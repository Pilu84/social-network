import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome!</h1>
            <img src="./github-box.svg" />

            <HashRouter>
                <div className="formcontainer">
                    <Route exact path = "/" component = { Registration } />
                    <Route exact path = "/login" component = { Login } />
                </div>
            </HashRouter>

        </div>
    );
}
