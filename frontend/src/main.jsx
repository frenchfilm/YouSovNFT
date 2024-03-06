import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {polygonMumbai} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Deployments from './components/Deployments.jsx';
import  Notfound  from './components/Notfound.jsx';
import AdminInteract from './components/AdminInteract.jsx';
import {  ApolloProvider } from '@apollo/client';
import client from './constants/apolloClient.js';

const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})
import Mint from './components/Mint.jsx';
import Upload from './components/Upload.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <ApolloProvider client={client}>
    <BrowserRouter>
   

    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="deployments" element={<Deployments />} />
        <Route path="/deployments/:collectionId" element={<AdminInteract />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="*" element={<Notfound />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
      </RainbowKitProvider>
    </WagmiConfig>
 
    </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
)
