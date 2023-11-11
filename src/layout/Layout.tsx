import React, { ErrorInfo, PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import styles from "./Layout.module.css";

class ErrorBoundary extends React.Component {
  state: {
    hasError: boolean
  };

  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Clear your session to restart</h1>;
    }

    return (this.props as any).children;
  }
}


export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.root}>
      <Navbar />
      <ErrorBoundary>
        <div className={styles.content}>{children}</div>
      </ErrorBoundary>
    </div>
  );
}
