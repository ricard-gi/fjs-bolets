import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App.jsx'
import Inici from './Inici.jsx';
import Login from './Login.jsx';
import LListaBolets from './LListaBolets.jsx';
import MostraBolet from './MostraBolet.jsx';
import BoletNou from './BoletNou.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>

          <Route index element={<Inici />} />
          <Route path="/login" element={<Login />} />
          <Route path="/llista" element={<LListaBolets />} />
          <Route path="/bolet/:nom" element={<MostraBolet />} />
          <Route path="/bolet/nou" element={<BoletNou />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
