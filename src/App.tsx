import React from 'react';
import './App.css';
import { Map } from './components/Map/Map';
import { Layout } from "./layout/Layout";
import * as Toast from '@radix-ui/react-toast';
import { GraphContextProvider } from "./GraphContext";

function App() {
  return (
    <GraphContextProvider>
      <Toast.Provider swipeDirection="right">
        <Layout>
          <Map />
        </Layout>
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
    </GraphContextProvider>
  );
}

export default App;
