import styles from "./Map.module.css";
import { useCallback, useState } from 'react';
import ReactFlow, { Connection, Controls, Edge, EdgeChange, Node, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import { Recipe } from "../Recipe/Recipe";
import { Step } from "../Step/Step";
import ButtonStep from "../Step/ButtonStep";
import { TodoApp } from "../../experiments/resources";
import { expandGraph } from "../../experiments/graph";

const nodeTypes = {
  recipeNode: Recipe
}

const edgeTypes = {
  stepEdge: Step,
  buttonStep: ButtonStep
}

const graph = expandGraph(TodoApp);

console.log(graph);


export function Map() {
  const [nodes, setNodes] = useState<Node[]>(graph.nodes);
  const [edges, setEdges] = useState<Edge[]>(graph.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className={styles.root}>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
      </ReactFlow>
    </div>
  );

}

Map.displayName = "Map";
