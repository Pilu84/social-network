import React from "React";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userSearch } from "./actions";
import axios from "./axios";


class ShowUserName extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {usersearched: ""};
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();


        axios.post("/searchwithname", this.state).then(({data}) => {
            console.log(data);

            this.setState({usersearched: data});
        });

    }

    componentDidMount() {

        this.props.dispatch(userSearch());

    }



    render() {

        const {users} = this.props;

        var defaultpic = "/github-box-red.svg";

        return (

            <div className="friendscontainer">


                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} type="text" name="username" placeholder="Search new friends" />
                    <button>Submit</button>
                </form>


                <div className="friends">
                    {this.state.usersearched && this.state.usersearched.map((user, index) => {
                        return (
                            <div className="friend" key={index}>
                                <Link to={"/users/" + user.id}><img src={user.profilpic || defaultpic} /></Link>
                                <div className="text">
                                    <Link to={"/users/" + user.id}><p>{user.first_name} {user.last_name}</p></Link>

                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="searchtitel"><h1>People, who could you interest</h1></div>
                <div className="friends">
                    {users && users.map((name, index) => {
                        return (
                            <div key={index}><div className="friend" >
                                <Link to={"/users/" + name.id}><img src={name.profilpic || defaultpic} /></Link>
                                <div className="text">
                                    <Link to={"/users/" + name.id}><p>{name.first_name} {name.last_name}</p></Link>

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

    return state;
};

export default connect(mapStateToProps)(ShowUserName);
