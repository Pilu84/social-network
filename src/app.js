import React from "react";
import axios from "./axios";
import OtherUserProfil from "./otheruserprofil";
import ShowUserName from "./showusername";
import Uploader from "./uploader";
import Friends from "./friends";
import OnlineUsers from "./onlineusers";
import Nav from "./nav";
import { BrowserRouter, Route } from "react-router-dom";
import Profile from "./profil";
import Chat from "./chat";



export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
            editBioVisible: false,
            linkVisible: true,
            limit: 3
        };
        this.showUploader = this.showUploader.bind(this);
        this.unShowUploader = this.unShowUploader.bind(this);
        this.changeProfilUrl = this.changeProfilUrl.bind(this);
        this.showBio = this.showBio.bind(this);
        this.unShowBio = this.unShowBio.bind(this);
        this.changeBio = this.changeBio.bind(this);
        this.changeLinkVisible = this.changeLinkVisible.bind(this);
    }

    showUploader() {

        this.setState({
            uploaderIsVisible: true
        });
    }

    unShowUploader() {

        this.setState({
            uploaderIsVisible: false
        });
    }

    showBio() {
        this.setState({
            editBioVisible: true
        });
    }

    unShowBio() {
        this.setState({
            editBioVisible: false
        });
    }

    changeBio(biog) {
        this.setState({
            bio: biog
        });
    }

    changeProfilUrl(url) {
        this.setState({
            profilpic: url
        });
    }

    changeLinkVisible() {
        this.setState({
            linkVisible: false
        });
    }

    componentDidMount() {

        axios.get("/user").then(({data}) => {
            this.setState(data[0]);
        });


        axios.get("/otherusers", {params: {limit: this.state.limit}}).then(resp => {

            this.setState({users: resp.data});

        });



    }
    render() {


        return(
            <BrowserRouter>
                <div className="route">
                    <Nav showUploader = {this.showUploader} profilpic = {this.state.profilpic} first = {this.state.first_name}/>


                    <OnlineUsers />


                    <Route exact path="/" render = { () => {

                        return <Friends />;
                    }} />

                    {this.state.uploaderIsVisible && <Uploader unShowUploader = {this.unShowUploader}
                        changeProfilUrl = {this.changeProfilUrl} showUploader = {this.showUploader} />}


                    <Route path = "/chat" render = {() => {
                        return <Chat />;
                    }} />




                    <Route exact path="/profil" render= { () => {
                        return <Profile
                            first = {this.state.first_name}
                            last = {this.state.last_name}
                            email = {this.state.email}
                            bio = {this.state.bio}
                            profilpic = {this.state.profilpic}
                            showBio = {this.showBio}
                            unShowBio = {this.unShowBio}
                            showUploader = {this.showUploader}
                            unShowUploader = {this.unShowUploader}
                            uploaderIsVisible = {this.state.uploaderIsVisible}
                            editBioVisible = {this.state.editBioVisible}
                            changeBio = {this.changeBio}
                            changeProfilUrl = {this.changeProfilUrl}

                        />;
                    }} />




                    <Route exact path = "/usersearch" render = { () => {

                        return <ShowUserName users={this.state.users} limit={this.state.limit}/>;

                    }} />

                    <Route exact path = "/users/:id" render = { props => {
                        return <OtherUserProfil {...props}
                            key = {props.match.url }/>;
                    }} />


                </div>
            </BrowserRouter>
        );
    }
}



//git clone social egy helyre -> atnevez -> masol (kezzel) -> git remove origin  -> git remote add origin "az url"  -> git checkout -b final origin/oliverB
