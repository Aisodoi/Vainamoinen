import React from 'react';
import './App.css';
import { Map } from './components/Map/Map';
import { Layout } from "./layout/Layout";
import * as Toast from '@radix-ui/react-toast';

function App() {
  return (
    <Toast.Provider swipeDirection="right">
      <Layout>
        <Map />
      </Layout>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
}

export default App;
