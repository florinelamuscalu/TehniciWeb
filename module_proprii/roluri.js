const Drepturi=require('./drepturi.js');


class Rol{
    static get tip() {return "generic"}
    static get drepturi() {return []}
    //static get dreptCurierat(){return []}
    constructor (){
        this.cod=this.constructor.tip;
    }

    areDreptul(drept){ //drept trebuie sa fie tot Symbol
        //console.log("in metoda rol!!!!")
        return this.constructor.drepturi.includes(drept); //pentru ca e admin
    }

    // areDreptuldeCurierat(drept){
    //     return this.constructor.dreptCurierat.includes(drept);
    // }
}

class RolAdmin extends Rol{
    
    static get tip() {return "admin"}
    static get drepturi() { return [
        Drepturi.vizualizareUtilizatori,
        Drepturi.stergereUtilizatori,
        Drepturi.cumparareProduse,
        Drepturi.vizualizareGrafice,
        Drepturi.adaugaProduse,
        Drepturi.stergeProduse,
        Drepturi.modificaProduse
    ] }
    constructor (){
        super();
    }

    areDreptul(drept){
        return this.constructor.drepturi.includes(drept);
    }

}

class RolModerator extends Rol{
    
    static get tip() {return "moderator"}
    static get drepturi() { return [
        Drepturi.vizualizareUtilizatori,
    ] }
    constructor (){
        super()
    }
}

class RolClient extends Rol{
    static get tip() {return "comun"}
    static get drepturi() { return [
        Drepturi.cumparareProduse,
        Drepturi.scrieChat,
        Drepturi.stergereUtilizatori,
    ] }
    constructor (){
        super()
    }

}

class RolCurier extends Rol{
    static get tip() {return "curier"}
    static get drepturi() { return [
        Drepturi.curierat,
    ] }
    
    constructor (){
        super()
    }


    areDreptul(drept) {
        return this.constructor.drepturi.includes(drept); //returneaza true daca dreptul este inclus in drepturile curierului
    }

}

class RolComerciant extends Rol{
    static get tip() {return "comerciant"}
    static get drepturi() { return [
        Drepturi.adaugaProduse,
        Drepturi.stergeProduse,
        Drepturi.modificaProduse,
    ] }
    
    constructor (){
        super()
    }
  
    areDreptul(drept) {
        return this.constructor.drepturi.includes(drept); 
    }

}

class RolFactory{
    static creeazaRol(tip) {
        switch(tip){
            case RolAdmin.tip : return new RolAdmin();
            case RolModerator.tip : return new RolModerator();
            case RolClient.tip : return new RolClient();
            case RolCurier.tip : return new RolCurier();
            case RolComerciant.tip : return new RolComerciant();
        }
    }
}


module.exports={
    RolFactory:RolFactory,
    RolAdmin:RolAdmin
}