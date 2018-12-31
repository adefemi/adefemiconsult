import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {mail} from 'react-icons-kit/icomoon/mail'
import {phone} from 'react-icons-kit/icomoon/phone'
import {user} from 'react-icons-kit/icomoon/user'
import {facebook} from 'react-icons-kit/icomoon/facebook'
import {instagram} from 'react-icons-kit/icomoon/instagram'
import {twitter} from 'react-icons-kit/icomoon/twitter'
import {youtube} from 'react-icons-kit/icomoon/youtube'
import {googlePlus} from 'react-icons-kit/icomoon/googlePlus'
import {github} from 'react-icons-kit/icomoon/github'
import {linkedin} from 'react-icons-kit/icomoon/linkedin'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ToastContainer, ToastStore} from 'react-toasts';

import {actionWithoutData, setContent, authorizeWithData, authorizeWithoutData, actionWithData} from '../../redux/actions'
import {verifyauth, processError, resetToken} from '../common/miscellaneous'


const initialState = {
    fullName: "", email: "", phone: "", message: "", isSubmitting: false,
};

class Contact extends React.Component{

    constructor(props){
        super(props);

        this.state = initialState
    }

    getSocials(){
        let socials = [...this.props.settingContent.socials];
        let array = [];

        socials.map((o,i) => {

            switch (o.title){
                case "facebook":
                    array.push(
                        <ol key={i}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={facebook}/></span></a></ol>
                    );
                    break;
                case "instagram":
                    array.push(
                        <ol key={i}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={instagram}/></span></a></ol>
                    );
                    break;
                case "twitter":
                    array.push(
                        <ol key={i}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={twitter}/></span></a></ol>
                    );
                    break;
                case "youtube":
                    array.push(
                        <ol key={i}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={youtube}/></span></a></ol>
                    );
                    break;
                case "googleplus":
                    array.push(
                        <ol key={i}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={googlePlus}/></span></a></ol>
                    );
                    break;
                case "github":
                    array.push(
                        <ol key={i}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={github}/></span></a></ol>
                    );
                    break;
                case "linkedin":
                    array.push(
                        <ol key={i}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={linkedin}/></span></a></ol>
                    );
                    break;
                default:
                    array.push(
                        <ol key={i}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={user}/></span></a></ol>
                    );
            }

        });
        return array
    }

    handleSubmit(){
        let url = this.props.backEndLinks.mailEnquiry;
        let payload = new FormData;
        payload.append('fullname',this.state.fullName);
        payload.append('email',this.state.email);
        payload.append('phone',this.state.phone);
        payload.append('message',this.state.message);

        this.props.actionWithData('post', url, payload).then(
            res => {
                ToastStore.success("Message Sent!");
                this.resetState();
            },
            err => {
                let error = processError(err, this.props.backEndLinks.refresh);
                ToastStore.error(<div dangerouslySetInnerHTML={{__html: error.content}}/>);
                this.setState({isSubmitting: false});
            }
        )
    }

    resetState(){
        this.setState(initialState)
    }

    render(){
        return(
            <div className={'adefemi-contact'}>

                <div className={'contact-inner'}  data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-duration="500">
                    <ToastContainer position={ToastContainer.POSITION.TOP_LEFT} store={ToastStore}/>
                    <div className={'top'}>
                        <div className={'title'}>Contact</div>
                        <div className={'sub-title'}>Do you wish to reach me, Let discuss business!!!</div>
                        <div className={'contact-item'}>
                            <div className={'head'}>Emails</div>
                            {
                                this.props.settingContent.hasOwnProperty('contacts') ?
                                    <div>
                                        <li><span><Icon icon={mail}/></span> {this.props.settingContent.contacts[0].email}</li>
                                        <li><span><Icon icon={mail}/></span> {this.props.settingContent.contacts[0].email2}</li>
                                    </div>
                                    : null
                            }

                        </div>
                        <div className={'contact-item'}>
                            <div className={'head'}>Phones</div>
                            {
                                this.props.settingContent.hasOwnProperty('contacts') ?
                                    <div>
                                        <li><span><Icon icon={phone}/></span>{this.props.settingContent.contacts[0].telephone}</li>
                                        <li><span><Icon icon={phone}/></span>{this.props.settingContent.contacts[0].telephone2}</li>
                                    </div>
                                    : null
                            }

                        </div>
                        <div className={'contact-item'}>
                            <div className={'head'}>Social Handles</div>
                            {
                                this.props.settingContent.hasOwnProperty('socials') ?
                                    <div className={'social-handles'}>
                                        {
                                            this.getSocials()
                                        }
                                    </div>
                                    : null
                            }
                        </div>
                    </div>
                    <div className={'bottom'}>
                        <div className={'title'}>Send a message</div>
                        <form id={'contact-form'} onSubmit={(e) => [e.preventDefault(), this.setState({isSubmitting: true}), this.handleSubmit()]}>
                            <div className={'form-group'}>
                                <span><Icon icon={user}/></span>
                                <input required type="text" placeholder={'Full Name'} value={this.state.fullName} onChange={(e) => this.setState({fullName: e.target.value})}/>
                            </div>
                            <div className={'form-group'}>
                                <span><Icon icon={mail}/></span>
                                <input required type="email" placeholder={'Email Address'} value={this.state.email} onChange={(e) => this.setState({email: e.target.value})}/>
                            </div>
                            <div className={'form-group'}>
                                <span><Icon icon={phone}/></span>
                                <input required type="tel" placeholder={'Phone'} value={this.state.phone} onChange={(e) => this.setState({phone: e.target.value})}/>
                            </div>
                            <textarea required rows="10" placeholder={"Write message"} value={this.state.message} onChange={(e) => this.setState({message: e.target.value})}>

                            </textarea>
                            {
                                this.state.isSubmitting ? <button className={'auth-button'}>
                                    <div className={'button-loader'}>
                                        <ol className={'loading-butt'}> </ol>
                                        <ol className={'loading-butt'}> </ol>
                                        <ol className={'loading-butt'}> </ol>
                                    </div>
                                </button>:<button>Send</button>

                            }
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, backEndLinks: state.backEndLinks, settingContent : state.settingContent
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithoutData: actionWithoutData, setContent: setContent, authorizeWithData:authorizeWithData,
        authorizeWithoutData: authorizeWithoutData, actionWithData: actionWithData
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Contact);