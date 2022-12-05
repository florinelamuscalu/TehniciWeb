

function setCookie(nume, val, timpExpirare){
    d = new Date();
    d.setTime(d.getTime() + timpExpirare)
    document.cookie=`${nume} = ${val}; expires = ${d.toUTCString()}`;
}

function getCookie(nume){
    vectorParametri = document.cookie.split(";")
    for(let param of vectorParametri){
        if(param.trim().startWith(nume + "="))
            return param.split("=")[1]
    }
    return null;
}

function deleteCookie(nume){
    document.cookie=`${nume}; expires=${(new Date()).toUTCString()}`;
}

window.addEventListener("load", function(){
    if (getCookie("acceptat_banner")){
        this.document.getElementById("banner").style.display="none";
    }

    this.document
})