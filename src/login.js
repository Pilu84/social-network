import React from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export default class Login extends React.Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {};
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({
            messageEmail: "",
            messagePassword: ""
        });
        //formData!!!
        const {email, password } = this.state;

        if(!email || !password) {
            if(!email) {
                this.setState({messageEmail: "Email", errorClassEmail: "errorinput"});
            }
            if(!password) {
                this.setState({messagePassword: "Password", errorClassPassword: "errorinput"});
            }

            document.querySelector('input[name=password]').value = "";
            return;
        }
        axios.post("/login", this.state).then(resp => {

            if(resp.data.succes) {
                location.replace("/");

            } else {

                document.querySelector('input[name=password]').value = "";
                this.setState({error: true});

            }
        });
    }

    render() {
        return (
            <div>
                <h1>Login</h1>
                { this.state.error && <div className="error"> Something wrong! Please try again! </div>}
                <form onSubmit={this.handleSubmit} id="login">
                    { this.state.messageEmail && <div className="error"> {this.state.messageEmail} is required! Please try again! </div>}
                    <input onChange = {this.handleChange} className = {this.state.errorClassEmail } name="email" type="text" placeholder="Email" />
                    { this.state.messagePassword && <div className="error"> {this.state.messagePassword} is required! Please try again! </div>}
                    <input onChange = {this.handleChange} className = {this.state.errorClassPassword } name="password" type="password" placeholder="Your password" />
                    <button>Login</button>
                </form>

                <Link to = "/">Click here to registration</Link>
            </div>
        );
    }
}
