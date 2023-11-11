import { Position, WrapEdgeProps, getBezierPath } from 'reactflow';
import styles from "./Step.module.css";
import { BaseEdge } from 'reactflow';

export type BezierEdgeStepProps<T = any> = Omit<WrapEdgeProps<T>, "type" | "markerStart" | "markerEnd"> & {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  type: "default" | "stepEdge"
  markerStart?: string;
  markerEnd?: string;
};


export function Step(props: BezierEdgeStepProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, ...restOfProps } = props;
  
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // TODO: Type problem
  const edgeElement = <BaseEdge path={edgePath} {...restOfProps}/>
  return edgeElement
}

Step.displayName = "Step";

export const getEdgeVariant = (scheme: string = "solid") => {
  return {
    solid: styles.solid,
    fancy: styles.fancy,
  }[scheme];
};
