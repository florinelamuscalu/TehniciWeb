const { ActivityHandler, MessageFactory } = require('botbuilder');

class AzureBot extends ActivityHandler{
    constructor() {
        super();
    
        this.onMessage(async (context, next) => {
          const userMessage = context.activity.text;
          let botResponse = '';
    
          if (userMessage.toLowerCase() === 'hello') {
            botResponse = 'Hello there!';
          } else {
            botResponse = `'I'm sorry, I didn't understand that.'`;
          }
    
          await context.sendActivity(MessageFactory.text(botResponse));
    
          await next();
        });
      }
}

module.exports = { AzureBot: AzureBot };

