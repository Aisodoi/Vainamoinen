import { LocalDatabase } from "../database/db";
import { resetDb } from "../database/setup";
import { Table } from "../database/table";

function uuidv4() {
  return crypto.randomUUID();
}

const SCHEMA_VERSION = "2023-11-12 - 00:17"

export const ResourceKinds = LocalDatabase.declareTable(
  "resourceKind",
  (state) => new ResourceKind(state),
);
export const Resources = LocalDatabase.declareTable(
  "resource",
  (state) => new Resource(state),
);

type Requirement = {
  kind: string;
  name?: string;
  description?: string;
  many?: boolean;
}
type Requirements = {[key: string]: Requirement}

type Output = {
  description: string;
  kind: "uri";
};
type Outputs = {[key: string]: Output};

function getCreator<Type extends BaseResource<any>, Cls extends { new(state: Type["state"]): Type }>(
  cls: Cls,
  table: Table<Type>,
) {
  return (args: Omit<Type["state"], "id">) => {
    const instance = new cls({
      id: uuidv4(),
      ...args,
    });
    table.set(instance.state.id, instance);
    return instance;
  }
}

type BaseState = {
  id: string;
}
class BaseResource<State extends BaseState> {
  state: State;

  get id() {
    return this.state.id;
  }

  constructor(state: State) {
    this.state = state;
  }
}

export class ResourceKind extends BaseResource<{
  id: string;
  name: string;
  requirements?: Requirements;
  outputs?: Outputs;
}> {
  require(name?: string, description?: string, many?: boolean): Requirement {
    return {
      kind: this.state.id,
      name: name,
      description: description,
      many: many,
    };
  }

  get requirements() {
    return this.state.requirements ?? {};
  }

  get outputs() {
    return this.state.outputs ?? {};
  }

  static create = getCreator(ResourceKind, ResourceKinds);
}


type ResourceOutputs = {[key: string]: string};
export class Resource extends BaseResource<{
  id: string;
  kind: string;
  isManuallyDeclared: boolean;
  inputs?: {[key: string]: string | string[]};
  outputs?: ResourceOutputs;
}> {
  static create = getCreator(Resource, Resources);

  get kind(): ResourceKind | undefined {
    return ResourceKinds.get(this.state.kind);
  }

  get outputs(): ResourceOutputs {
    return this.state.outputs ?? {};
  }

  get isReady(): boolean {
    const kind = ResourceKinds.get(this.state.kind);
    const outputs = this.outputs;
    if (!kind) return false;
    for (const key in kind.outputs) {
      if (outputs[key] === undefined) {
        return false;
      }
    }
    return true;
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

const WebApp = ResourceKinds.filter((x) => x.state.name === "Web App")[0];
export const TodoApp = Resources.filter((x) => x.state.kind === WebApp.id)[0];
