import { Handle, Node } from 'reactflow';
import styles from "./Recipe.module.css";
import { classnames } from '../../utils';
import { Resource } from "../../experiments/resources";
import { StepContent } from "../NodeContent";


export interface RecipeProps extends Node {
  data: Resource,
}

export function Recipe(props: RecipeProps) {
  const resource = props.data;

  return (
    <div className={classnames(
      styles.root,
      getStatusColor(resource.isReady ? "green" : resource.state.isManuallyDeclared ? "red" : "white"),
      getBorderSolidity(resource.state.isManuallyDeclared ? "solid" : "dashed")
      )}>
      <StepContent resource={resource} />
      {props.sourcePosition ? <Handle type="source" position={props.sourcePosition} /> : null}
      {props.targetPosition ? <Handle type="target" position={props.targetPosition} /> : null}
    </div>
  );
}

Recipe.displayName = "Recipe";

const getStatusColor = (scheme: string = "green") => {
  return {
    green: styles.green,
    red: styles.red,
    white: styles.white,
  }[scheme];
};

const getBorderSolidity = (scheme: string = "solid") => {
  return {
    solid: styles.solid,
    dashed: styles.dashed,
  }[scheme];
};
