const { ActivityHandler, MessageFactory, TurnContext } = require('botbuilder');
const { InstalareWindows } = require('../componenteDialog/instalareWindows');
const { ComponenteleUnuiPC } = require('../componenteDialog/componenteleUnuiPC');

class ChatBot extends ActivityHandler {
    constructor(conversationState, userState) {
        super();

        this.conversationState = conversationState;
        this.userState = userState;
        this.dialogState = conversationState.createProperty('dialogState');
        this.insatalareWindowsDialog = new InstalareWindows(this.conversationState, this.userState);
        this.componenteleunuipcDialog = new ComponenteleUnuiPC(this.conversationState, this.userState);

        this.previousIntent = this.conversationState.createProperty('previousIntent');
        this.conversationData = this.conversationState.createProperty('conversationData');


        this.onMessage(async (context, next) => {
            await this.dispatchToIntentAsync(context);
            await next();
        });

        this.onDialog(async (context, next) => {
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context);
            await next();
        });
    }

    async sendWelcomeMessage(turnContext) {
        try {
            const { activity } = turnContext;

            for (const idx in activity.membersAdded) {
                if (activity.membersAdded[idx].id !== activity.recipient.id) {
                    const welcomeMessage = `Bine ai venit pe platforma PC Components ${ activity.membersAdded[idx].name }.`;
                    await turnContext.sendActivity(welcomeMessage);
                    await this.sendSuggestedActions(turnContext);
                }
            }
        } catch (error) {
            console.error('Eroare la trimiterea mesajului de bun venit:', error);
        }
    }

    async sendSuggestedActions(turnContext) {
        var reply = MessageFactory.suggestedActions(['Instalare Windows', 'Componentele unui PC'], 'Cu ce vrei sa te ajutam?');
        await turnContext.sendActivity(reply);
    }

    async dispatchToIntentAsync(context) {
        try {
            let currentIntent = '';
            const previousIntent = await this.previousIntent.get(context, {});
            const conversationData = await this.conversationData.get(context, {});

            if (previousIntent && previousIntent.intentName && conversationData && conversationData.endDialog === false) {
                currentIntent = previousIntent.intentName;
            } else if (previousIntent && previousIntent.intentName && conversationData && conversationData.endDialog === true) {
                currentIntent = context.activity.text;
            } else {
                currentIntent = context.activity.text;
                await this.previousIntent.set(context, { intentName: context.activity.text });
            }

            console.log(currentIntent);

            const request = TurnContext.getConversationReference(context.activity);
            const conversationReference = TurnContext.applyConversationReference({ type: 'event', name: context.activity.name }, request, false);
            const turnContextWithHeader = Object.assign(new TurnContext(context.adapter, conversationReference), context.activity);

            switch (currentIntent) {
            case 'Instalare Windows':
                console.log('Înăuntru la cazul windows');
                await this.conversationData.set(context, { endDialog: false });
                await this.insatalareWindowsDialog.run(context, this.dialogState);
                conversationData.endDialog = await this.insatalareWindowsDialog.isDialogComplete();
                if (conversationData.endDialog) {
                    await this.sendSuggestedActions(context);
                    await context.sendActivity('Instalarea Windows a fost finalizată.');
                }
                break;
            case 'Care sunt componentele unui PC?':
                console.log('Înăuntru la cazul caresuntcomponenteleunuipcDialog');
                await this.conversationData.set(context, { endDialog: false });
                await this.componenteleunuipcDialog.run(context, this.dialogState);
                conversationData.endDialog = await this.componenteleunuipcDialog.isDialogComplete();
                if (conversationData.endDialog) {
                    await this.previousIntent.set(context, { intentName: null });
                    await this.sendSuggestedActions(context);
                    await context.sendActivity('Lista cu componentele unui PC a fost trimisă.');
                }
                break;
            default:
                console.log('Nu a ales nimic :(');
                break;
            }
        } catch (error) {
            console.error('Eroare în funcția dispatchToIntentAsync:', error);
        }
    }

}

module.exports.ChatBot = ChatBot;
