
/**
 @typedef Drepturi
 @type {Object}
 @property {Symbol} vizualizareUtilizatori Dreptul de a intra pe  pagina cu tabelul de utilizatori.
 @property {Symbol} stergereUtilizatori Dreptul de a sterge un utilizator
 @property {Symbol} cumparareProduse Dreptul de a cumpara
 @property {Symbol} adaugaProduse Dreptul de a adauga produse
 @property {Symbol} stergeProduse Dreptul de a sterge produse
 @property {Symbol} modificaProduse Dreptul de a modifica produse

 @property {Symbol} vizualizareGrafice Dreptul de a vizualiza graficele de vanzari
 */


/**
 * @name module.exports.Drepturi
 * @type Drepturi
 */
const Drepturi = {
    vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
    stergereUtilizatori: Symbol("stergereUtilizatori"),
    cumparareProduse: Symbol("cumparareProduse"),
    vizualizareGrafice: Symbol("vizualizareGrafice"),
    adaugaProduse: Symbol("adaugaProduse"),
    stergeProduse: Symbol("stergeProduse"),
    modificaProduse: Symbol("modificaProduse")
}

module.exports = Drepturi;