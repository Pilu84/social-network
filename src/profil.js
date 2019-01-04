import React from "react";
import Editbio from "./editbio";
import ProfilPic from "./profilpic";

export default function Profile(props) {



    return (
        <div id="profil">

            <ProfilPic profilpic = {props.profilpic}
                showUploader = {props.showUploader}/>
            
            <div className="profildata">
                <h1>Yor Profil</h1>
                <p>Your first name: {props.first}</p>
                <p>Your last name: {props.last}</p>
                <p>Your email: {props.email}</p>
                {props.bio && <p>Your biography: {props.bio}</p>}
                {!props.bio && <p onClick={props.showBio}>Add you biography now</p>}
            </div>

            <div className="profilbuttons">

                {!props.editBioVisible && props.bio && <button onClick={props.showBio}>Edit your biography</button>}

                {props.editBioVisible &&
                <Editbio unShowBio = {props.unShowBio}
                    changeBio = {props.changeBio}
                    bio = {props.bio}/>
                }



            </div>
        </div>
    );
}
