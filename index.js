const express = require("express");
const fs = require("fs");
app = express();


const sharp = require("sharp");
const { Client } = require("pg");
const ejs = require("ejs");
var client = new Client({
    database: "lab8",
    user: "flori2",
    password: "flori",
    host: "localhost",
    port: 5432
});
client.connect();

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
var cssBootstrap = sass.compile(__dirname + "/resurse/scss/customizare_bootstrap.scss", { sourceMap: true });
fs.writeFileSync(__dirname + "/resurse/css/biblioteci/bootstrap_custom.css", cssBootstrap.css);

app.set("view engine", "ejs");
console.log("Cale proiect:", __dirname);
app.use("/resurse", express.static(__dirname + "/resurse"));

obGlobal = {
    erori: null,
    imagini: null
}

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


app.get(["/info", "info"], function (req, res) {
    res.render("pagini/info", { imagini: obGlobal.imagini });
});

// app.get("/produse", function (req, res) {
//     client.query("select * from unnest(enum_range(null::categ_prajitura))", function (err, rezCateg) {
//         client.query("select  * from prajituri", function (err, rez){
//             if (err) {
//                 console.log(err);
//                 renderError(res, 2);
//             }
//             else {
//                 res.render("pagini/produse", { produse: rez.rows, optiuni: rezCateg.rows });
//                 //console.log(rez);
//             }
//         });
//     });
// });


app.get(["/produse"], function (req, res) {
    console.log(req.query);
    client.query("select * from unnest(enum_range(null::categ_prajitura))", function (err, rezCateg) {
        continuareQuery=""
        if(req.query.tip)
            continuareQuery+=`and tip_produs='${req.query.tip}'`
        client.query("select * from prajituri where 1=1" + continuareQuery, function (err, rez) {
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
    client.query("select * from prajituri where id =" + req.params.id, function (err, rez) {
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

app.get(["/", "/index", "/home"], function (req, res) {
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