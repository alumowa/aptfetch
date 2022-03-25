

export default class Slacker {

  constructor(url) {

    this.url = url;
  }

  sendMessage(item){

    const message = {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'New Apartment Listed!'
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<${item.url}|${item.name}>`,
          },
          fields: [
            {
              type: 'mrkdwn',
              text: `*Price*\n${item.price}`
            },
            {
              type: 'mrkdwn',
              text: `*Distance*\n${(item.hsDistance).toFixed(2)}`
            }
          ]
        }
      ]
    };

    //Add image if exists
    if(item.image){
      message.blocks[1].accessory = {
        type: 'image',
        image_url: `${item.image}`,
        alt_text: `${item.name}`
      }
    }

    return fetch(this.url, { 
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        "content-type": "application/json;charset=UTF-8",
      }
    });
  }

}