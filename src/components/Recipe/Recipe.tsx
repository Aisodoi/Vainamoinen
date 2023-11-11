import { Handle, Node } from 'reactflow';
import styles from "./Recipe.module.css";
import { classnames } from '../../utils';


export interface RecipeProps extends Node {
  data: {
    label: string;
    isReady: boolean;
  }
}

export function Recipe(props: RecipeProps) {
  const { data } = props;
  const variant = "solid";

  return (
    <div className={classnames(styles.root, getVariant(variant))}>
      <span>{data.label} - Ready: {props.data.isReady.toString()}</span>
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
