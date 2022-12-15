window.onload = function () {
    x = 100
    document.getElementById("filtrare").onclick = function () {
        var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();
        var inpCategorie = document.getElementById("inp-categorie").value;
        var inpTipProd = document.getElementsByName("gr_rad");
        var inp_pret = document.getElementById("i-pret").value;
        var inp_text = document.getElementById("inp_textare").value.toLowerCase().trim();
        var desigilat = document.getElementsByName("gr_chck");
        var datalist = document.getElementById("i_datalist").value;

        if(inpNume == " " || inp_text == " "){
            return;
            alert("Ai uitat sa completezi campurile: Nume si Search")
        }

        var tip_prod_value = "";
        for (let tp of inpTipProd) {
            if (tp.checked)
                tip_prod_value += tp.value
        }

        var desigilat_value = "";
        var desigilat_id = "";
        for (let des of desigilat) {
            if (des.checked)
                desigilat_value += des.value + " ";
            desigilat_id += des.id + " ";
        }



        var produse = document.getElementsByClassName("produs");

        for (let produs of produse) {
            var cond1 = false, cond2 = false, cond3 = false, cond4 = false,
                cond5 = false, cond6=false, cond7=false;
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
            let pret = produs.getElementsByClassName("val-pret")[0].innerHTML.trim();
            //console.log(pret)
            if (inp_pret == 1 && pret < 200 || inp_pret == 2 && pret >= 200 && pret < 500
                || inp_pret == 3 && pret >= 500 && pret < 1000 || inp_pret == 4 && pret >= 1000 && pret < 1500
                || inp_pret == 5 && pret >= 1500 && pret < 2000 || inp_pret == 6 && pret >= 2000 && pret < 3000
                || inp_pret == 7 && pret >= 3000 && pret < 4000 || inp_pret == 8 && pret >= 4000 && pret < 5000
                || inp_pret == 9 && pret >= 5000) {
                cond4 = true
            }

            let descriere = produs.getElementsByClassName("descriere")[0].innerHTML.toLocaleLowerCase().trim();
            //console.log(descriere);
            let semn = inp_text.indexOf("+")
            let space = inp_text.indexOf(" ")
            let text = inp_text.substr(semn + 1, space)
            //console.log(text)
            if (descriere.includes(text)) {
                cond5 = true;
            }

            let disponibilitate = produs.getElementsByClassName("val-desigilat")[0].innerHTML.trim();
            for (let val in desigilat_value) {
                if (disponibilitate.includes(val)) {
                    cond6 = true;
                }
            }
            for(let id in desigilat_id){
                if(id == "promotii"){
                    // go to page promotii 
                    console.log(id)
                }
            }

            for(let id in desigilat_id){
                if(id == "desigilat"){
                    // go to page desigilat 
                    console.log(id)
                }
            }

            let culoare = produs.getElementsByClassName("val-culoare")[0].innerHTML;
            if(culoare.includes(datalist)){
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

}