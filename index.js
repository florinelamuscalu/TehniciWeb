const express = require("express");
const fs = require("fs");
const app = express();

//// BOT /////////////////////////////////////////////////////////

const { AzureBot } = require('./module_proprii/bot.js')


const botToken = 'eWJz1wTSa4Q.NpVP-5KsJI1pXVT5LVDbliyGsWJOxMNYYgTaNuJ1HKM';

const { BotFrameworkAdapter } = require('botbuilder');

const botAdapter = new BotFrameworkAdapter({
    appId: '', // Lasă gol pentru autentificarea cu tokenul de acces
    appPassword: '', // Lasă gol pentru autentificarea cu tokenul de acces
    token: botToken // Tokenul de acces generat
});

const connectorClient = botAdapter.createConnectorClient('');

//console.log(connectorClient)


//////////////////////////////////////////////////////////////////

const sharp = require("sharp");
const formidable = require("formidable");
const { Client } = require("pg");
const { Utilizator } = require("./module_proprii/utilizator.js")
const { Produse } = require("./module_proprii/produse.js")
const ejs = require("ejs");
const session = require("express-session");
const AccesBd = require("./module_proprii/accesbd.js")
const path = require('path');
const Drepturi = require("./module_proprii/drepturi.js")
const sass = require("sass");
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');
const mongodb = require('mongodb');
const helmet = require('helmet')
const xmljs = require('xml-js');
const bodyParser = require('body-parser')
const multer = require('multer');


// server 
const http = require('http');
const socket = require('socket.io');
var server = new http.createServer(app);
var io = socket(server)
io = io.listen(server);



var cssBootstrap = sass.compile(__dirname + "/resurse/scss/customizare_bootstrap.scss", { sourceMap: true });
fs.writeFileSync(__dirname + "/resurse/css/biblioteci/bootstrap_custom.css", cssBootstrap.css);

