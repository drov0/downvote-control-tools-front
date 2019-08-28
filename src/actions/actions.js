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
    if (cookies.get("name") !== undefined && cookies.get("username") !== undefined && cookies.get("avatar") !== undefined && cookies.get("token") !== undefined)
    {
        const response = (await backend.post('/auth/user',
            {username: cookies.get("username"), token: cookies.get("token")})).data;

        if (response.status === "ok") {

            let steem_data = await client.database.getAccounts([cookies.get("username")]);

            steem_data = steem_data[0]

            logged_user = {
                token: cookies.get("token"),
                username: cookies.get("username"),
                name: cookies.get("name"),
                avatar: cookies.get("avatar"),
                steem_data : steem_data,
                voting_power : Math.ceil(utils.getvotingpower(steem_data)*100)/100,
                downvoting_power : Math.ceil(utils.downvotingpower(steem_data)*100)/100

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
    let profile_image = "./img/default.png";

    if (data.json_metadata.profile !== undefined && data.json_metadata.profile.name !== undefined && data.json_metadata.profile.profile_image !== undefined)
    {
        name = data.json_metadata.profile.name;
        profile_image = data.json_metadata.profile.profile_image
    }

    cookies.set('token', data.token, { path: '/', expires : next_week});
    cookies.set('username', data.name, { path: '/', expires : next_week});
    cookies.set('name',name , { path: '/', expires : next_week});
    cookies.set('avatar',profile_image , { path: '/', expires : next_week});


    let steem_data = await client.database.getAccounts([data.username]);


    let logged_user = {
        token : data.token,
        username : data.name,
        name : name,
        avatar: profile_image,
        license : data.license,
        steem_data : steem_data,
        voting_power : utils.getvotingpower(steem_data),
        downvoting_power : utils.downvotingpower(steem_data)
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
    }
};


export {

    fetchLogin,
    login,
    fetchNegativeTrail,
    fetchPositiveTrail,
    addToTrail
};