import React from 'react';
import {connect} from "react-redux";

import {} from "../actions/actions"
import Login from "./Login";
const queryString = require('query-string');

class MainPage extends React.Component
{

    login_refresh = (event) =>
    {
        // TODO : production url
        if (event.origin !== "http://localhost:4002"  && event.origin !== "PRODUCTION")
            return;

        let data = {};

        try {
            data = JSON.parse(event.data);
            this.props.login(data);
        } catch (e) {
        }
    };


    async componentDidMount() {
        const params = queryString.parse(this.props.location.search);

        window.addEventListener("message", this.login_refresh);
    }



    render() {
            return (
                <Login/>
            )
    }

}


const mapStateToProps = (state) => {
    return {
        logged_user : state.user,
    };
};

export default connect(mapStateToProps, {})(MainPage);