import React from "react";
import { connect } from "react-redux";
import Privatchat from "./privatchat";

class OnlineUsers extends React.Component {
    constructor() {
        super();

        this.handleClick = this.handleClick.bind(this);

        this.state = {
            showChat: false,
            mid: ""
        };
    }

    handleClick(e) {
        console.log("a click: ", e.currentTarget.id);

        this.setState({showChat: true, mid: e.currentTarget.id});


    }

    render() {

        const { onlineuser } = this.props;
        var defaultpic = "/github-box-red.svg";

        return(


            <div className="privatchat">
                <div className="livetitle"><h1>Online Users</h1></div>
                <div className="livefriends">
                    {onlineuser && onlineuser.map((name, index) => {
                        return (
                            <div key={index} className="livefriend" onClick={this.handleClick} id={name.id}>
                                <img src={name.profilpic || defaultpic } />

                                <p>{name.first_name} {name.last_name}</p>
                            </div>
                        );
                    })}

                    {this.state.showChat && <Privatchat mid={this.state.mid}/>}
                </div>

            </div>





        );
    }
}


const mapStateToProps = function(state) {

    return {
        onlineuser: state.online_users
    };
};

export default connect(mapStateToProps)(OnlineUsers);
