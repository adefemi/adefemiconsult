import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit'
import {user} from 'react-icons-kit/icomoon/user'
import {lock} from 'react-icons-kit/icomoon/lock'
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
    isSubmitting: false, username: "", password: "", showToast: false, toastType: "success", toastContent: "",
};

class SignIn extends React.Component{
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
        let url = this.props.backEndLinks.auth;
        let payload = new FormData;
        payload.append('username',this.state.username);
        payload.append('password',this.state.password);
        this.props.actionWithData('post',url,payload).then(
            res => {
                let parsedData = jwt(res.data.access);
                url = this.props.backEndLinks.user + parsedData.id;
                this.props.actionWithoutData('get',url).then(
                    (rem) => {
                        if(parseInt(rem.data.is_superuser) !== 1){
                            localStorage.setItem(SiteData.name+'-user', JSON.stringify(res.data));
                            this.props.setContent("SET_USER_ACTIVE", rem.data);
                            setTimeout(() => {
                                this.props.history.push(this.props.activeLink);
                            }, 1000)
                        }
                        else{
                            alert('invalid username or password');
                            this.setState({submitted:false});
                        }
                    },
                    (err) => {
                        this.processError(err);
                    }
                );
            },
            err => {
                this.processError(err);
            }
        )
    }

    processError(err){
        let errorCheck = processError(err);
        this.setState({toastContent:"Invalid username or password! Authentication Failed.",
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
                    <div className={'logo'}><Link to={'/'}>
                        <Ac_logo size={130} />
                    </Link></div>
                    <div className={'top-controls'}>
                        Do not have an account yet?<Link to={'sign-up'}>Create one!</Link>
                    </div>
                    <form className={'auth-form'}>
                        <div className={'form-group'}>
                            <span><Icon icon={user}/></span>
                            <input value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} type="text" placeholder={'Username'}/>
                        </div>
                        <div className={'form-group'}>
                            <span><Icon icon={lock}/></span>
                            <input value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} type="password" placeholder={'Password'}/>
                        </div>
                        <div className={'form-side'}>
                            {
                                this.state.isSubmitting ? <button className={'auth-button'}>
                                    <div className={'button-loader'}>
                                        <ol className={'loading-butt'}> </ol>
                                        <ol className={'loading-butt'}> </ol>
                                        <ol className={'loading-butt'}> </ol>
                                    </div>
                                </button>:<button onClick={(e) => [e.preventDefault(), this.setState({isSubmitting: true}), this.handlesubmit()]} className={'auth-button'}>Sign in</button>

                            }

                            <Link to={'/'}>forgot password?</Link>
                        </div>
                    </form>
                </div>
                <div className={'side2'}>
                    <div className={'content'}>
                        <div className={'title'}>Sign into account</div>
                        <div className={'subtitle'}>Sign into your account to get full access!</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);