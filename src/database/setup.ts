import { ResourceKind, Resource } from "../experiments/resources";
import { LocalDatabase } from "./db";


export function resetDb() {
  LocalDatabase.clear();
  initData();
}

export function initData() {
  // const StorageChoice = ResourceKind.create({
  //   name: "Storage Choice",
  //   type: "step",
  // });
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
  const ComponentSpec = ResourceKind.create({
    name: "Component Breakdown",
    type: "step",
    requirements: {
      design: UiDesign.require(),
    },
    outputs: {
      component: {
        kind: "uri",
        description: "Break down designs to individual components",
        many: true,
      },
    },
  })

  const StorageApi = ResourceKind.create({
    name: "Storage API",
    type: "step",
    // requirements: {
    //   storageChoice: StorageChoice.require(),
    // },
    outputs: {
      storageApiDocs: {
        kind: "uri",
        description: "Storage API Docs",
        many: false,
      },
    },
  });

  const ComponentImplementation = ResourceKind.create({
    name: "Component Implementation",
    type: "step",
    requirements: {
      spec: ComponentSpec.require(),
    },
    outputs: {
      implementation: {
        kind: "uri",
        description: "Component implementation",
        many: false,
      },
    },
  });

  const ComponentLibrary = ResourceKind.create({
    name: "Component Library",
    type: "mergele",
    requirements: {
      components: ComponentImplementation.require(),
    },
    outputs: {
      componentLibrary: {
        kind: "uri",
        description: "Component library",
        many: false,
      },
    },
  })

  const ViewImplementation = ResourceKind.create({
    name: "View Implementation",
    type: "step",
    requirements: {
      components: ComponentLibrary.require(),
      storage: StorageApi.require(),
    },
    outputs: {
      viewImplementation: {
      kind: "uri",
      description: "View implementation",
      many: false,
    }}
  });

  const Feature = ResourceKind.create({
    name: "Feature",
    type: "mergele",
    requirements: {
      implementation: ViewImplementation.require(),
    },
    outputs: {
      feature: {
        kind: "uri",
        description: "Feature",
        many: false,
      },
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
      // deployment: Deployment.require(),
      features: Feature.require({
        name: "Features",
        description: "The features for this app",
      }),
    },
  });

  const TodoApp = Resource.create({
    kind: WebApp.id,
    isManuallyDeclared: true,
    context: [],
  });
  TodoApp.setInput([
    { features: Resource.create({kind: Feature.id, isManuallyDeclared: true, context: [TodoApp.id], name: "Profile view"}).id },
    { features: Resource.create({kind: Feature.id, isManuallyDeclared: true, context: [TodoApp.id], name: "Todo list"}).id },
    { features: Resource.create({kind: Feature.id, isManuallyDeclared: true, context: [TodoApp.id], name: "Settings view"}).id },
    { features: Resource.create({kind: Feature.id, isManuallyDeclared: true, context: [TodoApp.id], name: "Terms of Service"}).id },
  ]);
}
