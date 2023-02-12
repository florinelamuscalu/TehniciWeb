window.onload = function () {

    var formular = document.getElementById("form_inreg");
    if (formular) {
        document.getElementById("confPar").style.display="none"
    
        formular.onsubmit = function () {
            if (document.getElementById("parl").value != document.getElementById("rparl").value) {
                alert("Nu ati introdus acelasi sir pentru campurile \"parola\" si \"reintroducere parola\".");
                return false;
            }

            // verificare campuri
            var form = document.getElementById("form");
            var requiredFields = form.querySelectorAll("[required]");
            var allFieldsCompleted = true;

            for (var i = 0; i < requiredFields.length; i++) {
                var field = requiredFields[i];
                if (!field.value) {
                    allFieldsCompleted = false;
                    field.style.border = "10px solid red";
                } else {
                    field.style.border = "";
                }
            }

            if (!allFieldsCompleted) {
                alert("Completați toate câmpurile obligatorii!");
            }

            return true;
        }
    }
}