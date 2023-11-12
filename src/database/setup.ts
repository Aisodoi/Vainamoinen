import { ResourceKind, Resource } from "../experiments/resources";
import { LocalDatabase } from "./db";


export function resetDb() {
  LocalDatabase.clear();
  initData();
}

export function initData() {
  const StorageChoice = ResourceKind.create({
    name: "Storage Choice",
    type: "step",
  });
  const UiDesign = ResourceKind.create({
    name: "UI Design",
    type: "step",
    outputs: {
      designImage: {
        kind: "uri",
        description: "Reference Image",
        many: false,
      },
    },
  });
  const UiComponents = ResourceKind.create({
    name: "Component Breakdown",
    type: "step",
    outputs: {
      components: {
        kind: "uri",
        description: "Break down designs to individual components",
        many: true,
      },
    },
    requirements: {
      design: UiDesign.require(),
    },
  })

  const StorageApi = ResourceKind.create({
    name: "Storage API",
    type: "step",
    requirements: {
      storageChoice: StorageChoice.require(),
    },
    outputs: {
      storageApiDocs: {
        kind: "uri",
        description: "Storage API Docs",
        many: false,
      },
    },
  });

  const Implementation = ResourceKind.create({
    name: "Implementation",
    type: "subgraph",
    requirements: {
      components: UiComponents.require(),
      storage: StorageApi.require(),
    },
  });

  const Feature = ResourceKind.create({
    name: "Feature",
    type: "step",
    requirements: {
      implementation: Implementation.require({
        many: true,
        minCount: 1,
      }),
    },
  });

  const Deployment = ResourceKind.create({
    name: "Deployment",
    type: "step",
  });

  const WebApp = ResourceKind.create({
    name: "Web App",
    type: "step", // TODO: Change to (sub)graph
    requirements: {
      deployment: Deployment.require(),
      features: Feature.require({
        name: "Features",
        description: "The features for this app",
        many: true,
        minCount: 1,
      }),
    },
  });

  Resource.create({
    kind: WebApp.id,
    inputs: {
      "features": [
        Resource.create({kind: Feature.id, isManuallyDeclared: true}).id,
        Resource.create({kind: Feature.id, isManuallyDeclared: true}).id,
        Resource.create({kind: Feature.id, isManuallyDeclared: true}).id,
        Resource.create({kind: Feature.id, isManuallyDeclared: true}).id,
      ],
    },
    isManuallyDeclared: true,
  });
}
