import { Handle, Node } from 'reactflow';
import styles from "./Recipe.module.css";
import { classnames } from '../../utils';
import { Resource } from "../../experiments/resources";


export interface RecipeProps extends Node {
  data: Resource,
}

export function Recipe(props: RecipeProps) {
  const resource = props.data;

  const variant = "solid";

  const bgOpacity = resource.state.isManuallyDeclared ? 0.8 : 0.3;
  const borderstyle = resource.state.isManuallyDeclared ? "solid" : "dashed";
  const bgColor = resource.isReady ? `rgba(0, 255, 0, ${bgOpacity})` : `rgba(255, 0, 0, ${bgOpacity})`;

  return (
    <div className={classnames(styles.root, getVariant(variant))} style={{
      backgroundColor: bgColor,
      borderStyle: borderstyle,
    }}>
      <span>{resource.kind?.state.name ?? resource.state.kind}</span>
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
