const AccesBD = require('./accesbd.js');
const crypto = require("crypto");
const nodemailer = require("nodemailer")
const parole = require("./parole.js")
const { RolFactory } = require('./roluri.js');


class Utilizator {
    static tipConexiune = "local";
    static tabel = "utilizatori"
    static parolaCriptare = "tehniciweb"
    static emailServer = "florinelagabrielamuscalu@gmail.com"
    static lungimeCod = 64
    static numeDomeniu = "localhost:8080"
    #eroare;

    constructor({ id, username, nume, prenume, data_nastere, ocupatie, email, parola, rol, culoare_chat = "black", cale_imagine } = {}) {
        //this.id = id;

        // optinoal sa fcem asta in constructor

        // try {
        // if(this.checkUserName(username))
        // this.username
        // }
        // catch(e){ this.#eroare=e.message}


        try {
            if (this.checkUsername(username))
                this.username = username;
        } catch (e) { this.#eroare = e.message }

        for (let prop in arguments[0]) {
            this[prop] = arguments[0][prop]
        }

        if (this.rol)
            this.rol = this.rol.cod ? RolFactory.creeazaRol(this.rol.cod) : RolFactory.creeazaRol(this.rol);
        console.log(this.rol);

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

    checkName(nume) {
        return nume != "" && !nume.match(/[<>\/\.]/) && nume.match(new RegExp("^[A-Z][a-z]+$"))
    }


    /**
   * @typedef {object} Check - obiect primit de functiile care realizeaza un query 
   * @property {string} ocupatie - inputul care il verificam
   */

    /**
     * Verifica datele pentru inregistrare
     *
     * @param {Check} obj - un obiect cu datele pentru verifcare

     */
    checkOcupatie(ocupatie) {
        return ocupatie != "" && !ocupatie.match(/[<>\/\.]/)
    }

    /**
   * @typedef {object} Check - obiect primit de functiile care realizeaza un query 
   * @property {string} prenume - inputul care il verificam
   */

    /**
     * Verifica datele pentru inregistrare
     *
     * @param {Check} obj - un obiect cu datele pentru verifcare

     */

    checkPrenume(prenume) {
        return prenume != "" && !prenume.match(/[<>\/\.]/) && prenume.match(new RegExp("^[A-Z][a-z]+-[A-Z][a-z]+$"))
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
        if (this.checkName(nume)) this.nume = nume
        else {
            throw new Error("Nume gresit")
        }
    }

    /**
 * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
 * @property {string} prenume - inputul care il verificam
 * 
 */

    /**
     * Verifica datele pentru setare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru setare

     */
    set setarePrenume(prenume) {
        if (this.checkPrenume(prenume)) this.prenume = prenume
        else {
            throw new Error("Prenume gresit")
        }
    }

    /**
* @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
* @property {string} prenume - inputul care il verificam
* 
*/

    /**
     * Verifica datele pentru setare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru setare

     */


    set setareOcupatie(ocupatie) {
        if (this.checkOcupatie(ocupatie)) this.ocupatie = ocupatie
        else {
            throw new Error("Ocupatie gresit")
        }
    }

    /**
   * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
   * @property {string} usernume - inputul care il verificam
   * 
   */

    /**
     * Verifica datele pentru inregistrare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru verifcare

     */
    checkUserName(usernume) {
        return (usernume != "" && !usernume.match(/[<>\/\.]/) && usernume.match(new RegExp("^[a-z]+[0-9]+$")))
    }

    /*
   * folosit doar la inregistrare si modificare profil
   */


    /**
   * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
   * @property {string} parola - inputul care il verificam
   * 
   */

    /**
     * Verifica datele pentru inregistrare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru verifcare

     */
    checkPassword(parola) {
        return parola != "" && parola.match(new RegExp("^[A-Z]+[a-z]+[0-9]{6,}$"))
    }

    /**
    * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
    * @property {string} parola - inputul care il verificam
    * 
    */

    /**
     * Verifica datele pentru setare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru setare

     */

    set setareParola(parola) {
        if (this.checkPassword(parola)) this.parola = parola
        else {
            throw new Error("Parola este gresita, trebuie sa contina cel putin o litera mare una mica si o cifra numarul minim de caractere este 6")
        }
    }

    /**
  * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
  * @property {string} username - inputul care il verificam
  * 
  */

    /**
     * Verifica datele pentru setare
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru setare

     */

    set setareUserName(username) {
        if (this.checkUserName(username)) this.username = username
        else {
            throw new Error("UserName gresit")
        }
    }

    /**
     * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
     * @property {string} parola - parola user-ului
     * 
     */

    /**
     * Functie care ne cripteaza parola
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru criptarea parolei

     */
    static criptareParola(parola) {
        return crypto.scryptSync(parola, Utilizator.parolaCriptare, Utilizator.lungimeCod).toString("hex");
    }



    salvareUtilizator() {
        let parola_cryptata = Utilizator.criptareParola(this.parola)
        let utiliz = this;
        let token = parole.genereazaToken(100);
        console.log("!!!!!!!!!!!!!!!!!!!!!salvare utiliz", utiliz)
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({ tabel: Utilizator.tabel, 
            campuri: ["username", "nume", "prenume", "data_nastere", "ocupatie", "parola", "email", "culoare_chat", "cod", "cale_imagine"], 
            valori: [`'${this.username}'`, `'${this.nume}'`, `'${this.prenume}'`, `'${this.data_nastere}'`, `'${this.ocupatie}'`, `'${parola_cryptata}'`, `'${this.email}'`, `'${this.culoare_chat}'`, `'${token}'`, `'${this.cale_imagine}'`] }, function (err, rez) {
            if (err)
                console.log("eroare salvare utiliz.js", err);
            utiliz.trimiteMail("Cont nou", "Bine ai venit în comunitatea PC Components. Username-ul tău este:" + utiliz.username,
                `<h1>Salut!</h1><p style='color:green, font-style:bold'>Bine ai venit în comunitatea PC Components. Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/confirmare/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`)
        });
    }

    stergeUtilizator(username) {
        let utiliz = this;
        AccesBD.getInstanta(Utilizator.tipConexiune).delete({ tabel: Utilizator.tabel, conditiiAnd: [`username='${username}'`] }, function (err, rez) {
            if (err) {
                console.log("eorare delete utilizator.js", err);
            }
            else {
                console.log("trimite mail")
                utiliz.trimiteMail("Sterge cont", "Hello, " + utiliz.username + " acesta este un email pentru confirmarea stergerii contului. Va multimim pentru ca ati fost alaturi de noi!")
            }
        });
        //console.log("utilizator utiliz stergere", utiliz);
    }


    //amysjwfzroxnspcr

    /**
    * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
    * @property {string} subiect - subiectul mail-ului
    * @property {string} mesajText - mesajul mail-ului
    * @property {string} mesajHtml - mesajul in html mail-ului
    * @property {string[]} atasamente - atasamentele mail-ului
    */

    /**
     * Trimite mail la useri
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru functie
     */

    async trimiteMail(subiect, mesajText, mesajHtml, atasamente = []) {
        var transp = nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth: {//date login 
                user: Utilizator.emailServer,
                pass: "amysjwfzroxnspcr"
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        //genereaza html
        await transp.sendMail({
            from: Utilizator.emailServer,
            to: this.email, //TO DO
            subject: subiect,//"Te-ai inregistrat cu succes",
            text: mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// '<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }


    /**
     * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query
     * @property {string} username - username-ul userului
     */

    /**
     * Functie asincrona de returnare a datelor userului
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru query
     
     */

    static async getUtilizDupaUsernameAsync(username) {
        if (!username) return null;
        try {
            let rezSelect = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
                {
                    tabel: "utilizatori",
                    campuri: ['*'],
                    conditiiAnd: [`username='${username}'`]
                });
            if (rezSelect.rowCount != 0) {
                return new Utilizator(rezSelect.rows[0])
            }
            else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        }
        catch (e) {
            console.log(e);
            return null;
        }

    }

    /**
   * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query
   * @property {string} username - username-ul userului
   * @property {string []} obparam - obiectele functiei
   * @property {string[]} proceseazaUtiliz - 
   */


    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rezSelect Rezultatul query-ului
     */
    /**
     * Retuneaza userii dupa nume
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru query
     * @param {function} callback - o functie callback cu 2 parametri: eroare si rezultatul queryului
     */

    static getUtilizDupaUsername(username, obparam, proceseazaUtiliz) {
        if (!username) return null;
        let eroare = null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select({
            tabel: "utilizatori", campuri: ['*'], conditiiAnd: [`username='${username}'`]
        }, function (err, rezSelect) {
            //console.log("???????????????????????????????????????????????????")
            if (err) {
                console.error("Utilizator", err)
                console.error("Utilizator", rezSelect.rows.length);
                //throw new Error()
                eroare = -2;
            } else if (rezSelect.rowCount == 0) {
                eroare = -1;
            }
            // constructor({ id, username, nume, prenume, email, rol, culoare_chat = "black", cale_imagine }
            let u = new Utilizator(rezSelect.rows[0])
            proceseazaUtiliz(u, obparam, eroare);
            //procesUtiliz(u, obparam);
        }
        );
    }

    /**
     * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query
     * @property {string []} obparam - obiectele functiei
     * @property {string []} listaUtiliz - lista utilizatorilor
     */


    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rez Rezultatul query-ului
     */
    /**
     * cauta un user dupa filtre
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru query
     * @param {function} callback - o functie callback cu 2 parametri: eroare si rezultatul queryului
     */

    static cauta(obParam, calback) {
        const u = Utilizator;
        let listaUtiliz = u.filter(function (rezUser) {
            for (let prop in obParam) {
                if (rezUser[prop] != obParam[prop]) {
                    return false;
                }
            }
            return true;
        });

        if (listaUtiliz.length > 0) {
            calback(null, listaUtiliz);
        } else {
            calback("Nu a fost gasit niciun utilizator cu caracteristicile cerute", null)
        }
    }

    // apelare functie cauta 
    // Utilizator.cauta({ username: "ionel" }, function (err, listaUtiliz) {
    //     if (err) {
    //       console.error(err);
    //     } else {
    //       console.log(listaUtiliz);
    //     }
    //   });


    /**
   * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query
   * @property {string []} obparam - obiectele functiei
   * @property {string []} listaUtiliz - lista utilizatorilor
   */
    /**
     * cauta un user dupa filtre
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru query
     */

    static async cautaAsync(obParam) {
        const u = Utilizator;
        let listaUtiliz = u.filter(function (rezUser) {
            for (let prop in obParam) {
                if (rezUser[prop] != obParam[prop]) {
                    return false;
                }
            }
            return true;
        });

        return new Promise((resolve, reject) => {
            if (listaUtiliz.length > 0) {
                resolve(listaUtiliz);
            } else {
                reject(new Error("Nu a fost gasit niciun utilizator cu caracteristicile cerute"));
            }
        });
    }

    areDreptul(drept) {
        return this.rol.areDreptul(drept);
    }

    // areDreptuldeCurierat(drept) {
    //     return this.rol.areDreptuldeCurierat(drept);
    // }
}

module.exports = { Utilizator: Utilizator }
