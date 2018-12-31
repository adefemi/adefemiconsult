import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import "video-react/dist/video-react.css"
import './assets/css/style.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
// ..
AOS.init();

import RootReducer from './js/components/redux/reducer/rootReducer'

const Store = createStore(RootReducer, applyMiddleware(thunk));

import Router from './js/components/router';

const Index = () => (
    <Provider store={Store}>
        <Router />
    </Provider>
)


ReactDOM.render(<Index />, wrapper);