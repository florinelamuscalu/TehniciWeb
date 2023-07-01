const { WaterfallDialog, ComponentDialog, DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');

const { TextPrompt, ConfirmPrompt } = require('botbuilder-dialogs');

const TEXT_PROMPT = 'TEXT_PROMPT';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
var endDialog = '';

class InstalareWindows extends ComponentDialog {
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
        return await step.prompt(TEXT_PROMPT, `Pentru a instala Windows 10, urmează următorii pași:\n
    1.  Achiziționează o copie licențiată a Windows 10 sau asigură-te că ai acces la o imagine ISO a sistemului de operare.\n
    2.  Asigură-te că ai un mediu de instalare disponibil, cum ar fi un DVD sau o unitate flash USB (cu o capacitate de cel puțin 8 GB) pregătită pentru instalare.\n
    3.  Conectează unitatea flash USB sau introduce discul DVD în calculator.\n
    4.  Porniți computerul și accesează meniul de boot (de obicei, prin apăsarea tastelor F2, F12, sau Del în timpul procesului de pornire). Selectează unitatea flash USB sau unitatea DVD ca dispozitiv de boot.\n
    5.  Computerul va încărca acum fișierele de instalare ale Windows 10. Dacă folosești o unitate flash USB, asigură-te că este conectată înainte ca procesul de boot să înceapă.\n
    6.  După ce fișierele de instalare sunt încărcate, vei fi întâmpinat de ecranul de instalare al Windows 10. Alege limba preferată și alte opțiuni de configurare și apasă pe "Next" (Următorul).\n
    7.  Pe ecranul următor, apasă pe butonul "Install now" (Instalează acum).\n
    8.  Introdu codul de activare/licența Windows 10 dacă ți se cere. Dacă ai achiziționat o copie fizică a sistemului de operare, codul ar trebui să fie disponibil pe cutie sau înăuntrul pachetului. Dacă ai o licență digitală, va fi asociată cu contul tău Microsoft și nu va fi nevoie să introduci un cod de activare în timpul instalării.\n
    9.  Alege versiunea de Windows 10 pe care dorești să o instalezi (de obicei, există o singură opțiune disponibilă, dacă ai doar o copie a sistemului de operare).\n
    10. Acceptă termenii și condițiile și apasă pe "Next" (Următorul).\n
    11. Pe ecranul următor, selectează opțiunea "Custom: Install Windows only (advanced)" (Personalizat: Instalează doar Windows - avansat).\n
    12. Acum, va trebui să selectezi unitatea pe care dorești să instalezi Windows 10. Dacă ai o singură unitate sau dacă dorești să instalezi Windows 10 pe întreaga unitate, selectează unitatea principală și apasă pe "Next" (Următorul).\n
    13. Windows 10 va începe procesul de instalare. Vei vedea cum fișierele sunt copiate și configurările sunt efectuate. Așteaptă ca procesul să se finalizeze.\n
    14. După finalizarea instalării, calculatorul se va reporni și vei fi întâmpinat de ecranul de configurare inițială a Windows 10. Urmărește instrucțiunile de pe ecran pentru a configura opțiunile de bază, cum ar fi limba, regiunea și setările de rețea.\n
    15. După finalizarea configurării inițiale, vei ajunge la ecranul de autentificare al Windows 10. Introdu datele de autentificare, cum ar fi parola sau codul PIN, și apasă pe "Next".\n\n
    Felicitări! Ai instalat cu succes Windows 10 și te afli în interfața de utilizare a sistemului de operare.
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

module.exports.InstalareWindows = InstalareWindows;
