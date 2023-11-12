import { LocalDatabase } from "../database/db";
import { resetDb } from "../database/setup";
import { Table } from "../database/table";

function uuidv4() {
  return crypto.randomUUID();
}

const SCHEMA_VERSION = "2023-11-12 - 07:00"

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
  type: "step" | "mergele";
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


export type InputGroup = {[key: string]: ResourceId};
export type ResourceInputs = InputGroup[];
type ResourceOutputs = {[key: string]: DataUri}[];
export class Resource extends BaseResource<{
  id: string;
  kind: string;
  isManuallyDeclared: boolean;
  inputs?: ResourceInputs;
  outputs?: ResourceOutputs;
  context: string[];
}> {
  static create = getCreator(Resource, Resources);

  setInput(value: ResourceInputs) {
    this.state.inputs = value;
    Resources.save();
  }

  setOutput(value: ResourceOutputs) {
    this.state.outputs = value;
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
    return this.state.outputs ?? [{}];
  }

  get inputs(): ResourceInputs {
    return this.state.inputs ?? [{}];
  }

  get hasRequirements(): boolean {
    const kind = ResourceKinds.get(this.state.kind);
    const inputs = this.inputs;
    if (!kind) return false;
    for (const key in kind.requirements) {
      for (const inputGroup in inputs) {
        let inputResIds = inputs[inputGroup][key]
        if (inputResIds === undefined) {
          return false;
        }
        const inputRes = Resources.get(inputResIds);
        if (!inputRes || !inputRes.isReady) {
          return false;
        }
      }
    }
    return true;
  }

  get isEmpty(): boolean {
    return (
      !this.state.outputs ||
      this.state.outputs.length === 0
    );
  }

  get isDeletable(): boolean {
    return !this.state.isManuallyDeclared && this.isEmpty && !this.isReady;
  }

  get parents(): Resource[] {
    if (this.state.context.length === 0)  {
      return [];
    } else {
      const parent = Resources.get(this.state.context[0])
      return parent ? [parent] : [];
    }
  }

  get isOrphan(): boolean {
    return this.parents.length === 0;
    // return this.parents.length < Math.max(this.outputs.length, 1);
  }

  get isReady(): boolean {
    const kind = ResourceKinds.get(this.state.kind);
    const outputs = this.outputs;
    if (!kind) return false;
    for (const key in kind.outputs) {
      if (outputs[0][key] === undefined) {
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
