import React from 'react';
import {connect} from "react-redux";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {} from "../actions/actions"
import Login from "./Login";
import {login} from "../actions/actions";
import {fetchLogin} from "../actions/actions";
import {fetchNegativeTrail} from "../actions/actions";
import {fetchPositiveTrail} from "../actions/actions";
import {addToTrail} from "../actions/actions";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {removeTrail} from "../actions/actions";
import {saveThreshold} from "../actions/actions";
import {setThreshold} from "../actions/actions";
import {logout} from "../actions/actions";

const Joi = require('joi');

class Settings extends React.Component
{

    state = {trail_username : "", trail_ratio : 1};


    trailed_schema = Joi.object().keys({
        username: Joi.string().min(3).max(16).required(),
        ratio: Joi.number().min(0.1).max(2.5),
    });

    async componentDidMount() {
        this.props.fetchNegativeTrail(this.props.logged_user.username, this.props.logged_user.token );
        this.props.fetchPositiveTrail(this.props.logged_user.username, this.props.logged_user.token );
    }


    remove_trail = (trailed, positive) =>
    {
            this.props.removeTrail(this.props.logged_user.username, this.props.logged_user.token, trailed, positive);
    };

    set_threshold = () =>
    {
            this.props.saveThreshold(this.props.logged_user.username, this.props.logged_user.token, this.props.logged_user.threshold);
    };


    render_negative_trails = () =>
    {
        let rows = [];
        for (let i = 0; i < this.props.data.negative_trail.length; i++) {
            rows.push(<tr>
                <td>{this.props.data.negative_trail[i].trailed}</td>
                <td>{this.props.data.negative_trail[i].ratio}</td>
                <td><button className={"btn btn-primary"} onClick={() => this.remove_trail(this.props.data.negative_trail[i].trailed, -1)}>Delete</button></td>
            </tr>)
        }

        return rows

    };

    render_positive_trails = () =>
    {
        let rows = [];
        for (let i = 0; i < this.props.data.positive_trail.length; i++) {
            rows.push(<tr>
                <td>{this.props.data.positive_trail[i].trailed}</td>
                <td>{this.props.data.positive_trail[i].ratio}</td>
                <td><button className={"btn btn-primary"} onClick={() => this.remove_trail(this.props.data.positive_trail[i].trailed, 1)}>Delete</button></td>
            </tr>)
        }

        return rows

    };


    add_positive_trail= () =>
    {


        let test = Joi.validate({username : this.state.trail_username, ratio : this.state.trail_ratio}, this.trailed_schema);


        if (test.error === null) {

            this.props.addToTrail(this.props.logged_user.username, this.props.logged_user.token, this.state.trail_username, this.state.trail_ratio, 1);
        } else
        {
            toast.error(test.error.details[0].message);
        }
    };

    add_negative_trail= () =>
    {
        let test = Joi.validate({username : this.state.trail_username, ratio : this.state.trail_ratio}, this.trailed_schema);

        if (test.error === null) {

            this.props.addToTrail(this.props.logged_user.username, this.props.logged_user.token, this.state.trail_username, this.state.trail_ratio, -1);
        } else
        {
            toast.error(test.error.details[0].message);
        }
    };

    logout = () =>
    {
        this.props.logout(this.props.logged_user.username, this.props.logged_user.token);
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
                                <a href={"#"} onClick={this.logout}>logout</a>
                            </ul>

                        </div>
                    </nav>

                    <main role="main" className="container">
                        <h3> Logged in as :  {this.props.logged_user.username}</h3>
                        <p> Current voting power is : {this.props.logged_user.voting_power} % <br/>
                            Current downvoting power is : {this.props.logged_user.downvoting_power} %</p>
                        <br/>

                        <h4>Settings : </h4>

                        <p>Only use automatic downvote votes when power is above :
                        <input type={"number"} style={{width : "60px"}} max={100} min={0} value={this.props.logged_user.threshold} onChange={(e) => this.props.setThreshold(e.target.value)}/> % <button onClick={this.set_threshold} className={"btn btn-primary"}>Save</button>
                        </p>

                        <Tabs defaultActiveKey="trail" id="modal-tab" transition={false} >

                            <Tab eventKey="trail" title="Trail" >
                                <h5> Follow downvote trail </h5>
                                <p> Allows you to trail the downvotes of a specific account and thus downvote any content they downvote at a given rate relative to the size of their downvote.</p>
                                <p>Example: If you choose to trail <b>@abuse.control</b> with rating 0.75, then if  <b>@abuse.control</b> gives a <b>50%</b> downvote to a post you will give the same post a <b>25%</b> downvote.</p>


                                <input type={"text"} placeholder={"username"} value={this.state.trail_username} onChange={(e) => this.setState({trail_username : e.target.value})}/>
                                <input type={"number"} min={0} max={2.5} step={0.01} style={{width : "60px"}} value={this.state.trail_ratio} onChange={(e) => this.setState({trail_ratio : e.target.value})}/>
                                <button className={"btn  btn-primary"} onClick={this.add_positive_trail}>Add</button>

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

                            <Tab eventKey="negative_trail" title="Negative trail" >
                                <h5> Counter upvotes </h5>
                                <p> Used to counteract upvotes from specified accounts, meaning that you will downvote anything that they choose to upvote at a given rate relative to their upvote. </p>
                                <p>Example: If you choose to counter upvote <b>@baduser</b>r with rating 1.2, then if <b>@baduser</b> gives a 50% upvote to something, you will add a <b>60%</b> downvote to the same post or comment, while a rating of 0.5 would make you downvote <b>25%</b>, etc.</p>

                                <input type={"text"} placeholder={"username"} value={this.state.trail_username} onChange={(e) => this.setState({trail_username : e.target.value})}/>
                                <input type={"number"} min={0} max={2.5} step={0.1} style={{width : "60px"}} value={this.state.trail_ratio} onChange={(e) => this.setState({trail_ratio : e.target.value})}/>
                                <button className={"btn btn-primary"} onClick={this.add_negative_trail} >Add</button>

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
        data : state.data,
    };
};

export default connect(mapStateToProps, {login, logout, fetchLogin, fetchNegativeTrail, fetchPositiveTrail, addToTrail, removeTrail, saveThreshold, setThreshold})(Settings);