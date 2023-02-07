window.onload = function () {
    x = 100

    // var produse = document.getElementsByClassName("produs");

    // for (let produs of produse) {
    //     id="descriere"+produs.id;
    //     console.log(id)
    //     const buton=document.getElementById(id)

    //     buton.addEventListener('click', function handleClick() {
    //         console.log('element clicked');
    //       });

    // }

    document.getElementById("inp-garantie").onchange = function () {
        //console.log(this.value);
        document.getElementById("infoRange").innerHTML = `(${this.value})`
    }


    document.getElementById("filtrare").onclick = function () {
        var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();
        var inpCategorie = document.getElementById("inp-categorie").value;
        var inpTipProd = document.getElementsByName("gr_rad");
        var inp_pret = document.getElementById("i-pret").options;
        var inp_text = document.getElementById("validationTextarea").value.toLowerCase().trim();
        var desigilat = document.getElementsByName("gr_chck");
        var datalist = document.getElementById("i_datalist").value;

        // var text;
        // if (inpNume == "" || inp_text == "" 
        //     || !inpNume.match(new RegExp("a-z]"))
        //     || !inp_text.match(new RegExp("[a-z][-+]")) ) {
        //     text = "Campurile: \`Nume si Search` nu sunt completate corect";
        // }
        // document.getElementById("messaje_alert").innerHTML = text;


        var tip_prod_value = "";
        for (let tp of inpTipProd) {
            if (tp.checked)
                tip_prod_value += tp.value
        }

        let desigilat_value = "";
        //var desigilat_id = "";
        for (let des of desigilat) {
            if (des.checked) {
                desigilat_value += des.value;
                //desigilat_id += des.id + " ";
            }
        }
        //console.log(desigilat_value)

        var produse = document.getElementsByClassName("produs");

        for (let produs of produse) {
            var cond1 = false, cond2 = false, cond3 = false, cond4 = false,
                cond5 = false, cond6 = false, cond7 = false;
            produs.style.display = "none";

            let nume = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            if (nume.includes(inpNume)) {
                cond1 = true;
            }

            let categorie = produs.getElementsByClassName("val-categorie")[0].innerHTML.trim();
            if (inpCategorie == "toate" || categorie.includes(inpCategorie)) {
                cond2 = true;
            }

            let radio = produs.getElementsByClassName("val-tip_produs")[0].innerHTML;
            //console.log("****", radio);
            //console.log(tip_prod_value)
            if (radio.includes(tip_prod_value) || tip_prod_value == "toate") {
                cond3 = true;
            }
            //console.log(cond3)

            //console.log(cond3)
            let pret = parseInt(produs.getElementsByClassName("val-pret")[0].innerHTML.trim());
            sir = []
            for (let opt of inp_pret) {
                if (opt.selected)
                    sir.push(opt.value)
            }
            //console.log(sir)
            //console.log(cond4)
            //console.log(pret)
            if (sir.includes("1") && pret < 200 || sir.includes("2") && pret >= 200 && pret < 500
                || sir.includes("3") && pret >= 500 && pret < 1000 || sir.includes("4") && pret >= 1000 && pret < 1500
                || sir.includes("5") && pret >= 1500 && pret < 2000 || sir.includes("6") && pret >= 2000 && pret < 3000
                || sir.includes("7") && pret >= 3000 && pret < 4000 || sir.includes("8") && pret >= 4000 && pret < 5000
                || sir.includes("9") && pret >= 5000) {
                cond4 = true
            }
            //console.log(cond4)
            //cond4= true;
            let descriere = produs.getElementsByClassName("descriere")[0].innerHTML.toLocaleLowerCase().trim();
            //console.log(descriere);
            //console.log("--", inp_text)
            let messaj;
            if (inp_text.indexOf("+") < 0 && inp_text.indexOf("-") < 0) {
                messaj = "Textul trebuie sa contina semnul \'+' pentru caracteristica pe care o vrei si \'-' pentru ce nu vrei";
                document.getElementById("messaje_alert").innerHTML = messaj;
            }

            let space;
            if (inp_text.indexOf(" ") >= 0) {
                space = inp_text.indexOf(" ")
            }
            else {
                space = inp_text.length;
            }
            //console.log(space)

            let semn;
            let text;
            let semn2;
            let text2;
            //console.log("pozitia unde e +", inp_text.indexOf("+"))
            if (inp_text.indexOf("+") >= 0 && inp_text.indexOf("-") < 0) {
                semn = inp_text.indexOf("+");
                //console.log('semn', semn);
                text = inp_text.substr(semn + 1, space);
                ///console.log(text);
                if (descriere.includes(text)) {
                    cond5 = true;
                    //console.log("cond5=", cond5)
                }
            } else if (inp_text.indexOf("-") >= 0 && inp_text.indexOf("+") < 0) {
                semn2 = inp_text.indexOf("-")
                text2 = inp_text.substr(semn2 + 1, space)
                //console.log(text2)
                if (!descriere.includes(text2)) {
                    cond5 = true;
                    //console.log("text2 cond5=", cond5)
                }
            } else if (inp_text.indexOf("-") >= 0 && inp_text.indexOf("+") >= 0) {
                //console.log(inp_text.charAt(0))
                if (inp_text.charAt(0) == "+") {
                    semn = inp_text.indexOf("+");
                    text = inp_text.substr(semn + 1, space)
                    semn2 = inp_text.indexOf("-");
                    text2 = inp_text.substr(semn2 + 1, inp_text.length)
                    //console.log("***text2", text2)
                } else {
                    semn2 = inp_text.indexOf("-");
                    text2 = inp_text.substr(semn2 + 1, space)
                    semn = inp_text.indexOf("+");
                    text = inp_text.substr(semn + 1, inp_text.length)
                    //console.log("****text1", text1)
                }

                if (descriere.includes(text) && !descriere.includes(text2)) {
                    cond5 = true;
                    //console.log("text & text2 cond5=", cond5)
                }
            }
            //console.log("--------", descriere.includes(text))
            //console.log("cond5******", cond5)

            let disponibilitate = produs.getElementsByClassName("val-desigilat")[0].innerHTML.trim();
            //console.log("dis",disponibilitate)
            //console.log("des",desigilat_value)
            //console.log("****", disponibilitate.includes(desigilat_value))
            if (disponibilitate == desigilat_value) {
                cond6 = true;
            }

            //console.log(cond6)

            // am scos promotii
            // for (let id in desigilat_id) {
            //     if (id == "promotii") {
            //         // go to page promotii 
            //         //console.log(id)
            //     }
            // }

            // for (let id in desigilat_id) {
            //     if (id == "desigilat") {
            //         // go to page desigilat 
            //         //console.log(id)
            //     }
            // }

            let culoare = produs.getElementsByClassName("val-culoare")[0].innerHTML;
            if (culoare.includes(datalist)) {
                cond7 = true;
            }

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7) {
                produs.style.display = "block";
                //console.log(cond3)
            }
            console.log("1", cond1);
            console.log("2", cond2);
            console.log("3", cond3);
            console.log("4", cond4);
            console.log("5", cond5);
            console.log("6", cond6);
            console.log("7", cond7);

        }
    }

    document.getElementById("resetare").onclick = function () {
        //resteare produse
        var produse = document.getElementsByClassName("produs");
        for (let produs of produse) {
            produs.style.display = "block";
        }
        //resetare filtre
        document.getElementById("inp-nume").value = "";
        document.getElementById("sel-toate").selected = true;
        document.getElementById("i-pret").selected = false;
        document.getElementById("i_datalist").value = "";
        document.getElementById("validationTextarea").value = "";
        document.getElementById("stoc").checked = true;
        document.getElementById("resigilat").checked = false;
        // document.getElementById("promotii").checked = false;
        document.getElementById("i_rad4").checked = true;


    }

    function sorteaza(semn) {
        var produse = document.getElementsByClassName("produs");
        var v_produse = Array.from(produse);



        v_produse.sort(function (a, b) {
            var pret_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if (pret_a == pret_b) {
                var nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
                var nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
                return semn * nume_a.localeCompare(nume_b);
            }
            return (pret_a - pret_b) * semn;
        })
        for (let produs of v_produse) {
            produs.parentNode.appendChild(produs);
        }
    }

    document.getElementById("sortCrescNume").onclick = function () {
        sorteaza(1);
    }
    document.getElementById("sortDescrescNume").onclick = function () {
        sorteaza(-1);
    }

    function maxim() {
        var max = 0;
        var produse = document.getElementsByClassName("produs");
        //console.log(produse)
        for (let prod of produse) {
            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
            if (pret > max) {
                max = pret
            }
        }
        //console.log(max)
        return max;
    }

    function minim() {
        var min = 9999999;
        var produse = document.getElementsByClassName("produs");
        //console.log(produse)
        for (let prod of produse) {
            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
            //console.log(pret)
            if (pret < min) {
                min = pret
            }
        }
        //console.log("****", min)
        return min;
    }

    document.getElementById("maxim").onclick = function () {
        var pret_max = maxim();
        //console.log(pret_max)
        const produs = document.createElement("p")
        produs.innerText = `Pretul maxim este ${pret_max}`
        // var produse = document.getElementsByClassName("produs");
        // for (let prod in produse) {
        //     if (prod.pret == pret_max)
        //     //produs.innerHTML = prod
        //     produs.innerText=`Pretul maxim este ${pret_max}` 
        // }
        document.getElementsByClassName("grid-produse")[0].appendChild(produs)
    }
    document.getElementById("minim").onclick = function () {
        var pret_min = minim();
        //console.log(pret_max)
        var produs = document.createElement("p")
        produs.id = "pret"
        produs.innerHTML = `Pretul minim este ${pret_min}`
        var p = document.getElementsByClassName("grid-produse")[0];
        p.parentNode.insertBefore(produs, p);
        // var produse = document.getElementsByClassName("produs");
        // for (let prod in produse) {
        //     if (prod.pret == pret_min)
        //     //produs.innerHTML = prod
        //     produs.innerText=`Pretul minim este ${pret_min}` 
        // }
        //document.getElementsByClassName("grid-produse").appendChild(produs)
    }

    window.onkeydown = function (e) {
        //console.log(e);
        if (e.key == 'c' && e.altKey) {
            var produse = document.getElementsByClassName("produs");
            let suma = 0;
            for (let prod of produse) {
                if (prod.style.display != "none")
                    suma += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML)
            }
            if (!document.getElementById("rezultat")) {
                rezultat = document.createElement("p");
                rezultat.id = "rezultat";
                rezultat.innerHTML = "<b>Pret total:</b> " + suma;
                //document.getElementById("produse").appendChild(rezultat);
                var ps = document.getElementById("p-suma");
                ps.parentNode.insertBefore(rezultat, ps.nextSibling);
                rezultat.style.border = "1px solid purple";
                rezultat.onclick = function () {
                    this.remove();
                }

                setTimeout(function () {
                    document.getElementById("rezultat").remove();
                }, 2000);
            }
            //setInterval(function(){alert(1);}, 3000);
        }
    }

}