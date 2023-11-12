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

function splitOutputs(resource: Resource) {
}

function updateRelations(resource: Resource) {
  // if (!resource.hasRequirements) return;
  // const requirements = resource.kind?.requirements ?? {};
  // const inputs = resource.inputs;
  // for (const reqKey in requirements) {
  //   const input = inputs[reqKey];
  //   if (Array.isArray(input) && !requirements[reqKey].many) {
  //   }
  // }
}


export function updateGraph() {
  for (const entry of Resources.cache.values()) {
    updateStep(entry);
  }
  // for (const entry of Resources.cache.values()) {
  //   updateRelations(entry);
  // }
}
