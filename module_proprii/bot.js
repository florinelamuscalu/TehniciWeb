class ChatBot {
  constructor(conversationState) {
      this.conversationState = conversationState;
  }

  async onTurn(context) {
      if (context.activity.type === 'hello') {
          // Răspunde la mesajele primite
          await context.sendActivity('Bună! Ce pot să te ajut?');
      } else {
          await context.sendActivity(`${context.activity.type} nu este suportat.`);
      }
      await this.conversationState.saveChanges(context);
  }
}

module.exports.ChatBot = ChatBot;

