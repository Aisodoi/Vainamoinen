import { Resource, Resources } from "./resources";


// TODO: Find a better way to bind recipes to steps
function updateStep(resource: Resource) {
  if (!resource.hasRequirements) return;
  switch (resource.kind?.state.name) {
    case "Component Breakdown":
      resource.setOutput("components", [
        "component 1",
        "component 2",
        "component 3",
      ]);
      break;
    case "Implementation":
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
    for (let key in entry.inputs) {
      let val = entry.inputs[key];
      if (!val) continue;
      if (Array.isArray(val)) {
        entry.setInput(key, val.filter((x) => !deletedResources.has(x)))
      } else {
        if (deletedResources.has(val)) {
          entry.setInput(key, undefined);
        }
      }
    }
  }
}
