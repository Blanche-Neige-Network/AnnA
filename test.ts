import { Table, Uint8, Str, Bool, Float32 } from "./table/mod.ts";

const table = new Table("./name.extension", {
    id: Uint8, name: Str(20), size: Float32, verified: Bool
}, "id");

table.create({ id: 1, name: "Patate", size: 1.69, verified: true });

console.log(table.select(1));

table.create({ id: 2, name: "Patate 8", size: 2, verified: true });
table.create({ id: 3, name: "Patate 16", size: 1.30, verified: false });

console.log(table.select(() => true));

table.delete(2);

console.log(table.select(() => true));

table.delete(user => user.size < 1.5);

console.log(table.select(() => true));