import { LocalDatabase } from "../database/db";

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


function requireResource(kind: ResourceKind, name?: string, description?: string, many?: boolean) {
  return {
    kind: kind.id,
    name: name,
    description: description,
  };
}

class ResourceKind {
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


function initData() {
  const StorageChoice = ResourceKind.create("Storage Choice");
  const UiDesign = ResourceKind.create("UI Design");

  const StorageApi = ResourceKind.create("Storage API", {
    storageChoice: StorageChoice.require(),
  });

  const Implementation = ResourceKind.create("Implementation", {
    design: requireResource(UiDesign),
    storage: requireResource(StorageApi),
  });

  const Feature = ResourceKind.create("Feature", {
    implementation: requireResource(Implementation),
  });

  const Deployment = ResourceKind.create("Deployment");

  const WebApp = ResourceKind.create("Web App", {
    deployment: requireResource(Deployment),
    features: requireResource(Feature, "Features", "The features for this app", true),
  });

  const TodoApp = Resource.create(WebApp.id, {
    "features": [
      Resource.create(Feature.id, {}).id,
      Resource.create(Feature.id, {}).id,
      Resource.create(Feature.id, {}).id,
      Resource.create(Feature.id, {}).id,
    ],
  })
}


const shouldReset = (
  localStorage.getItem("schemaVersion") !== SCHEMA_VERSION ||
  Resources.count === 0 ||
  ResourceKinds.count === 0
);

if (shouldReset) {
  console.log("Resetting database!");
  LocalDatabase.clear();
  initData();
}

const WebApp = ResourceKinds.filter((x) => x.name === "Web App")[0];
export const TodoApp = Resources.filter((x) => x.kind === WebApp.id)[0];
