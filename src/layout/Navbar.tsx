import React from "react";
import styles from "./Navbar.module.css"
import { resetDb } from "../database/setup";
import * as Toast from '@radix-ui/react-toast';
import { Cross } from "../svgs";
import { updateGraph } from "../experiments/recipes";


export const ResetDbButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className={styles.navButton} onClick={() => {
        setOpen(false);
        resetDb()
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
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button className={styles.navButtonNeutral} onClick={() => {
        setOpen(false);
        // lol
        for (let i = 0; i < 6; i++) {
          updateGraph();
        }
        setOpen(true);
      }}>
        Run step
      </button>
      <Toast.Root className="ToastRoot green" open={open} onOpenChange={setOpen}>
        <Toast.Title className="ToastTitle">Step was run</Toast.Title>
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
