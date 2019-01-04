import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";



export default class Registration extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {};


    }

    handleChange(e) {

        this.setState({
            [e.target.name]: e.target.value,
        });


    }

    handleSubmit(e) {
        e.preventDefault();

        //formdata!!!

        this.setState({
            messageLast: "",
            messageEmail: "",
            messageFirst: "",
            messagePassword: "",
            errorClassFirst: "",
            errorClassLast: "",
            errorClassEmail: "",
            errorClassPassword: "",
        });

        const { first, last, email, password } = this.state;

        if(!first || !last || !email || !password ) {

            if(!first) {

                this.setState({messageFirst: "Fist name", errorClassFirst: "errorinput"});
            }
            if(!last) {
                this.setState({messageLast: "Last name", errorClassLast: "errorinput"});
            }
            if(!email) {
                this.setState({messageEmail: "Email", errorClassEmail: "errorinput"});
            }
            if(!password) {
                this.setState({messagePassword: "Password", errorClassPassword: "errorinput"});
            }

            document.querySelector('input[name=password]').value = "";
            return;
        }

        axios.post("/registration", this.state).then(resp => {
            if(resp.data.succes) {
                location.replace("/");
            } else {

                if(resp.data.errorText) {
                    this.setState({messageAlready: "This email already exists"});
                    document.querySelector('input[name=password]').value = "";
                    return;
                }
                document.querySelector('input[name=password]').value = "";

                this.setState({
                    error: true
                });
            }
        });

    }



    render() {
        return (
            <div className="registration-container">
                <h1>Please register</h1>
                { this.state.error && <div className="error"> Something wrong! Please try again! </div>}
                { this.state.messageAlready && <div className="error"> {this.state.messageAlready} </div>}
                <Link to = "/login">Click here to login</Link>
                <form onSubmit = {this.handleSubmit}>
                    { this.state.messageFirst && <div className="error"> {this.state.messageFirst} is required! Please try again! </div>}
                    <input onChange = { this.handleChange } className = {this.state.errorClassFirst } name = "first" type="text" placeholder = "first name" />
                    { this.state.messageLast && <div className="error"> {this.state.messageLast} is required! Please try again! </div>}
                    <input onChange = { this.handleChange } className = {this.state.errorClassLast } name = "last" type="text" placeholder = "last name" />
                    { this.state.messageEmail && <div className="error"> {this.state.messageEmail} is required! Please try again! </div>}
                    <input onChange = { this.handleChange } className = {this.state.errorClassEmail }  name = "email" type="text" placeholder = "email" />
                    { this.state.messagePassword && <div className="error"> {this.state.messagePassword} is required! Please try again! </div>}
                    <input onChange = { this.handleChange } className = {this.state.errorClassPassword } name = "password" type="password" placeholder = "password" />
                    <button>Register</button>
                </form>
            </div>
        );
    }
}
