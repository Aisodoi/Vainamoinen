import React, { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import styles from "./Layout.module.css";


export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.root}>
      <Navbar />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
