window.onload = function () {

    // const passwordInput = document.querySelector("#parl");
    // const eyeIcon = document.querySelector(".bi");

    // eyeIcon.addEventListener("click", function () {
    //     if (passwordInput.type === "password") {
    //         passwordInput.type = "text";
    //         eyeIcon.classList.remove("bi-eye");
    //         eyeIcon.classList.add("bi-eye-slash");
    //     } else {
    //         passwordInput.type = "password";
    //         eyeIcon.classList.remove("bi-eye-slash");
    //         eyeIcon.classList.add("bi-eye");
    //     }
    // });


    var formular = document.getElementById("form_inreg");
    if (formular) {
        formular.onsubmit = function () {
            if (document.getElementById("parl").value != document.getElementById("rparl").value) {
                alert("Nu ati introdus acelasi sir pentru campurile \"parola\" si \"reintroducere parola\".");
                return false;
            }

            return true;
        }
    }
}