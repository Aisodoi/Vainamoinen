function uuidv4() {
  return crypto.randomUUID();
}


export const ResourceKinds = new Map<string, ResourceKind>();
export const Resources = new Map<string, Resource>();


type Requirement = {
  kind: string;
  name?: string;
  description?: string;
  many?: boolean;
}
type Requirements = {[key: string]: Requirement}


class ResourceKind {
  id: string;
  name: string;
  requirements: Requirements;

  constructor(id: string, name: string, staticRequirements: Requirements) {
    this.id = id;
    this.name = name;
    this.requirements = staticRequirements;
  }

  require(name?: string, description?: string, many?: boolean): Requirement {
    return {
      kind: this.id,
      name: name,
      description: description,
    };
  }

  static create(name: string, requirements?: Requirements): ResourceKind {
    const kind = new ResourceKind(uuidv4(), name, requirements ?? {});
    ResourceKinds.set(kind.id, kind);
    return kind;
  }
}


export class Resource {
  id: string;
  kind: string;
  inputs: {[key: string]: string | string[]};

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


const StorageChoice = ResourceKind.create("Storage Choice");
const UiDesign = ResourceKind.create("UI Design");

const StorageApi = ResourceKind.create("Storage API", {
  storageChoice: StorageChoice.require(),
});

const Implementation = ResourceKind.create("Implementation", {
  design: UiDesign.require(),
  storage: StorageApi.require(),
});

const Feature = ResourceKind.create("Feature", {
  implementation: Implementation.require(),
});

const Deployment = ResourceKind.create("Deployment");

const WebApp = ResourceKind.create("Web App", {
  deployment: Deployment.require(),
  features: Feature.require("Features", "The features for this app", true),
});


export const TodoApp = Resource.create(WebApp.id, {
  "features": [
    Resource.create(Feature.id, {}).id,
    Resource.create(Feature.id, {}).id,
    Resource.create(Feature.id, {}).id,
    Resource.create(Feature.id, {}).id,
  ],
});
