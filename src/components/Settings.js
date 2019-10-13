import React from 'react';
import {connect} from "react-redux";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {} from "../actions/actions"
import {login} from "../actions/actions";
import {fetchLogin} from "../actions/actions";
import {fetchTrails} from "../actions/actions";
import {addToTrail} from "../actions/actions";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {removeTrail} from "../actions/actions";
import {saveThreshold} from "../actions/actions";
import {logout} from "../actions/actions";
import {setMinPayout} from "../actions/actions";
import {saveMinPayout} from "../actions/actions";
import {addToWhitelist} from "../actions/actions";
import {fetchWhitelist} from "../actions/actions";
import {removeWhitelist} from "../actions/actions";
import {setDvThreshold} from "../actions/actions";
import {setVpThreshold} from "../actions/actions";
import {fetchHitlist} from "../actions/actions";
import {removeHitlist} from "../actions/actions";
import {addToHitlist} from "../actions/actions";

const Joi = require('joi');

class Settings extends React.Component
{

    state = {trail_username : "", trail_ratio : 1, hitlist_percent : 50, hitlist_min_payout : 5};


    trailed_schema = Joi.object().keys({
        username: Joi.string().min(3).max(16).required(),
        ratio: Joi.number().min(0.1).max(2.5),
    });

    whitelist_schema = Joi.object().keys({
        username: Joi.string().min(3).max(16).required(),
    });

    hitlist_schema = Joi.object().keys({
        username: Joi.string().min(3).max(16).required(),
        percent: Joi.number().min(0.1).max(100),
        min_payout: Joi.number().min(0.1),
    });

    async componentDidMount() {
        this.props.fetchTrails(this.props.logged_user.username, this.props.logged_user.token, this.props.logged_user.type);
        this.props.fetchWhitelist(this.props.logged_user.username, this.props.logged_user.token, this.props.logged_user.type);
        this.props.fetchHitlist(this.props.logged_user.username, this.props.logged_user.token, this.props.logged_user.type);
    };


    remove_trail = (trailed, type) =>
    {
            this.props.removeTrail(this.props.logged_user.username, this.props.logged_user.token,this.props.logged_user.type, trailed, type);
    };

    remove_whitelist = (author) =>
    {
            this.props.removeWhitelist(this.props.logged_user.username, this.props.logged_user.token,this.props.logged_user.type, author);
    };

    remove_hitlist = (author) =>
    {
            this.props.removeHitlist(this.props.logged_user.username, this.props.logged_user.token,this.props.logged_user.type, author);
    };

    set_threshold = (type) =>
    {
        if (type === "dv")
            this.props.saveThreshold(this.props.logged_user.username, this.props.logged_user.token, this.props.logged_user.type,  this.props.logged_user.dv_threshold, type);
        else if (type === "vp")
            this.props.saveThreshold(this.props.logged_user.username, this.props.logged_user.token, this.props.logged_user.type,  this.props.logged_user.vp_threshold, type);

    };

