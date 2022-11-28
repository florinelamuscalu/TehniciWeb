window.onload = function() {
    x = 100
    document.getElementById("filtrare").onclick=function() {
        var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();
        var inpCategorie = document.getElementById("inp-categorie").value;

        var produse = document.getElementsByClassName("produs"); 

        for( let produs of produse) {
            var cond1 = false, cond2 = false; 
            produs.style.display = "none";

            let nume = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            if(nume.includes(inpNume)) {
                var cond1 = true; 
            }

            let categorie = produs.getElementsByClassName("val-categorie")[0].innerHTML.trim();
            if(inpCategorie == "toate" || categorie == inpCategorie) {
                var cond2 = true; 
            }

            if(cond1 && cond2) {
                produs.style.display = "block";
            }
        }
    }
    document.getElementById("resetare").onclick=function() {
        var produse = document.getElementsByClassName("produs"); 

        for( let produs of produse) {
            produs.style.display = "none";
        }

        document.getElementById("inp-nume").value="";
        document.getElementById("sell-toate").selected=true;
        
    }

    function sortare(sem) {
        var produse = document.getElementsByClassName("produs"); 
        var v_produse = Array.from(produse);

        v_produse.sort(function(a,b){
            var pret_a = parseInt( a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b = parseInt( b.getElementsByClassName("val-pret")[0].innerHTML);
            
            if(pret_a == pret_b){
                var nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
                var nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
                return sem * nume_a.localeCompare(nume_b);
            }
            
            return (pret_a-pret_b)*sem;
        });

    }
    document.getElementById("sortCrescNume").onclick=function() {
        sortare(1); // pt desc -1
        }
}