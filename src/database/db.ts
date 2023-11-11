import { Table } from "./table";


class Database {
  tables: Map<string, Table<any>>;

  constructor() {
    this.tables = new Map();
  }

  declareTable<T extends { state: any }>(name: string, loader: (state: any) => T): Table<T> {
    if (this.tables.get(name)) {
      throw new Error(`Table with the name ${name} already exists!`);
    }
    const table = new Table<T>(name, loader);
    this.tables.set(name, table);
    return table;
  }

  load() {
    console.log("Loading database...");
    for (const table of Array.from(this.tables.values())) {
      table.load();
    }
    console.log("Done!");
  }

  clear() {
    console.log("Clearing database!");
    for (const table of Array.from(this.tables.values())) {
      table.clear();
    }
  }
}

export const LocalDatabase = new Database();
