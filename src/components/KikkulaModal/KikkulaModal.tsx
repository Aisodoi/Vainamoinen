import React, { PropsWithChildren, ReactNode, cloneElement, useMemo } from "react";
import styles from "./KikkulaModal.module.css";
import * as Dialog from '@radix-ui/react-dialog';
import { Cross } from "../../svgs";
import { classnames } from "../../utils";

type KikkulaModalProps = {
  isVisible: boolean;
  trigger: ReactNode;
  title: JSX.Element | string;
  description: JSX.Element | string;
  inputs: {input: JSX.Element; label: JSX.Element}[];
  saveOnClick: () => void;
}

function addClasses(element: JSX.Element, classesToAdd: string, key: string) {
  return cloneElement(element, {
    className: classnames(
      element.props.className,
      classesToAdd,
    ),
    key: key,
  });
}

export const KikkulaModal: React.FC<PropsWithChildren<KikkulaModalProps>> = (props) => {
  const fieldSets = useMemo(() => {
    return props.inputs.map(x => {
      return (
        <fieldset className={styles.Fieldset}>
          {addClasses(x.label, styles.Label, "label")}
          {addClasses(x.input, styles.Input, "input")}
        </fieldset>
      )
    });
  }, [props.inputs]);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {props.trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.DialogOverlay} />
        <Dialog.Content className={styles.DialogContent}>
          <Dialog.Title className={styles.DialogTitle}>{props.title}</Dialog.Title>
          <Dialog.Description className={styles.DialogDescription}>
            {props.description}
          </Dialog.Description>
          {fieldSets}
          <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
            <Dialog.Close asChild>
              <button className={classnames(styles.Button, styles.green)} onClick={props.saveOnClick}>Save changes</button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className={styles.IconButton} aria-label="Close">
              <Cross />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
