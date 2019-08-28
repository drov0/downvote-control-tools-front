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

const dataReducer = (state  = {negative_trail : "", positive_trail : ""}, action) => {

    if (action.type === "FETCH_NEGATIVE_TRAIL")
    {
            let new_state = _.cloneDeep(state);
            new_state.negative_trail = action.payload;
            return new_state
    } else if (action.type === "FETCH_POSITIVE_TRAIL")
    {
        let new_state = _.cloneDeep(state);
        new_state.positive_trail = action.payload;
        return new_state
    } else if (action.type === "ADD_TRAIL")
    {
        let new_state = _.cloneDeep(state);

        let trail = action.payload;

        if (trail.positive === 1) {
            new_state.positive_trail.push(action.payload);
        } else
        {
            new_state.negative_trail.push(action.payload);
        }

        return new_state
    }else if (action.type === "REMOVE_TRAIL")
    {
        let new_state = _.cloneDeep(state);

        let trail = action.payload;

        if (trail.positive === 1) {
            new_state.positive_trail = state.positive_trail.filter(el => el.trailed !== trail.trailed);
        } else {
            new_state.negative_trail = state.negative_trail.filter(el => el.trailed !== trail.trailed);
        }

        return new_state
    }

    return state;

};



export default combineReducers({
    user : userReducer,
    data : dataReducer
})