    save_min_payout = () =>
    {
            this.props.saveMinPayout(this.props.logged_user.username, this.props.logged_user.token, this.props.logged_user.type, this.props.logged_user.min_payout);
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

    render_whitelist = () =>
    {
        let rows = [];
        for (let i = 0; i < this.props.data.whitelist.length; i++) {
            rows.push(<tr>
                <td>{this.props.data.whitelist[i].trailed}</td>
                <td><button className={"btn btn-primary"} onClick={() => this.remove_whitelist(this.props.data.whitelist[i].trailed)}>Delete</button></td>
            </tr>)
        }

        return rows
    };

    render_hitlist = () =>
    {
        let rows = [];
        for (let i = 0; i < this.props.data.hitlist.length; i++) {
            rows.push(<tr>
                <td>{this.props.data.hitlist[i].author}</td>
                <td>{this.props.data.hitlist[i].percent} %</td>
                <td>{this.props.data.hitlist[i].min_payout} $</td>
                <td><button className={"btn btn-primary"} onClick={() => this.remove_hitlist(this.props.data.hitlist[i].author)}>Delete</button></td>
            </tr>)
        }

        return rows
    };

    render_counter_downvote_trail = () =>
    {
        let rows = [];
        for (let i = 0; i < this.props.data.counter_trail.length; i++) {
            rows.push(<tr>
                <td>{this.props.data.counter_trail[i].trailed}</td>
                <td>{this.props.data.counter_trail[i].ratio}</td>
                <td><button className={"btn btn-primary"} onClick={() => this.remove_trail(this.props.data.counter_trail[i].trailed, 2)}>Delete</button></td>
            </tr>)
        }

        return rows

    };

    add_trail = (type) =>
    {
        let test = Joi.validate({username : this.state.trail_username, ratio : this.state.trail_ratio}, this.trailed_schema);
        if (test.error === null)
            this.props.addToTrail(this.props.logged_user.username, this.props.logged_user.token,this.props.logged_user.type, this.state.trail_username, this.state.trail_ratio, type);
        else
            toast.error(test.error.details[0].message);
    };

    add_whitelist = () =>
    {
        let test = Joi.validate({username : this.state.trail_username}, this.whitelist_schema);

        if (test.error === null)
            this.props.addToWhitelist(this.props.logged_user.username, this.props.logged_user.token,this.props.logged_user.type, this.state.trail_username);
        else
            toast.error(test.error.details[0].message);
    };

    add_hitlist = () =>
    {
        let test = Joi.validate({username : this.state.trail_username, percent : this.state.hitlist_percent, min_payout : this.state.hitlist_min_payout}, this.hitlist_schema);

        if (test.error === null)
            this.props.addToHitlist(this.props.logged_user.username, this.props.logged_user.token,this.props.logged_user.type, this.state.trail_username,  this.state.hitlist_percent, this.state.hitlist_min_payout);
        else
            toast.error(test.error.details[0].message);
    };

    logout = () =>
    {
        this.props.logout(this.props.logged_user.username, this.props.logged_user.token, this.props.logged_user.type);
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

                        <h4>Global settings : </h4>

                        <p>Only use automatic downvote votes when power is above :
                        <input type={"number"} style={{width : "60px"}} max={100} min={0} value={this.props.logged_user.dv_threshold} onChange={(e) => this.props.setDvThreshold(e.target.value)}/> % <button onClick={() => this.set_threshold("dv")} className={"btn btn-primary"}>Save</button>
                        </p>
                        <p>If my downvoting power reaches 0, use my voting power to downvote when my power is above :
                        <input type={"number"} style={{width : "60px"}} max={100} min={0} value={this.props.logged_user.vp_threshold} onChange={(e) => this.props.setVpThreshold(e.target.value)}/> % <button onClick={() => this.set_threshold("vp")} className={"btn btn-primary"}>Save</button>
                            <br/><small>This setting also applies when upvoting to counter downvotes</small>
                        </p>

                        <p>Only downvote if the post has more than  :
                        <input type={"number"} style={{width : "60px"}} min={0} value={this.props.logged_user.min_payout} onChange={(e) => this.props.setMinPayout(e.target.value)}/>
                        $ of pending payouts.
                            <button onClick={this.save_min_payout} className={"btn btn-primary"}>Save</button>
                        <br/><small>Posts with 0$ payout won't be downvoted</small>
                        </p>
                        <br/>

                        <Tabs defaultActiveKey="trail" id="modal-tab" transition={false} >

                            <Tab eventKey="trail" title="Trail" >
                                <h5> Follow downvote trail </h5>
                                <p> Allows you to trail the downvotes of a specific account and thus downvote any content they downvote at a given rate relative to the size of their downvote.</p>
                                <p>Example: If you choose to trail <b>@abuse.control</b> with rating 0.75, then if  <b>@abuse.control</b> gives a <b>50%</b> downvote to a post you will give the same post a <b>37.5%</b> downvote.</p>

                                <input type={"text"} placeholder={"username"} value={this.state.trail_username} onChange={(e) => this.setState({trail_username : e.target.value})}/>
                                <input type={"number"} min={0.01} max={2.5} step={0.01} style={{width : "60px"}} value={this.state.trail_ratio} onChange={(e) => this.setState({trail_ratio : e.target.value})}/>
                                <button className={"btn  btn-primary"} onClick={() => this.add_trail(1)}>Add</button>

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

                            <Tab eventKey="counter_upvotes" title="Counter upvotes " >
                                <h5> Counter upvotes </h5>
                                <p> Used to counteract upvotes from specified accounts, meaning that you will downvote anything that they choose to upvote at a given rate relative to their upvote. </p>
                                <p>Example: If you choose to counter upvote <b>@baduser</b>r with rating 1.2, then if <b>@baduser</b> gives a 50% upvote to something, you will add a <b>60%</b> downvote to the same post or comment, while a rating of 0.5 would make you downvote <b>25%</b>, etc.</p>

                                <input type={"text"} placeholder={"username"} value={this.state.trail_username} onChange={(e) => this.setState({trail_username : e.target.value})}/>
                                <input type={"number"} min={0} max={2.5} step={0.1} style={{width : "60px"}} value={this.state.trail_ratio} onChange={(e) => this.setState({trail_ratio : e.target.value})}/>
                                <button className={"btn btn-primary"} onClick={() => this.add_trail(-1)} >Add</button>

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
                            <Tab eventKey="counter_downvotes" title="Counter downvotes " >
                                <h5> Counter downvotes </h5>
                                <p> Used to counteract downvotes from specified accounts, meaning that you will upvote anything that they choose to downvote at a given rate relative to their downvote. </p>
                                <p>Example: If you choose to counter downvote <b>@baduser</b>r with rating 1.2, then if <b>@baduser</b> gives a 50% downvote on something, you will do a <b>60%</b> upvote to the same post or comment, while a rating of 0.5 would make you upvote at <b>25%</b>, etc.</p>

                                <input type={"text"} placeholder={"username"} value={this.state.trail_username} onChange={(e) => this.setState({trail_username : e.target.value})}/>
                                <input type={"number"} min={0} max={2.5} step={0.1} style={{width : "60px"}} value={this.state.trail_ratio} onChange={(e) => this.setState({trail_ratio : e.target.value})}/>
                                <button className={"btn btn-primary"} onClick={() => this.add_trail(2)} >Add</button>

                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Username</th>
                                        <th scope="col">Ratio</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.render_counter_downvote_trail()}

                                    </tbody>
                                </table>
                            </Tab>
                            <Tab eventKey="whitelist" title="Whitelist" >
                                <h5> Whitelist </h5>
                                <p>You won't downvote the users in this list</p>

                                <input type={"text"} placeholder={"username"} value={this.state.trail_username} onChange={(e) => this.setState({trail_username : e.target.value})}/>
                                <button className={"btn btn-primary"} onClick={this.add_whitelist} >Add</button>

                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Username</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.render_whitelist()}

