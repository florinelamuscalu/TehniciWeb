window.addEventListener("load", function () {

    let checkbox = document.getElementById("ch-menu");
    //console.log(checkbox.checked);

    if (window.innerWidth <= 450) {
        let li_mare = document.querySelectorAll("ul.meniu > li");
        for (let i of li_mare) {
            i.onmouseover = function () {
                var elem = this.querySelector("ul")
                if(elem){
                    elem.style.display ="block";
                    elem.style.backgroundColor = "red";
                }
                console.log(elem)
            }

        }
    }
    window.onresize = function () {
        let checkbox = document.getElementById("ch-menu");

        let w = window.innerWidth;

        if (w > 450) {
            checkbox.checked = false;
        }

        //document.getElementById("header").innerHTML = "Width: " + w + ", " + "Height: " + h



        let submeniu_list = document.querySelectorAll("ul li ul li");
        let submeniu_list2 = document.querySelectorAll("ul li ul li ul li")
        for (let submeniu of submeniu_list) {
            submeniu.style.display = "none";
        }

        for (let submeniu2 of submeniu_list2) {
            submeniu2.style.display = "none";
        }


    }


});