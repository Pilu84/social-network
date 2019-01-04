const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const db = require("./db");
const csurf = require("csurf");
const bcrypt = require("./cript");
const s3 = require("./s3");
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: 'localhost:8080' });
var ownId = "";


var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(bodyParser.json());



const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});


app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});



app.use(express.static("./public"));
app.use(express.static("./uploads"));
app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}


app.post("/registration", (req, res) => {

    bcrypt.hash(req.body.password).then(hash => {
        db.createUser(req.body.first, req.body.last, req.body.email, hash)
            .then(results => {
                req.session.id = results.rows[0].id;
                res.json({succes: true});
            })
            .catch(err => {

                if(err.detail == `Key (email)=(${req.body.email}) already exists.`) {
                    res.json({succes: false,
                        errorText: true});
                }
                console.log("error by user write: ", err);
                res.json({succes: false});
            });
    }).catch(err => {
        console.log("error by hash the password: ", err);
        res.json({succes: false});
    });
});

app.post("/login", (req, res) => {
    db.loginUser(req.body.email).then(results => {
        bcrypt.compare(req.body.password, results.rows[0].password).then(login => {
            if (login === true) {
                req.session.id = results.rows[0].id;
                res.json({succes: true});
            } else {
                res.json({succes: false});
            }
        });
    }).catch(err => {
        console.log(err);
        res.json({succes: false});
    });
});

app.post("/editbio", async (req, res) => {
    const data = await db.updateBio(req.session.id, req.body.bio);


    res.json({succes: true, data: data.rows});
});

app.get("/user", async (req, res) => {

    const data = await db.userInfo(req.session.id);

    res.json(data.rows);

});


app.get("/ownfriends", async (req, res) => {


    const results = await db.getFriend(req.session.id);

    res.json(results.rows);
});

app.get("/otherusers", async (req, res) => {
    const results = await db.usersInfo(req.query.limit, req.session.id);

    res.json(results.rows);
});

app.get("/moreuser", async (req, res) => {

    const results = await db.getMoreUser(req.query.limit, req.query.id, req.session.id);


    res.json(results.rows);
});


app.post("/searchwithname", async (req, res) => {
    let searchText = "%" + req.body.username + "%";
    const results = await db.searchUserByName(searchText);

    res.json(results.rows);
});

app.get("/others/:id", async(req, res) => {
    try {
        if(req.params.id != req.session.id) {

            const results = await db.userInfo(req.params.id);

            res.json(results.rows);
        } else {

            res.json({succes: true});

        }
    } catch (err) {
        console.log(err);
        res.json({succes: true});
    }

});

app.get("/checkfriend/:id", async(req, res) => {
    const results = await db.friendInfo(req.session.id, req.params.id);

    res.json(results.rows);
});

app.get("/chatmessage", async (req, res) => {
    const results = await db.getMessages();
    const reversed = await makeRev(results.rows);



    res.json(reversed);
});
function makeRev(result) {
    return result.reverse();
}

app.get("/privatmessage/:oid", async(req, res) => {

    const results = await db.getPrivatMessages(req.session.id, req.params.oid);

    if(results.rows.length != 0) {

        var message = JSON.parse(results.rows[0].messages);

        res.json({msg: message, chatid : results.rows[0].id});
    } else {

        db.newPMinsert(req.session.id, req.params.oid).then(result => {

            db.updatePrivatMessage(result.rows[0].id, "text").then(() => {

                var text = '[{"id": ' + req.session.id + ',"text": ""},{"id": ' + req.params.oid + ',"text": ""}]';

                db.makeFirst(result.rows[0].id, text).then(() => {
                    var message = JSON.parse(text);

                    res.json({msg: message, chatid : result.rows[0].id});
                });

            });

        });
    }


});


app.post("/friendaction", async(req, res) => {

    var results = "";
    if(req.body.action == "request") {

        results = await db.friendShipSet(req.body.otherId, req.session.id);
        res.json({action: "request", results:results.rows});
    } else if (req.body.action == "delete") {
        results = await db.friendshipDelete(req.body.id);
        res.json({succes: true});

    } else if (req.body.action == "remove") {
        results = await db.friendshipDelete(req.body.id);
        res.json({succes: true});

    } else if (req.body.action == "accept") {

        results = await db.friendRequestUpdate(req.body.id);
        res.json({action: "accepted", results: results.rows});

    }

});



app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    if(req.file) {
        const s3 = require("./config.json");
        var fileurl = s3.s3Url + req.file.filename;

        db.uploadPicture(fileurl, req.session.id).then(results => {
            if (results.rows) {
                res.json({succes: true,
                    pic: results.rows[0].profilpic});
            }
        }).catch(err => {
            res.json({succes: false});
            console.log("error by writing database: ", err);
        });
    }
});

app.get('/welcome', function(req, res) {
    if (req.session.id) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});


app.get("/logout", (req, res) => {

    req.session = null;
    res.redirect("/welcome");
});



//the lasts
app.get('*', function(req, res) {
    if (!req.session.id) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
        ownId = req.session.id;

    }
});
server.listen(8080, function() {
    console.log("I'm listening.");
});



let onlineUsers = {};



io.on('connection', function(socket) {



    let socketId = socket.id;
    let userId = socket.request.session.id;

    db.userInfo(userId).then(results => {
        socket.broadcast.emit("newonlineuser", results.rows);
    });


    onlineUsers[socketId] = userId;

    let arrOfIds = Object.values(onlineUsers);


    var newArrofIds = arrOfIds.slice(0, -1);
    db.getUsersByIds(newArrofIds).then(results => {
        socket.emit("onlineUsers", results.rows);
    });


    socket.on("disconnect", () => {
        if (Object.values(onlineUsers).includes(userId)) {
            delete onlineUsers[socketId];
            if (!Object.values(onlineUsers).includes(userId)) {
                socket.broadcast.emit("leftuser", userId);
            }

        }
    });

    socket.on("chatMessage", msg => {

        db.setMessage(socket.request.session.id, msg).then(results => {


            db.getMessageInfo(results.rows[0].id).then(data => {

                io.sockets.emit("newMessage", data.rows);
            });

        });
    });


    socket.on("privatchatMessage", msge => {
        console.log(msge);
    });


    socket.on("privatchatMessageToData", msg => {

        var toBack = {id: msg.idToBack, text: msg.messageToBack};
        var socketIdToSend;
        for (var key in onlineUsers) {
            if (onlineUsers.hasOwnProperty(key)) {

                if(onlineUsers[key] == msg.idToBack) {
                    socketIdToSend = key;
                }
            }
        }

        io.to(socketIdToSend).emit("privatchatMessage", toBack);

        socket.emit("privatchatMessage", toBack);
        let chatidDataBase = msg.chatid;
        // console.log(chatidDataBase);
        // if(chatidDataBase == "") {
        //     db.newPMinsert(msg.idToBack, msg.id).then(results => {
        //         chatidDataBase = results.id;
        //     });
        // }

        db.updatePrivatMessage(chatidDataBase, msg.text).then(() => {
            socket.emit("statusMessage", "true");
        }).catch(err => {
            console.log(err);
            socket.emit("statusMessage", "false");
        });
    });


});
