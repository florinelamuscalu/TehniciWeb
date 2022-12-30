window.addEventListener("load", function () {

    var checkbox = document.getElementById("ch-menu");
    console.log(checkbox.cheched);
    window.onresize = function () {

        let w = window.innerWidth;

        if (w > 450) {
            checkbox.cheched = false;
        }

        //document.getElementById("header").innerHTML = "Width: " + w + ", " + "Height: " + h
    }


});