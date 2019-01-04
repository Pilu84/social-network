import React from "react";
import { connect } from "react-redux";
import { friends, unfriends, acceptFriends } from "./actions";
import { Link } from "react-router-dom";


class Friends extends React.Component {
    constructor() {
        super();
        this.state = {};

    }


    componentDidMount() {
        this.props.dispatch(friends());
    }


    render() {

        console.log("this.props", this.props);
        const { friends, wannabe, ownsent } = this.props;

        var defaultpic = "/github-box-red.svg";

        return (
            <div className="friendscontainer">
                <div className="friendtitle"><h1>Your Friends</h1></div>
                <div className="friends">
                    {friends && friends.map(friend => {
                        return (
                            <div key={friend.id}><div className="friend">
                                <Link to={"/users/" + friend.id}><img src={friend.profilpic || defaultpic } /></Link>
                                <div className="text">
                                    <Link to={"/users/" + friend.id}><p>{friend.first_name} {friend.last_name}</p></Link>
                                    <button onClick={()=> this.props.dispatch(unfriends(friend.fid))}>End friendship</button>
                                </div>
                            </div></div>
                        );
                    })}
                </div>

                <div className="friendtitle"><h1>They would your friend</h1></div>
                <div className="wannabe">
                    {wannabe && wannabe.map(wannabes => {
                        return (
                            <div key={wannabes.id}><div className="friend" >
                                <Link to={"/users/" + wannabes.id}><img src={wannabes.profilpic || defaultpic} /></Link>
                                <div className="text">
                                    <Link to={"/users/" + wannabes.id}><p>{wannabes.first_name} {wannabes.last_name}</p></Link>
                                    <button onClick={() => this.props.dispatch(acceptFriends(wannabes.fid))}>Accept</button>
                                </div>
                            </div></div>
                        );
                    })}
                </div>

                <div className="friendtitle"><h1>Your request</h1></div>
                <div className="ownsent">
                    {ownsent && ownsent.map(sent => {
                        return (
                            <div key={sent.id}><div className="friend" >
                                <Link to={"/users/" + sent.id}><img src={sent.profilpic || defaultpic} /></Link>
                                <div className="text">
                                    <Link to={"/users/" + sent.id}><p>{sent.first_name} {sent.last_name}</p></Link>
                                    <button onClick={() => this.props.dispatch(unfriends(sent.fid))}>Cancel friend request</button>
                                </div>
                            </div></div>
                        );
                    })}
                </div>

            </div>
        );

    }
}


const mapStateToProps = function(state) {

    var list = state.users;

    return {
        friends: list && list.filter(
            user => user.accepted == true
        ),
        wannabe: list && list.filter(
            user => !user.accepted && user.sender_id == user.id
        ),
        ownsent: list && list.filter(
            user => user.sender_id != user.id && !user.accepted
        )
    };
};

export default connect(mapStateToProps)(Friends);
