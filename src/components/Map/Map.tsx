import { useCallback, useContext, useMemo } from 'react';
import ReactFlow, { Connection, ConnectionLineType, Edge, addEdge, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

import { Recipe } from "../Recipe/Recipe";
import { Step } from "../Step/Step";
import { ResourceKinds, Resources } from "../../experiments/resources";
import { expandGraph } from "../../experiments/graph";

import dagre from "@dagrejs/dagre";

import 'reactflow/dist/style.css';
import { GraphRefreshContext } from "../../GraphContext";

const nodeTypes = {
  recipeNode: Recipe
}

const edgeTypes = {
  stepEdge: Step,
}


export function Map() {
  const { state } = useContext(GraphRefreshContext);
  const graph = useMemo(() => {
    const WebApp = ResourceKinds.filter((x) => x.state.name === "Web App")[0];
    const TodoApp = Resources.filter((x) => x.state.kind === WebApp.id)[0];
    const gr = expandGraph(TodoApp);
    const ids = new Set();
    for (const edge of gr.nodes) {
      if (ids.has(edge.id)) {
        console.log(`Dupe ID: ${edge.id}`);
      } else {
        ids.add(edge.id);
      }
    }
    return gr;
  }, [state]);
  
  const getLayoutedElements = useCallback((nodes: any[], edges: any[], direction = 'LR') => {

    const nodeWidth = 500;
    const nodeHeight = 36;
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });
  
    nodes.forEach((node: { id: string; }) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
  
    edges.forEach((edge: { source: dagre.Edge; target: string | { [key: string]: any; } | undefined; }) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
  
    dagre.layout(dagreGraph);
  
    nodes.forEach((node: { id: string | dagre.Label; targetPosition: string; sourcePosition: string; position: { x: number; y: number; }; }) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? 'left' : 'top';
      node.sourcePosition = isHorizontal ? 'right' : 'bottom';
  
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
  
      return node;
    });
  
    return { nodes, edges };
  }, [state]);
  
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => getLayoutedElements(
    graph.nodes,
    graph.edges
  ), [getLayoutedElements, graph.edges, graph.nodes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
      ),
    []
  );
  const onLayout = useCallback(
    (direction: string | undefined) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [edges, nodes, setEdges, setNodes, getLayoutedElements]
  );

  // TODO: Replace any with proper types
  console.log(graph.nodes);
  console.log(graph.edges);
  return (
    <ReactFlow
      key={state}
      nodes={graph.nodes}
      nodeTypes={nodeTypes as any}
      edgeTypes={edgeTypes as any}
      edges={graph.edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      proOptions={{ hideAttribution: true }}
      fitView
    />
  );

}

Map.displayName = "Map";
