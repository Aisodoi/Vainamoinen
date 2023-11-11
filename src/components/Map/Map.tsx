import styles from "./Map.module.css";
import { useCallback, useState } from 'react';
import ReactFlow, { Connection, Controls, Edge, EdgeChange, Node, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import { nodes as initialNodes} from "../../data/nodes"
import { edges as initialEdges} from "../../data/edges"
import { Recipe } from "../Recipe/Recipe";
import { Step } from "../Step/Step";
import ButtonStep from "../Step/ButtonStep";

const nodeTypes = {
  recipeNode: Recipe
}

const edgeTypes = {
  stepEdge: Step,
  buttonStep: ButtonStep
}


export function Map() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

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
