import React from "react";
import { connect } from "react-redux";
import {initSocket} from "./socket";
import { privatMessages } from "./actions";

class Privatchat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {id: props.mid};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


    }

    componentDidMount() {

        this.props.dispatch(privatMessages(this.state.id));
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        let otherid = this.state.id;

        const ownid = function(id) {
            for (var i = 0; i < id.length; i++) {
                if (id[i] != otherid) {
                    return id[i].id;
                }
            }
        };

        const ownId = ownid(this.props.message);
        let oldMessage = [...this.props.message, {
            id: ownId,
            text: this.state.text}];

        let newMessage = JSON.stringify(oldMessage);

        let sendData = {text: newMessage, chatid: this.props.chatid, messageToBack: this.state.text, idToBack: this.state.id};

        let socket = initSocket();

        socket.emit("privatchatMessageToData", sendData);
        // document.getElementById('text').value = "";
        document.getElementById('text').value = "";
    }

    componentDidUpdate() {

        this.elem.scrollTop = this.elem.scrollHeight;
    }

    render() {

        const { message } = this.props;

        if (!message) {
            return null;
        }
        let arrOfMessages = this.props.message.map((msg, index) => {

            return (
                <div className="pmessage" key = {index} ref={elem => (this.elem = elem)}>
                    {msg.id == this.state.id &&
                    <div className="pmessagetext-left">
                        <p>{msg.text}</p>
                    </div>
                    }
                    {msg.id != this.state.id &&
                        <div className="pmessagetext-right">
                            <p>{msg.text}</p>
                        </div>
                    }
                </div>

            );

        });

        return (
            <div className="privatchatcontainer">
                <h1>This is privatchat</h1>

                {arrOfMessages &&
                    <div className = "sendmessagecontainer">
                        <div className = "messages">{arrOfMessages}</div>

                        <div className = "messageform">
                            <form onSubmit = {this.handleSubmit} >
                                <input type="text" name="text" onChange={this.handleChange} id="text"/>

                                <button>Send</button>
                            </form>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {

    console.log("a state: ", state);
    return {
        message: state.messages,
        chatid: state.chatid
    };
};

export default connect(mapStateToProps)(Privatchat);
