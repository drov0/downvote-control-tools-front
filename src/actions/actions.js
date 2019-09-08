import backend from "../api/backend";
import Cookies from "universal-cookie";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

const utils = require("../api/utils");
var dsteem = require('dsteem');

var client = new dsteem.Client('https://api.steemit.com');



const fetchLogin = () => async (dispatch) => {

    const cookies = new Cookies();

    let logged_user = "";
    if (cookies.get("username") !== undefined && cookies.get("token") !== undefined)
    {
        const response = (await backend.post('/auth/user',
            {username: cookies.get("username"), token: cookies.get("token")})).data;

        if (response.status === "ok") {

            let steem_data = await client.database.getAccounts([cookies.get("username")]);

            steem_data = steem_data[0];

            logged_user = {
                username: cookies.get("username"),
                token: cookies.get("token"),
                steem_data : steem_data,
                voting_power : Math.ceil(utils.getvotingpower(steem_data)*100)/100,
                downvoting_power : Math.ceil(utils.downvotingpower(steem_data)*100)/100,
                threshold : response.threshold,
                min_payout : response.min_payout
            };
        }
    }

    dispatch({
        type: 'FETCH_LOGIN',
        payload: logged_user
    });
};


const login = (data) => async(dispatch) => {

    const cookies = new Cookies();

    let next_week = new Date();

    next_week.setDate(next_week.getDate() + 14);

    let name = data.name;
    let profile_image = "https://steemitimages.com/u/"+name+"/avatar";

    cookies.set('username', data.username, { path: '/', expires : next_week});
    cookies.set('token', data.token, { path: '/', expires : next_week});

    let steem_data = await client.database.getAccounts([data.username]);

    steem_data = steem_data[0];

    let logged_user = {
        username : data.username,
        token : data.token,
        avatar: profile_image,
        steem_data : steem_data,
        voting_power : Math.ceil(utils.getvotingpower(steem_data)*100)/100,
        downvoting_power : Math.ceil(utils.downvotingpower(steem_data)*100)/100,
        threshold : data.threshold,
        min_payout : data.min_payout
    };

    dispatch({
        type: 'LOGIN',
        payload: logged_user
    });
};




const fetchNegativeTrail = (username, token) => async (dispatch) => {

        const response = (await backend.post('/settings/get_trail',
            {username: username, token: token, positive : -1})).data;

        if (response.status === "ok") {
           return dispatch({
                type: 'FETCH_NEGATIVE_TRAIL',
                payload: response.data
            });
        }
};

const fetchPositiveTrail = (username, token) => async (dispatch) => {

        const response = (await backend.post('/settings/get_trail',
            {username: username, token: token, positive : 1})).data;

        if (response.status === "ok") {
           return dispatch({
                type: 'FETCH_POSITIVE_TRAIL',
                payload: response.data
            });
        }
};


const addToTrail = (username, token, trailed, ratio, positive) => async (dispatch) => {

    let account = await client.database.getAccounts([trailed]);


    if (account.length === 0)
    {
        toast.error("User "+ trailed + " doesn't exists")
        return;
    }


    const response = (await backend.post('/settings/add_trail',
        {username: username, token: token, trailed, ratio, positive})).data;

    if (response.status === "ok") {
        return dispatch({
            type: 'ADD_TRAIL',
            payload: {
                username,
                trailed,
                ratio,
                positive
            }
        });
    } else
    {
        if (response.error === "already exists")
        {
            toast.error("This user is already trailed, either in a negative or a normal trail")
        }
    }
};
const removeTrail = (username, token, trailed, positive) => async (dispatch) => {

    const response = (await backend.post('/settings/remove_trail',
        {username: username, token: token, trailed, positive})).data;

    if (response.status === "ok") {
        return dispatch({
            type: 'REMOVE_TRAIL',
            payload: {
                trailed,
                positive
            }
        });
    }
};

const saveThreshold = (username, token, threshold) => async (dispatch) => {

    const response = (await backend.post('/settings/update_threshold',
        {username: username, token: token, threshold})).data;

    if (response.status === "ok") {

        toast.info("Saved");

        return dispatch({
            type: 'SET_THRESHOLD',
            payload: threshold
        });
    }
};

const setThreshold = (threshold) => async (dispatch) => {
        return dispatch({
            type: 'SET_THRESHOLD',
            payload: threshold
        });
};

const setMinPayout = (payout) => async (dispatch) => {
        return dispatch({
            type: 'SET_PAYOUT',
            payload: payout
        });
};


const saveMinPayout = (username, token, payout) => async (dispatch) => {

    const response = (await backend.post('/settings/update_min_payout',
        {username: username, token: token, min_payout : payout})).data;

    if (response.status === "ok") {

        toast.info("Saved");

        return dispatch({
            type: 'SET_PAYOUT',
            payload: payout
        });
    }
};




const logout = (username, token) => async (dispatch) => {
    const cookies = new Cookies();

    cookies.remove("uuid");
    cookies.remove("username");
    cookies.remove("name");
    cookies.remove("avatar");

    await backend.post('/auth/logout', {username: username, token: token});

    dispatch({
        type: 'LOGOUT',
        payload: ""
    });
};



export {

    fetchLogin,
    login,
    fetchNegativeTrail,
    fetchPositiveTrail,
    addToTrail,
    removeTrail,
    saveThreshold,
    setThreshold,
    logout,
    setMinPayout,
    saveMinPayout,

};