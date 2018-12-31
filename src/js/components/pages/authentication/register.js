import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit'
import {user} from 'react-icons-kit/icomoon/user'
import {lock} from 'react-icons-kit/icomoon/lock'
import {mail3} from 'react-icons-kit/icomoon/mail3'
import {withLine} from 'react-icons-kit/entypo/withLine'
import {eye} from 'react-icons-kit/entypo/eye'
import {mail} from 'react-icons-kit/icomoon/mail'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import jwt from 'jwt-decode'

import Loadash from 'lodash'

import {actionWithoutData, setContent, authorizeWithData, authorizeWithoutData, actionWithData} from '../../redux/actions'
import {processError, resetToken, verifyauth} from '../common/miscellaneous'
import {SiteData} from '../data/siteMain'

import Ac_logo from '../svg/ac-logo'
import Toast from '../common/toast';

const initialState = {
    isSubmitting: false, username: "", password: "", email: "", showToast: false, toastType: "success", toastContent: "",
    isPasswordVisible: false
};

class Register extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        if(verifyauth()) {
            this.props.history.push(this.props.activeLink);
        }
    }

    closeAlert(){
        this.setState({showToast:false})
    }
    handlesubmit(){
        this.setState({showToast: false});
        let url = this.props.backEndLinks.user;
        let payload = new FormData;
        payload.append('username',this.state.username);
        payload.append('password',this.state.password);
        payload.append('email',this.state.email);
        this.props.actionWithData('post',url,payload).then(
            res => {
                this.setState({toastContent:"Your account has been created successfully. You can now proceed to sign in",
                    toastType:"success", isSubmitting: false, showToast: true, password:'', username: '', email: '' })
            },
            err => {
                this.processError(err);
            }
        )
    }

    processError(err){
        let errorCheck = processError(err);
        this.setState({toastContent:errorCheck.content,
            toastType:"danger", isSubmitting: false, showToast: true, password:'' })
    }


    render(){
        return(
            <div className={'auth-container'}>
                {
                    this.state.showToast ?
                        <Toast type={this.state.toastType} content={this.state.toastContent} closeAlert={this.closeAlert.bind(this)}/>
                        :
                        null
                }
                <div className={'side1'}>
                    <div className={'logo'}>
                        <Link to={'/'}>
                            <Ac_logo size={130} />
                        </Link>
                    </div>
                    <div className={'top-controls'}>
                        Already have an account?<Link to={'sign-in'}>Sign-in</Link>
                    </div>
                    <form className={'auth-form'}>
                        <div className={'form-group'}>
                            <span><Icon icon={mail}/></span>
                            <input required value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} type="email" placeholder={'Email Address'}/>
                        </div>
                        <div className={'form-group'}>
                            <span><Icon icon={user}/></span>
                            <input required value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} type="text" placeholder={'Username'}/>
                        </div>

                        <div className={'form-group'}>
                            <span><Icon icon={lock}/></span>
                            <input required type={this.state.isPasswordVisible ? "text" : "password"} value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} placeholder={'Password'}/>
                            <button type={'button'} onClick={() => this.setState({isPasswordVisible:!this.state.isPasswordVisible})}><Icon icon={this.state.isPasswordVisible ? withLine : eye}/></button>
                        </div>
                        {
                            this.state.isSubmitting ? <button className={'auth-button'}>
                                <div className={'button-loader'}>
                                    <ol className={'loading-butt'}> </ol>
                                    <ol className={'loading-butt'}> </ol>
                                    <ol className={'loading-butt'}> </ol>
                                </div>
                            </button>:
                                <button
                                    onClick={(e) => [e.preventDefault(), this.setState({isSubmitting: true}), this.handlesubmit()]}
                                    className={'auth-button'}>Create Account</button>

                        }
                    </form>
                </div>
                <div className={'side2'}>
                    <div className={'content'}>
                        <div className={'title'}>Create an account with us!</div>
                        <div className={'subtitle'}>Join Adefemiconsult to be to participate in every activities we have provided</div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithoutData: actionWithoutData, setContent: setContent, authorizeWithData:authorizeWithData,
        authorizeWithoutData: authorizeWithoutData, actionWithData: actionWithData,
    }, dispatch)
}

function mapStateToProps(state) {
    return({
        activeLink: state.activeLink, backEndLinks: state.backEndLinks
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);