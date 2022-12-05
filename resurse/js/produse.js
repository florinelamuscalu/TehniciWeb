window.addEventListener("DOMContentLoaded", function () {
    x = 100

    document.getElementById("inp-pret").onchange=function(){
        console.log(this.value);
        document.getElementById("infoRange").innerHTML=`(${this.value})`
    }


    document.getElementById("filtrare").onclick = function () {
        //verificare inputuri
        condValidare = true;
        var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();
        condValidare = condValidare && inpNume.match(new RegExp("[a-zA-Z]*$"))
        if (!condValidare) {
            alert("Inputuri gresite");
            return;
        }
        var inpCategorie = document.getElementById("inp-categorie").value;

        var produse = document.getElementsByClassName("produs");

        for (let produs of produse) {
            var cond1 = false, cond2 = false;
            produs.style.display = "none";

            let nume = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            if (nume.includes(inpNume)) {
                var cond1 = true;
            }

            let categorie = produs.getElementsByClassName("val-categorie")[0].innerHTML.trim();
            if (inpCategorie == "toate" || categorie == inpCategorie) {
                var cond2 = true;
            }

            if (cond1 && cond2) {
                produs.style.display = "block";
            }
        }
    }
    document.getElementById("resetare").onclick = function () {
        var produse = document.getElementsByClassName("produs");

        for (let produs of produse) {
            produs.style.display = "none";
        }

        document.getElementById("inp-nume").value = "";
        document.getElementById("sell-toate").selected = true;

    }

    function sortare(sem) {
        var produse = document.getElementsByClassName("produs");
        var v_produse = Array.from(produse);

        v_produse.sort(function (a, b) {
            var pret_a = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);

            if (pret_a == pret_b) {
                var nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
                var nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
                return sem * nume_a.localeCompare(nume_b);
            }

            return (pret_a - pret_b) * sem;
        });

    }
    document.getElementById("sortCrescNume").onclick = function () {
        sortare(1); // pt desc -1
    }

    window.onkeydown = function (e) {
        console.log(e);
        if (e.key == 'c' && e.altKey) {
            let sum = 0;
            var produse = document.getElementsByClassName("produs");
            for (let prod of produse) {
                if (prod.style.display != "none")
                    sum += parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            }
            if (!document.getElementById('rezultat')) {
                rezultat = document.createElement("p");
                rezultat.id = "rezultat";
                rezultat.innerHTML = "<b> Pret total: </b>" + sum;
                //document.body.appendChild(rezultat); // final de body
                //document.getElementById("produse").appendChild(rezultat); // final de produse
                var ps = document.getElementById("p-suma");
                ps.parentNode.insertBefore(rezultat, ps.nextSibling);
                rezultat.style.border = "1px solid black";
                rezultat.onclick = function () {
                    this.remove;
                }
                setTimeout(function () {
                    document.getElementById("rezultat").remove();
                }, 20000);
                //setInterval(function(){alert(1);}, 3000);
            }
        }
    }
}
);