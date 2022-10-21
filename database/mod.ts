import Database from "./type.ts";
import {createRandomString} from "./utils.ts";
import { Table, Uint8, Str, Bool, Float32 } from "../table/mod.ts";


const HOME_PATH = Deno.env.get("HOME") || Deno.env.get("USERPROFILE") || Deno.env.get("HOMEPATH") || "./_databases/"; 
//const HOME_PATH = "./_databases"; 

Deno.mkdir(HOME_PATH, { recursive: true });

export class bdd {
    private database:Database = null;
    private name = "";

    constructor(name:string) {
        this.name = name;
        this.addDatabse(name);
    }

    // Database infos

    private addDatabse(name:string){
        try {
            Deno.statSync(HOME_PATH + "/.__"+name);
            Deno.statSync(HOME_PATH + "/.__"+name+"/infos.json");
        } catch (error) {
            Deno.mkdirSync(HOME_PATH + "/.__"+name, { recursive: true });
            this.createDatabase(name);
        }
        this.loadDatabase(name);
    }

    private loadDatabase(name:string) {
        /**
         * File infos.json save the database informations like:
         * name, 
         * uid,
         * all the tables architecture
         */
        let infos = JSON.parse(Deno.readTextFileSync(HOME_PATH + "/.__"+name+"/infos.json"));
        let tmp : Database = {
            name: infos.name,
            uid: infos.uid,
            tables: []
        }

        for(let i = 0; i < infos.tables.length; i++) {
            tmp.tables.push(new Table(HOME_PATH + "/.__"+name+"/"+infos.tables[i].name+"/master.anna", infos.tables[i].arch, infos.tables[i].primary));
        }
        this.database = tmp;
    }

    public createDatabase(name:string) {
        // Check name is maching with regex pattern: /^[a-zA-Z0-9_]+$/
        const check = name.match(/^[a-zA-Z0-9_]+$/);
        if (check === null) {
            return {
                error: true,
                message: "Database name is not valid, please use only letters, numbers and underscores"
            }
        }

        // Create database
        const k = {
            name: name,
            uid: createRandomString(27),
            tables: []
        }
        this.database = k;

        this.saveDatabase()

        return {
            error: false,
            message: "Database created successfully",
            uid: k.uid
        }
    }
    
    public getDatabase(name:string) {
        // Check if database exists
        const databaseExists = this.database.find((database) => database.name === name);

        return {
            database: databaseExists,
            error: databaseExists ? false : true,
        }
    }

    public deleteDatabase(name:string) {
        // Check if database exists
        const databaseExists = this.database.find((database) => database.name === name);
        if (!databaseExists) {
            return {
                error: true,
                message: "Database does not exists"
            }
        }

        // Delete database
        this.database = this.database.filter((database) => database.name !== name);

        return {
            error: false,
            message: "Database deleted successfully"
        }
    }


    // Table infos
    public table_create(name:string, arch:any, primary?:string) {
        Deno.mkdirSync(HOME_PATH + "/.__"+this.database.name+"/"+name, { recursive: true });
        const table = new Table(HOME_PATH + "/.__"+this.database.name+"/"+name+"/master.anna", arch, primary);
        this.database.tables.push(table);
        this.saveDatabase();
    }

    public table_get(name:string){
        return this.database.tables.find((table) => table.file.path.split('__')[1].split('/')[1] === name);
    }
    


    // Save
    public databasesInfos() {
        return {
            name: this.name,
            uid: this.database.uid,
            tables_count: this.database.tables.length,
            tables_name: this.database.tables.map((table) => table.file.path.split('__')[1].split('/')[1])
        }
    }

    private saveDatabase() {
        // Save all the databases
        Deno.writeTextFileSync(HOME_PATH + "/.__"+this.database.name+"/infos.json", JSON.stringify({
            name: this.database.name,
            uid: this.database.uid,
            tables: this.getTablesInfos(this.database.tables)
        }));
    }

    private getTablesInfos(o:any) {

        let tablesInfos:any = []
        for(let i = 0; i < o.length; i++) {
            tablesInfos.push({
                name: o[i].file.path.split('__')[1].split('/')[1],
                uid: o[i].uid,
                primary: o[i].primary,
                arch: o[i].model
            })
        }

        return tablesInfos;
    }
}