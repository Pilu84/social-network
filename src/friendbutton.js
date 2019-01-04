import React from "React";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({otherId: props.otherId,  action: "", id: ""});
        this.handleSubmit = this.handleSubmit.bind(this);

    }




    handleSubmit(e) {
        e.preventDefault();

        this.setState({
            [this.state.name]: this.state.value
        });



        axios.post("/friendaction", this.state).then(({data}) => {


            if(data.succes) {
                this.setState({text: "Make friend request", action: "request"});
                return;
            }

            if(data.length != 0) {
                if(data.action == "request") {
                    this.setState({text: "Cancel friend request", action: "remove"});
                    return;
                }

                if(data.action == "accepted") {
                    this.setState({text: "End friendship", action: "delete"});
                    return;
                }
            }


        });

    }

    componentDidMount() {

        axios.get("/checkfriend/" + this.state.otherId).then(resp => {

            if (resp.data.length > 0) {
                if(resp.data[0].accepted) {
                    this.setState({text: "End friendship", action: "delete"});
                } else if (resp.data[0].receiver_id == this.state.otherId) {
                    this.setState({text: "Cancel friend request", action: "remove"});
                } else if (resp.data[0].sender_id == this.state.otherId) {
                    this.setState({text: "Accept friend request", action: "accept"});
                }
                this.setState({id: resp.data[0].id});
            } else {
                this.setState({text: "Make friend request", action: "request"});
            }

        });
    }

    render() {
        return(
            <div className="friendbutton">
                <form onSubmit={this.handleSubmit}>
                    <input type="hidden" name="action" value={this.state.action} />
                    <input type="hidden" name="otherid" value={this.state.otherId} />
                    <input type="hidden" name="reqid" value={this.state.id} />
                    <button>{this.state.text}</button>
                </form>
            </div>
        );
    }
}
