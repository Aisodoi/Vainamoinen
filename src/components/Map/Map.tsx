import styles from "./Map.module.css";
import { useCallback, useState } from 'react';
import ReactFlow, { Controls, OnConnect, OnEdgesChange, OnNodesChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';

import { nodes as initialNodes} from "../../data/nodes"
import { edges as initialEdges} from "../../data/edges"
import { Recipe } from "../Recipe/Recipe";
import { Step } from "../Step/Step";

const nodeTypes = {
  recipeNode: Recipe
}

const edgeTypes = {
  stepEdge: Step
}


export function Map() {
  // const { content, icon, variant = "info" } = props;

  // return (
  //   <div className={classnames(styles.root, getStyle(variant))}>
  //     {<Icon wrapperClasses={styles.icon}>{icon}</Icon>}
  //     {<div className={styles.content}>{content}</div>}
  //   </div>
  // );
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: OnNodesChange[]) => setNodes((nds: OnNodesChange) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: OnEdgesChange[]) => setEdges((eds: OnEdgesChange) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: OnConnect[]) => setEdges((eds: OnConnect) => addEdge(connection, eds)),
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

// const getStyle = (scheme: MapProps["variant"] = "info") => {
//   return {
//     info: styles.Map__info,
//     danger: styles.Map__danger,
//     warning: styles.Map__warning,
//     success: styles.Map__success,
//   }[scheme];
// };
