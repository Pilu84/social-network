export default function(state = {}, action ) {


    if (action.type == "FRIENDS_USERS") {

        state = {...state,
            users: action.users
        };
    }

    if (action.type == "UNFRIEND") {
        state = {...state,
            users: state.users.filter(user => {
                if (user.fid != action.users_remove) {

                    return user;
                }
            })
        };
    }

    if (action.type == "ACCEPT_FRIEND") {

        state = {...state,
            users: state.users.filter(user => {
                if (user.fid == action.users_add) {

                    return user.accepted = true;
                } else {
                    return user;
                }
            })};
    }

    if (action.type == "OTHER_USERS") {

        state = {...state,
            search_users: action.users,
        };
    }


    if (action.type == "ONLINE_USERS") {

        state = {...state,
            online_users: action.users
        };
    }

    if (action.type == "NEW_ONLINE_USER") {

        state = {...state,
            online_users: [...state.online_users, ...action.users]};
    }

    if (action.type == "USER_LEFT") {

        state = {
            ...state,
            online_users: state.online_users.filter(user => {
                if (user.id != action.id) {
                    return user;
                }
            })
        };
    }

    if(action.type == "ADD_ANIMALS") {
        return {
            ...state,
            catnipCuteAnimals: action.cuteAnimals
        };
    }

    if (action.type == "CHAT_MESSAGE") {
        return {
            ...state,
            chatsMessages: action.data
        };
    }


    if (action.type == "NEW_CHAT_MESSAGE") {

        return {
            ...state,
            chatsMessages: [...state.chatsMessages, ...action.data]
        };
    }

    if (action.type == "CHAT_IN_DATABASE") {

        return {
            ...state,
            status: action.status
        };
    }

    if (action.type == "PRIVAT_CHAT_MESSAGE") {
        console.log("az action.data: ", action.data);
        return {
            ...state,
            messages: action.data.msg,
            chatid: action.data.chatid
        };
    }

    if (action.type == "NEW_PRIVAT_MESSAGE") {

        return {
            ...state,
            messages: [...state.messages, {text: action.text.text,
                id: action.text.id}]
        };
    }

    console.log("a state: ", state);
    return state;
}
