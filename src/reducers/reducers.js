import {combineReducers} from "redux";
import {toast} from "react-toastify";

const _ = require('lodash');

const userReducer = (state  = "", action) => {

    if (action.type === "LOGIN")
    {

        let user = action.payload;

        if (user.license !== undefined) {

            let license = user.license;
            if (license !== "") {
                for (let i = 0; i < license.subscribers.length; i++) {
                    license.subscribers[i].beneficiaries = JSON.parse(license.subscribers[i].beneficiaries);
                }
                user.license = license;
            }
        }
        return user;
    } else if (action.type === "FETCH_LOGIN" )
    {
        return action.payload;
    }
    else if (action.type === "LOGOUT")
    {
        return ""
    } else if (action.type === "FETCH_LICENSE")
    {

        let license = action.payload;
        if (license !== "") {
            for (let i = 0; i < license.subscribers.length; i++) {
                license.subscribers[i].beneficiaries = JSON.parse(license.subscribers[i].beneficiaries);
            }
        }

        return {...state, license : license};
    }
    else if (action.type === "NEW_SUBSCRIBER")
    {

        if (state.license.subscribers.filter(el => el.username === action.payload).length !== 0)
        {
            toast.error(`${action.payload} is already in your authors`);
            return state;
        }

        let license = _.cloneDeep(state.license);
        let new_sub = _.cloneDeep(state.license.subscribers.filter(el => el.username === "default"));

        new_sub = new_sub[0];
        new_sub.username = action.payload;

        license.subscribers.push(new_sub);


        return {...state, license : license};
    } else if (action.type === "DELETE_SUBSCRIBER")
    {
        let license = _.cloneDeep(state.license);
        license.subscribers = license.subscribers.filter(el => el.username !== action.payload);

        return {...state, license : license};
    }else if (action.type === "FETCH_EARNINGS")
    {
        return {...state, earnings : action.payload};
    }

    return state;
};


export default combineReducers({
    user : userReducer,
})