app.use(bodyParser.json()); // pentru a lua datele din JSON body
app.use(["/feedback"], express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//console.log("Cale proiect:", __dirname);
app.use("/module_proprii", express.static(__dirname + "/module_proprii"));
app.use("/resurse", express.static(__dirname + "/resurse"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/poze_uploadate", express.static(__dirname + "/resurse/imagini/poze_uploadate"));
app.use(helmet.frameguard());
app.use(["/mesaj"], express.json({ limit: '2mb' }));


app.use(["/produse_cos", "/cumpara"], express.json({ limit: '2mb' }));//obligatoriu de setat pt request body de tip json
app.use(session({ // aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
}));



obGlobal = {
    erori: null,
    imagini: null,
    protocol: "http://",
    numeDomeniu: "localhost:8080",
    clientMongo: mongodb.MongoClient,
    bdMongo: null
}

var url = "mongodb://localhost:27017";//pentru versiuni mai vechi de Node
var url = "mongodb://0.0.0.0:27017";

obGlobal.clientMongo.connect(url, function (err, bd) {
    if (err) console.log(err);
    else {
        obGlobal.bdMongo = bd.db("tehnici_web");
    }
});

//creare foldere necesare
foldere = ["temp", "poze_uploadate"];
for (let folder of foldere) {
    let calefolder
    if (folder = "poze_uploadate") {
        calefolder = path.join(__dirname, "/resurse/imagini/", folder);
        //console.log("**********cale folder", calefolder)
    }
    else {
        calefolder = path.join(__dirname, folder);
    }
    if (!fs.existsSync(calefolder))
        fs.mkdirSync(calefolder);
}

app.use("/*", function (req, res, next) {
    client.query("select * from unnest(enum_range(null::categ_produs))", function (err, rezCateg) {
        //continuareQuery = "";
        res.locals.optiuni = rezCateg.rows;
        res.locals.Drepturi = Drepturi;
        if (req.session.utilizator)
            req.utilizator = res.locals.utilizator = new Utilizator(req.session.utilizator);
        next();
    });
});

// var client = new Client({
//     database: "pc",
//     user: "flori2",
//     password: "flori",
//     host: "localhost",
//     port: 5432
// });
// client.connect();

var instantaBD = AccesBd.getInstanta({ init: "local" })
var client = instantaBD.getClient();


//verificare select din accesbd
// instantaBD.select({campuri:[" nume, pret"], tabel:"produse", conditiiAnd:["pret>300", "pret<500"]}, function(err, rez){
//     console.log("!!!!!!!!!!")
//     if (err)
//         console.log(err);
//     else
//         console.log(rez);
// })

// client.query("select * from tabel_test", function (err, rez) {
//     if (err)
//         console.log(err);
//     else
//         console.log(rez);
// });


// var vedeToatalumea="ceva!";
// app.use('/*', function(req,res){
//     res.locals.vede=vedeToatalumea;
//     next();
// });



// {

// // apelare functie 
// (function (){console.log("ape functie")}) ();

// // verificare functie async pentru get utilizator
// (async function (){
//     let u = await Utilizator.getUtilizDupaUsernameAsync("prof")
//     console.log("User async", u)
// }) ()

// }

/// cand se conexcteaza soket-ul la server 


io.on("connection", (socket) => { 
    console.log("Conectare!");
    console.log("aaa****************") 
    console.log("Conectare!");
	//if(!conexiune_index)
	//	conexiune_index=socket
    socket.on('disconnect', () => {conexiune_index=null;console.log('Deconectare')});
});


app.post('/mesaj', function (req, res) {

    if (req?.utilizator?.areDreptul?.(Drepturi.scrieChat)) {
        console.log("primit mesaj");
        console.log(req.body);
        //if(conexiune_index){

        //trimit catre restul de utilizatori mesajul primit
        io.sockets.emit('mesaj_nou', req.body.nume, req.body.culoare, req.body.mesaj);
        res.send("Submit");
        //}
    } else {
        console.log("Trebuie să fii logat să vezi chatul")
        res.send("Trebuie să fii logat să scri chatul")
    }
    //res.send("Submit");
});

///////////////////////////////////

function getIp(req) {//pentru Heroku/Render
    var ip = req.headers["x-forwarded-for"];//ip-ul userului pentru care este forwardat mesajul
    if (ip) {
        let vect = ip.split(",");
        return vect[vect.length - 1];
    }
    else if (req.ip) {
        return req.ip;
    }
    else {
        return req.connection.remoteAddress;
    }
}


// --------------------- accesari -------------------

app.all("/*", function (req, res, next) {
    let id_utiliz = req?.session?.utilizator?.id;
    id_utiliz = id_utiliz ? id_utiliz : null;
    AccesBd.getInstanta().insert({
        tabel: "accesari",
        campuri: ["ip", "user_id", "pagina"],
        valori: [`'${getIp(req)}'`, `${id_utiliz}`, `'${req.url}'`]
    }, function (err, rezQuery) {
        // console.log(err);
    }
    )
    next();
});

//obiect cu ipurile active
//ip-uri active= cele care au facut o cerere de curand
//cheia e de forma ip|url iar valoarea e un obiect de forma {nr:numar_accesari, data:data_ultimei accesari}

var ipuri_active = {};


app.all("/*", function (req, res, next) {
    let ipReq = getIp(req);
    var ip_gasit = ipuri_active[ipReq + "|" + req.url];
    var timp_curent = new Date();
    if (ip_gasit) {

        if ((timp_curent - ip_gasit.data) < 120 * 1000) {//diferenta e in milisecunde; verific daca ultima accesare a fost pana in 10 secunde
            if (ip_gasit.nr > 60) {//mai mult de 10 cereri 
                res.send("<h1>Prea multe cereri intr-un interval scurt. Revino mai tarziu</h1>");
                ip_gasit.data = timp_curent
                return;
            }
            else {

                ip_gasit.data = timp_curent;
                ip_gasit.nr++;
            }
        }
        else {
            //console.log("Resetez: ", req.ip+"|"+req.url, timp_curent-ip_gasit.data)
            ip_gasit.data = timp_curent;
            ip_gasit.nr = 1;//a trecut suficient timp de la ultima cerere; resetez
        }
    }
    else {
        ipuri_active[ipReq + "|" + req.url] = { nr: 1, data: timp_curent };
        //console.log("am adaugat ", req.ip+"|"+req.url);
        //console.log(ipuri_active);        

    }
    let comanda_param = `insert into accesari(ip, user_id, pagina) values ($1::text, $2,  $3::text)`;
    //console.log(comanda);
    if (ipReq && ip_gasit) { //TO DO - nu depaseste 10 cereri in 5 secunde (atentie in cerinta aveti alte numere)
        if ((timp_curent - ip_gasit.data) < 120 * 1000) {
            if (ip_gasit.nr > 60) {//mai mult de 10 cereri 
                res.send("<h1>Prea multe cereri intr-un interval scurt.Revino m-ai tarziu</h1>");
                ip_gasit.data = timp_curent
                return;
            }
            else {

                ip_gasit.data = timp_curent;
                ip_gasit.nr++;
                var id_utiliz = req.session.utilizator ? req.session.utilizator.id : null;
                //console.log("id_utiliz", id_utiliz);
                client.query(comanda_param, [ipReq, id_utiliz, req.url], function (err, rez) {
                    if (err) console.log(err);
                });
            }
        }
    var id_utiliz=req.session.utilizator?req.session.utilizator.id:null;
    //console.log("id_utiliz", id_utiliz);
    client.query(comanda_param, [ipReq, id_utiliz, req.url], function(err, rez){
        if(err) console.log(err);
    });
    }
    next();
});


function stergeAccesariVechi() {
    AccesBd.getInstanta().delete({
        tabel: "accesari",
        conditiiAnd: ["now() - data_accesare >= interval '10 minutes' "]
    },
        function (err, rez) {
            // console.log(err);
        })
}
stergeAccesariVechi();
setInterval(stergeAccesariVechi, 10 * 60 * 1000);



// {
//     (function(a){console.log("in functie", a)})(10);

//     (async function(){
//     let u=await Utilizator.getUtilizDupaUsernameAsync("abc");
//     console.log("User async:", u);
//     })()
// }


/////////////////////// WEB CHAT /////////////////////////////////////////////////

// app.post('/azurebot', (req, res) => {
//     const bot = new AzurBot();
//     connectorClient.processActivity(req, res, async (context) => {
//         await bot.run(context);
//     });
// });


app.post('/azurebot', (req, res) => {
    const bot = new AzureBot();
  
    const userMessage = req.body.message;
    console.log("usermesage", userMessage)
    const context = { activity: { text: userMessage } };

    

  
    bot.run(context)
      .then(() => {
        res.status(200).json({ message: 'OK' });
      })
      .catch((error) => {
        console.error('Eroare în timpul execuției botului:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  });
  

//////////////////////////////////////////////////////////////////////////////// logare

app.post("/login", function (req, res) {
    var formular = new formidable.IncomingForm();
    formular.parse(req, function (err, campuriText, campuriFisier) {
        Utilizator.getUtilizDupaUsername(campuriText.username, {
            req: req,
            res: res,
            parola: campuriText.parola
        }, function (u, obparam) {
            let parolaCriptata = Utilizator.criptareParola(obparam.parola);
            if (u.confirmat_mail) {
                if (u.parola == parolaCriptata) {
                    u.cale_imagine = u.cale_imagine ? path.join("poze_uploadate", u.username, u.cale_imagine) : "";
                    obparam.req.session.utilizator = u;
                    obparam.res.redirect("/index");
                    req.session.incercari = 0;
                    var timpCurent = new Date();
                }
                else {
                    req.session.ultimulTimp = timpCurent;
                    if (req.session.ultimulTimp || (timpCurent - req.session.ultimulTimp) > 600000) {
                        req.session.incercari = 1;
                    } else {
                        req.session.incercari++;
                        var mesaj = "Date connectare incorecte!"
                    }

                    if (req.session.incercari >= 3) {
                        console.log("intra")
                        req.session.timp_b = new Date();
                        mesajText = `Stimate ${u.username} ati introdus parola de 3 ori.`;
                        mesajHTML = `<h2>Stimate ${u.username},</h2> ati introdus parola de 3 ori.`;
                        u.trimiteMail("Parola incorecta", mesajText, mesajHTML, [{
                            filename: "",
                            content: ""
                        }]);
                        mesaj = "Poti sa te conectezi dupa 5 minute"
                    }
                    let timp_trecut = req.session.timp_b + 500000;
                    if (req.session.timp_b >= timp_trecut) {
                        req.session.incercari = 0;
                    }

                    res.render("pagini/loggare", { mesaj: mesaj });
                }
            } else {
                return res.render("pagini/loggare", { mesaj: "Nu aveti mail-ul confirmat si nu va puteti loga. Va rugam sa va confirmati mail-ul" });
            }
        });
    });
});



//delogare

app.get("/logout", function (req, res) {
    req.session.destroy();
    res.locals.utilizator = null;
    res.render("pagini/logout");
});


/// Utilizatori
const allowedExtensions = ['.png', '.jpg', '.jpeg'];

function validateFileName(fileName) {
    const lastDotIndex = fileName.lastIndexOf('.');
    console.log("validateFileName", lastDotIndex)
    console.log(fileName)
    const fileExtension = fileName.substr(lastDotIndex).toLowerCase();

    if (fileName.indexOf('%') !== -1) {
        return false;
    }

    if (allowedExtensions.includes(fileExtension)) {
        return true;
    }

    for (let i = 0; i < allowedExtensions.length; i++) {
        if (fileName.endsWith(allowedExtensions[i])) {
            return false;
        }
    }

    return false;
}


app.get("/resetare", function (req, res) {
    res.render("pagini/resetare")
})

app.post("/resetare", function (req, res) {
    var formular = new formidable.IncomingForm()
    formular.parse(req, function (err, campuriText, campuriFisier) {
        var parolaCriptata = Utilizator.criptareParola(campuriText.parola);
        AccesBd.getInstanta().select(
            {
                tabel: "utilizatori",
                campuri: ["*"],
                conditiiAnd: [`email = '${campuriText.email}'`, `username = '${campuriText.username}'`]

            },
            function (err, rez) {
                console.log("rez", rez);
                if (err) {
                    console.log("error", err);
                    renderError(res, 2);
                }
                console.log("RESETARE", rez.rows);
                if (rez.rowCount == 0) {
                    var mesaj = "Email-ul sau username-ul nu sunt corecte"
                    res.render("pagini/resetare", { mesaj: mesaj })
                }
                else {
                    AccesBd.getInstanta().update(
                        {
                            tabel: "utilizatori",
                            campuri: ["parola"],
                            valori: [parolaCriptata],
                            conditiiAnd: [`username = '${campuriText.username}'`]

                        },
                        function (err, rezUpdate) {

                            if (err) {
                                console.log("error Update", err);
                                mesaj = "Eroare la update"
                            }
                            if (rezUpdate.rowCount == 0) {
                                var mesaj = "Resetarea nu s-a realizat"
                            }
                            else {
                                var mesaj = "Resetarea s-a realizat cu succes!"
                                u = new Utilizator(rez.rows[0])
                                mesajText = `Hello ${campuriText.username} se pare ca ti-ai resetat prola`;
                                mesajHTML = `<h2>Hello ${campuriText.username},</h2> se pare ca ti-ai resetat parola`;
                                u.trimiteMail("V-ati schimbat parola de la cont", mesajText, mesajHTML, [{
                                    filename: "",
                                    content: ""
                                }])
                            }

                            res.render("pagini/resetare", { mesaj: mesaj })


                        });
                }
            });
    });
});



function generateUsernameSuggestion(username) {
    // Adaugam un numar la sfarsitul username-ului existent
    var suggestion = username + Math.floor(Math.random() * 10000);
    return suggestion;
}


app.post("/inregistrare", function (req, res) {
    var formular = new formidable.IncomingForm()
    formular.parse(req, function (err, campuriText, campuriFisier) {
        var eroare = "";
        var utilizNou = new Utilizator();
        try {
            utilizNou.setareNume = campuriText.nume;
            utilizNou.setareUserName = campuriText.username;
            utilizNou.data_nastere = campuriText.data_nastere;
            utilizNou.setareOcupatie = campuriText.ocupatie;
            utilizNou.email = (campuriText.email);
            utilizNou.setarePrenume = (campuriText.prenume)
            utilizNou.culoare_chat = (campuriText.culoare_chat);
            utilizNou.setareParola = (campuriText.parola);
            if (campuriFisier.poza.originalFilename && validateFileName(campuriFisier.poza.originalFilename)) {
                utilizNou.cale_imagine = campuriFisier.poza.originalFilename;
            }
            Utilizator.getUtilizDupaUsername(campuriText.username, {}, function (u, parametru, eroareUser) {
                var mesaj;
                if (eroareUser == -1) {
                    utilizNou.salvareUtilizator();
                    console.log("utilizator dupa salvare", utilizNou)
                }
                else {
                    let sugestie = generateUsernameSuggestion(username);
                    mesaj = "M-ai exista username-ul. Poti folosi user-ul " + sugestie
                    console.log(mesaj)
                }
                console.log("err, errUser", eroare, eroareUser)
                if (!eroare && eroareUser == -1) {
                    res.render("pagini/inregistrare", { raspuns: "Inregistrare cu succes!" })

                }
                else
                    res.render("pagini/inregistrare", { err: "Eroare:  " + eroare, mesaj: mesaj });
            })
        }
        catch (e) {
            console.log(e.message);
            eroare += "Eroare site; reveniti mai tarziu";
            console.log("*******", eroare);
            res.render("pagini/inregistrare", { err: "Eroare: " + eroare })
        }
    });
    formular.on("field", function (nume, val) {
        console.log(`--- ${nume}=${val}`);
        if (nume == "username")
            username = val;
    })
    formular.on("fileBegin", function (nume, fisier) {
        console.log("fileBegin");
        console.log(nume, fisier);
        let folderUser = path.join(__dirname, "/resurse/imagini/poze_uploadate", username);
        if (!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser);
        fisier.filepath = path.join(folderUser, fisier.originalFilename)
    })
    formular.on("file", function (nume, fisier) {
        console.log(nume, fisier);
    });
});

//////////////////////////////////////////////////////////////////////////////////actualizare profil


app.post("/profil", function (req, res) {
    if (!req.session.utilizator) {
        renderError(res, 403,)
        res.render("pagini/eroare", { text: "Nu sunteti logat." });
        return;
    }
    var formular = new formidable.IncomingForm();
    formular.parse(req, function (err, campuriText, campuriFisier) {
        var parolaCriptata = Utilizator.criptareParola(campuriText.parola);
        var newparolaCriptata = Utilizator.criptareParola(campuriText.cparola);
        console.log(newparolaCriptata, "!!!!!!!!!!!!!!!")
        AccesBd.getInstanta().updateParametrizat(
            {
                tabel: "utilizatori",
                campuri: ["nume", "prenume", "email", "culoare_chat", "cale_imagine", "parola"],
                valori: [`${campuriText.nume}`, `${campuriText.prenume}`, `${campuriText.email}`, `${campuriText.culoare_chat}`, `${campuriText.cale_imagine}`, `${newparolaCriptata}`],
                conditiiAnd: [`username = '${campuriText.username}'`, `parola = '${parolaCriptata}'`] // parola cripatat inlocuiesti in valori si in sesiune :))

            },
            function (err, rez) {
                if (err) {
                    console.log(err);
                    renderError(res, 2);
                    return;
                }
                console.log(rez.rowCount);
                if (rez.rowCount == 0) {
                    res.render("pagini/profil", { mesaj: "Update-ul nu s-a realizat. Verificati parola introdusa." });
                    return;
                }
                else {
                    req.session.utilizator.nume = campuriText.nume;
                    req.session.utilizator.prenume = campuriText.prenume;
                    req.session.utilizator.email = campuriText.email;
                    req.session.utilizator.culoare_chat = campuriText.culoare_chat;
                    req.session.utilizator.parola = parolaCriptata;
                    if (campuriFisier.poza.originalFilename && validateFileName(campuriFisier.poza.originalFilename)) {
                        utilizNou.cale_imagine = campuriFile.poza.originalFilename;
                    }
                    res.locals.utilizator = req.session.utilizator;
                }
                res.render("pagini/profil", { mesaj: "Update-ul s-a realizat cu succes." });
                res.send[""]

            });


    });
});

/****************************************************************************Administrare utilizatori */


app.get("/useri", function (req, res) {

    if (req?.utilizator?.areDreptul?.(Drepturi.vizualizareUtilizatori)) {
        AccesBd.getInstanta().select({ tabel: "utilizatori", campuri: ["*"] }, function (err, rezQuery) {
            console.log(err);
            res.render("pagini/useri", { useri: rezQuery.rows });
        });
    }
    else {
        renderError(res, 403);
    }
});



app.post("/sterge_utiliz", function (req, res) {
    if (req?.utilizator?.areDreptul?.(Drepturi.stergereUtilizatori)) {
        var formular = new formidable.IncomingForm();

        formular.parse(req, function (err, campuriText, campuriFile) {
            var user
            AccesBd.getInstanta().select({ tabel: "utilizatori", campuri: ["*"], conditiiAnd: [`id=${campuriText.id_utiliz}`] }, function (err, rezQuery) {
                console.log(err);
                if (rezQuery.rows > 0) {
                    user = rezQuery.rows[0];

                    console.log("****************", user)

                    var folder = __dirname + "/resurse/imagini/poze_uploadate"
                    if (campuriText.id == user.id) {
                        let folder2 = path.join(folder, user.username)
                        fs.rmSync(folder2, { recursive: true, force: true })
                    }
                }

            });

            AccesBd.getInstanta().delete({ tabel: "utilizatori", conditiiAnd: [`id=${campuriText.id_utiliz}`] }, function (err, rezQuery) {
                console.log(err);
                res.redirect("/useri");
                mesajText = `Stimate ${req.utilizator.username} cu sinceră părere de rău, vă anunțăm că ați fost șters! Adio`;
                mesajHTML = `<h2>Stimate ${req.utilizator.username},</h2> cu sinceră părere de rău, vă anunțăm că ați fost șters! Adio`;
                req.utilizator.trimiteMail("Vi s-a sters contul", mesajText, mesajHTML, [{
                    filename: "",
                    content: ""
                }]);
                //res.send("Contul a fost sters!");
            });

        });
    } else {
        renderError(res, 403);
    }
})


app.post("/sterge_cont", function (req, res) {
    if (req?.utilizator?.areDreptul?.(Drepturi.stergereUtilizatori)) {
        var formular = new formidable.IncomingForm();
        formular.parse(req, function (err, campuriText, campuriFile) {
            var user
            username = campuriText.username
            AccesBd.getInstanta().select({ tabel: "utilizatori", campuri: ["*"], conditiiAnd: [`username='${username}'`] }, function (err, rez) {
                if (err) {
                    console.log('err', err);
                } else {
                    console.log("a tecut de select")
                    user = rez.rows[0];
                    AccesBd.getInstanta().select({ tabel: "accesari", campuri: ["*"], conditiiAnd: [`user_id=${user.id}`] }, function (err, rezAcc) {
                        if (rezAcc.rows.length >= 1) {
                            AccesBd.getInstanta().delete({ tabel: "accesari", conditiiAnd: [`user_id=${user.id}`] }, function (err, rezQuery) {
                                if (err)
                                    console.log("delete accesari", err);
                                else {
                                    //res.redirect("/useri");
                                    req.utilizator.stergeUtilizator(campuriText.username);
                                    console.log("trece de utiliz.stergeUtilizator(); ")

                                    var folder = __dirname + "/resurse/imagini/poze_uploadate"
                                    if (campuriText.username == user.username) {
                                        let folder2 = path.join(folder, user.username)
                                        fs.rmSync(folder2, { recursive: true, force: true })
                                    }
                                }

                            });
                        } if (!err) {
                            req.utilizator.stergeUtilizator(campuriText.username);
                            console.log("trece de utiliz.stergeUtilizator(); ")

                            var folder = __dirname + "/resurse/imagini/poze_uploadate"
                            if (campuriText.username == user.username) {
                                let folder2 = path.join(folder, user.username)
                                fs.rmSync(folder2, { recursive: true, force: true })
                            }

                        }
                    });
                    res.redirect("/logout");
                }

            });
        })
    } else {
        renderError(res, 403);
    }
});



app.get("/confirmare/:username/:token", function (req, res) {
    console.log(req.params) // parametrii functiei 
    try {
        Utilizator.getUtilizDupaUsername(req.params.username, { res: res, token: req.params.token }, function (u, obparam) {
            AccesBd.getInstanta().update({
                tabel: "utilizatori",
                campuri: ['confirmat_mail'],
                valori: ['true'],
                conditiiAnd: [`cod = '${obparam.token}'`]
            },
                function (err, rezUpdate) {
                    if (err || rezUpdate.rowCount == 0) {
                        console.error("cod", err)
                        renderError(res, 3);
                    } else {
                        res.render("pagini/confirmare");
                    }
                }
            )
        })
    }
    catch (e) {
        console.log(e);
        renderError(res, 2);
    }
});


app.get(["/info", "info"], function (req, res) {
    res.render("pagini/info", { imagini: obGlobal.imagini });
});



app.get(["/produse"], function (req, res) {
    //console.log('req1', req.query);
    client.query("select * from unnest(enum_range(null::categ_produs))", function (err, rezCateg) {
        continuareQuery = ""
        if (req.query.tip)
            continuareQuery += ` and categorie::text like '%${req.query.tip}%'`
        //  console.log('req', req.query.tip)

        client.query("select * from produse where 1=1" + continuareQuery, function (err, rez) {
            if (err) {
                renderError(res, 2);
                console.log(err);
            } else {
                res.render("pagini/produse", { produse: rez.rows, optiuni: rezCateg.rows });
                //res.render("pagini/favorite", { produse: rez.rows, optiuni: rezCateg.rows });
            }
        })
    })
});

app.get("/produs/:id", function (req, res) {
    //console.log("!!!!!!!!!!!!req.params.id", typeof req.params.id)
    // id= req.params.id
    // if(/\d/.id){
    //     client.query("select * from produse where id =" + req.params.id, function (err, rez) {
    //         if (err) {
    //             console.log(err);
    //             console.log("------------> produs:", rez)
    //             renderError(2);
    //         }
    //         else {
    //             res.render("pagini/produs", { prod: rez.rows[0] });
    //             //console.log(rez);
    //         }
    //     })
    // }else{
    //     res.render("pagini/index");
    // }
    client.query("select * from produse where id =" + req.params.id, function (err, rez) {
        if (err) {
            console.log(err);
            //console.log("------------> produs:", rez)
            renderError(2);
        }
        else {
            res.render("pagini/produs", { prod: rez.rows[0] });
            //console.log(rez);
        }
    })
});


function transformaSirSpecificatii(sir) {
    const elemente = sir.split(',').map(s => `"${s.trim()}"`);
    const json = `{${elemente.join(', ')}}`;
    return json;
}


app.post("/adaugaProduse", function (req, res) {
    var formular = new formidable.IncomingForm()
    formular.parse(req, function (err, campuriText, campuriFisier) {
        var eroare = "";
        utiliz = req.utilizator;
        produsNou = new Produse();
        var specificatii_trans = transformaSirSpecificatii(campuriText.specificatii)
        try {
                produsNou.setareNume = campuriText.nume,
                produsNou.setareDescriere = campuriText.descriere,
                produsNou.setarePret = campuriText.pret,
                produsNou.setareGreutate = campuriText.greutate,
                produsNou.data_fabricare = campuriText.data_fabricare,
                produsNou.tip_produs = campuriText.tip_produs,
                produsNou.categorie = campuriText.categorie,
                produsNou.setareSpecificatii = specificatii_trans,
                produsNou.desigilate = campuriText.desigilate,
                produsNou.setareCuloare = campuriText.culoare,
                produsNou.data_adaugare = campuriText.data_add,
                produsNou.garantie = campuriText.garantie,
                produsNou.stoc = campuriText.stoc
            //console.log("!!!!!!!!!!!!!!!!!!!Campuri Fisier", campuriFisier)
            if (campuriFisier.imagine.originalFilename && validateFileName(campuriFisier.imagine.originalFilename)) {
                produsNou.imagine = campuriFisier.imagine.originalFilename;

            }

            //console.log('!!!!!!!!!!specificatii trans', specificatii_trans)

            AccesBd.getInstanta().select({
                tabel: "produse",
                campuri: "nume,descriere, pret, greutate, data_fabricare, tip_produs, categorie, specificatii, desigilate, culoare, imagine, garantie, stoc".split(","),
                conditiiAnd: [`descriere = '${campuriText.descriere}'`, `specificatii = '${specificatii_trans}'`]
            },
                function (err, rezSelectP) {
                    if (err)
                        console.log("eorare select produse din adauga produse", err);
                    if (rezSelectP.rowCount == 0) {
                        console.log("rezultat selet adauga produse", rezSelectP.rows)
                        produsNou.salvareProdus();
                        mesajText = `Hello, ${req.utilizator.username} ne bucuram ca vei sa colaborezi cu noi.`;
                        mesajHTML = `<h2>Hello, ${req.utilizator.username},</h2> ne bucuram ca vei sa colaborezi cu noi.`;
                        req.utilizator.trimiteMail("Ai adaugat un produs", mesajText, mesajHTML, [{
                            filename: "",
                            content: ""
                        }]);

                        if (req.utilizator.rol.cod != "comerciant") {
                            AccesBd.getInstanta().update({
                                tabel: "utilizatori",
                                campuri: ['rol'],
                                valori: ['comerciant'],
                                conditiiAnd: [`username = '${req.utilizator.username}'`]
                            },
                                function (err, rezUpdate) {
                                    if (err || rezUpdate.rowCount == 0) {
                                        console.error("rol", err)
                                        renderError(res, 3);
                                    }
                                })
                        }

                        const data = new Date();
                        const day = data.getDate().toString().padStart(2, '0');
                        const month = (data.getMonth() + 1).toString().padStart(2, '0');
                        const year = data.getFullYear().toString();
                        const date = `${day}-${month}-${year}`;
                        //console.log(date); // afișează data curentă în formatul dd-mm-yyyy

                        let jsoncomerciant = {
                            utilizator: req.utilizator,
                            produse: produsNou,
                            data_creare_cont: date
                        }
                        if (obGlobal.bdMongo) {
                            obGlobal.bdMongo.collection("comercianti").find({ "produse": produsNou, "utilizatoe": req.utilizator }).toArray(
                                function (err, rezgasire) {
                                    if (err) console.log(err)
                                    if (rezgasire.length == 0) {
                                        obGlobal.bdMongo.collection("comercianti").insertOne(jsoncomerciant, function (err, rezmongo) {
                                            if (err) console.log(err)
                                            else console.log("Am inserat comercianti in mongodb");

                                            obGlobal.bdMongo.collection("comercianti").find({}).toArray(
                                                function (err, rezInserare) {
                                                    if (err) console.log(err)
                                                    else console.log(rezInserare);
                                                })
                                        })
                                    }
                                })
                        }

                        // adaugare imagine 

                        formular.on("field", function (nume, val) {  // 1

                            console.log(`--- ${nume}=${val}`);

                            if (nume == "nume")
                                nume = val;
                        })
                        formular.on("fileBegin", function (nume, fisier) { //2
                            console.log("fileBegin");

                            console.log(nume, fisier);
                            let folderProdus = path.join(__dirname, "/resurse/imagini/produse");
                            if (!fs.existsSync(folderProdus))
                                fs.mkdirSync(folderProdus);
                            fisier.filepath = path.join(folderProdus, fisier.originalFilename)
                        })
                        formular.on("file", function (nume, fisier) {//3
                            console.log(nume, fisier);
                        });

                        res.render("pagini/adaugaProduse", { raspuns: "Adaugare cu succes!" })
                    } else {
                        res.render("pagini/adaugaProduse", { raspuns: "Produsul pe care vreti sa il adaugati exista deja in baza noastra de date. Noi comapram produsul pe care vreti sa il adaugati cu produsele deja existente in baza noastra dupa descriere si specificatile!" })
                    }
                });


        }
        catch (e) {
            console.log(e.message);
            eroare += "Eroare site; reveniti mai tarziu";
            console.log("*******", eroare);
            res.render("pagini/adaugaProduse", { err: "Eroare: " + eroare })
        }
    });

});

app.get("/vizualizareProduse", function (req, res) {
    utiliz = req.utilizator;

    if (obGlobal.bdMongo) {
        obGlobal.bdMongo
            .collection("comercianti")
            .find({ "utilizator.username": utiliz.username })
            .toArray(function (err, rezultat) {
                if (err) console.log(err);
                else {
                    if (rezultat.length > 0) {
                        //console.log("rezultat", rezultat);
                        res.render("pagini/vizualizareProduse", { comercianti: rezultat, comerciantiLen: rezultat.length });
                    } else {
                        //console.log("Nu s-au gasit produse pentru utilizatorul specificat");
                        res.redirect("/");
                    }
                }
            });
    } else {
        //console.log("Nu s-a putut conecta la baza de date");
        res.redirect("/");
    }
});

app.get("/modificaProduse/:specificatii", function (req, res) {
    //console.log("!!!!!!!!!!!nodejs modifica prod spec", req.params.specificatii)
    const spec = decodeURIComponent(req.params.specificatii);
    //console.log("!!!spec modificare produs",spec)
    const utiliz = req.utilizator;

    if (!req.session.utilizator) {
        renderError(res, 403,)
        res.render("pagini/eroare", { text: "Nu sunteti logat." });
        return;
    }

    if (obGlobal.bdMongo) {
        obGlobal.bdMongo
            .collection("comercianti")
            .findOne(
                {
                    "utilizator.username": utiliz.username,
                    "produse.specificatii": spec,
                },
                function (err, rez) {
                    if (err) console.log(err);
                    else {
                        //console.log("rez.rows modificaProduse index,js", rez.produse)
                        if (rez) {
                            //console.log("produs modificare produs", rez.produse);
                            res.render("pagini/modificaProduse", { produs: rez.produse });
                        } else {
                            console.log("Nu s-a gasit produsul cu specificatia specificata");
                            res.redirect("/");
                        }
                    }
                }
            );
    } else {
        console.log("Nu s-a putut conecta la baza de date");
        res.redirect("/");
    }
});



app.post("/modificaProduse/:specificatii", function (req, res) {

    const utiliz = req.utilizator
    if (!req.session.utilizator) {
        renderError(res, 403,)
        res.render("pagini/eroare", { text: "Nu sunteti logat." });
        return;
    }

    var formular = new formidable.IncomingForm();
    formular.parse(req, async function (err, campuriText, campuriFile) {
        var specificatii_trans = transformaSirSpecificatii(campuriText.specificatii)
        var imagine
        if (campuriFile.imagine.originalFilename) {
            var imagine = campuriFile.imagine.originalFilename
            if (!validateFileName(imagine))
                res.render("pagini/modificaProduse", {mesaj: "Extensia imaginii nu este buna"})
            else {
                AccesBd.getInstanta().select({ tabel: "produse", campuri: "imagine".split(","), conditiiAnd: [`specificatii = '${specificatii_trans}'`] },
                function (err, rez) {
                    if (!err && rez.rowCount > 0) {
                        //console.log(rez.rows[0].imagine, "!!!!!!!!!!!!!!!!!!!!!!!!!")
                        var folder = __dirname + "/resurse/imagini/produse"
                        let folder2 = path.join(folder, rez.rows[0].imagine)
                        fs.rmSync(folder2, { recursive: true, force: true })
                        //console.log(folder2, "FOLDER2 !!!!!!!!!!!")
                    }

                });
            }
        } else {
            var img = await AccesBd.getInstanta().selectAsync({
                tabel: "produse",
                campuri: "imagine".split(","),
                conditiiAnd: [`specificatii = '${specificatii_trans}'`]
            },
                function (err, rez) {
                    if (rez.rowCount > 0) {
                        console.log("rez.rows modificaProdus", rez.rows[0].imagine)
                        imagine = rez.rows[0].imagine
                        console.log(imagine)
                    } else {
                        //res.send("Produslul pe care il cautati nu e in baza noastra de date")
                        res.render("pagini/modificaProduse", {mesaj: "Produslul pe care il cautati nu e in baza noastra de date"})
                    }

                });
            imagine =img.rows[0].imagine
        }
        console.log(imagine,'!!!!!!!!!!!!!!!!!!!!!!')
        AccesBd.getInstanta().updateParametrizat(
            {
                tabel: "produse",
                campuri: ["descriere", "pret", "greutate", "data_fabricare", "tip_produs", "categorie", "desigilate", "culoare", "imagine", "garantie", "stoc"],
                valori: [`${campuriText.descriere}`, `${campuriText.pret}`, `${campuriText.greutate}`, `${campuriText.data_fabricare}`, `${campuriText.tip_produs}`,
                `${campuriText.categorie}`, `${campuriText.desigilate}`, `${campuriText.culoare}`, `${imagine}`, `${campuriText.garantie}`, `${campuriText.stoc}`],
                conditiiAnd: [`specificatii = '${specificatii_trans}'`]

            },
            function (err, rez) {
                if (err) {
                    console.log(err);
                    //renderError(res, 2);
                    res.render("pagini/modificaProduse", {mesaj: "A aparut o eroare la update"})
                } else {
                    //console.log("update modificaProduse", rez.rowCount);
                    if (rez.rowCount == 0) {
                        //res.render("pagini/vizualizareProduse", { mesaj: "Update-ul nu s-a realizat." });
                        //res.send("Update-ul nu s-a realizat")
                        res.render("pagini/modificaProduse", {mesaj: "Update-ul nu s-a realizat"})  
                    } else {
                        if (obGlobal.bdMongo) {
                            obGlobal.bdMongo
                                .collection("comercianti")
                                .updateOne(
                                    {
                                        "utilizator.username": utiliz.username,
                                        "produse.specificatii": specificatii_trans,
                                    },
                                    {
                                        $set: {
                                            "produse.descriere": campuriText.descriere,
                                            "produse.pret": campuriText.pret,
                                            "produse.greutate": campuriText.greutate,
                                            "produse.data_fabricare": campuriText.data_fabricare,
                                            "produse.tip_produs": campuriText.tip_produs,
                                            "produse.categorie": campuriText.categorie,
                                            "produse.desigilate": campuriText.desigilate,
                                            "produse.culoare": campuriText.culoare,
                                            "produse.imagine": imagine,
                                            "produse.garantie": campuriText.garantie,
                                            "produse.stoc": campuriText.stoc
                                        }
                                    },
                                    function (err, rez) {
                                        if (err) console.log("eorare update mongo db", err);
                                        else {
                                            console.log("Documentul a fost actualizat cu succes!");
                                            console.log(rez);
                                            //res.render("pagini/vizualizareProduse", { mesaj: "Update-ul s-a realizat." });
                                            //res.send("Update-ul s-a realizat")
                                            res.render("pagini/modificaProduse", {mesaj: "Update-ul s-a realizat!"})
                                        }
                                    }
                                );
                        } else {
                            console.log("Nu s-a putut conecta la baza de date");
                            res.redirect("/");
                        }
                    }
                }


            });
    });
    formular.on("field", function (nume, val) {  // 1
        //console.log("filed");
        if (nume == "imagine")
            nume = val;
        })
    formular.on("fileBegin", function (nume, fisier) { //2
        //console.log("fileBegin");
        //console.log(nume, fisier);
        let folderProdus = path.join(__dirname, "/resurse/imagini/produse");
        if (!fs.existsSync(folderProdus))
            fs.mkdirSync(folderProdus);
        fisier.filepath = path.join(folderProdus, fisier.originalFilename)
        })
    formular.on("file", function (nume, fisier) {//3
        console.log(nume, fisier);
    });
});

app.delete("/stergeProduse/:spec", (req, res) => {
    const specificatii = decodeURIComponent(req.params.spec);
    console.log("sterge produse spec", specificatii)
    const utiliz = req.utilizator
    AccesBd.getInstanta().delete({
        tabel: "produse",
        conditiiAnd: [`specificatii = '${specificatii}'`]
    },
        function (err, rez) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "A avut loc o eroare" });
            }
            if (rez.rowCount > 0) {

                if (obGlobal.bdMongo) {
                    obGlobal.bdMongo
                        .collection("comercianti")
                        .deleteOne(
                            {
                                "utilizator.username": utiliz.username,
                                "produse.specificatii": specificatii,
                            },
                            function (err, rez) {
                                if (err) console.log("eroare stergere document din baza de date", err);
                                else {
                                    console.log("Documentul a fost sters cu succes!");
                                    console.log(rez);
                                    //res.send("Stergerea s-a realizat");
                                }
                            }
                        );
                } else {
                    console.log("Nu s-a putut conecta la baza de date");
                    //res.send("Nu s-a putut conecta la baza de date")
                }

                res.status(200).json({ message: "Produsul a fost sters cu succes" });

            } else {
                res.status(404).json({ message: "Produsul nu a fost gasit" });
            }
        });

});



/////////////////////////////////////////////// FAVORITE

app.post("/favorite", function (req, res) {
    //console.log("req.body.idProdus", req.body.idProdus)
    let idProdus = req.body.idProdus
    let id_utiliz = req?.session?.utilizator?.id;
    id_utiliz = id_utiliz ? id_utiliz : null;
    console.log("id_utiliz", id_utiliz)

    if (id_utiliz != null) {
        AccesBd.getInstanta().select({ tabel: "favorite", campuri: "id_produs".split(","), conditiiAnd: [`id_produs in (${idProdus})`, `id_user in (${id_utiliz})`] },
            function (err, rez) {
                if (!err && rez.rowCount <= 0) {
                    try {
                        AccesBd.getInstanta().insert({
                            tabel: "favorite",
                            campuri: ["id_user", "id_produs"],
                            valori: [`${id_utiliz}`, `'${idProdus}'`]
                        }, function (err, rezQuery) {
                            // console.log("eorare adaugare la favorite1", err);
                            // console.log("eorare adaugare la favorite1 rezQuery", rezQuery);
                        })
                        res.sendStatus(200);

                    } catch (error) {
                        console.error('Eroare la adăugarea la favorite2:', error);
                        res.sendStatus(500);
                    }
                } else {
                    //res.send("Produsul se afla deja in lista de favorite");
                    res.sendStatus(500);
                }

            });
    } else {
        //res.send("Nu puteti adauga produse la favorite daca nu sunteti logat");
        res.sendStatus(500);
    }


    //next();
});


app.delete("/favorite", function (req, res) {
    let idProdus = req.body.idProdus
    let id_utiliz = req?.session?.utilizator?.id;
    id_utiliz = id_utiliz ? id_utiliz : null;
    if (id_utiliz != null) {
        AccesBd.getInstanta().delete({ tabel: "favorite", conditiiAnd: [`id_produs = ${idProdus}`, `id_user = ${id_utiliz}`] }, function (err, rez) {
            if (!err) {
                AccesBd.getInstanta().selectJoin({
                    tabel: "favorite", campuri: "produse.id,nume,descriere,pret,greutate,data_fabricare,tip_produs,categorie,specificatii,desigilate,culoare,imagine,produse.data_adaugare,garantie,stoc".split(","),
                    joinTabel: "produse",
                    joinConditiile: [`favorite.id_produs = produse.id`], conditiiAnd: [`favorite.id_user in (${id_utiliz})`]
                }, function (err, rez) {
                    if (!err) {
                        res.status(200).render("pagini/favorite", { favorite: rez.rows });
                    } else {
                        console.error('Eroare la selectarea produselor ramase din favorite:', err);
                        res.sendStatus(500);
                    }
                });
            } else {
                console.error('Eroare la ștergerea din favorite:', error);
                res.sendStatus(500);
            }
        });
    } else {
        res.sendStatus(500);
    }
});

app.get("/favorite", function (req, res) {
    let id_utiliz = req?.session?.utilizator?.id;
    id_utiliz = id_utiliz ? id_utiliz : null;
    if (id_utiliz != null) {
        AccesBd.getInstanta().selectJoin({ tabel: "favorite", campuri: "produse.id,nume,descriere,pret,greutate,data_fabricare,tip_produs,categorie,specificatii,desigilate,culoare,imagine,produse.data_adaugare,garantie,stoc".split(","), joinTabel: "produse", joinConditiile: [`favorite.id_produs = produse.id`], conditiiAnd: [`favorite.id_user in (${id_utiliz})`] },
            function (err, rez) {
                if (err) {
                    renderError(res, 2);
                    //console.log(err);
                } else {
                    //console.log(rez)
                    res.render("pagini/favorite", { favorite: rez.rows });
                }
            });
    } else {
        res.render("pagini/favorite_gol")
    }

});

//////////////////////////////Cos virtual
app.post("/produse_cos", function (req, res) {
    //console.log("----------------------", req.body);
    if (req.body.ids_prod.length != 0) {
        //TO DO : cerere catre AccesBD astfel incat query-ul sa fi `select nume, descriere, pret, specificatii, imagine from produse where id in (lista de id-uri)`
        AccesBd.getInstanta().select({ tabel: "produse", campuri: "nume,descriere,pret,specificatii,imagine".split(","), conditiiAnd: [`id in (${req.body.ids_prod})`] },
            function (err, rez) {
                if (err)
                    res.send([]);
                else
                    res.send(rez.rows);
            });
    }
    else {
        res.send([]);
    }

});


cale_qr = "./resurse/imagini/qrcode";
if (fs.existsSync(cale_qr))
    fs.rmSync(cale_qr, { force: true, recursive: true });
fs.mkdirSync(cale_qr);
client.query("select id from produse", function (err, rez) {
    for (let prod of rez.rows) {
        let cale_prod = obGlobal.protocol + obGlobal.numeDomeniu + "/produs/" + prod.id;
        //console.log(cale_prod);
        QRCode.toFile(cale_qr + "/" + prod.id + ".png", cale_prod);
    }
});

async function genereazaPdf(stringHTML, numeFis, callback) {
    const chrome = await puppeteer.launch();
    const document = await chrome.newPage();
    console.log("inainte load")
    await document.setContent(stringHTML, { waitUntil: "load" });

    console.log("dupa load")
    await document.pdf({ path: numeFis, format: 'A4' });
    await chrome.close();
    if (callback)
        callback(numeFis);
}

function randomnumarComanda() {
    const randomNumber = Math.floor(Math.random() * Math.pow(10, 8));
    return randomNumber.toString().padStart(8, '0');
}



app.post("/cumpara", function (req, res) {
    var prodid = [];
    var cantitate = req.body.cantitate;
    var cant = []
    console.log("cant122", cantitate)
    for (let i = 0; i < cantitate.length - 1; ++i) {
        prodid.push(cantitate[i].id)
        cant.push(cantitate[i].cantitate)
    }
    console.log(prodid, "\n")
    console.log("CANTITATE", cant)
    if (req?.utilizator?.areDreptul?.(Drepturi.cumparareProduse)) {
        AccesBd.getInstanta().select({
            tabel: "produse",
            campuri: ["*"],
            conditiiAnd: [`id in (${prodid})`]
        }, function (err, rez) {
            if (!err && rez.rowCount > 0) {
                //console.log("produse:", rez.rows);
                let rezFactura = ejs.render(fs.readFileSync("./views/pagini/factura.ejs").toString("utf-8"), {
                    protocol: obGlobal.protocol,
                    domeniu: obGlobal.numeDomeniu,
                    utilizator: req.session.utilizator,
                    produse: rez.rows,
                    cantitate: cant
                });
                //console.log(rezFactura);
                let numeFis = `./temp/factura${(new Date()).getTime()}.pdf`;
                genereazaPdf(rezFactura, numeFis, function (numeFis) {
                    mesajText = `Stimate ${req.session.utilizator.username} aveti mai jos rezFactura.`;
                    mesajHTML = `<h2>Stimate ${req.session.utilizator.username},</h2> aveti mai jos rezFactura.`;
                    req.utilizator.trimiteMail("Factura", mesajText, mesajHTML, [{
                        filename: "factura.pdf",
                        content: fs.readFileSync(numeFis)
                    }]);
                    res.send("Comanda a fost procesata cu succes, pe e-mail veti regasi factura. Va multumim pentru comanda!");
                });
                rez.rows.forEach(function (elem) { elem.cantitate = 1 });
                const data = new Date();
                const day = data.getDate().toString().padStart(2, '0');
                const month = (data.getMonth() + 1).toString().padStart(2, '0');
                const year = data.getFullYear().toString();
                const date = `${day}-${month}-${year}`;
                //console.log(date); // afișează data curentă în formatul dd-mm-yyyy

                let jsonFactura = {
                    data: date,
                    username: req.session.utilizator.username,
                    produse: rez.rows
                }
                if (obGlobal.bdMongo) {
                    //console.log(")))))))))))))))))))))))))))))))))))))))))))))))))))")
                    obGlobal.bdMongo.collection("facturi").insertOne(jsonFactura, function (err, rezmongo) {
                        if (err) console.log(err)
                       

                        obGlobal.bdMongo.collection("facturi").find({}).toArray(
                            function (err, rezInserare) {
                                if (err) console.log(err)
                                
                            })
                    })
                }

                //comnezi
                numarComanda = randomnumarComanda();
                let jsonComenzi = {
                    numarComanda: numarComanda,
                    statusComanda: 0,
                    data: date,
                    username: req.session.utilizator.username,
                    produse: rez.rows,
                }
                if (obGlobal.bdMongo) {
                    //console.log(")))))))))))))))))))))))))))))))))))))))))))))))))))")
                    obGlobal.bdMongo.collection("comenzi").insertOne(jsonComenzi, function (err, rezmongo) {
                        if (err) console.log(err)
                        

                        obGlobal.bdMongo.collection("comenzi").find({}).toArray(
                            function (err, rezInserare) {
                                if (err) console.log(err)
                                
                            })
                    })
                }


            }
        })
    }
    else {
        res.send("Nu puteti cumpara daca nu sunteti logat sau nu aveti dreptul!");
    }

});

app.get("/comenzi", function (req, res) {
    if (obGlobal.bdMongo) {
        obGlobal.bdMongo.collection("comenzi").find({}).toArray(
            function (err, rez) {
                if (err)
                    console.log(err)
                if (rez.length > 0) {
                    // filtrăm comenzi cu statusul 3 și le ștergem
                    obGlobal.bdMongo.collection("comenzi").deleteMany({ statusComanda: "3" }, function (err, result) {
                        if (err)
                            console.log(err)
                        console.log("Removed " + result.deletedCount + " documents with statusComanda = 3");
                    });
                    res.render("pagini/comenzi", { comenzi: rez })
                    //console.log("get comenzi", rez)
                }
            })
    }
})


app.post("/modificaStatus", function (req, res) {
    if (obGlobal.bdMongo) {
        const status = req.body.data
        const numarComanda = req.body.numarComanda
        console.log("status", status)
        console.log("nrc", numarComanda)

        obGlobal.bdMongo.collection("comenzi").updateOne(
            { numarComanda: numarComanda },
            { $set: { statusComanda: status } },
            function (err, rez) {
                if (err) {
                    console.log(err)
                    res.sendStatus(204)
                }
                else {
                    console.log("post comenzi", rez)
                    res.sendStatus(201);
                }
            })
    }
})

//////////////////////////////////// urmareste colet ///////////////////////////////////////

app.get("/urmaresteColet", function (req, res) {
    if (obGlobal.bdMongo) {
        obGlobal.bdMongo.collection("comenzi").find({}).toArray(
            function (err, rez) {
                if (err)
                    console.log(err)
                if (rez.length > 0) {
                    res.render("pagini/urmaresteColet", { comenzi: rez })
                    //console.log("get urmareste colet", rez)
                }
            })
    }
})

app.delete("/stergeColet/:numarComanda", (req, res) => {
    const numarComanda = req.params.numarComanda

    console.log("numarComanda", numarComanda)
    console.log(typeof (numarComanda))

    if (obGlobal.bdMongo) {
        obGlobal.bdMongo
            .collection("comenzi")
            .deleteOne(
                {
                    "numarComanda": numarComanda,
                },
                function (err, rez) {
                    if (err) console.log("eroare stergere document din baza de date", err);
                    else {
                        console.log("Documentul a fost sters cu succes!");
                        console.log(rez);
                        res.send("200");
                    }
                }
            );
    } else {
        console.log("Nu s-a putut conecta la baza de date");
        res.send("500")
    }

});

//////////////////////////////////////////grafice ///////////////////////////////////


app.get("/grafice", function (req, res) {
    if (!(req?.session?.utilizator && req.utilizator.areDreptul(Drepturi.vizualizareGrafice))) {
        renderError(res, 403);
        return;
    }
    res.render("pagini/grafice");

})

app.get("/update_grafice", function (req, res) {
    obGlobal.bdMongo.collection("facturi").find({}).toArray(function (err, rezultat) {
        res.send(JSON.stringify(rezultat));
    });
})

////////////////////////////// Feedback //////////////////////////

caleXMLMesaje = "resurse/xml/feedback.xml";
headerXML = `<?xml version="1.0" encoding="utf-8"?>`;
function creeazaXMlContactDacaNuExista() {
    if (!fs.existsSync(caleXMLMesaje)) {
        let initXML = {
            "declaration": {
                "attributes": {
                    "version": "1.0",
                    "encoding": "utf-8"
                }
            },
            "elements": [
                {
                    "type": "element",
                    "name": "feedback",
                    "elements": [
                        {
                            "type": "element",
                            "name": "mesaje",
                            "elements": []
                        }
                    ]
                }
            ]
        }
        let sirXml = xmljs.js2xml(initXML, { compact: false, spaces: 4 });//obtin sirul xml (cu taguri)
        console.log(sirXml);
        fs.writeFileSync(caleXMLMesaje, sirXml);
        return false; //l-a creat
    }
    return true; //nu l-a creat acum
}


function parseazaMesaje() {
    let existaInainte = creeazaXMlContactDacaNuExista();
    let mesajeXml = [];
    let obJson;
    if (existaInainte) {
        let sirXML = fs.readFileSync(caleXMLMesaje, 'utf8');
        obJson = xmljs.xml2js(sirXML, { compact: false, spaces: 4 });


        let elementMesaje = obJson.elements[0].elements.find(function (el) {
            return el.name == "mesaje"
        });
        let vectElementeMesaj = elementMesaje.elements ? elementMesaje.elements : [];// conditie ? val_true: val_false
        console.log("Mesaje: ", obJson.elements[0].elements.find(function (el) {
            return el.name == "mesaje"
        }))
        let mesajeXml = vectElementeMesaj.filter(function (el) { return el.name == "mesaj" });
        return [obJson, elementMesaje, mesajeXml];
    }
    return [obJson, [], []];
}


app.get("/feedback/:id", function (req, res) {
    let obJson, elementMesaje, mesajeXml;
    [obJson, elementMesaje, mesajeXml] = parseazaMesaje();

    res.render("pagini/feedback", { mesaje: mesajeXml, id: req.params.id });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Obținem numele utilizatorului din sesiune
        let u = req.session.utilizator ? req.session.utilizator.username : 'anonim';
        // Specificăm calea directorului în care dorim să salvăm fișierele încărcate
        let director = `resurse/imagini/comentarii/${u}`;
        // Verificăm dacă directorul există, în caz contrar îl cream
        if (!fs.existsSync(director)) {
            fs.mkdirSync(director, { recursive: true });
        }
        cb(null, director);
    },
    filename: function (req, file, cb) {
        // Generăm un nume unic pentru fiecare fișier încărcat, care include și data la care a fost adăugat
        let numeImagine = `${Date.now()}_${file.originalname}`;
        cb(null, numeImagine);
    }
});

const upload = multer({ storage: storage });

app.post("/feedback/:id", upload.array('imagine'), function (req, res) {
    let obJson, elementMesaje, mesajeXml;

    [obJson, elementMesaje, mesajeXml] = parseazaMesaje();

    let u = req.session.utilizator ? req.session.utilizator.username : "anonim";
    let caleImagini = "";

    // Verificăm dacă există fișiere atașate în cererea POST
    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            let numeImagine = file.filename;
            caleImagini += `resurse/imagini/comentarii/${u}/${numeImagine}, `;
        });
        caleImagini = caleImagini.slice(0, -2); // Eliminăm ultimul ", " din caleImagini
    }

    // adauga id-produs
    let mesajNou = {
        type: "element",
        name: "mesaj",
        attributes: {
            username: u,
            data: new Date(),
            cale_imagine: caleImagini,
            id: req.params.id,
        },
        elements: [{ type: "text", "text": req.body.mesaj }]
    };
    if (elementMesaje.elements)
        elementMesaje.elements.push(mesajNou);
    else
        elementMesaje.elements = [mesajNou];

    let sirXml = xmljs.js2xml(obJson, { compact: false, spaces: 4 });
    fs.writeFileSync(caleXMLMesaje, sirXml); // Salvăm XML-ul actualizat în fișier
    console.log(sirXml)
    res.render("pagini/feedback", { mesaj: "Am adaugat un nou feedback" })
});



