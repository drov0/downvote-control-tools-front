import {combineReducers} from "redux";

const _ = require('lodash');

const userReducer = (state  = "", action) => {

    if (action.type === "LOGIN")
    {

        return action.payload;
    } else if (action.type === "FETCH_LOGIN" )
    {

        return action.payload;
    }else if (action.type === "LOGOUT")
    {
        return ""
    } else if (action.type === "SET_THRESHOLD" )
    {
        let new_state = _.cloneDeep(state);

        new_state.threshold = action.payload;
        return new_state
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