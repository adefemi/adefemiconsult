import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {user} from 'react-icons-kit/icomoon/user'
import {lock} from 'react-icons-kit/icomoon/lock'
import {mail} from 'react-icons-kit/icomoon/mail'
import {withLine} from 'react-icons-kit/entypo/withLine'
import {eye} from 'react-icons-kit/entypo/eye'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import HomeHeader from '../common/header';
import Contact from '../common/contact';
import Footer from '../common/footer';
import SubLoader from '../common/subLoader'
import Toast from '../common/toast';

import {actionWithoutData, setContent, authorizeWithData, authorizeWithoutData, actionWithData} from '../../redux/actions'
import {verifyauth, processError, resetToken} from '../common/miscellaneous'
import Goup from '../common/go_up'
import {SiteData} from "../data/siteMain";

const initialState = {
  username: "", email: "", old_password: "", new_password: "",
  pageLoading: true, isSubmitted: null, showToast: false, toastType: "success", toastContent: "",
};


class Index extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState
    }
    closeAlert(){
        this.setState({showToast:false})
    }
    componentWillMount(){
        this.props.userStatus === null ? this.props.history.push(this.props.activeLink) : null;
        this.setUpData();
        setTimeout(() => {
            this.setState({pageLoading:false})
        }, 1000);
    }


    setUpData(){
        if(this.props.userStatus === null) return;
        let ActiveUser = this.props.userStatus;
        this.setState({username:ActiveUser.username, email: ActiveUser.email});
    }

    signOut(){
        localStorage.removeItem(SiteData.name+'-user');
        setTimeout(() => {
            window.location.reload();
        }, 5000)
    }

    updateDetails(access = null){
        this.setState({showToast:false});

        let contents = {
            username: this.state.username, email: this.state.email
        };
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.user + this.props.userStatus.id;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem(SiteData.name+'-user')).access: null;
        this.props.authorizeWithData("put", url, payload, accessToken).then(
            (res) =>{
                this.setState({toastContent:"User details updated successfully, we would logout out now so as to allow you verify your new details",
                    toastType:"success", submit: false, showToast: true});
                this.signOut();

            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                errorObj.type === 3 ? this.updateDetails(errorObj.content) :
                    this.setState({toastContent:errorObj.content,
                        toastType:"danger", isSubmitted: false, showToast: true});
            }
        )
    }

    updatePassword(access = null){
        this.setState({showToast:false});

        let contents = {
            old_password: this.state.old_password, new_password: this.state.new_password
        };
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.passwordChange + this.props.userStatus.id;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem(SiteData.name+'-user')).access: null;
        this.props.authorizeWithData("put", url, payload, accessToken).then(
            (res) =>{
                this.setState({toastContent:"User password updated successfully, we would logout out now so as to allow you verify your new details",
                    toastType:"success", submit: false, showToast: true});
                this.signOut();

            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                errorObj.type === 3 ? this.updatePassword(errorObj.content) :
                    this.setState({toastContent:errorObj.content,
                        toastType:"danger", isSubmitted: null, showToast: true});
            }
        )
    }

    render(){

        return(
            <div className={'profile-wrapper'}>
                <HomeHeader history={this.props.history}/>
                {
                    this.state.showToast ?
                        <Toast type={this.state.toastType} content={this.state.toastContent} closeAlert={this.closeAlert.bind(this)}/>
                        :
                        null
                }
                <div className={'wrapper'}>
                    {
                        this.state.pageLoading ? <SubLoader/> :
                            <div className={'profile-con'}>
                                <div className={'left'}>
                                    <h4>Basic Information</h4>
                                    <form>
                                        <div className={'form-group'}>
                                            <label>Username</label>
                                            <div className={'input-group'}>
                                                <Icon icon={user}/>
                                                <input value={this.state.username} onChange={(e) => this.setState({username: e.target.value})}
                                                    type="text" placeholder={'Username'}/>
                                            </div>
                                        </div>
                                        <div className={'form-group'}>
                                            <label>Email Address</label>
                                            <div className={'input-group'}>
                                                <Icon icon={mail}/>
                                                <input value={this.state.email} onChange={(e) => this.setState({email: e.target.value})}
                                                    type="text" placeholder={'Email'}/>
                                            </div>
                                        </div>
                                        {
                                            this.state.isSubmitted === "uDetails" ?
                                                <button className={'auth-button'}>
                                                    <div className={'button-loader'}>
                                                        <ol className={'loading-butt'}> </ol>
                                                        <ol className={'loading-butt'}> </ol>
                                                        <ol className={'loading-butt'}> </ol>
                                                    </div>
                                                </button>:
                                                <button onClick={(e) => [e.preventDefault(), this.setState({isSubmitted:"uDetails"}), this.updateDetails()]}>Update details</button>
                                        }

                                    </form>
                                </div>
                                <div className={'right'}>
                                    <h4>Provide Password Information</h4>
                                    <form>
                                        <div className={'form-group'}>
                                            <label>Old Password</label>
                                            <div className={'input-group'}>
                                                <Icon icon={lock}/>
                                                <input value={this.state.old_password} onChange={(e) => this.setState({old_password: e.target.value})}
                                                    type="password" placeholder={'old password'}/>
                                            </div>
                                        </div>
                                        <div className={'form-group'}>
                                            <label>New Password</label>
                                            <div className={'input-group'}>
                                                <Icon icon={lock}/>
                                                <input value={this.state.new_password} onChange={(e) => this.setState({new_password: e.target.value})}
                                                    type="password" placeholder={'new password'}/>
                                                <Icon icon={eye}/>
                                            </div>
                                        </div>
                                        {
                                            this.state.isSubmitted === "uPassword" ?
                                                <button className={'auth-button'}>
                                                    <div className={'button-loader'}>
                                                        <ol className={'loading-butt'}> </ol>
                                                        <ol className={'loading-butt'}> </ol>
                                                        <ol className={'loading-butt'}> </ol>
                                                    </div>
                                                </button>:
                                                <button onClick={(e) => [e.preventDefault(), this.setState({isSubmitted:"uPassword"}), this.updatePassword()]}>Update Password</button>
                                        }
                                    </form>
                                </div>
                            </div>
                    }
                </div>
                <Footer/>

            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithoutData: actionWithoutData, setContent: setContent, authorizeWithData:authorizeWithData,
        authorizeWithoutData: authorizeWithoutData, actionWithData: actionWithData
    }, dispatch)
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, backEndLinks: state.backEndLinks, activeLink: state.activeLink
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);