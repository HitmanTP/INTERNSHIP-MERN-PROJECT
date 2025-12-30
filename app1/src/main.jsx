import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 1. IMPORT BOOTSTRAP FIRST
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

// 2. IMPORT CUSTOM CSS LAST (So it overrides Bootstrap)
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)