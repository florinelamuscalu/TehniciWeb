window.addEventListener("load", function () {

    var checkbox = document.getElementById("ch-menu");
    console.log(checkbox.cheched);
    window.onresize = function () {

        let w = window.innerWidth;

        if (w > 450) {
            checkbox.cheched = false;
        }

        //document.getElementById("header").innerHTML = "Width: " + w + ", " + "Height: " + h


        
        let submeniu_list= document.querySelectorAll("ul li ul li a");
        let submeniu_list2 =document.querySelectorAll("ul li ul li ul li a")
        for (let submeniu of submeniu_list){
            submeniu.style.display="none";
        }

        for (let submeniu2 of submeniu_list2){
            submeniu2.style.display="none";
        }
    }


});