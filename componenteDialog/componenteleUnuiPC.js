const { WaterfallDialog, ComponentDialog, DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');

const { TextPrompt, ConfirmPrompt } = require('botbuilder-dialogs');

const TEXT_PROMPT = 'TEXT_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
var endDialog = '';

class ComponenteleUnuiPC extends ComponentDialog {
    constructor(conversationState, userState) {
        super('instalareWindows10');

        this.addDialog(new TextPrompt(TEXT_PROMPT));
        this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.install.bind(this),
            this.feedback.bind(this),
            this.sorryMessage.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            console.log(this.id);
            await dialogContext.beginDialog(this.id);
        }
    }

    async install(step) {
        endDialog = false;
        return await step.prompt(TEXT_PROMPT, `
        Un computer personal (PC) este format din mai multe componente esențiale care lucrează împreună pentru a permite utilizatorilor să efectueze diverse activități, de la navigarea pe internet și editarea documentelor la rularea de jocuri complexe și procesare multimedia. Iată principalele componente ale unui PC: \n
        1. Procesor (CPU): Procesorul este creierul sistemului, responsabil de efectuarea tuturor calculelor și sarcinilor de procesare a datelor. Producătorii populari de procesoare includ Intel și AMD. \n
        2. Placă de bază (Motherboard): Placa de bază este o platformă care conectează toate componentele hardware ale calculatorului și permite comunicarea între ele. Aici sunt integrate diferite porturi, sloturi și chipset-uri esențiale. \n
        3. Memorie RAM: RAM (memorie cu acces aleator) este utilizată pentru a stoca date temporar pentru procesor și programele în execuție. Cu cât aveți mai multă memorie RAM, cu atât veți putea rula mai multe aplicații în același timp și veți avea o experiență mai fluidă. \n
        4. Unitate de stocare (Hard Disk Drive - HDD sau Solid State Drive - SSD): Unitatea de stocare reprezintă spațiul în care sunt stocate datele și programele pe termen lung. HDD-urile oferă o capacitate mai mare, dar viteze de citire/scriere mai lente în comparație cu SSD-urile, care sunt mai rapide și mai eficiente energetic. \n
        5. Unitate optică (opțională): Deși tot mai rar utilizată în ziua de azi, unitatea optică (de exemplu, DVD sau Blu-ray) permite citirea și scrierea discurilor optice. \n
        6. Placă video (GPU): Placa video gestionează afișarea imaginilor pe monitor. Pentru jocuri sau sarcini grafice intense, este importantă o placă video puternică. În plus, există și procesoare grafice integrate în procesor, care pot oferi performanțe grafice de bază pentru utilizarea de zi cu zi. \n
        7. Sursă de alimentare: Sursa de alimentare furnizează energia electrică necesară pentru a alimenta toate componentele PC-ului. \n
        8. Unitate de alimentare cu apă sau aer (opțională): În cazul sistemelor mai avansate, este posibil să aveți o unitate de alimentare cu apă sau aer pentru răcirea eficientă a componentelor, mai ales în cazul unor procesoare sau plăci video extrem de puternice.\n
        9. Carcasă: Carcasa este exteriorul PC-ului și oferă un suport fizic pentru toate componentele interne. \n
        10. Tastatură și mouse: Acestea sunt dispozitivele de intrare principale care permit utilizatorului să interacționeze cu computerul. \n
        11. Monitor: Monitorul afișează informațiile și imaginile generate de PC, permițând utilizatorului să vizualizeze și să interacționeze cu sistemul. \n
        Acestea sunt componentele de bază ale unui PC, însă există și alte accesorii și componente opționale, cum ar fi placa de sunet, placa de rețea, \n 
        camere web, difuzoare, dispozitive de stocare externă, etc. Dacă doriți să vă construiți propriul PC, asigurați-vă că toate componentele \n 
        sunt compatibile între ele și că aveți cunoștințele necesare pentru asamblare. \n\n
        Pentru a continua trebuie sa imi lasati un mesaj. :)`);
    }

    async feedback(step) {
        return await step.prompt(CONFIRM_PROMPT, 'Consideri ca te ajuta pasii explicati mai sus?', ['Da', 'Nu']);
    }

    async sorryMessage(step) {
        if (step.result === true) {
            await step.context.sendActivity('Iti multumim pentru feedback!');
        } else {
            await step.context.sendActivity('Ne pare rau ca nu te-am putut ajuta!');
        }
        endDialog = true;
        return await step.endDialog();
    }

    async isDialogComplete() {
        console.log('endDialog instalareWindows10', endDialog);
        return endDialog;
    }
}

module.exports.ComponenteleUnuiPC = ComponenteleUnuiPC;
