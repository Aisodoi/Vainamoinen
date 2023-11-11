

export class Table<T> {
  name: string;
  cache: Map<string, T>;

  constructor(name: string) {
    this.name = name;
    this.cache = new Map();
    this.load();
  }

  get count(): number {
    return this.cache.size;
  }

  filter(predicate: (obj: T) => boolean): T[] {
    return Array.from(this.cache.values()).filter(predicate);
  }

  get first(): T | undefined {
    return (this.cache.entries().next().value ?? [undefined, undefined])[1];
  }

  load() {
    const saved = localStorage.getItem(this.name);
    if (!saved) return;
    this.cache = new Map(JSON.parse(saved));
  }

  save() {
    const serialized = JSON.stringify(Array.from(this.cache));
    localStorage.setItem(this.name, serialized);
  }

  clear() {
    this.cache = new Map();
    localStorage.removeItem(this.name);
  }

  set(id: string, obj: T) {
    this.cache.set(id, obj);
  }

  get(id: string): T | undefined {
    return this.cache.get(id);
  }
}