app.get(["/", "/index", "/home", "/login"], async function (req, res) {
    //console.log("ceva");

    // let rez;
    // rez = await instantaBD.selectAsync({ campuri: ["nume", "pret"], tabel: "produse", conditiiAnd: ["pret>100", "pret<400"] })
    // console.log("========================================!!!!", rez.rows);

    let sir = req.session.succesLogin;
    //res.render("pagini/index", { ip: req.ip, imagini: obGlobal.imagini, succesLogin: sir })
    req.session.succesLogin = null;

    // selectam user_id-i distincti unde data_accesare <= 5 minute

    client.query("select username, nume, prenume from utilizatori where id in (select distinct user_id from accesari where now()-data_accesare <= interval '5 minutes')",
        function (err, rez) {
            let useriOnline = [];
            if (!err && rez.rowCount != 0)
                useriOnline = rez.rows
            //console.log(useriOnline);

            /////////////// am adaugat aici:
            // var evenimente = []
            // var locatie = "";

            // request('https://secure.geobytes.com/GetCityDetails?key=7c756203dbb38590a66e01a5a3e1ad96&fqcn=109.99.96.15', //se inlocuieste cu req.ip; se testeaza doar pe Heroku
            //     function (error, response, body) {
            //         locatie = "Nu se poate detecta pentru moment."
            //         if (error) {

            //             console.error('eroare geobytes:', error)
            //         }
            //         else {
            //             var obiectLocatie = JSON.parse(body);
            //             console.log(obiectLocatie);
            //             locatie = obiectLocatie.geobytescountry + " " + obiectLocatie.geobytesregion
            //         }

            //         //generare evenimente random pentru calendar 

            //         var texteEvenimente = ["Eveniment important", "Festivitate", "Prajituri gratis", "Zi cu soare", "Aniversare"];
            //         dataCurenta = new Date();
            //         for (i = 0; i < texteEvenimente.length; i++) {
            //             evenimente.push({ data: new Date(dataCurenta.getFullYear(), dataCurenta.getMonth(), Math.ceil(Math.random() * 27)), text: texteEvenimente[i] });
            //         }
            //         console.log(evenimente)
            //         console.log("inainte", req.session.mesajLogin);

            //         //////sfarsit zona adaugata:
            //         res.render("pagini/index", { ip: req.ip, imagini: obGlobal.imagini, succesLogin: sir, useriOnline: useriOnline, evenimente: evenimente, locatie: locatie });

            //     });

            // res.render("pagini/index", { ip: req.ip, imagini: obGlobal.imagini, succesLogin: sir, useriOnline: useriOnline });
            client.query("select username, nume, prenume from utilizatori where id in (select distinct user_id from accesari where now()-data_accesare >= interval '5 minutes' and now()-data_accesare <= interval '10 minute')",
                function (err, rez) {
                    let useriOnlineInactiv = [];
                    if (!err && rez.rowCount != 0)
                        useriOnlineInactiv = rez.rows
                    //console.log(useriOnlineInactiv);



                    //adaugat si inchidere functie:
                    res.render("pagini/index", { ip: req.ip, imagini: obGlobal.imagini, succesLogin: sir, useriOnlineInactiv: useriOnlineInactiv, useriOnline: useriOnline });
                });


            //adaugat si inchidere functie:
        });
    // console.log(req.ip);
    // res.render("pagini/index", { ip: req.ip, imagini: obGlobal.imagini, succesLogin: sir, useriOnlineInactiv: useriOnlineInactiv, useriOnline: useriOnline, port: s_port });
    // console.log("*********************s_port", s_port)
});

