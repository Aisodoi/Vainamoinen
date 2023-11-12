import { Resource, Resources } from "./resources";


// TODO: Find a better way to bind recipes to steps
function executeStep(resource: Resource) {
  if (!resource.hasRequirements) return;
  switch (resource.kind?.state.name) {
    case "Component Breakdown":
      resource.setOutput("components", [
        "component 1",
        "component 2",
        "component 3",
      ]);
      break;
  }
}


export function updateGraph() {
  for (const entry of Resources.cache.values()) {
    executeStep(entry);
  }
}
