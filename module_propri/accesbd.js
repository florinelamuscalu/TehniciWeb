

const { Client } = require("pg");

class AccesBD{
    static #instanta=null;

    constructor() {
        if(AccesBD.#instanta){
            throw new Error("Deja a fost instantiat");
        }
        AccesBD.#instanta = -1
    }

    initLocal(){
         this.client = new Client({
            database: "pc",
            user: "flori2",
            password: "flori",
            host: "localhost",
            port: 5432
        });
        this.client.connect();
    }

    getClient(){
        if(!AccesBD.#instanta || AccesBD.#instanta == -1){
            throw new Error ("Nu a fost instantiata clasa")
        }
        return this.client
    }


    static getInstanta({init="local"}={}){
        console.log(this); // this == nume clasa pt e metoda statica
        if(!this.#instanta){
            this.#instanta = new AccesBD(); 

            switch(init){
                case "local":this.#instanta.initLocal();
            }
        }
        return this.#instanta;
    }  

    select({tabel ="", campuri=[],conditiiAnd=[]}={}, callback){
        let conditieWhere ="";
        if(conditiiAnd.length >0)
            conditieWhere =`where ${conditiiAnd.join(" and ")}`;
        let comanda = `select ${campuri.join(",")} from ${tabel} ${conditieWhere}` 
        console.log(comanda);
        this.client.query(comanda, callback)
    }

    insert({tabel ="", campuri=[],valori=[]}={}, callback){
        //console.log("insert")
        if(campuri.length!= valori.length)
            throw new Error("numar campuri difera de nr de val");
        let comanda = `insert into ${tabel}  (${campuri.join(",")}) values ( ${valori.join(",")})` 
        console.log(comanda);
        this.client.query(comanda, callback)
    }
}

module.exports=AccesBD;