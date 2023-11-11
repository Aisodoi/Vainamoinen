import { ResourceKind, Resource } from "../experiments/resources";
import { LocalDatabase } from "./db";


export function resetDb() {
  LocalDatabase.clear();
  initData();
}


function requireResource(kind: ResourceKind, name?: string, description?: string, many?: boolean) {
  return {
    kind: kind.id,
    name: name,
    description: description,
  };
}

export function initData() {
  const StorageChoice = ResourceKind.create("Storage Choice");
  const UiDesign = ResourceKind.create("UI Design", {}, {
    designImage: { kind: "uri", description: "Reference Image" },
  });

  const StorageApi = ResourceKind.create("Storage API", {
    storageChoice: StorageChoice.require(),
  }, {
    outputs: { kind: "uri", description: "Storage API Docs" },
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

  Resource.create(WebApp.id, {
    "features": [
      Resource.create(Feature.id, {}).id,
      Resource.create(Feature.id, {}).id,
      Resource.create(Feature.id, {}).id,
      Resource.create(Feature.id, {}).id,
    ],
  })
}
