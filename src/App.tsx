import React from 'react';
import './App.css';
import { Map } from './components/Map/Map';
import { Layout } from "./layout/Layout";

function App() {
  return (
    <Layout>
      <Map />
    </Layout>
  );
}

export default App;