// pentru port 

app.get('/chat', function (req, res) {
    console.log(req.ip);
    res.render('pagini/chat', { port: s_port });
});

// app.get("/info.html", function(req, res, next){
//     console.log("1111");
//     res.sendFile( __dirname+ "/info.html");
//     //res.send("Ha ha ha!");
//     // res.write("123");
//     // next();
// });

// app.get("/*",function(req, res){
//     console.log("url:",req.url);
//     res.render("pagini"+req.url);
// });

function createImages() {
    var continutFisier = fs.readFileSync(__dirname + "/resurse/json/galerie.json").toString("utf8");
    //console.log(continutFisier);
    var obiect = JSON.parse(continutFisier);
    var dim_mediu = 200
    var dim_mic = 100
    obGlobal.imagini = obiect.imagini;
    obGlobal.imagini.forEach(function (elem) {
        [numefisier, extensie] = elem.fisier.split('.');
        if (!fs.existsSync(obiect.cale_galerie + '/mediu/')) {
            fs.mkdirSync(obiect.cale_galerie + '/mediu/');
        }
        elem.fisier_mediu = obiect.cale_galerie + '/mediu/' + numefisier + '.webp';
        elem.fisier = obiect.cale_galerie + "/" + elem.fisier;
        sharp(__dirname + '/' + elem.fisier).resize(dim_mediu).toFile(__dirname + '/' + elem.fisier_mediu);


        if (!fs.existsSync(obiect.cale_galerie + '/mic/')) {
            fs.mkdirSync(obiect.cale_galerie + '/mic/');
        }

        elem.fisier_mic = obiect.cale_galerie + '/mic/' + numefisier + '.webp';
        sharp(__dirname + '/' + elem.fisier).resize(dim_mic).toFile(__dirname + '/' + elem.fisier_mic);
    })
    //console.log(obGlobal.imagini);
}

