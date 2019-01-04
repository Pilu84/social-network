import * as io from 'socket.io-client';
import { usersOnline, userJoined, userLeft, newChatText, newPrivatStatus, newPrivatMessage } from "./actions";



let socket;

export function initSocket(store) {
    if(!socket) {
        socket = io.connect();

        socket.on("onlineUsers", listOfOnlineUsers => {
            store.dispatch(usersOnline(listOfOnlineUsers));
        });

        socket.on("newonlineuser", userWhoJoined => {

            store.dispatch(userJoined(userWhoJoined));
        });

        socket.on("leftuser", userWhoLeft => {

            store.dispatch(userLeft(userWhoLeft));
        });

        socket.on("newMessage", newText => {
            store.dispatch(newChatText(newText));
        });

        socket.on("statusMessage", status => {
            store.dispatch(newPrivatStatus(status));
        });

        socket.on("privatchatMessage", newPM => {
            store.dispatch(newPrivatMessage(newPM));
        });

    }
    return socket;
}
