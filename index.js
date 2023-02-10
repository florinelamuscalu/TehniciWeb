const express = require("express");
const fs = require("fs");
app = express();


const sharp = require("sharp");
const formidable = require("formidable");
const { Client } = require("pg");
const { Utilizator } = require("./module_proprii/utilizator.js")
const ejs = require("ejs");
const session = require("express-session");
const AccesBd = require("./module_proprii/accesbd.js")
const path = require('path');
const Drepturi = require("./module_proprii/drepturi.js")
const sass = require("sass");
const QRCode= require('qrcode');
const puppeteer=require('puppeteer');
const mongodb=require('mongodb');


var cssBootstrap = sass.compile(__dirname + "/resurse/scss/customizare_bootstrap.scss", { sourceMap: true });
fs.writeFileSync(__dirname + "/resurse/css/biblioteci/bootstrap_custom.css", cssBootstrap.css);

app.set("view engine", "ejs");
//console.log("Cale proiect:", __dirname);
app.use("/resurse", express.static(__dirname + "/resurse"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/poze_uploadate", express.static(__dirname + "/poze_uploadate"));


app.use(["/produse_cos", "/cumpara"], express.json({ limit: '2mb' }));//obligatoriu de setat pt request body de tip json
app.use(session({ // aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
}));


obGlobal = {
    erori: null,
    imagini: null,
    protocol:"http://",
    numeDomeniu:"localhost:8080",
    clientMongo:mongodb.MongoClient,
    bdMongo:null
}

var url = "mongodb://localhost:27017";//pentru versiuni mai vechi de Node
var url = "mongodb://0.0.0.0:27017";
 
obGlobal.clientMongo.connect(url, function(err, bd) {
    if (err) console.log(err);
    else{
        obGlobal.bdMongo = bd.db("tehnici_web");
    }
});

//creare foldere necesare
foldere = ["temp", "poze_uploadate"];
for (let folder of foldere) {
    let calefolder = path.join(__dirname, folder);
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
        console.log(err);
    }
    )
    next();
});

//obiect cu ipurile active
//ip-uri active= cele care au facut o cerere de curand
//cheia e de forma ip|url iar valoarea e un obiect de forma {nr:numar_accesari, data:data_ultimei accesari}

// var ipuri_active={};


// app.all("/*",function(req,res,next){
//     let ipReq=getIp(req);
//     let ip_gasit=ipuri_active[ipReq+"|"+req.url];
//     timp_curent=new Date();
//     if(ip_gasit){

//         if( (timp_curent-ip_gasit.data)< 5*1000) {//diferenta e in milisecunde; verific daca ultima accesare a fost pana in 10 secunde
//             if (ip_gasit.nr>10){//mai mult de 10 cereri 
//                 res.send("<h1>Prea multe cereri intr-un interval scurt. Ia te rog sa fii cuminte, da?!</h1>");
//                 ip_gasit.data=timp_curent
//                 return;
//             }
//             else{  

//                 ip_gasit.data=timp_curent;
//                 ip_gasit.nr++;
//             }
//         }
//         else{
//             //console.log("Resetez: ", req.ip+"|"+req.url, timp_curent-ip_gasit.data)
//             ip_gasit.data=timp_curent;
//             ip_gasit.nr=1;//a trecut suficient timp de la ultima cerere; resetez
//         }
//     }
//     else{
//         ipuri_active[ipReq+"|"+req.url]={nr:1, data:timp_curent};
//         //console.log("am adaugat ", req.ip+"|"+req.url);
//         //console.log(ipuri_active);        

//     }
//     let comanda_param= `insert into accesari(ip, user_id, pagina) values ($1::text, $2,  $3::text)`;
//     //console.log(comanda);
//     if (ipReq){ //TO DO - nu depaseste 10 cereri in 5 secunde (atentie in cerinta aveti alte numere)
//         var id_utiliz=req.session.utilizator?req.session.utilizator.id:null;
//         //console.log("id_utiliz", id_utiliz);
//         client.query(comanda_param, [ipReq, id_utiliz, req.url], function(err, rez){
//             if(err) console.log(err);
//         });
//     }
//     next();   
// }); 


