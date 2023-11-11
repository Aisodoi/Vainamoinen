import { Table } from "./table";


class Database {
  tables: Map<string, Table<unknown>>;

  constructor() {
    this.tables = new Map();
  }

  declareTable<T>(name: string, loader: (state: any) => T): Table<T> {
    if (this.tables.get(name)) {
      throw new Error(`Table with the name ${name} already exists!`);
    }
    const table = new Table<T>(name, loader);
    this.tables.set(name, table);
    return table;
  }

  clear() {
    console.log("Clearing database!");
    for (const table of Array.from(this.tables.values())) {
      table.clear();
    }
  }
}

export const LocalDatabase = new Database();
