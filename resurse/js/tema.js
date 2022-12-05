window.addEventListener("load" , function(){
    //vect_teme =["dark", "light", "craciun"]
    tema_curenta = localStorage.getItem("tema");
    if(tema_curenta){
        document.body.classList.add(tema_curenta);
    }
    document.getElementById("tema").onclick=function(){
        if(document.body.classList.contains("dark")){
            document.body.classList.remove("dark");
            localStorage.removeItem("tema");
        }else{
            document.body.classList.add("dark")
            localStorage.setItem("tema", "dark")
        }
    }
}
);