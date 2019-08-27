import React from "react";
import {fetchComments, fetchLogin, login, setParent} from "../actions/actions"
import {connect} from "react-redux";

class LoginParking extends React.Component {

    state = {username : "", posting_key : "", email : "", password : "", error : "", loginType : "email"};

    login_steemconnect = () =>
    {
        this.props.displaySignIn(false);
        // TODO : fix produciton url
        window.open(process.env.NODE_ENV ===  "production" ? 'PRODUCTIONURL' : "http://localhost:4002/auth",'',' scrollbars=yes,menubar=no,width=447,height=614, resizable=yes,toolbar=no,location=no,status=no')
    };

    render() {
        return (
            <span>
                <div className="sidenav">
                    <div className="login-main-text">
                        <h2>Login Page</h2>
                        <p>Login here to access your settings</p>
                    </div>
                </div>
                <div className="main">
                    <div className="col-md-6 col-sm-12">

                            <button type={"button"} className="btn btn-primary " onClick={this.login_steemconnect} style={{backgroundColor : "white", color : "#999999", width : "235px", marginTop : "20px", border : "1px solid #999999", borderRadius : "0"}}>Log in with SteemConnect</button>

                    </div>
                </div>
            </span>
        )
    }

}


const mapStateToProps = (state) => {
    return {
        logged_user : state.login};
};

export default connect(mapStateToProps, {login})(LoginParking);