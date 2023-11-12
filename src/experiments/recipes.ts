import { Resource, Resources } from "./resources";


function updateImplementation(resource: Resource) {
}


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
}
