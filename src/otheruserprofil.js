import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

export default class OtherUserProfil extends React.Component {
    constructor() {
        super();
        this.state = {};

    }

    componentDidMount() {
        var otherId = this.props.match.params.id;
        axios.get("/others/" + otherId).then(({data}) => {

            if(data.succes || data.length == 0) {
                // location.replace("/");
                this.props.history.push("/");
                return;
            }
            this.setState({
                first: data[0].first_name,
                last: data[0].last_name,
                email: data[0].email,
                profilpic: data[0].profilpic,
                bio: data[0].bio
            });
        });
    }

    render() {
        var defaultpic = "/github-box-red.svg";

        return(
            <div className="opp">

                <h1>Profil {this.state.first} {this.state.last}</h1>
                <p>Name: {this.state.first} {this.state.last}</p>
                <p>Email: {this.state.email}</p>
                <p>Biography: {this.state.bio}</p>
                <p>Profil picture:</p>
                <img src={this.state.profilpic || defaultpic} className="oprofilpic"/>
                <FriendButton otherId={this.props.match.params.id} />

            </div>
        );
    }
}
