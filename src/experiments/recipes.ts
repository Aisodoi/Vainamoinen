import { InputGroup, Resource, ResourceInputs, Resources } from "./resources";
import { buildLeft } from "./graph";


// TODO: Find a better way to bind recipes to steps
function updateStep(resource: Resource) {
  if (!resource.hasRequirements) return;
  switch (resource.kind?.state.name) {
    case "Component Spec":
      resource.setOutput([
        {"component": "Component 1"},
        {"component": "Component 2"},
        {"component": "Component 3"},
      ]);
      break;
    case "Implementation":
      // for (let inp in resource.inputs) {
      //   const inpRes = Resources.get(inp);
      //   if (!inpRes) continue;
      //
      //   for (let out in resource.outputs) {
      //
      //   }
      // }
      break;
  }
}

export function updateGraph() {
  for (const entry of Resources.cache.values()) {
    updateStep(entry);
  }
  const deletedResources = new Set<string>();

  for (const entry of Resources.filter(x => x.isDeletable)) {
    deletedResources.add(entry.id);
    Resources.del(entry.id);
  }

  for (const entry of Resources.cache.values()) {
    const newInputs: ResourceInputs = [];
    for (const group of entry.inputs) {
      const newGroup: InputGroup = {};
      for (let key in group) {
        let val = group[key];
        if (!val || deletedResources.has(val)) continue;
        newGroup[key] = val;
      }
      newInputs.push(newGroup);
    }
    entry.setInput(newInputs);
  }

  // Connect splits to the closest merger
  for (const entry of Resources.filter(x => x.outputs.length > 1)) {
    for (const parentId of entry.state.context) {
      const parent = Resources.get(parentId);
      if (!parent || parent.kind?.state.type !== "mergele") continue;
      buildLeft(parent, entry.outputs.length, entry);
      break;
    }
  }
}
