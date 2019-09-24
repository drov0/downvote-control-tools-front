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
    if (cookies.get("username") !== undefined && cookies.get("token") !== undefined && cookies.get("type") !== undefined)
    {
        const response = (await backend.post('/auth/user',
            {username: cookies.get("username"), token: cookies.get("token"), type : cookies.get("type")})).data;

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
                min_payout : response.min_payout,
                type: cookies.get("type"),

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




const fetchNegativeTrail = (username, token, type) => async (dispatch) => {

        const response = (await backend.post('/settings/get_trail',
            {username: username, token: token, type: type, positive : -1})).data;

        if (response.status === "ok") {
           return dispatch({
                type: 'FETCH_NEGATIVE_TRAIL',
                payload: response.data
            });
        }
};

const fetchPositiveTrail = (username, token, type) => async (dispatch) => {

        const response = (await backend.post('/settings/get_trail',
            {username: username, token: token, type: type, positive : 1})).data;

        if (response.status === "ok") {
           return dispatch({
                type: 'FETCH_POSITIVE_TRAIL',
                payload: response.data
            });
        }
};


const addToTrail = (username, token, type,  trailed, ratio, positive) => async (dispatch) => {

    let account = await client.database.getAccounts([trailed]);

    if (account.length === 0)
    {
        toast.error("User "+ trailed + " doesn't exists");
        return;
    }

    const response = (await backend.post('/settings/add_trail',
        {username: username, token: token, type, trailed, ratio, positive})).data;

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
const removeTrail = (username, token, type, trailed, positive) => async (dispatch) => {

    const response = (await backend.post('/settings/remove_trail',
        {username: username, token: token, type, trailed, positive})).data;

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

const saveThreshold = (username, token, type,  threshold) => async (dispatch) => {

    const response = (await backend.post('/settings/update_threshold',
        {username, token, type, threshold})).data;

    if (response.status === "ok") {

        toast.info("Saved");

        return dispatch({
            type: 'SET_THRESHOLD',
            payload: threshold
        });
    }
};


const saveMinPayout = (username, token, type,  min_payout) => async (dispatch) => {

    const response = (await backend.post('/settings/update_min_payout',
        {username, token, type, min_payout})).data;

    if (response.status === "ok") {

        toast.info("Saved");

        return dispatch({
            type: 'SET_PAYOUT',
            payload: min_payout
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




const logout = (username, token, type) => async (dispatch) => {
    const cookies = new Cookies();

    cookies.remove("login");
    cookies.remove("username");
    cookies.remove("token");

    await backend.post('/auth/logout', {username: username, token: token, type : type});

    dispatch({
        type: 'LOGOUT',
        payload: ""
    });
};



const login_keychain = (username, encrypted_username) => async (dispatch) => {

    let data = (await backend.post('/auth/keychain/login', {username, encrypted_username})).data;

    if (data.status === "ok")
    {
        data = data.account;

        const cookies = new Cookies();

        let next_week = new Date();

        next_week.setDate(next_week.getDate() + 14);

        let profile_image = "https://steemitimages.com/u/"+username+"/avatar";

        cookies.set('username', data.username, { path: '/', expires : next_week});
        cookies.set('token', data.token, { path: '/', expires : next_week});
        cookies.set('type', "keychain", { path: '/', expires : next_week});

        let steem_data = await client.database.getAccounts([username]);

        steem_data = steem_data[0];

        let logged_user = {
            username : username,
            token : data.token,
            avatar: profile_image,
            steem_data : steem_data,
            voting_power : Math.ceil(utils.getvotingpower(steem_data)*100)/100,
            downvoting_power : Math.ceil(utils.downvotingpower(steem_data)*100)/100,
            threshold : data.threshold,
            min_payout : data.min_payout,
            type : "keychain"
        };

        dispatch({
            type: 'LOGIN',
            payload: logged_user
        });
    }



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
    login_keychain

};