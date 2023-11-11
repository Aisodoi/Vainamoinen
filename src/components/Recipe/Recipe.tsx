import { Handle, Node } from 'reactflow';
import styles from "./Recipe.module.css";
import { classnames } from '../../utils';


export interface RecipeProps extends Node {
  data: {
    label: string;
    isReady: boolean;
    isManuallyDeclared: boolean;
  }
}

export function Recipe(props: RecipeProps) {
  const { data } = props;
  const variant = "solid";

  const bgOpacity = data.isManuallyDeclared ? 0.8 : 0.3;
  const borderstyle = data.isManuallyDeclared ? "solid" : "dashed";
  const bgColor = data.isReady ? `rgba(0, 255, 0, ${bgOpacity})` : `rgba(255, 0, 0, ${bgOpacity})`;

  return (
    <div className={classnames(styles.root, getVariant(variant))} style={{
      backgroundColor: bgColor,
      borderStyle: borderstyle,
    }}>
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
