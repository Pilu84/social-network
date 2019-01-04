import React from "react";
import { connect } from "react-redux";
import {initSocket} from "./socket";
import { messages } from "./actions";


class Chat extends React.Component {
    constructor() {
        super();
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);


    }

    sendMessage(e) {
        let socket = initSocket();

        if (e.which === 13) {
            socket.emit("chatMessage", e.target.value);
            document.getElementById('chat').value = "";

        }

    }

    handleChange(e) {
        this.setState({
            chat: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let socket = initSocket();

        socket.emit("chatMessage", this.state.chat);
        document.getElementById('chat').value = "";
    }

    componentDidMount() {
        this.props.dispatch(messages());
    }


    componentDidUpdate() {

        this.elem.scrollTop = this.elem.scrollHeight;
    }

    render() {


        if (!this.props.messages) {
            return null;
        }

        var defaultpic = "/github-box-red.svg";



        let arrOfMessages = this.props.messages.map((msg, index) => {

            return (
                <div className="message" key = {index}>
                    <img src={msg.profilpic || defaultpic} />
                    <div className="messagetext">
                        <p>{msg.first_name} {msg.last_name} say at {msg.created_at}:</p>
                        <p>{msg.message_text}</p>
                    </div>
                </div>
            );
        });



        return (
            <div className= "messages-container">
                <h1>Chat with the other users!</h1>
                <div id="chat-messages" ref={elem => (this.elem = elem)}>

                    {arrOfMessages}
                    <p>Say something for the others!</p>
                    <form onSubmit={this.handleSubmit}>
                        <textarea onKeyDown = {this.sendMessage} onChange = {this.handleChange} id = "chat"/>
                        <button>Send Message</button>
                    </form>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    
    return {
        messages: state.chatsMessages
    };
};

export default connect(mapStateToProps)(Chat);
