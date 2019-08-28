import React from 'react';
import {connect} from "react-redux";

import {} from "../actions/actions"
import Login from "./Login";
import {login} from "../actions/actions";
import {fetchLogin} from "../actions/actions";
const queryString = require('query-string');


class Settings extends React.Component
{


    async componentDidMount() {
    }



    render() {


            return (
                <div>
                    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                        <a className="navbar-brand" href="#">Navbar</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Link</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled" href="#" tabIndex="-1"
                                       aria-disabled="true">Disabled</a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="dropdown01"
                                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                                    <div className="dropdown-menu" aria-labelledby="dropdown01">
                                        <a className="dropdown-item" href="#">Action</a>
                                        <a className="dropdown-item" href="#">Another action</a>
                                        <a className="dropdown-item" href="#">Something else here</a>
                                    </div>
                                </li>
                            </ul>

                        </div>
                    </nav>

                    <main role="main" className="container">
                        <h3> Welcome {this.props.logged_user.username}</h3>
                        <p> Your current voting power is : {this.props.logged_user.voting_power} %</p>
                        <p> Your current downvoting power is : {this.props.logged_user.downvoting_power} %</p>
                        <div className="row">
                            <div className={"col"}>

                            </div>

                        </div>

                    </main>
                </div>
            )

    }

}


const mapStateToProps = (state) => {
    return {
        logged_user : state.user,
    };
};

export default connect(mapStateToProps, {login, fetchLogin})(Settings);