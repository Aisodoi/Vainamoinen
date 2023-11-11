import { Edge, Handle, Node, WrapEdgeProps, getStraightPath } from 'reactflow';
import styles from "./Step.module.css";
import { classnames } from '../../utils';
import { ReactNode, cloneElement } from 'react';
import { BaseEdge } from 'reactflow';
import { BezierEdgeType, DefaultEdge, SmoothStepEdgeType } from './EdgeTypes';

export type DefaultStepProps<T = any> = {
  variant?: "solid" | "fancy";
  color?: string;
} & DefaultEdge<T>;

export type SmoothStepStepProps<T = any> = {
  variant?: "solid" | "fancy";
  color?: string;
} & SmoothStepEdgeType<T>;

export type BezierEdgeStepProps<T = any> = {
  variant?: "solid" | "fancy";
  color?: string;
} & BezierEdgeType<T>;


export function Step(props: (DefaultStepProps | SmoothStepStepProps | BezierEdgeStepProps)[]) {
  // Dafuq is going on with the types. Why couldn't they just export the main Edge type?????
  const { sourceX, sourceY, targetX, targetY, variant, color, ...restOfProps } = props;
  console.log(props);
  // const { variant = "solid", color } = props.data;

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const edgeElement = <BaseEdge path={edgePath} {...restOfProps}/>
 
  return cloneElement(edgeElement, {
    className: classnames(
      edgeElement.props.className,
      getVariant(variant)
    ),
    "data-color": {color}
  })

  // return <BaseEdge path={edgePath} {...restOfProps} data-color={color} />;


  
  // return (
  //   <>
  //     <div className={classnames(styles.root, getVariant(variant))} data-color={color}>
  //       {data.label}
  //     </div>
 
  //     {props.sourcePosition ? <Handle type="source" position={props.sourcePosition} /> : null}
  //     {props.targetPosition ? <Handle type="target" position={props.targetPosition} /> : null}
      
  //   </>
  // );
}

Step.displayName = "Step";

const getVariant = (scheme: string = "info") => {
  return {
    solid: styles.solid,
    fancy: styles.fancy,
  }[scheme];
};
