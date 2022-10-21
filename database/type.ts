import { Table } from "../table/mod.ts";

export interface Database {
    name: string;
    uid: string;
    tables: Table[];
}