const AccesBD = require('./accesbd.js');
const Utilizator = require('./utilizator')

class Produse {
    static tipConexiune = "local";
    static tabel = "produse"
    static parolaCriptare = "tehniciweb"
    static emailServer = "florinelagabrielamuscalu@gmail.com"
    static lungimeCod = 64
    static numeDomeniu = "localhost:8080"
    #eroare;

    constructor({ id, nume, descriere, pret, greutate, data_fabricare, tip_produs, categorie, specificatii, desigilate, culoare, imagine, data_adaugare, garantie, stoc } = {}) {

        try {
            if (this.checkNume(nume))
                this.nume = nume;
        } catch (e) { this.#eroare = e.message }

        for (let prop in arguments[0]) {
            this[prop] = arguments[0][prop]
        }

        this.#eroare = "";
    }


    /**
    * @typedef {object} Check - obiect primit de functiile care realizeaza un query 
    * @property {string} nume - inputul care il verificam
    */

    /**
     * Verifica datele pentru inregistrare
     *
     * @param {Check} obj - un obiect cu datele pentru verifcare

     */

    checkNume(nume) {
        return nume != "" && !nume.match(/[<>\/\.]/)
    }


    /**
   * @typedef {object} Check - obiect primit de functiile care realizeaza un query 
   * @property {string} descriere - inputul care il verificam
   */

    /**
     * Verifica datele pentru inregistrare
     *
     * @param {Check} obj - un obiect cu datele pentru verifcare

     */
    checkDescriere(descriere) {
        return descriere != "" && !descriere.match(/[<>\/\.]/)
    }

    /**
   * @typedef {object} Check - obiect primit de functiile care realizeaza un query 
   * @property {string} greutate - inputul care il verificam
   */

    /**
     * Verifica datele pentru inregistrare
     *
     * @param {Check} obj - un obiect cu datele pentru verifcare

     */

    checkGreutate(greutate) {
        return greutate != "" && !greutate.match(/[<>\/\.]/) && greutate.match(/^[0-9]+$/)
    }
    
    /**
   * @typedef {object} Check - obiect primit de functiile care realizeaza un query 
   * @property {string} pret - inputul care il verificam
   */

    /**
     * Verifica datele pentru inregistrare
     *
     * @param {Check} obj - un obiect cu datele pentru verifcare

     */

    checkPret(pret) {
        return pret != "" && !pret.match(/[<>\/\.]/) && pret.match(/^[0-9]+$/)
    }

    /**
    * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
    * @property {string} nume - inputul care il verificam
    * 
    */

    /**
     * Verifica datele pentru setare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru setare

     */

    set setareNume(nume) {
        if (this.checkNume(nume)) this.nume = nume
        else {
            throw new Error("Nume gresit")
        }
    }

    /**
     * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
     * @property {string} greutate - inputul care il verificam
     * 
     */

    /**
     * Verifica datele pentru setare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru setare

     */
    set setareGreutate(greutate) {
        if (this.checkGreutate(greutate)) this.greutate = greutate
        else {
            throw new Error("Greutate gresita")
        }
    }

     /**
     * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
     * @property {string} pret - inputul care il verificam
     * 
     */

    /**
     * Verifica datele pentru setare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru setare

     */
    set setarePret(pret) {
        if (this.checkPret(pret)) this.pret = pret
        else {
            throw new Error("Pret gresita")
        }
    }

    /**
    * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
    * @property {string} descriere - inputul care il verificam
    * 
    */

    /**
     * Verifica datele pentru setare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru setare

     */


    set setareDescriere(descriere) {
        if (this.checkDescriere(descriere)) this.descriere = descriere
        else {
            throw new Error("Descriere gresita")
        }
    }

    /**
    * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
    * @property {string} specificatii - inputul care il verificam
    * 
    */

    /**
     * Verifica datele pentru inregistrare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru verifcare

     */
    checkSpecificatii(specificatii) {
        return (specificatii != "" && !specificatii.match(/[<>\/\.]/))
    }

    /*
   * folosit doar la inregistrare si modificare profil
   */


    /**
   * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
   * @property {string} culoare - inputul care il verificam
   * 
   */

    /**
     * Verifica datele pentru inregistrare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru verifcare

     */
    checkCuloare(culoare) {
        return culoare != "" && !culoare.match(/[<>\/\.]/)
    }


    set setareCuloare(culoare) {
        if (this.checkCuloare(culoare)) this.culoare = culoare
        else {
            throw new Error("Culoarea e gresita")
        }
    }

    /**
  * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
  * @property {string} specificatii - inputul care il verificam
  * 
  */

    /**
     * Verifica datele pentru setare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru setare

     */

    set setareSpecificatii(specificatii) {
        if (this.checkSpecificatii(specificatii)) this.specificatii = specificatii
        else {
            throw new Error("Specificatie gresita")
        }
    }



    salvareProdus() {
        console.log("produse.js inserare specificatii", this.specificatii)
        AccesBD.getInstanta(Produse.tipConexiune).insert({
            tabel: Produse.tabel,
            campuri: ["nume", "descriere", "pret", "greutate", "data_fabricare", "tip_produs", "categorie", "specificatii", "desigilate", "culoare", "imagine", "data_adaugare", "garantie", "stoc"],
            valori: [`'${this.nume}'`, `'${this.descriere}'`, `'${this.pret}'`, `'${this.greutate}'`, `'${this.data_fabricare}'`, `'${this.tip_produs}'`, `'${this.categorie}'`, `'${this.specificatii}'`, `'${this.desigilate}'`, `'${this.culoare}'`, `'${this.imagine}'`, `'${this.data_adaugare}'`, `'${this.garantie}'`, `'${this.stoc}'`]
        }, function (err, rez) {
            if (err)
                console.log("eroare salvare produse.js", err);
            console.log(rez)
        });
    }

}

module.exports = { Produse: Produse }
