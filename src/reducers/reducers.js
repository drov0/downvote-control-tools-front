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
    } else if (action.type === "SET_DV_THRESHOLD" )
    {
        let new_state = _.cloneDeep(state);

        new_state.dv_threshold = action.payload;
        return new_state
    }else if (action.type === "SET_VP_THRESHOLD" )
    {
        let new_state = _.cloneDeep(state);

        new_state.vp_threshold = action.payload;
        return new_state
    } else if (action.type === "SET_PAYOUT" )
    {
        let new_state = _.cloneDeep(state);

        new_state.min_payout = action.payload;
        return new_state
    }

    return state;
};

const dataReducer = (state  = {negative_trail : "", positive_trail : "", counter_trail : "", whitelist : ""}, action) => {

    if (action.type === "FETCH_TRAILS")
    {
        let new_state = _.cloneDeep(state);

        new_state.positive_trail = action.payload.filter(el => el.type === 1);
        new_state.negative_trail = action.payload.filter(el => el.type === -1);
        new_state.counter_trail = action.payload.filter(el => el.type === 2);

        return new_state
    } else if (action.type === "ADD_TRAIL")
    {
        let new_state = _.cloneDeep(state);

        let trail = action.payload;

        if (trail.trail_type === 1) {
            new_state.positive_trail.push(action.payload);
        } else if (trail.trail_type === -1)
        {
            new_state.negative_trail.push(action.payload);
        } else if (trail.trail_type === 2)
        {
            new_state.counter_trail.push(action.payload);
        }

        return new_state
    }else if (action.type === "REMOVE_TRAIL")
    {
        let new_state = _.cloneDeep(state);

        let trail = action.payload;

        if (trail.trail_type === 1)
            new_state.positive_trail = state.positive_trail.filter(el => el.trailed !== trail.trailed);
        else if (trail.trail_type === -1)
            new_state.negative_trail = state.negative_trail.filter(el => el.trailed !== trail.trailed);
        else if (trail.trail_type === 2)
            new_state.counter_trail = state.counter_trail.filter(el => el.trailed !== trail.trailed);

        return new_state
    } else if (action.type === "FETCH_WHITELIST")
    {
        let new_state = _.cloneDeep(state);
        new_state.whitelist = action.payload;
        return new_state
    } else if (action.type === "ADD_WHITELIST")
    {
        let new_state = _.cloneDeep(state);
        new_state.whitelist.push(action.payload);
        return new_state
    } else if (action.type === "REMOVE_WHITELIST")
    {
        let new_state = _.cloneDeep(state);
        new_state.whitelist = state.whitelist.filter(el => el.trailed !== action.payload.trailed);
        return new_state
    }

    return state;

};



export default combineReducers({
    user : userReducer,
    data : dataReducer
})