function stergeAccesariVechi() {
    AccesBd.getInstanta().delete({
        tabel: "accesari",
        conditiiAnd: ["now() - data_accesare >= interval '10 minutes' "]
    },
        function (err, rez) {
            console.log(err);
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

// logare


app.post("/login", function (req, res) {
    var username;
    console.log("ceva");
    var formular = new formidable.IncomingForm()
    formular.parse(req, function (err, campuriText, campuriFisier) {
        Utilizator.getUtilizDupaUsername(campuriText.username, {
            req: req,
            res: res,
            parola: campuriText.parola
        }, function (u, obparam) {
            let parolaCriptata = Utilizator.criptareParola(obparam.parola);
            if (u.parola == parolaCriptata && u.confirmat_mail) {
                u.cale_imagine = u.cale_imagine ? path.join("poze_uploadate", u.username, u.cale_imagine) : "";
                obparam.req.session.utilizator = u;

                obparam.req.session.succesLogin = "Bravo! Te-ai logat!";
                obparam.res.redirect("/index");
                //obparam.res.render("/login");
            }
            else {
                obparam.req.session.succesLogin = "Date logare incorecte sau nu a fost confirmat mailul!";
                obparam.res.redirect("/index");
            }
        })
    })
});


//delogare

app.get("/logout", function (req, res) {
    req.session.destroy();
    res.locals.utilizator = null;
    res.render("pagini/logout");
});


/// Utilizatori


app.post("/inregistrare", function (req, res) {
    var username;
    //console.log("ceva");
    var formular = new formidable.IncomingForm()
    formular.parse(req, function (err, campuriText, campuriFisier) {
        console.log(campuriText);

        console.log(campuriFisier);
        var eroare = "";

        var utilizNou = new Utilizator();
        try {
            utilizNou.setareNume = campuriText.nume;
            utilizNou.setareUserName = campuriText.username;
            utilizNou.data_nastere = campuriText.data_nastere;
            utilizNou.ocupatie = campuriText.ocupatie;
            utilizNou.email = (campuriText.email);
            utilizNou.prenume = (campuriText.prenume)
            utilizNou.culoare_chat = (campuriText.culoare_chat);
            utilizNou.parola = (campuriText.parola)
            utilizNou.cale_imagine = campuriFisier.poza.originalFilename;
            Utilizator.getUtilizDupaUsername(campuriText.username, {}, function (u, parametru, eroareUser) {
                //console.log("=============================================================");
                if (eroareUser == -1) {//nu exista username-ul in BD
                    utilizNou.salvareUtilizator();
                    //console.log("=============================================================");
                }
                else {
                    eroare += "Mai exista username-ul";
                }
                if (!eroare && eroareUser == -1) {
                    res.render("pagini/inregistrare", { raspuns: "Inregistrare cu succes!" })

                }
                else
                    res.render("pagini/inregistrare", { err: "Eroare:  " + eroare });
            })
            //utilizNou.salvareUtilizator();
        }
        catch (e) {
            console.log(e.message);
            eroare += "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", { err: "Eroare: " + eroare })
        }
    });
    formular.on("field", function (nume, val) {  // 1

        console.log(`--- ${nume}=${val}`);

        if (nume == "username")
            username = val;
    })
    formular.on("fileBegin", function (nume, fisier) { //2
        console.log("fileBegin");

        console.log(nume, fisier);
        //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului
        let folderUser = path.join(__dirname, "poze_uploadate", username);
        //folderUser=__dirname+"/poze_uploadate/"+username
        console.log(folderUser);
        if (!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser);
        fisier.filepath = path.join(folderUser, fisier.originalFilename)
        //fisier.filepath=folderUser+"/"+fisier.originalFilename
    })
    formular.on("file", function (nume, fisier) {//3
        console.log("file");
        console.log(nume, fisier);
    });
});

//actualizare profil


app.post("/profil", function (req, res) {
    console.log("profil");
    if (!req.session.utilizator) {
        randeazaEroare(res, 403,)
        res.render("pagini/eroare_generala", { text: "Nu sunteti logat." });
        return;
    }
    var formular = new formidable.IncomingForm();

    formular.parse(req, function (err, campuriText, campuriFile) {

        var parolaCriptata = Utilizator.criptareParola(campuriText.parola);
        // AccesBD.getInstanta().update(
        //     {tabel:"utilizatori",
        //     campuri:["nume","prenume","email","culoare_chat"],
        //     valori:[`${campuriText.nume}`,`${campuriText.prenume}`,`${campuriText.email}`,`${campuriText.culoare_chat}`],
        //     conditiiAnd:[`parola='${parolaCriptata}'`]
        // },  
        AccesBD.getInstanta().updateParametrizat(
            {
                tabel: "utilizatori",
                campuri: ["nume", "prenume", "email", "culoare_chat"],
                valori: [`${campuriText.nume}`, `${campuriText.prenume}`, `${campuriText.email}`, `${campuriText.culoare_chat}`],
                conditiiAnd: [`parola='${parolaCriptata}'`]
            },
            function (err, rez) {
                if (err) {
                    console.log(err);
                    randeazaEroare(res, 2);
                    return;
                }
                console.log(rez.rowCount);
                if (rez.rowCount == 0) {
                    res.render("pagini/profil", { mesaj: "Update-ul nu s-a realizat. Verificati parola introdusa." });
                    return;
                }
                else {
                    //actualizare sesiune
                    //console.log("ceva");
                    req.session.utilizator.nume = campuriText.nume;
                    req.session.utilizator.prenume = campuriText.prenume;
                    req.session.utilizator.email = campuriText.email;
                    req.session.utilizator.culoare_chat = campuriText.culoare_chat;
                    res.locals.utilizator = req.session.utilizator;
                }


                res.render("pagini/profil", { mesaj: "Update-ul s-a realizat cu succes." });

            });


    });
});

/******************Administrare utilizatori */
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

            AccesBd.getInstanta().delete({ tabel: "utilizatori", conditiiAnd: [`id=${campuriText.id_utiliz}`] }, function (err, rezQuery) {
                console.log(err);
                res.redirect("/useri");
            });
        });
    } else {
        renderError(res, 403);
    }
})

