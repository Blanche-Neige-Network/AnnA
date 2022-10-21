import { Table, Uint8, Str, Bool, Float32 } from "./table/mod.ts";
import { bdd } from "./database/mod.ts";

const o = new bdd("test");

//console.log("add table")
//o.table_create("test", { id: Uint8, name: Str(20), size: Float32, verified: Bool }, "id")
console.log(o.databasesInfos()); 
let k = o.table_get("test");
//k.create({ id: 1, name: "Patate", size: 1.69, verified: true });
//k.create({ id: 2, name: "Patate44", size: 13, verified: true });
console.log("select data from the table 'test'")

console.log(k.select(() => true));




