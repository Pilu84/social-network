import React from "react";

export default function ProfilPic(props) {
    var defaultpic = "./github-box-red.svg";

    return (
        <div className="profilpiccontainer">
            <img onClick = {props.showUploader} src={props.profilpic || defaultpic} />
        </div>
    );
}
