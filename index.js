const express = require("express");
const fs = require("fs");
app = express();


const sharp = require("sharp");
const formidable = require("formidable");
const { Client } = require("pg");
const { Utilizator } = require("./module_propri/utilizator.js")
const ejs = require("ejs");
const session = require("express-session");

const AccesBd = require("./module_propri/accesbd.js")

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


const sass = require("sass");
const utilizator = require("./module_propri/utilizator.js");
var cssBootstrap = sass.compile(__dirname + "/resurse/scss/customizare_bootstrap.scss", { sourceMap: true });
fs.writeFileSync(__dirname + "/resurse/css/biblioteci/bootstrap_custom.css", cssBootstrap.css);

app.set("view engine", "ejs");
console.log("Cale proiect:", __dirname);
app.use("/resurse", express.static(__dirname + "/resurse"));

obGlobal = {
    erori: null,
    imagini: null
}

app.use(session({ // aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
  }));


app.use("/*", function (req, res, next) {
    client.query("select * from unnest(enum_range(null::categ_produs))", function (err, rezCateg) {
        continuareQuery = ""
        res.locals.optiuni = rezCateg.rows;
        next();
    });
    res.locals.utilizator = req.session.utilizator;
    //next();
})


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
         }, function(u, obparam){
            let parolaCriptata = Utilizator.criptareParola(obparam.parola);
            if(u.parola == parolaCriptata){
                obparam.req.session.Utilizator = u;
                obparam.res.redirect("/index");
                // obparam.res.render("/login"); pagina in care ii multumesti ca s-a logat
            }else{
                obparam.res.render("pagini/index", {erroareLogin:"Date logare incorecte!"})
            }
         })
    })
});


//delogare

app.get("/logout", function(req, res){
    req.session.destroy();
    res.locals.utilizator=null;
    res.render("pagini/logout");
});


/// Utilizatori


app.post("/inregistrare", function (req, res) {
    var username;
    console.log("ceva");
    var formular = new formidable.IncomingForm()
    formular.parse(req, function (err, campuriText, campuriFisier) {
        console.log(campuriText);

        var eroare = "";

        var utilizNou = new Utilizator();
        try {
            utilizNou.setareNume = campuriText.nume;
            utilizNou.setareUserName = campuriText.username;
            utilizNou.email = (campuriText.email);
            utilizNou.prenume = (campuriText.prenume)
            utilizNou.culoare_chat = (campuriText.culoare_chat);
            utilizNou.parola = (campuriText.parola)
            utilizNou.salvareUtilizator();
        }
        catch (e) { eroare += e.message }

        if (!eroare) {
            res.render("pagini/inregistrare", { raspuns: "Inregistrare cu scucces!" });
        }
        else
            res.render("pagini/inregistrare", { err: "Eroare: " + eroare });
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

    })
    formular.on("file", function (nume, fisier) {//3
        console.log("file");
        console.log(nume, fisier);
    });
});



app.get(["/info", "info"], function (req, res) {
    res.render("pagini/info", { imagini: obGlobal.imagini });
});



app.get(["/produse"], function (req, res) {
    console.log('req1', req.query);
    client.query("select * from unnest(enum_range(null::categ_produs))", function (err, rezCateg) {
        continuareQuery = ""
        if (req.query.tip)
            continuareQuery += ` and categorie::text like '%${req.query.tip}%'`
        console.log('req', req.query.tip)

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

//http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}

app.get("/cod/:username/:token", function (req, re) {
    console.log(req.params) // parametrii functiei 
    try {
        Utilizator.getUtilizDupaUsername(req.params.username, { res: res, token: req.params.token }, function (u, obparam) {
            AccesBd.getInstanta().update({
                tabel: "utilizatori",
                campuri: ['confirmat_mail'],
                valori: ['true'],
                conditiiAnd: [`cod = '${obparam.token}'`]
            },
                function (err, rez) {
                    if (err || rezUpdate.rowCount == 0) {
                        console.error("Cod", err)
                        renderError(rez, 3);
                    } else {
                        rez.render("pagini/confirmare.ejs");
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


app.get(["/", "/index", "/home,/login"], function (req, res) {
    console.log("ceva");
    res.render("pagini/index", { ip: req.ip })
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


console.log("Hello world!");

app.listen(8080);
console.log("Serverul a pornit!");

