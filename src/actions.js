import axios from "./axios";

export async function friends() {
    const { data } = await axios.get('/ownfriends');
    return {
        type: 'FRIENDS_USERS',
        users: data
    };
}

export async function unfriends(id) {

    await axios.post("/friendaction", {action: "delete", id: id});

    return {
        type: "UNFRIEND",
        users_remove: id
    };


}


export async function acceptFriends(id) {
    await axios.post("/friendaction", {action: "accept", id: id});

    return {
        type: "ACCEPT_FRIEND",
        users_add: id
    };


}

export async function userSearch(limit, startId) {
    const { data } = await axios.get("/otherusers", {params: {limit: 3, id: startId}});

    return {
        type: "OTHER_USERS",
        users: data
    };


}

export async function usersOnline(arrUsers) {

    return {
        type: "ONLINE_USERS",
        users: arrUsers
    };

}

export async function userJoined(newUser) {

    return {
        type: "NEW_ONLINE_USER",
        users: newUser
    };
}


export function userLeft(data) {
    return {
        type: "USER_LEFT",
        id: data
    };
}

export async function messages() {
    const { data } = await axios.get("/chatmessage");

    return {
        type: "CHAT_MESSAGE",
        data: data
    };
}

export async function privatMessages(id) {
    const { data } = await axios.get("/privatmessage/" + id);

    return {
        type: "PRIVAT_CHAT_MESSAGE",
        data: data
    };
}

export function newChatText(data) {
    return {
        type: "NEW_CHAT_MESSAGE",
        data: data
    };
}

export function newPrivatStatus(status) {
    return {
        type: "CHAT_IN_DATABASE",
        status: status
    };
}

export function newPrivatMessage(text) {
    return {
        type: "NEW_PRIVAT_MESSAGE",
        text: text
    };
}
