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
                        <h3> Welcome {this.props.logged_user.username}</h3>
                        <p> Your current voting power is : {this.props.logged_user.voting_power} % <br/>
                        Your current downvoting power is : {this.props.logged_user.downvoting_power} %</p>
                        <br/>

                        <h4>Settings : </h4>

                        <p>Execute votes when my downvoting power reaches :
                        <input type={"number"} style={{width : "60px"}} max={100} min={0} value={this.props.logged_user.threshold} onChange={(e) => this.props.setThreshold(e.target.value)}/> % <button onClick={this.set_threshold} className={"btn btn-primary"}>Save</button>
                        </p>

                        <Tabs defaultActiveKey="negative_trail" id="modal-tab" transition={false} >
                            <Tab eventKey="negative_trail" title="Negative trail" >
                                <h5> Negative trails </h5>
                                <p> Select the accounts you want to follow the votes but in reverse, this is useful to counter votes.<br /> if you negative trail <b>baduser</b> and <b>baduser</b> votes at 50% on something, you will downvote at <b>50%</b> <br/>
                                    The <b>ratio</b> parameters define how you want to follow the vote, if you set it to <b>0.5</b>  you'll downvote at half the power, if it's <b>2</b> you'll downvote with twice the power
                                </p>

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
                            </Tab><Tab eventKey=" trail" title="Trail" >
                                <h5> Trail : </h5>
                                <p> Select the accounts you want to follow the downvotes  <br /> if you negative trail <b>user</b> and <b>user</b> downvotes at 50% on something, you will downvote at <b>50%</b> <br/>
                                    The <b>ratio</b> parameters define how you want to follow the vote, if you set it to <b>0.5</b>  you'll downvote at half the power, if it's <b>2</b> you'll downvote with twice the power
                                </p>
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