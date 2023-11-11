import React from "react";
import styles from "./Navbar.module.css"
import { resetDb } from "../database/setup";


export const ResetDbButton: React.FC = () => {
  return (
    <button className={styles.navButton} onClick={resetDb}>
      Reset database
    </button>
  )
}


export const Navbar: React.FC = () => {
  return (
    <div className={styles.root}>
      <ResetDbButton />
    </div>
  );
}
