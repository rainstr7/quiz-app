import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {attachLogger} from "effector-logger";
import { appStarted } from '../shared/config/init';

attachLogger();
appStarted();
const container = document.querySelector('#root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
