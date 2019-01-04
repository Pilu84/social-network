import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import Friends from "./friends";


export default class Logo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};


    }

    componentDidMount() {

        axios.get("/user").then(({data}) => {
            this.setState(data[0]);
        });
    }


    render() {

        return (
            <div className="uplogo">
                <h1>Hello, {this.state.first_name}</h1>
                <Friends />
                <div className="linktoother"><Link to = "/usersearch">Search new friends!</Link></div>
            </div>
        );
    }
}
