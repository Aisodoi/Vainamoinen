import { Resource, ResourceInputs, ResourceKinds, Resources } from "./resources";
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


// function findClosestSplit(resource: Resource, parents?: Resource[]): [Resource, Resource[]] | undefined {
//   for (const inpField in resource.inputs) {
//     for (const inpResId of resource.inputs[inpField] ?? []) {
//       const inpRes = Resources.get(inpResId);
//       if (!inpRes) continue;
//       if (inpRes.outputs.length > 1) {
//         return [inpRes, parents ?? []];
//       }
//     }
//   }
//   for (const inpField in resource.inputs) {
//     for (const inpResId of resource.inputs[inpField] ?? []) {
//       const inpRes = Resources.get(inpResId);
//       if (!inpRes) continue;
//       return findClosestSplit(inpRes, [resource, ...(parents ?? [])]);
//     }
//   }
// }

export function buildLeft(
  resource: Resource,
  minGroups: number,
  untilLinked: Resource,
) {
  const kind = ResourceKinds.get(resource.state.kind);

  if (!kind) {
    return;
  }

  const newInputs: ResourceInputs = [];
  for (let groupIndex = 0; groupIndex < (minGroups ?? 1); groupIndex++) {
    const currentGroup = resource.inputs[groupIndex] ?? [{}];
    for (const reqSlot in kind.state.requirements) {
      const requirement = kind.state.requirements[reqSlot];

      let matched = false;
      let inRes = Resources.get(currentGroup[reqSlot]);
      if (!inRes) {
        if (requirement.kind === untilLinked.state.kind) {
          inRes = untilLinked;
          matched = true;
        } else {
          inRes = createChildOrLinkOrphan(resource, requirement.kind);
        }
      }
      currentGroup[reqSlot] = inRes.id;
      if (!matched) {
        buildLeft(inRes, 1, untilLinked);
      }
    }
    newInputs.push(currentGroup);
  }
  resource.setInput(newInputs);
}


export function expandGraph(resource: Resource, usedIds?: Set<string>) {
  if (!usedIds) {
    usedIds = new Set<string>();
  }
  const kind = ResourceKinds.get(resource.state.kind);

  const nodes: RecipeProps[] = [];
  const edges: Edge[] = [];

  if (!usedIds.has(resource.id)) {
    nodes.push({
      id: resource.id,
      type: "recipeNode",
      data: resource,
      position: {x: 0, y: 0},
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });
    usedIds.add(resource.id);
  }

  if (!kind) {
    return {
      edges,
      nodes,
    };
  }

  const newInputs: ResourceInputs = [];
  for (const currentGroup of resource.inputs) {
    for (const reqSlot in kind.state.requirements) {
      const requirement = kind.state.requirements[reqSlot];

      let inRes = Resources.get(currentGroup[reqSlot]);
      if (!inRes) {
        inRes = createChildOrLinkOrphan(resource, requirement.kind);
        currentGroup[reqSlot] = inRes.id;
      }

      const edgeId = `${inRes.id}-${resource.id}`;
      if (!usedIds.has(edgeId)) {
        edges.push({
          id: edgeId,
          source: inRes.id,
          target: resource.id,
          type: "stepEdge",
        });
        usedIds.add(edgeId);
      }

      const inpGraph = expandGraph(inRes, usedIds);
      nodes.push(...inpGraph.nodes);
      edges.push(...inpGraph.edges);
    }
    newInputs.push(currentGroup);
  }

  resource.setInput(newInputs);

  return {
    nodes,
    edges,
  }
}
