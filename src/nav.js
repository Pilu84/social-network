import React from "react";
import { Link } from "react-router-dom";

export default function Nav(props) {
    var defaultpic = "/github-box-red.svg";
    return (
        <div className="nav">
            <Link to = "/"><div className="logo"><img src="/github-box.svg" /></div></Link>
            <div className="navwelcome">How are you, {props.first}?</div>
            <Link to = "/profil"><div className="editprofil">Your profil</div></Link>
            <Link to = "/usersearch">Search new friends!</Link>
            <Link to = "/chat">Chat</Link>
            <div onClick = {props.showUploader} className="picwelcome">{!props.profilpic && <p>You can upload your profil picture</p>}<img src={props.profilpic || defaultpic} /></div>
            <div className="logout"><a href="/logout">Logout</a></div>
        </div>
    );
}
