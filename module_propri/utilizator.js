const AccesBD = require('./accesbd.js');
const crypto=require("crypto");
const nodemailer = require("nodemailer")
const parole = require("./parole.js")


class Utilizator {
    static tipConexiune = "local";
    static tabel = "utilizator"
    static parolaCriptare="tehniciweb"
    static emailServer = "florinelagabrielamuscalu@gmail.com"
    static lungimeCod=64
    static numeDomeniu = "localhost:8080"
    #eroare;

    constructor({ id, username, nume, prenume, email, parola, rol, culoare_chat = "black", poza } = {}) {
        this.id = id;

        // optinoal sa fcem asta in constructor

        // try {
        // if(this.checkUserName(username))
        // this.username
        // }
        // catch(e){ this.#eroare=e.message}


        this.username = username;
        this.nume = nume;
        this.prenume = prenume;
        this.email = email;
        this.parola = this.parola
        this.rol = rol; //TO DO clasa Rol
        this.culoare_chat = culoare_chat;
        this.poza = poza;

        this.#eroare = "";
    }

    checkName(nume) {
        return nume != "" && nume.match(new RegExp("^[A-Z] [a-z]+$"))
    }

    set setareNume(nume) {
        if (this.checkName(nume)) this.nume = nume
        else {
            throw new Error("Nume gresit")
        }
    }

    checkUserName(usernume) {
        return usernume != "" && usernume.match(new RegExp("^[A-Z-a-z0-9]+$"))
    }

    set setareUserName(usernume) {
        if (this.checkName(usernume)) this.usernume = usernume
        else {
            throw new Error("Nume gresit")
        }
    }

    static criptareParola(parola){
       return crypto.scryptSync(this.parola, Utilizator.parolaCriptare, Utilizator.lungimeCod).toString("hex");
    }

    salvareUtilizator() {
        let parola_cryptata = Utilizator.criptareParola(parola)
        let utiliz=this;
        let token=parole.genereazaToken(100);
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({ tabel: Utilizator.tabel, campuri: ["username", "nume", "prenume", "parola", "email", "culoare_chat", "cod"], valori: [`'${this.username}'`, `'${this.nume}'`, `'${this.prenume}'`, `'${parola_cryptata}'`, `'${this.email}'`, `'${this.culoare_chat}'`, `'${token}'`] }, function (err, rez) {
            if (err)
                console.log(err);
            utiliz.trimiteMail("Te-ai inregistrat cu succes", "Username-ul tau este "+utiliz.username, 
            `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`)
        });
    }

    


//amysjwfzroxnspcr

        async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
            var transp= nodemailer.createTransport({
                service: "gmail",
                secure: false,
                auth:{//date login 
                    user:Utilizator.emailServer,
                    pass:"amysjwfzroxnspcr"
                },
                tls:{
                    rejectUnauthorized:false
                }
            });
            //genereaza html
            await transp.sendMail({
                from:Utilizator.emailServer,
                to:email, //TO DO
                subject:subiect,//"Te-ai inregistrat cu succes",
                text:mesajText, //"Username-ul tau este "+username
                html: mesajHtml,// '<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
                attachments: atasamente
            })
            console.log("trimis mail");
        }

        static getUtilizDupaUsername(username, obparam, procesUtiliz){
            AccesBD.getInstanta(Utilizator.tipConexiune).select({tabel:"utilizatori", campuri:['*'], conditiiAnd:[`username='${username}'`], function(err, rezSelect){
                if(err || rezSelect.rowCount == 0 ) {
                    console.error("Utilizator", err)
                    console.error("Utilizator", rezSelect.rows.length);
                    throw new Error ()
                }
                // constructor({ id, username, nume, prenume, email, rol, culoare_chat = "black", poza }
                let u = new Utilizator({
                    id: rezSelect.rows[0].id, 
                    username: rezSelect.rows[0].username , 
                    nume: rezSelect.rows[0].nume, 
                    prenume: rezSelect.rows[0].prenume, 
                    email: rezSelect.rows[0].email,
                    parola: rezSelect.row[0].parola, 
                    rol: rezSelect.rows[0].rol, 
                    culoare_chat: rezSelect.rows[0].culoare_chat, 
                    poza: rezSelect.rows[0].poza})
                procesUtiliz(u, obparam);
            }});
        }
}

module.exports = { Utilizator: Utilizator }
