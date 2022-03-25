import { WunderFetch } from "./wunder.mjs";
import KV from "./Kv.mjs";
import Slacker from "./Slack.mjs";

async function gather(_, env) {

  //Instantiate kv store
  const { APTFETCH_KV, START_DATE, END_DATE } = env;
  const store = new KV(APTFETCH_KV);

  //Once we have the store we can read encrypted vars
  const secrets = await store.readEnv();
  const slack = new Slacker(secrets.SLACK_WEBHOOK);

  //Retrieve listings & saved properties
  const [result, propertyList] = await Promise.all([
    WunderFetch(secrets, START_DATE, END_DATE),
    store.listProperties()
  ]);
  
  
  //Build list of new items and perform action on each
  const seen = new Set(propertyList);
  const unseen = result.filter(item => !seen.has(item.id));
  
  //For each new item, save and notify
  await Promise.all(unseen.map((item) => {

    return Promise.all([
      store.saveProperty(item),
      slack.sendMessage(item)
    ]);
  }))

  return new Response(`New item count ${unseen.length}`);
}

export default {

  async fetch(request, env) {

    return gather(request, env);  
  },

  async scheduled(event, env, ctx) {

    return ctx.waitUntil(gather(event, env));  
  }
}

