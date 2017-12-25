import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import Animate from './Animate.jsx';

ReactDOM.render(<Animate width={window.innerWidth} height={window.innerHeight}/>, document.getElementById('root'));
