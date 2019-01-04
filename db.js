const spicedPg = require('spiced-pg');

const db = spicedPg(`postgres:postgres:postgres@localhost:5432/socialnetwork`);


exports.createUser = (first, last, email, pass) => {
    return db.query(
        `INSERT INTO users (first_name, last_name, email, password)
                VALUES ($1, $2, $3, $4)
                RETURNING id`,

        [first, last, email, pass]
    );
};

exports.loginUser = email => {
    return db.query(
        `SELECT * FROM users WHERE email = $1`,

        [email]
    );
};


exports.userInfo = id => {
    return db.query( `SELECT id, first_name, last_name, email, bio, profilpic FROM users WHERE id = $1`,
        [id]
    );
};


exports.uploadPicture = (file, id) => {
    return db.query(`UPDATE users SET profilpic = $1 WHERE id = $2
                        RETURNING profilpic`,

    [file, id]);
};

exports.updateBio = (id, bio) => {
    return db.query(`UPDATE users SET bio = $2 WHERE id = $1
                        RETURNING bio`,

    [id, bio]);
};

exports.usersInfo = (limit, ownuserid) => {
    return db.query(`SELECT first_name, last_name, email, bio, profilpic, id, (
                        SELECT COUNT(id) AS count FROM users)
                        FROM users
                        WHERE NOT id = $2
                        ORDER BY id DESC
                    LIMIT $1`,

    [limit, ownuserid]);
};


exports.getMoreUser = (limit, startid, ownid) => {
    return db.query(`SELECT first_name, last_name, email, bio, profilpic, id, (
                        SELECT COUNT(id) AS count FROM users WHERE NOT id = $3 AND id < $2)
                        FROM users
                        WHERE NOT id = $3 AND id < $2
                        ORDER BY id DESC
                    LIMIT $1`,

    [limit, startid, ownid]);
};

exports.friendInfo = (firstid, secondid) => {
    return db.query(`SELECT * FROM friendships WHERE
                        (receiver_id = $1 AND sender_id = $2) OR
                        (receiver_id = $2 AND sender_id = $1)`,

    [firstid, secondid]);
};

exports.friendRequestUpdate = (id) => {
    return db.query (`UPDATE friendships SET accepted = true WHERE id = $1
                    RETURNING *`,
    [id]
    );
};

exports.friendshipDelete = (id) => {
    return db.query (`DELETE FROM friendships WHERE id = $1`,

        [id]);
};

exports.friendShipSet = (firstid, secondid) => {
    return db.query(`INSERT INTO friendships (receiver_id, sender_id, accepted)
                    VALUES ($1, $2, 'false')
                    RETURNING *`,

    [firstid, secondid]);
};

exports.getFriend = (id) => {
    return db.query(`SELECT users.id, users.first_name, users.last_name, users.profilpic, accepted, sender_id, friendships.id AS fid
                    FROM friendships
                    JOIN users
                    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
                    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
                    OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
                    OR (accepted = false AND sender_id = $1 AND receiver_id = users.id)
                    `,

    [id]);
};

exports.getUsersByIds = (arrayOfIds) => {
    return db.query(`SELECT id, first_name, last_name, profilpic FROM users WHERE id = ANY($1)`,

        [arrayOfIds]);

};

exports.getMessages = () => {
    return db.query(`SELECT users.id, users.first_name, users.last_name, users.profilpic, chats.message_text, chats.created_at, chats.id AS chatid
                    FROM chats
                    JOIN users
                    ON (users.id = chats.sender_id)
                    ORDER BY created_at DESC LIMIT 10`);
};


exports.setMessage = (id, msg) => {
    return db.query(`INSERT INTO chats (sender_id, message_text) VALUES ($1, $2)
                    RETURNING id`,

    [id, msg]);

};

exports.getMessageInfo = id => {
    return db.query(`SELECT users.id, users.first_name, users.last_name, users.profilpic, chats.message_text, chats.created_at, chats.id AS chatid
                    FROM chats
                    JOIN users
                    ON(users.id = chats.sender_id)
                    WHERE chats.id = $1`,

    [id]);
};


exports.searchUserByName = name => {
    return db.query(`SELECT id, first_name, last_name, profilpic FROM users WHERE first_name LIKE $1 OR last_name LIKE $1`,

        [name]);
};


exports.getPrivatMessages = (id, oid) => {
    return db.query(`
    SELECT * FROM chats_meta WHERE pid = (
                SELECT id
                FROM privat_chats
                WHERE u_id = $1 AND u2_id = $2
                OR u2_id = $1 AND u_id = $2)`,

    [id, oid]);
};

exports.updatePrivatMessage = (chatid, message) => {


    return db.query(`UPDATE chats_meta SET messages = $2 WHERE id = $1`,

        [chatid, message]);
};

exports.newPMinsert = (id, otherid) => {
    return db.query(`INSERT INTO privat_chats (u_id, u2_id) VALUES ($1, $2)
                        RETURNING id`,

    [id, otherid]);
};


exports.makeFirst = (id, text) => {
    return db.query(`INSERT INTO chats_meta (pid, messages) VALUES ($1, $2)`,

        [id, text]);
};
