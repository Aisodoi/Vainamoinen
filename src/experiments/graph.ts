import { Resource, ResourceKinds, Resources } from "./resources";
import { RecipeProps } from "../components/Recipe/Recipe";
import { Position } from "@reactflow/core";
import { Edge } from "reactflow";


export function expandGraph(resource: Resource) {
  const kind = ResourceKinds.get(resource.state.kind);

  const nodes: RecipeProps[] = [];
  const edges: Edge[] = [];
  nodes.push({
    id: resource.id,
    type: "recipeNode",
    data: resource,
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  if (!kind) {
    return {
      edges,
      nodes,
    };
  }

  for (const reqSlot in kind.state.requirements) {
    const requirement = kind.state.requirements[reqSlot];

    let inputId = resource.state.inputs ? resource.state.inputs[reqSlot] : undefined;

    if (inputId === undefined) {
      if (requirement.many) {
        inputId = [];
      } else {
        inputId = Resource.create({ kind: requirement.kind, isManuallyDeclared: false }).id;
        resource.setInput(reqSlot, inputId);
      }
    }

    const inputIds = Array.isArray(inputId) ? inputId : [inputId];

    for (const inId of inputIds) {
      const inRes = Resources.get(inId);
      if (!inRes) continue;

      edges.push({
        id: `${inId}-${resource.id}`,
        source: inId,
        target: resource.id,
        type: "stepEdge",
      });

      const inpGraph = expandGraph(inRes);
      nodes.push(...inpGraph.nodes);
      edges.push(...inpGraph.edges);
    }
  }

  return {
    nodes,
    edges,
  }
}
