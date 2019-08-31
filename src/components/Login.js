import React from "react";
import {login} from "../actions/actions"
import {connect} from "react-redux";

class LoginParking extends React.Component {

    state = {username : "", posting_key : "", email : "", password : "", error : "", loginType : "email"};

    login_steemconnect = () =>
    {
        // TODO : fix produciton url
        window.open(process.env.NODE_ENV ===  "production" ? 'https://back.downvotecontrol.com/auth' : "http://localhost:4002/auth",'',' scrollbars=yes,menubar=no,width=447,height=614, resizable=yes,toolbar=no,location=no,status=no')
    };

    render() {
        return (
            <div className="wrapper fadeInDown">
                <div id="formContent">

                    <div className="fadeIn first">
                        <img src="./Steem_Symbol_Gradient.png" alt="steem icon" style={{width : "150px"}}/>
                    </div>

                    <button type={"button"} className="btn btn-primary " onClick={this.login_steemconnect} style={{backgroundColor : "white", color : "#999999", width : "235px", marginTop : "20px", border : "1px solid #999999", borderRadius : "0"}}>Log in with SteemConnect</button>



                </div>
            </div>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        logged_user : state.login};
};

export default connect(mapStateToProps, {login})(LoginParking);