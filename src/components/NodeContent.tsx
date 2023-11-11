import React, { useState, useRef } from "react";
import { Resource } from "../experiments/resources";
import styles from "./NodeContent.module.css";
import { KikkulaModal } from "./KikkulaModal/KikkulaModal";

export const ResourceValSetter: React.FC<{ resource: Resource, field: string }> = ({ resource, field }) => {
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <KikkulaModal isVisible={showModal} dismiss={() => setShowModal(false)}>
        <div className={styles.form}>
          <input type={"text"} ref={inputRef}/>
          <button className={styles.button} onClick={() => {
            if (!inputRef.current) return;
            resource.setOutput(field, inputRef.current.value);
          }}>Save</button>
        </div>
      </KikkulaModal>
      <button style={{ color: "black" }} onClick={() => setShowModal(true)}>Set</button>
    </>
  );
}

type StepContentProps = {
  resource: Resource;
}
export const StepContent: React.FC<StepContentProps> = ({ resource }) => {
  const outputs = resource.kind?.outputs ?? {};
  return (
    <div className={styles.root}>
      <span>{resource.kind?.state.name ?? resource.state.kind}</span>
      <table>
        <tbody>
        {Object.keys(outputs).map((k) => {
          const outVal = resource.outputs[k];
          return (
            <tr key={k}>
              <td>{k}</td>
              <td>{outVal}</td>
              <td>
                <ResourceValSetter resource={resource} field={k} />
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};
