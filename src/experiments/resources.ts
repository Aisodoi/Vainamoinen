import { LocalDatabase } from "../database/db";
import { resetDb } from "../database/setup";
import { Table } from "../database/table";

function uuidv4() {
  return crypto.randomUUID();
}

const SCHEMA_VERSION = "2023-11-12 - 03:24"

export const ResourceKinds = LocalDatabase.declareTable(
  "resourceKind",
  (state) => new ResourceKind(state),
);
export const Resources = LocalDatabase.declareTable(
  "resource",
  (state) => new Resource(state),
);
// export const Edges = LocalDatabase.declareTable(
//   "edges",
//   (state) => new Edge(state),
// );

type Requirement = {
  kind: string;
  name?: string;
  description?: string;
  many?: boolean;
  minCount?: number;
}
type Requirements = {[key: string]: Requirement}

type Output = {
  description: string;
  kind: "uri";
  many: boolean;
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
  type: "step" | "subgraph";
  requirements?: Requirements;
  outputs?: Outputs;
}> {
  require(opts?: Omit<Requirement, "kind">): Requirement {
    return {
      ...opts,
      kind: this.id,
    };
  }

  registerHandler(handle: () => {}) {
  }

  get requirements() {
    return this.state.requirements ?? {};
  }

  get outputs() {
    return this.state.outputs ?? {};
  }

  static create = getCreator(ResourceKind, ResourceKinds);
}


type ResourceId = string;
type DataUri = string;


type ResourceInputs = {[key: string]: ResourceId | ResourceId[] | undefined};
type ResourceOutputs = {[key: string]: DataUri | DataUri[]};
export class Resource extends BaseResource<{
  id: string;
  kind: string;
  isManuallyDeclared: boolean;
  inputs?: ResourceInputs;
  outputs?: ResourceOutputs;
  context: string[];
}> {
  static create = getCreator(Resource, Resources);

  setInput(field: string, value: string | string[] | undefined) {
    if (!this.state.inputs) {
      this.state.inputs = {};
    }
    this.state.inputs[field] = value;
    Resources.save();
  }

  setOutput(field: string, value: string | string[]) {
    if (!this.state.outputs) {
      this.state.outputs = {};
    }
    this.state.outputs[field] = value;
    Resources.save();
  }

  setContext(context: string[]) {
    this.state.context = context;
    Resources.save();
  }

  get kind(): ResourceKind | undefined {
    return ResourceKinds.get(this.state.kind);
  }

  get outputs(): ResourceOutputs {
    return this.state.outputs ?? {};
  }

  get inputs(): ResourceInputs {
    return this.state.inputs ?? {};
  }

  get hasRequirements(): boolean {
    const kind = ResourceKinds.get(this.state.kind);
    const inputs = this.inputs;
    if (!kind) return false;
    for (const key in kind.requirements) {
      let inputResIds = inputs[key]
      if (inputResIds === undefined) {
        return false;
      }
      if (!Array.isArray(inputResIds)) {
        inputResIds = [inputResIds];
      }
      for (const resId of inputResIds) {
        const inputRes = Resources.get(resId);
        if (!inputRes || !inputRes.isReady) {
          return false;
        }
      }
    }
    return true;
  }

  get isDeletable(): boolean {
    return !this.state.isManuallyDeclared && Object.keys(this.outputs ?? {}).length === 0;
  }

  get isOrphan(): boolean {
    if (this.state.context.length === 0) {
      return false;
    } else {
      return !Resources.get(this.state.context[0]);
    }
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
// export class Edge extends BaseResource<{
//   id: string;
//   source: string;
//   target: string;
// }> {
//   static create = getCreator(ResourceKind, ResourceKinds);
// }


LocalDatabase.load();


const shouldReset = (
  localStorage.getItem("schemaVersion") !== SCHEMA_VERSION ||
  Resources.count === 0 ||
  ResourceKinds.count === 0
);

if (shouldReset) {
  resetDb();
  localStorage.setItem("schemaVersion", SCHEMA_VERSION);
}
