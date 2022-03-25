export default class KV {

  constructor(binding){

    this.binding = binding;
    this.propertyPrefix = 'PROPERTY::';
    this.envPrefix = 'ENV::';
  }


  async readEnv() {

    const { keys } = await this.binding.list({ 'prefix': this.envPrefix });

    //Since we dont have much data, ignore checking list_complete value
    //as the results would fit in 1 list query.

    //Read value for each key here
    const values = await Promise.all(keys.map((key => {

      return this.binding.get(key.name);
    })));

    //note: key is an object with name property!
    const zipped = keys.map(({ name: keyFull }, index) => {

      //Remove prefix from key and join with value
      const key = keyFull.split(this.envPrefix)[1];
      return [key, values[index]];
    });

    return Object.fromEntries(zipped);
  }

  //List all properties (default limit of 1000)
  async listProperties() {
    
    const prefix = this.propertyPrefix;
    const { keys } = await this.binding.list({ prefix });
    return keys.map(k => k.name.split(prefix)[1]);
  }

  //Persist a property w/ property key prefix and expire 
  async saveProperty(property) {

    //Expire property after 30 days
    return this.binding.put(`${this.propertyPrefix}${property.id}`, JSON.stringify(property), { expirationTtl: 86400 * 30 });
  }

  read(param, type = 'text') {

    return this.binding.get(param, { type });
  }

  write(key, value) {

    return this.binding.put(key, value);
  }

}