import { Table } from "./table";


class Database {
  tables: Map<string, Table<unknown>>;

  constructor() {
    this.tables = new Map();
  }

  declareTable<T>(name: string): Table<T> {
    if (this.tables.get(name)) {
      throw new Error(`Table with the name ${name} already exists!`);
    }
    const table = new Table<T>(name);
    this.tables.set(name, table);
    return table;
  }

  clear() {
    console.log("Clearing database!");
    for (const table of this.tables.values()) {
      table.clear();
    }
  }
}

export const LocalDatabase = new Database();
