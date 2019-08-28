import React from 'react';
import {connect} from "react-redux";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {} from "../actions/actions"
import Login from "./Login";
import {login} from "../actions/actions";
import {fetchLogin} from "../actions/actions";
const queryString = require('query-string');

const Joi = require('joi');

class Settings extends React.Component
{

    state = {vote_threshold : 98, new_n_trail_username : "", new_n_trail_ratio : 1}

    async componentDidMount() {
    }


    render_negative_trails = () =>
    {
        let rows = [];

        for (let i = 0; i < 5; i++) {
            rows.push(<tr>
                <td>Howo</td>
                <td>2</td>
                <td><button className={"btn btn-primary"}>Delete</button></td>
            </tr>)
        }


        return rows

    };

    render_positive_trails = () =>
    {
        let rows = [];

        for (let i = 0; i < 5; i++) {
            rows.push(<tr>
                <td>Howo</td>
                <td>2</td>
                <td><button className={"btn btn-primary"}>Delete</button></td>
            </tr>)
        }


        return rows

    };

    render() {


            return (
                <div>
                    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                        <a className="navbar-brand" href="#">Downvote Control Tool</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                            <ul className="navbar-nav mr-auto">
                                <a href={"https://steemit.com/@howo"} target={"_blank"}> A tool by @howo</a>
                            </ul>

                        </div>
                    </nav>

                    <main role="main" className="container">
                        <h3> Welcome {this.props.logged_user.username}</h3>
                        <p> Your current voting power is : {this.props.logged_user.voting_power} % <br/>
                        Your current downvoting power is : {this.props.logged_user.downvoting_power} %</p>
                        <br/>

                        <h4>Settings : </h4>

                        <p>Execute votes when my downvoting power reaches :
                        <input type={"number"} style={{width : "60px"}} max={100} min={0} value={this.state.vote_threshold} onChange={(e) => this.setState({vote_threshold : e.target.value})}/> %
                        </p>

                        <Tabs defaultActiveKey="negative_trail" id="modal-tab" transition={false} >
                            <Tab eventKey="negative_trail" title="Negative_trail" >
                                <h5> Negative trails </h5>
                                <p> Select the accounts you want to follow the votes but in reverse <br /> if you negative trail <b>baduser</b> and <b>baduser</b> votes at 50% on something, you will downvote at <b>50%</b> <br/>
                                    The <b>ratio</b> parameters define how you want to follow the vote, if you set it to <b>0.5</b>  you'll downvote at half the power, if it's <b>2</b> you'll downvote with twice the power
                                </p>

                                <input type={"text"} placeholder={"username"} value={this.state.new_n_trail_username} onChange={(e) => this.setState({new_n_trail_username : e.target.value})}/> <input type={"number"} min={0} max={2.5} step={0.1} style={{width : "60px"}} value={this.state.new_n_trail_ratio} onChange={(e) => this.setState({new_n_trail_ratio : e.target.value})}/> <button className={"btn  btn-primary"}>Add</button>

                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Username</th>
                                        <th scope="col">Ratio</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.render_negative_trails()}

                                    </tbody>
                                </table>
                            </Tab><Tab eventKey=" trail" title="Trail" >
                                <h5> Trail : </h5>
                                <p> Select the accounts you want to follow the downvotes  <br /> if you negative trail <b>user</b> and <b>user</b> downvotes at 50% on something, you will downvote at <b>50%</b> <br/>
                                    The <b>ratio</b> parameters define how you want to follow the vote, if you set it to <b>0.5</b>  you'll downvote at half the power, if it's <b>2</b> you'll downvote with twice the power
                                </p>
                            <input type={"text"} placeholder={"username"} value={this.state.new_n_trail_username} onChange={(e) => this.setState({new_n_trail_username : e.target.value})}/> <input type={"number"} min={0} max={2.5} step={0.1} style={{width : "60px"}} value={this.state.new_n_trail_ratio} onChange={(e) => this.setState({new_n_trail_ratio : e.target.value})}/> <button className={"btn  btn-primary"}>Add</button>

                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">Username</th>
                                    <th scope="col">Ratio</th>
                                    <th scope="col">Delete</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.render_positive_trails()}

                                </tbody>
                            </table>

                            </Tab>

                        </Tabs>


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