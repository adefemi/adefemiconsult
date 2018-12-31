import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {more_2} from 'react-icons-kit/ikons/more_2'
import {iosSearch} from 'react-icons-kit/ionicons/iosSearch'
import {androidClose} from 'react-icons-kit/ionicons/androidClose'
import $ from 'jquery'
import proptypes from 'prop-types'
import {user} from 'react-icons-kit/icomoon/user'
import {facebook} from 'react-icons-kit/icomoon/facebook'
import {instagram} from 'react-icons-kit/icomoon/instagram'
import {twitter} from 'react-icons-kit/icomoon/twitter'
import {youtube} from 'react-icons-kit/icomoon/youtube'
import {googlePlus} from 'react-icons-kit/icomoon/googlePlus'
import {github} from 'react-icons-kit/icomoon/github'
import {linkedin} from 'react-icons-kit/icomoon/linkedin'

import {connect} from 'react-redux';

import Go_up from './go_up'

import Ac_logo from '../svg/ac-logo'
import {SiteData} from "../data/siteMain";

const initialState = {
  sideBarState: false, activeLink: "/", isSigningOut: false,
};


class HomeHeader extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
        $('html').css('overflow-y','auto');

        this.state.activeLink = window.location.pathname;
    }

    hideSearch(){
        $('.search-trigger').blur();
    }

    toggleSideBar(){
        this.setState({sideBarState: !this.state.sideBarState});
        let sideBarCon = $('.sidebar-content');
        let htmlHolder = $('html');
        sideBarCon.hasClass('closed') ? sideBarCon.removeClass('closed') : sideBarCon.addClass('closed');
    }

    loadpage(link){
        this.props.history.push(link);
    }

    signOut(){
        this.setState({isSigningOut:true});
        localStorage.removeItem(SiteData.name+'-user');
        setTimeout(() => {
            window.location.reload();
        }, 1000)
    }
    getSocials(){
        let socials = [...this.props.settingContent.socials];
        let array = [];

        socials.map((o,i) => {

            switch (o.title){
                case "facebook":
                    array.push(
                        <ol key={i} className={'fb'}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={facebook}/></span></a></ol>
                    );
                    break;
                case "instagram":
                    array.push(
                        <ol key={i} className={'in'}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={instagram}/></span></a></ol>
                    );
                    break;
                case "twitter":
                    array.push(
                        <ol key={i} className={'tw'}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={twitter}/></span></a></ol>
                    );
                    break;
                case "youtube":
                    array.push(
                        <ol key={i} className={'yo'}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={youtube}/></span></a></ol>
                    );
                    break;
                case "googleplus":
                    array.push(
                        <ol key={i} className={'gp'}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={googlePlus}/></span></a></ol>
                    );
                    break;
                case "github":
                    array.push(
                        <ol key={i} className={'git'}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={github}/></span></a></ol>
                    );
                    break;
                case "linkedin":
                    array.push(
                        <ol key={i} className={'ln'}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={linkedin}/></span></a></ol>
                    );
                    break;
                default:
                    array.push(
                        <ol key={i} className={'ln'}><a target={'_blank'} href={o.link}><span><Icon size={13} icon={user}/></span></a></ol>
                    );
            }

        });

        return array
    }

    render(){
        return(
            <div>
                <div className={'header-links'}>
                    {
                        this.props.settingContent.hasOwnProperty('contacts') ?
                            <div className={'number'}>
                                <ol><Link to={'/'}>{this.props.settingContent.contacts[0].telephone}</Link></ol>
                                <ol><Link to={'/'}>{this.props.settingContent.contacts[0].telephone2}</Link></ol>
                            </div>
                            : null
                    }

                    {
                        this.props.settingContent.hasOwnProperty('socials') ?
                            <div className={'socials'}>
                                {
                                    this.getSocials()
                                }
                            </div>
                            : null
                    }


                </div>
                <div className={'adefemi-header'}>
                    <div className={'links'}>
                        <Link to={'/'}><div className={'nav-brand'}><Ac_logo size={40} color={'#43cdeb'} />&nbsp;AdefemiConsult</div></Link>
                        <div className={'nav-links'}>
                            <Link to={'/'} className={this.state.activeLink === '/' ? 'active' : ''}>Home</Link>
                            <Link to={'/service'} className={this.state.activeLink.includes('service') ? 'active' : ''}>Services</Link>
                            <Link to={'/store'} className={this.state.activeLink.includes('store')  ? 'active' : ''}>Store</Link>
                            <Link to={'/project'} className={this.state.activeLink.includes('project') ? 'active' : ''}>Projects</Link>
                            <Link to={'/blog'} className={this.state.activeLink.includes('blog') ? 'active' : ''}>Blog</Link>
                            <button className={'search-trigger'}><Icon icon={iosSearch}/>
                                <div className={'header-searchBar'}>
                                    <form className={'search-wrapper'}>
                                        <input type="text" placeholder={'place search here...'}/>
                                        <div><Icon icon={iosSearch}/></div>
                                    </form>
                                    <div className={'close'} onClick={() => this.hideSearch()}><Icon icon={androidClose}/></div>
                                </div>
                            </button>
                            {
                                this.props.userStatus === null?
                                    <button className={'drop-trigger'}><Icon icon={more_2}/>
                                        <div className={'dropdown'}>
                                            <li onClick={() => this.loadpage('/sign-up')}>Create an Account</li>
                                            <li onClick={() => this.loadpage('/sign-in')}>Sign into Account</li>
                                            <li>FAQ</li>
                                            <li>Achievements</li>
                                        </div>
                                    </button>:
                                    <button className={'drop-trigger'}><Icon icon={user}/>
                                        <div className={'dropdown'}>
                                            <li onClick={() => this.loadpage('/user-profile')}>Update Profile</li>
                                            {
                                                this.state.isSigningOut ? <li>Please wait...</li>:
                                                    <li onClick={() => this.signOut()}>Sign out</li>
                                            }

                                        </div>
                                    </button>
                            }



                        </div>
                        <div className={'header-sidebar'}>
                            <button className={'search-trigger'}><Icon icon={iosSearch}/>
                                <div className={'header-searchBar'}>
                                    <form className={'search-wrapper'}>
                                        <input type="text" placeholder={'place search here...'}/>
                                        <div><Icon icon={iosSearch}/></div>
                                    </form>
                                    <div className={'close'} onClick={() => this.hideSearch()}><Icon icon={androidClose}/></div>
                                </div>
                            </button>
                            <button className={'controller'} onClick={() => this.toggleSideBar()}>
                                <Icon icon={this.state.sideBarState ? androidClose : more_2}/>
                            </button>
                            <div className={'sidebar-content closed'}>
                                <div className={'close'} onClick={() => this.toggleSideBar()}><Icon icon={androidClose}/></div>
                                <div className={'title'}>Menu</div>
                                <Link to={'/'} className={this.state.activeLink === '/' ? 'active' : ''}>Home</Link>
                                <Link to={'/service'} className={this.state.activeLink.includes('service') ? 'active' : ''}>Services</Link>
                                <Link to={'/store'} className={this.state.activeLink.includes('store')  ? 'active' : ''}>Store</Link>
                                <Link to={'/project'} className={this.state.activeLink.includes('project') ? 'active' : ''}>Projects</Link>
                                <Link to={'/blog'} className={this.state.activeLink.includes('blog') ? 'active' : ''}>Blog</Link>

                                <div className={'title'}>Sub-menu</div>
                                {
                                    this.props.userStatus === null?
                                        <div>
                                            <Link to={'/sign-up'}>Create an Account</Link>
                                            <Link to={'/sign-in'}>Sign into Account</Link>
                                            <Link to={'/'}>FAQ</Link>
                                            <Link to={'/'}>Achievements</Link>
                                        </div>:
                                        <div>
                                            <Link to={'/user-profile'} className={this.state.activeLink.includes('profile') ? 'active' : ''}>Update Profile</Link>
                                            {
                                                this.state.isSigningOut ? <Link to={'/'} onClick={(e) => e.preventDefault()}>Please wait...</Link>:
                                                    <Link to={'/'} onClick={(e) => [e.preventDefault(), this.signOut()]}>Sign out</Link>
                                            }

                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Go_up/>
            </div>
        )
    }
}

HomeHeader.propTypes = {
    history: proptypes.object.isRequired,
};

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, backEndLinks: state.backEndLinks, settingContent : state.settingContent
    })
}

export default connect(mapStateToProps)(HomeHeader);