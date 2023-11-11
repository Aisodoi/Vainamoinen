import { LocalDatabase } from "../database/db";
import { resetDb } from "../database/setup";

function uuidv4() {
  return crypto.randomUUID();
}


const SCHEMA_VERSION = "2023-11-11 - 21:52"


export const ResourceKinds = LocalDatabase.declareTable<ResourceKind>("resourceKind");
export const Resources = LocalDatabase.declareTable<Resource>("resource");


type Requirement = {
  kind: string;
  name?: string;
  description?: string;
  many?: boolean;
}
type Requirements = {[key: string]: Requirement}


type Output = {
  description: string;
  uri: string;
};
type Outputs = {[key: string]: Output};

export class ResourceKind {
  id: string;
  name: string;
  requirements: Requirements;
  outputs: Outputs;

  constructor(id: string, name: string, staticRequirements: Requirements, outputs: Outputs) {
    this.id = id;
    this.name = name;
    this.requirements = staticRequirements;
    this.outputs = outputs;
  }

  require(name?: string, description?: string, many?: boolean): Requirement {
    return {
      kind: this.id,
      name: name,
      description: description,
    };
  }

  static create(name: string, requirements?: Requirements, outputs?: Outputs): ResourceKind {
    const kind = new ResourceKind(uuidv4(), name, requirements ?? {}, outputs ?? {});
    ResourceKinds.set(kind.id, kind);
    return kind;
  }
}


export class Resource {
  id: string;
  kind: string;
  inputs: {[key: string]: string | string[]};
  state: any;

  constructor(id: string, kind: string, inputs: {[key: string]: string | string[]}) {
    this.id = id;
    this.kind = kind;
    this.inputs = inputs;
  }

  static create(kind: string, inputs: {[key: string]: string | string[]}): Resource {
    const resource = new Resource(uuidv4(), kind, inputs);
    Resources.set(resource.id, resource);
    return resource;
  }
}


const shouldReset = (
  localStorage.getItem("schemaVersion") !== SCHEMA_VERSION ||
  Resources.count === 0 ||
  ResourceKinds.count === 0
);

if (shouldReset) {
  resetDb();
}

const WebApp = ResourceKinds.filter((x) => x.name === "Web App")[0];
export const TodoApp = Resources.filter((x) => x.kind === WebApp.id)[0];
