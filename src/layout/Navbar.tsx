import React from "react";
import styles from "./Navbar.module.css"
import { resetDb } from "../database/setup";
import * as Toast from '@radix-ui/react-toast';
import { Cross } from "../svgs";
import { updateGraph } from "../experiments/recipes";
import { GraphRefreshContext } from "../GraphContext";


export const ResetDbButton: React.FC = () => {
  const { refresh } = React.useContext(GraphRefreshContext);

  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className={styles.navButton} onClick={() => {
        setOpen(false);
        resetDb();
        refresh();
        setOpen(true);
      }}>
        Reset database
      </button>
      <Toast.Root className="ToastRoot green" open={open} onOpenChange={setOpen}>
        <Toast.Title className="ToastTitle">Database was reset</Toast.Title>
        <Toast.Description className="ToastDescription">And it's gone.</Toast.Description>
        <Toast.Close className="ToastClose">
          <Cross />
        </Toast.Close>
      </Toast.Root>
    </>
  )
}

export const RunStepButton: React.FC = () => {
  const { refresh } = React.useContext(GraphRefreshContext);
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className={styles.navButtonNeutral} onClick={() => {
        setOpen(false);
        // lol
        updateGraph();
        refresh();
        setOpen(true);
      }}>
        Update graph
      </button>
      <Toast.Root className="ToastRoot green" open={open} onOpenChange={setOpen}>
        <Toast.Title className="ToastTitle">Update graph</Toast.Title>
        <Toast.Close className="ToastClose">
          <Cross />
        </Toast.Close>
      </Toast.Root>
    </>
  )
}


export const Navbar: React.FC = () => {
  return (
    <div className={styles.root}>
      <ResetDbButton />
      <RunStepButton />
    </div>
  );
}
