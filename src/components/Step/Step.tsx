import { Position, WrapEdgeProps, getBezierPath } from 'reactflow';
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

export type CustomCSSProps = React.CSSProperties & {
  animation: string;
};



const animationStuff: CustomCSSProps = {
  animation: 'dashdraw 0.2s linear infinite',
  strokeDasharray: 5,
  stroke: "#eced55"
}

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

  const edgeElement = <BaseEdge path={edgePath} {...restOfProps} style={animationStuff}/>
  return edgeElement
}

Step.displayName = "Step";
