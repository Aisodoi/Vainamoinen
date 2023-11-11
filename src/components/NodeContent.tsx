import React from "react";
import { Resource } from "../experiments/resources";
import styles from "./NodeContent.module.css";

type StepContentProps = {
  resource: Resource;
}
export const StepContent: React.FC<StepContentProps> = ({ resource }) => {
  const outputs = resource.kind?.outputs ?? {};
  return (
    <div className={styles.root}>
      <span>{resource.kind?.state.name ?? resource.state.kind}</span>
      <table>
        {Object.keys(outputs).map((k) => {
          const outVal = resource.outputs[k];
          return (
            <tr>
              <td>{k}</td>
              <td>{outVal}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};
