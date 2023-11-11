import { ResourceKind, Resource } from "../experiments/resources";
import { LocalDatabase } from "./db";


export function resetDb() {
  LocalDatabase.clear();
  initData();
}

export function initData() {
  const StorageChoice = ResourceKind.create({name: "Storage Choice"});
  const UiDesign = ResourceKind.create({
    name: "UI Design",
    outputs: {
      designImage: {kind: "uri", description: "Reference Image"},
    }
  });

  const StorageApi = ResourceKind.create({
    name: "Storage API", requirements: {
      storageChoice: StorageChoice.require(),
    },
    outputs: {
      storageApiDocs: {kind: "uri", description: "Storage API Docs"},
    }
  });

  const Implementation = ResourceKind.create({
    name: "Implementation", requirements: {
      design: UiDesign.require(),
      storage: StorageApi.require(),
    }
  });

  const Feature = ResourceKind.create({
    name: "Feature", requirements: {
      implementation: Implementation.require(),
    }
  });

  const Deployment = ResourceKind.create({
    name: "Deployment"
  });

  const WebApp = ResourceKind.create({
    name: "Web App",
    requirements: {
      deployment: Deployment.require(),
      features: Feature.require("Features", "The features for this app", true),
    }
  });

  Resource.create({
    kind: WebApp.id,
    inputs: {
      "features": [
        Resource.create({kind: Feature.id}).id,
        Resource.create({kind: Feature.id}).id,
        Resource.create({kind: Feature.id}).id,
        Resource.create({kind: Feature.id}).id,
      ],
    }
  });
}
