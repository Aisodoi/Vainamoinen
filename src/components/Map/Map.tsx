import { useCallback } from 'react';
import ReactFlow, { Connection, ConnectionLineType, Edge, addEdge, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

import { Recipe } from "../Recipe/Recipe";
import { Step } from "../Step/Step";
import { TodoApp } from "../../experiments/resources";
import { expandGraph } from "../../experiments/graph";

import dagre from "@dagrejs/dagre";

import 'reactflow/dist/style.css';

const nodeTypes = {
  recipeNode: Recipe
}

const edgeTypes = {
  stepEdge: Step,
}

const graph = expandGraph(TodoApp);

console.log(graph);


export function Map() {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const nodeWidth = 215;
  const nodeHeight = 36;
  
  const getLayoutedElements = (nodes: any[], edges: any[], direction = 'LR') => {
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
  };
  
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    graph.nodes,
    graph.edges
  );

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
    [graph.nodes, graph.edges]
  );

  // TODO: Replace any with proper types
  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes as any}
      edgeTypes={edgeTypes as any}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
    />
  );

}

Map.displayName = "Map";
