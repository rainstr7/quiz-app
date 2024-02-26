import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {attachLogger} from "effector-logger";
import {appStarted} from '../shared/config/init';

attachLogger();
appStarted();

const container = document.querySelector('#root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<App/>);
}