//http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}

app.get("/cod/:username/:token", function (req, res) {
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
                        console.error("Cod", err)
                        renderError(res, 3);
                    } else {
                        res.render("pagini/confirmare.ejs");
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
            }
        })
    })
});



app.get("/produs/:id", function (req, res) {
    client.query("select * from produse where id =" + req.params.id, function (err, rez) {
        if (err) {
            console.log(err);
            renderError(2);
        }
        else {
            res.render("pagini/produs", { prod: rez.rows[0] });
            //console.log(rez);
        }
    })
});

app.get("/produse", function (req, res) {
    client.query("select * from unnest(enum_range(null::categ_produs))", function (err, rezCateg) {
        client.query("select  * from ", function (err, rez) {
            if (err) {
                console.log(err);
                renderError(res, 2);
            }
            else {
                res.render("pagini/produse", { produse: rez.rows, optiuni: rezCateg.rows });
                console.log(rez);
            }
        });
    });
});


//////////////////////////////Cos virtual
app.post("/produse_cos", function (req, res) {
    console.log("----------------------", req.body);
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

async function genereazaPdf(stringHTML,numeFis, callback) {
    const chrome = await puppeteer.launch();
    const document = await chrome.newPage();
    console.log("inainte load")
    await document.setContent(stringHTML, {waitUntil:"load"});

    console.log("dupa load")
    await document.pdf({path: numeFis, format: 'A4'});
    await chrome.close();
    if(callback)
        callback(numeFis);
}

app.post("/cumpara",function(req, res){
    console.log(req.body);
    console.log("Utilizator:", req?.utilizator);
    console.log("Utilizator are dreptul:", req?.utilizator?.rol?.areDreptul?.(Drepturi.cumparareProduse));
    console.log("Drept:", req?.utilizator?.areDreptul?.(Drepturi.cumparareProduse));
    if (req?.utilizator?.areDreptul?.(Drepturi.cumparareProduse)){
        AccesBd.getInstanta().select({
            tabel:"produse",
            campuri:["*"],
            conditiiAnd:[`id in (${req.body.ids_prod})`]
        }, function(err, rez){
            if(!err  && rez.rowCount>0){
                console.log("produse:", rez.rows);
                let rezFactura= ejs.render(fs.readFileSync("./views/pagini/factura.ejs").toString("utf-8"),{
                    protocol: obGlobal.protocol, 
                    domeniu: obGlobal.numeDomeniu,
                    utilizator: req.session.utilizator,
                    produse: rez.rows
                });
                console.log(rezFactura);
                let numeFis=`./temp/factura${(new Date()).getTime()}.pdf`;
                genereazaPdf(rezFactura, numeFis, function (numeFis){
                    mesajText=`Stimate ${req.session.utilizator.username} aveti mai jos rezFactura.`;
                    mesajHTML=`<h2>Stimate ${req.session.utilizator.username},</h2> aveti mai jos rezFactura.`;
                    req.utilizator.trimiteMail("Factura", mesajText,mesajHTML,[{
                        filename:"factura.pdf",
                        content: fs.readFileSync(numeFis)
                    }] );
                    res.send("Totul e bine!");
                });
                rez.rows.forEach(function (elem){ elem.cantitate=1});
                let jsonFactura= {
                    data: new Date(),
                    username: req.session.utilizator.username,
                    produse:rez.rows
                }
                if(obGlobal.bdMongo){
                    console.log(")))))))))))))))))))))))))))))))))))))))))))))))))))")
                    obGlobal.bdMongo.collection("facturi").insertOne(jsonFactura, function (err, rezmongo){
                        if (err) console.log(err)
                        else console.log ("Am inserat factura in mongodb");

                        obGlobal.bdMongo.collection("facturi").find({}).toArray(
                            function (err, rezInserare){
                                if (err) console.log(err)
                                else console.log (rezInserare);
                        })
                    })
                }
            }
        })
    }
    else{
        res.send("Nu puteti cumpara daca nu sunteti logat sau nu aveti dreptul!");
    }

});


app.get("/grafice", function(req,res){
    if (! (req?.session?.utilizator && req.utilizator.areDreptul(Drepturi.vizualizareGrafice))){
        renderError(res, 403);
        return;
    }
    res.render("pagini/grafice");

})

app.get("/update_grafice",function(req,res){
    obGlobal.bdMongo.collection("facturi").find({}).toArray(function(err, rezultat) {
        res.send(JSON.stringify(rezultat));
    });
})


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
            console.log(useriOnline);

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

            res.render("pagini/index", { ip: req.ip, imagini: obGlobal.imagini, succesLogin: sir, useriOnline: useriOnline });



            //adaugat si inchidere functie:
        });

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

app.get("/*.ejs", function (req, res) {
    renderError(res, 403);
});


app.get("/*", function (req, res) {
    console.log("url:", req.url);
    res.render("pagini" + req.url, function (err, rezRandare) {
        if (err) {
            console.log(err)
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

app.listen(8080);
console.log("Serverul a pornit!");

