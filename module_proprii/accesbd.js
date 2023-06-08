const {Client}=require("pg");


class AccesBD{
    static #instanta=null;
    static #initializat=false;

    constructor() {
        if(AccesBD.#instanta){
            throw new Error("Deja a fost instantiat");
        }
        else if(!AccesBD.#initializat){
            throw new Error("Trebuie apelat doar din getInstanta; fara sa fi aruncat vreo eroare");
        }
    }

    initLocal(){
        this.client= new Client({
            database: "pc",
            user: "flori2",
            password: "flori",
            host: "localhost",
            port: 5432
        });
        this.client.connect();
    }


    getClient(){
        if(!AccesBD.#instanta ){
            throw new Error("Nu a fost instantiata clasa");
        }
        return this.client;
    }

    //JsDOC

     /**
     * @typedef {object} ObiectConexiune - obiect primit de functiile care realizeaza un query
     * @property {string} init - tipul de conexiune ("init", "render" etc.)
     * 
     * /

    /**
     * Returneaza instanta unica a clasei
     *
     * @param {ObiectConexiune} un obiect cu datele pentru query
     * @returns {AccesBD}
     */

    static getInstanta({init="local"}={}){
        console.log(this);//this-ul e clasa nu instanta pt ca metoda statica
        if(!this.#instanta){
            this.#initializat=true;
            this.#instanta=new AccesBD();

            //initializarea poate arunca erori
            //vom adauga aici cazurile de initializare 
            //pentru baza de date cu care vrem sa lucram
            try{
                switch(init){
                    case "local":this.#instanta.initLocal();
                }
                

                //daca ajunge aici inseamna ca nu s-a produs eroare la initializare
                
            }
            catch (e){
                console.error("Eroare la initializarea bazei de date!");
            }

        }
        return this.#instanta;
    }

     /**
     * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query
     * @property {string} tabel - numele tabelului
     * @property {string []} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
     */

    
    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rez Rezultatul query-ului
     */
    /**
     * Selecteaza inregistrari din baza de date
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru query
     * @param {function} callback - o functie callback cu 2 parametri: eroare si rezultatul queryului
     */


    select({tabel="",campuri=[],conditiiAnd=[]} = {}, callback){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        //console.log("0000000000000000000000000000000000000000000000000000000000")
        //console.log(callback);
        let comanda=`select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error(comanda);
        this.client.query(comanda,callback)
    }

    selectJoin({tabel="",campuri=[], joinTabel="", joinConditiile=[], conditiiAnd=[],} = {}, callback){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let joinClause = "";
        if(joinTabel && joinConditiile.length > 0) {
            joinClause = `join ${joinTabel} ON ${joinConditiile.join(" and ")}`;
        }
        let comanda=`select ${campuri.join(",")} from ${tabel} ${joinClause} ${conditieWhere}`;
        console.error(comanda);
        this.client.query(comanda,callback)
    }


    selectParametrizat({tabel="",campuri=[],conditiiAnd=[]} = {}, callback, parametriQuery=[]){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error(comanda);
        this.client.query(comanda,parametriQuery,callback)
    }  

     /**
     * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query
     * @property {string} tabel - numele tabelului
     * @property {string []} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
     */

    /**
     * Selecteaza inregistrari din baza de date
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru query
     */

    async selectAsync({tabel="",campuri=[],conditiiAnd=[]} = {}){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        
        let comanda=`select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        //console.error("selectAsync:",comanda);
        try{
            let rez=await this.client.query(comanda);
            console.log("selectasync: ",rez);
            return rez;
        }
        catch (e){
            console.log(e);
            return null;
        }
    }

     /**
     * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
     * @property {string} tabel - numele tabelului
     * @property {string []} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
     * @property {string []} valori - o lista de stringuri cu numele atributelor care vor fii inserate in tabel
     */

    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rez Rezultatul query-ului
     */

    /**
     * Selecteaza inregistrari din baza de date
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru query
     * @param {function} callback - o functie callback cu 2 parametri: eroare si rezultatul queryului
     */

    insert({tabel="",campuri=[],valori=[]} = {}, callback){
        if(campuri.length!=valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")
        
        let comanda=`insert into ${tabel}(${campuri.join(",")}) values ( ${valori.join(",")})`;
        //console.log("comanda insert", comanda);
        this.client.query(comanda,callback)
    }

    insertParametrizat({tabel="",campuri=[],valori=[]} = {}, callback){
        if(campuri.length!=valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")

        //parametrizare
        let camp =[]
        for(let i=0; i<campuri.length; i++)
            camp.push(`${campuri[i]}=$${i+1}`);

        let comanda=`insert into ${tabel}(${camp.join(",")}) values (${camp.join(",")})`;
        //console.log(comanda);
        this.client.query(comanda,callback)
    }

     /**
     * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
     * @property {string} tabel - numele tabelului
     * @property {string []} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
     * @property {string []} valori - o lista de stringuri cu numele atributelor care vor fii actualizate in tabel
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
     */

    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rez Rezultatul query-ului
     */

    /**
     * Selecteaza inregistrari din baza de date
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru query
     * @param {function} callback - o functie callback cu 2 parametri: eroare si rezultatul queryului
     */
    
    update({tabel="",campuri=[],valori=[], conditiiAnd=[]} = {}, callback){
        if(campuri.length!=valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")
        let campuriActualizate=[];
        for(let i=0;i<campuri.length;i++)
            campuriActualizate.push(`${campuri[i]}='${valori[i]}'`);
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
        console.log("update comanda", comanda);
        this.client.query(comanda,callback)
    }

     /**
     * @typedef {object} ObiectQuery - obiect primit de functiile care realizeaza un query 
     * @property {string} tabel - numele tabelului
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
     */

    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rez Rezultatul query-ului
     */

    /**
     * Selecteaza inregistrari din baza de date
     *
     * @param {ObiectQuery} obj - un obiect cu datele pentru query
     * @param {function} callback - o functie callback cu 2 parametri: eroare si rezultatul queryului
     */

    delete({tabel="",conditiiAnd=[]} = {}, callback){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        
        let comanda=`delete from ${tabel} ${conditieWhere}`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

    deleteParametrizat({tabel="",conditiiAnd=[]} = {}, callback, parametriQuery){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        
        let comanda=`delete from ${tabel} ${conditieWhere}`;
        //console.log(comanda);
        this.client.query(comanda,parametriQuery,callback)
    }


    updateParametrizat({tabel="",campuri=[],valori=[], conditiiAnd=[]} = {}, callback, parametriQuery){
        if(campuri.length!=valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")
        let campuriActualizate=[];
        for(let i=0;i<campuri.length;i++)
            campuriActualizate.push(`${campuri[i]}=$${i+1}`);
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
        console.log("comanda update parametrizat \n",comanda);
        this.client.query(comanda,valori, callback)
    }

}

module.exports=AccesBD;