createImages();


function createErrors() {
    var continutFisier = fs.readFileSync(__dirname + "/resurse/json/erori.json").toString("utf8");
    obGlobal.erori = JSON.parse(continutFisier);
}
createErrors();

function renderError(res, identificator, titlu, text, imagine) {
    var eroare = obGlobal.erori.info_erori.find(function (elem) {
        return elem.identificator == identificator;
    })
    titlu = titlu || (eroare && eroare.titlu) || obGlobal.erori.eroare_default.titlu;
    text = text || (eroare && eroare.text) || obGlobal.erori.eroare_default.text;
    imagine = imagine || (eroare && obGlobal.erori.cale_baza + "/" + eroare.imagine) || obGlobal.erori.cale_baza + "/" + obGlobal.erori.eroare_default.imagine;
    if (eroare && eroare.status) {
        res.status(identificator).render("pagini/eroare", { titlu: titlu, text: text, imagine: imagine })
    }
    else {
        res.render("pagini/eroare", { titlu: titlu, text: text, imagine: imagine });
    }
}

app.get("/*.ejs", function (req, res) {
    renderError(res, 403);
});


app.get("/*", function (req, res) {
    //console.log("url:", req.url);
    res.render("pagini" + req.url, function (err, rezRandare) {
        console.log(req.url)
        if (err) {
            // console.log(err)
            if (err.message.includes("Failed to lookup view")) {
                renderError(res, 404);
            }
            else {

            }
        }
        else {
            res.send(rezRandare);
        }


    });
});


//console.log("Hello world!");

//app.listen(8080, () => console.log("Serverul Express a pornit pe 8080!"));
// server.listen(8080, () => console.log("Serverul Socket a pornit pe 8080!"));

// s_port=process.env.PORT || 5000
// server.listen(s_port)
// console.log('Serverul a pornit pe portul '+ s_port);


s_port = process.env.PORT || 8080
server.listen(s_port, function () {
    console.log('server listening at', server.address())
})
