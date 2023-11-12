import React, { useState, useRef } from "react";
import { Resource } from "../experiments/resources";
import styles from "./NodeContent.module.css";
import { KikkulaModal } from "./KikkulaModal/KikkulaModal";
import { Edit } from "../svgs";

export const ResourceValSetter: React.FC<{ resource: Resource, field: string }> = ({ resource, field }) => {
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {/* <button className="iconButton" onClick={() => setShowModal(true)}><Edit/></button> */}
      <KikkulaModal
        isVisible={showModal}
        saveOnClick={() => {
            if (!inputRef.current) return;
            resource.setOutput(field, inputRef.current.value);
          }}
        title={"Edit Resource"}
        description={"Here you can edit a resource, to auto generate new paths."}
        inputs={[{label: <label htmlFor="resouce">Resource</label>, input: <input id="resource" type={"text"} ref={inputRef}/>}]}
        trigger={<div className="iconButton" ><Edit/></div>}
        >
      </KikkulaModal>
    </div>
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