                                    </tbody>
                                </table>
                            </Tab>
                            <Tab eventKey="hitlist" title="Hit list" >
                                <h5> Hist list </h5>
                                <p>Downvote user using x% whenever his post or comment reaches more than y$ (the number of dollar is the one in the global settings) </p>
                                <p>For instance you can configure the tool to downvote user @milkinguser whenever he makes more than 5$ on a post or comment with a 30% downvote</p>
                                Downvote
                                <input type={"text"} placeholder={"username"} value={this.state.trail_username} onChange={(e) => this.setState({trail_username : e.target.value})}/>
                                With a
                                <input type={"number"} style={{width : "60px"}}  min={1} max={100} value={this.state.hitlist_percent} onChange={(e) => this.setState({hitlist_percent : e.target.value})}/>
                                % downvote if his post has a payout superior to
                                <input type={"number"} style={{width : "60px"}}   value={this.state.hitlist_min_payout} onChange={(e) => this.setState({hitlist_min_payout : e.target.value})}/> $

                                <button className={"btn btn-primary"} style={{marginLeft : "5px"}} onClick={this.add_hitlist} >Add</button>

                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">Username</th>
                                        <th scope="col">downvote percent</th>
                                        <th scope="col">Minimum payout</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.render_hitlist()}
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

export default connect(mapStateToProps, {login, logout, fetchLogin,fetchWhitelist, fetchTrails, addToTrail, addToHitlist, removeHitlist, removeTrail, saveThreshold, setDvThreshold, setVpThreshold, setMinPayout, saveMinPayout, addToWhitelist, removeWhitelist, fetchHitlist})(Settings);