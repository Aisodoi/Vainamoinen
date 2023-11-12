import { Resource, ResourceKinds, Resources } from "./resources";
import { RecipeProps } from "../components/Recipe/Recipe";
import { Position } from "@reactflow/core";
import { Edge } from "reactflow";


function createChildOrLinkOrphan(resource: Resource, kind: string): Resource {
  const context = [resource.id, ...resource.state.context];
  const orphans = Resources.filter((x) => x.state.kind === kind && x.isOrphan);
  let bestMatch: Resource | undefined = undefined;
  let bestCount = 0;
  for (const entry of orphans) {
    let count = 0;
    for (const id of entry.state.context) {
      if (context.indexOf(id) > -1) {
        count += 1;
      } else {
        if (Resources.get(id) !== undefined) {
          count = -1;
          break;
        }
      }
    }
    if (count > bestCount) {
      bestMatch = entry;
    }
  }

  if (bestMatch) {
    bestMatch.setContext(context);
    return bestMatch;
  } else {
    return Resource.create({
      kind: kind,
      isManuallyDeclared: false,
      context,
    });
  }
}


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

    let inputId = resource.state.inputs ? resource.state.inputs[reqSlot] ?? [] : [];

    if (inputId.length < (requirement.minCount ?? 1)) {
      for (let i = inputId.length; i < (requirement.minCount ?? 1); i++) {
        inputId.push(createChildOrLinkOrphan(resource, requirement.kind).id);
      }
      resource.setInput(reqSlot, inputId);
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
