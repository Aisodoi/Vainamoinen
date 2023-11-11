import { Handle, Node } from 'reactflow';
import styles from "./Recipe.module.css";
import { classnames, getGlobalColor } from '../../utils';


export interface RecipeProps extends Node {
  data: {
    label: string;
    isReady: boolean;
  }
}

export function Recipe(props: RecipeProps) {
  const { data } = props;
  const variant = "solid";
  const color = "orange";
  
  return (
    <div className={classnames(styles.root, getVariant(variant), getGlobalColor(color))}>
      <span>{data.label}</span>
      {props.sourcePosition ? <Handle type="source" position={props.sourcePosition} /> : null}
      {props.targetPosition ? <Handle type="target" position={props.targetPosition} /> : null}
    </div>
  );
}

Recipe.displayName = "Recipe";

const getVariant = (scheme: string = "solid") => {
  return {
    solid: styles.solid,
    fancy: styles.fancy,
  }[scheme];
};
