import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {unShow:  props.unShowUploader, changeUrl: props.changeProfilUrl};


    }



    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        });

    }

    handleSubmit(e) {
        e.preventDefault();



        var formData = new FormData();
        formData.append("file", this.state.file);


        axios.post("/upload", formData).then(({data}) => {

            if(data.succes) {
                this.state.unShow();
                this.state.changeUrl(data.pic);
            }
        });

    }

    render() {
        return (
            <div className="uploaderbg">
                <div className="uploader-container">
                    <div onClick={this.state.unShow} className="escape"><img src="/black_x.svg" /></div>
                    <h1>Upload an image</h1>
                    <form onSubmit = {this.handleSubmit}>
                        <input onChange = { this.handleChange } name="file" type = "file" accept = "image/*" />
                        <button>Upload</button>
                    </form>
                </div>
            </div>
        );
    }
}
