import { Handle, Node } from 'reactflow';
import styles from "./Recipe.module.css";
import { classnames, getGlobalColor } from '../../utils';
import { ReactNode } from 'react';


export interface RecipeProps extends Node {
  data: {
    // [key: string]: ReactNode | string | boolean};
    label: string;
    variant?: "solid" | "fancy";
    color?: string;
  }
}

export function Recipe(props: RecipeProps) {
  const { data } = props;
  const { variant = "solid", color } = props.data;
  
  return (
    <>
      <div className={classnames(styles.root, getVariant(variant), getGlobalColor(color))}>
        {data.label}
      </div>
      {props.sourcePosition ? <Handle type="source" position={props.sourcePosition} /> : null}
      {props.targetPosition ? <Handle type="target" position={props.targetPosition} /> : null}
    </>
  );
}

Recipe.displayName = "Recipe";

const getVariant = (scheme: string = "solid") => {
  return {
    solid: styles.solid,
    fancy: styles.fancy,
  }[scheme];
};
