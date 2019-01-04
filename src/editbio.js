import React from "react";
import axios from "./axios";

export default class EditBio extends React.Component {
    constructor(props) {
        super(props);

        this.state={changeBio: props.changeBio, unShowBio: props.unShowBio, bio: props.bio};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();


        axios.post("/editbio", this.state).then(({data}) => {
            if(data.succes) {

                this.state.unShowBio();
                this.state.changeBio(data.data[0].bio);

            }
        });
    }

    render() {

        return (

            <div className="editbio">

                <form onSubmit={this.handleSubmit}>
                    <textarea onChange = {this.handleChange} defaultValue={this.state.bio} name="bio" rows="8" cols="40"/>
                    <button>Save</button>
                </form>
            </div>
        );
    }
}
