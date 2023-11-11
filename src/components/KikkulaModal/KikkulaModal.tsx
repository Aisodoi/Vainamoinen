import React, { PropsWithChildren } from "react";
import styles from "./KikkulaModal.module.css";

type KikkulaModalProps = {
  isVisible: boolean;
  dismiss: () => void;
}
export const KikkulaModal: React.FC<PropsWithChildren<KikkulaModalProps>> = (props) => {
  if (!props.isVisible) return null;

  return (
    <div className={styles.root} onClick={props.dismiss}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {props.children}
      </div>
    </div>
  );
};
