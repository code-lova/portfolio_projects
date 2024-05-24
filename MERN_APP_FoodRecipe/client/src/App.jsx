import React from 'react'
import {BrowserRouter} from "react-router-dom";
import Routers from './routes/Routers';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


axios.defaults.withCredentials = true;

function App() {

  return (
    <BrowserRouter>
      <Routers />
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
