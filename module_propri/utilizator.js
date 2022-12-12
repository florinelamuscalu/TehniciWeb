//const AccesBD=require('./accesbd.js');


class Utilizator{
    static tipConexiune="local";
    #eroare;

    constructor({id, username, nume, prenume, email, rol, culoare_chat="black", poza}={}) {
        this.id=id;

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
        this.rol=rol; //TO DO clasa Rol
        this.culoare_chat=culoare_chat;
        this.poza=poza;

        this.#eroare="";
    }

    checkName(nume){
        return nume!="" &&  nume.match(new RegExp("^[A-Z] [a-z]+$"))
    }

    set setareNume(nume){
        if (this.checkName(nume)) this.nume = nume 
        else {
            throw new Error("Nume gresit")
        }
    }

    checkUserName(usernume){
        return usernume!="" &&  usernume.match(new RegExp("^[A-Z-a-z0-9]+$"))
    }

    set setareUserName(usernume){
        if (this.checkName(usernume)) this.usernume = usernume 
        else {
            throw new Error("Nume gresit")
        }
    }

/*
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{//date login 
                user:obGlobal.emailServer,
                pass:"rwgmgkldxnarxrgu"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:obGlobal.emailServer,
            to:email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }
   */ 
}

module.exports={Utilizator:Utilizator}
