

export class Table<T> {
  name: string;
  loader: (state: any) => T;
  cache: Map<string, T>;

  constructor(name: string, loader: (state: any) => T) {
    this.name = name;
    this.cache = new Map();
    this.loader = loader;
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
    this.cache = new Map((JSON.parse(saved) as [string, object][]).map((x) => [x[0], this.loader(x[1])]));
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
