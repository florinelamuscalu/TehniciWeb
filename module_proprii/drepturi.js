
/**
 @typedef Drepturi
 @type {Object}
 @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe  pagina cu tabelul de utilizatori.
 @property {Symbol} stergereUtilizatori Dreptul de a sterge un utilizator
 @property {Symbol} cumparareProduse Dreptul de a cumpara
 @property {Symbol} scrieChat Dreptul de a scrie pe chat
 @property {Symbol} adaugaProduse Dreptul de a adauga produse
 @property {Symbol} stergeProduse Dreptul de a sterge produse
 @property {Symbol} modificaProduse Dreptul de a modifica produse
 @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vanzari
 @property {Symbol} curierat de a modifica statusul unei comenzi
 @property {Symbol} scrieBot de a modifica statusul unei comenzi
 */


/**
 * @name module.exports.Drepturi
 * @type Drepturi
 */

const Drepturi = {
    vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
    stergereUtilizatori: Symbol("stergereUtilizatori"),
    cumparareProduse: Symbol("cumparareProduse"),
    scriereChat: Symbol("scriereChat"),
    vizualizareGrafice: Symbol("vizualizareGrafice"),
    adaugaProduse: Symbol("adaugaProduse"),
    stergeProduse: Symbol("stergeProduse"),
    modificaProduse: Symbol("modificaProduse"),
    curierat: Symbol("curierat"),
    bot:  Symbol("scrieBot")
}

module.exports = Drepturi;