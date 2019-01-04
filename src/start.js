import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import reducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { initSocket } from './socket';



const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

let component;

if(location.pathname === "/welcome" ) {

    component = <Welcome />;
} else {
    component = (
        initSocket(store),
        <Provider store={store}>
            <App />
        </Provider>
    );
}



ReactDOM.render(component, document.querySelector("main"));
