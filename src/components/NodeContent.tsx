import React, { useState, useRef } from "react";
import { Resource } from "../experiments/resources";
import styles from "./NodeContent.module.css";
import { KikkulaModal } from "./KikkulaModal/KikkulaModal";
import { Edit } from "../svgs";
import { updateGraph } from "../experiments/recipes";
import { GraphRefreshContext } from "../GraphContext";

export const ResourceValSetter: React.FC<{ resource: Resource, field: string }> = ({ resource, field }) => {
  const { refresh } = React.useContext(GraphRefreshContext);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {/* <button className="iconButton" onClick={() => setShowModal(true)}><Edit/></button> */}
      <KikkulaModal
        isVisible={showModal}
        saveOnClick={() => {
          if (!inputRef.current) return;
          // TODO: Make support multiple fields; don't override entire thing
          const res: any = {};
          res[field] = inputRef.current.value;
          resource.setOutput([res]);

          updateGraph();
          refresh();
        }}
        title={"Edit Resource"}
        inputs={[{label: <label htmlFor="resouce">Resource</label>, input: <input id="resource" type={"text"} ref={inputRef}/>}]}
        trigger={<div className="iconButton" ><Edit/></div>}
        >
      </KikkulaModal>
    </div>
  );
}

const OutTable: React.FC<{ resource: Resource, output: {[key: string]: string}  }> = ({ output, resource }) => {
  const outputs = resource.kind?.outputs ?? {};

  if (!outputs) {
    return null;
  }
  return (
    <table>
      <tbody>
      {Object.keys(outputs).map((k,) => (
        <tr key={k}>
          <td>{k}</td>
          <td>{output[k]}</td>
        </tr>
      ))}
      </tbody>
    </table>
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
      {/*<table>*/}
      {/*  <tbody>*/}
      {/*  {resource.outputs.map((o, idx) => {*/}
      {/*    return (*/}
      {/*      <tr key={idx}>*/}
      {/*        <td><OutTable output={o} resource={resource} /></td>*/}
      {/*      </tr>*/}
      {/*    );*/}
      {/*  })}*/}
      {/*  </tbody>*/}
      {/*</table>*/}
      {Object.keys(outputs).map((k) => {
        return <ResourceValSetter key={k} resource={resource} field={k} />;
      })}
    </div>
  );
};
