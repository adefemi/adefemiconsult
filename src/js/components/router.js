import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import jwt from 'jwt-decode'

import Index from './pages/homepage/index'
import Service from './pages/servicepage/index'
import Store from './pages/storepage/index'
import Projects from './pages/projectpage/index'
import Blog from './pages/blogpage/index'
import BlogVideo from './pages/blogpage/video'
import BlogVideoExplorer from './pages/blogpage/videoExplorer'
import BlogExplorer from './pages/blogpage/blogExplorer'
import Signin from './pages/authentication/signin'
import Register from './pages/authentication/register'
import ProjectExplorer from './pages/projectpage/explorer'
import StoreExplorer from './pages/storepage/explorer'
import UserProfile from './pages/userprofile/index'

import MainLoader from './pages/common/mainLoader';

import {actionWithoutData, setContent} from './redux/actions'
import {verifyauth} from "./pages/common/miscellaneous";
import {SiteData} from "./pages/data/siteMain";


const initialState = {
    loading: true, errorStatus: false,
};

class Router extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;

        setTimeout(() => {
            this.setState({loading: false})
        }, 1000)
    }

    componentWillMount(){
        this.getContents();
        this.verifyUser();
    }

    verifyUser(){
        if(verifyauth()){
            let token = JSON.parse(localStorage.getItem(SiteData.name+'-user'));
            let parsedData = jwt(token.access);
            let url = this.props.backEndLinks.user + parsedData.id;
            this.props.actionWithoutData('get',url).then(
                (rem) => {
                    this.props.setContent("SET_USER_ACTIVE", rem.data);
                },
                (err) => {
                    localStorage.removeItem(SiteData.name+'-user');
                    this.props.setContent("SET_USER_ACTIVE", null);
                }
            );
        }
        else{
            localStorage.removeItem(SiteData.name+'-user');
            this.props.setContent("SET_USER_ACTIVE", null);
        }
    }

    getContents(){
        this.setState({errorStatus: false});
        this.state.errorStatus = false;

        //Get About Content
        let url = this.props.backEndLinks.about;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.setContent("SET_ABOUT_CONTENT", res.data);
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        //Get Skillset Content
        url = this.props.backEndLinks.skillset;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.setContent("SET_SKILL_CONTENT", res.data);
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        //Get Team Content
        url = this.props.backEndLinks.team;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.setContent("SET_TEAM_CONTENT", res.data);
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        //Get User Content
        url = this.props.backEndLinks.user;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.setContent("SET_USER_CONTENT", res.data);
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );

        //Get Setting Images
        url = this.props.backEndLinks.settingImage;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.settingContent.images = res.data;
                this.props.setContent("SET_SETTING_CONTENT", this.props.settingContent);
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );
        //Get Setting Socials
        url = this.props.backEndLinks.settingSocial;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.settingContent.socials = res.data;
                this.props.setContent("SET_SETTING_CONTENT", this.props.settingContent);
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );
        //Get Setting Contact
        url = this.props.backEndLinks.settingContact;
        this.props.actionWithoutData('get', url).then(
            (res) => {
                this.props.settingContent.contacts = res.data;
                this.props.setContent("SET_SETTING_CONTENT", this.props.settingContent);
            },
            (err) => {
                this.setState({errorStatus:true})
            }
        );
    }

    render(){
        return(
            this.state.loading ? <MainLoader/> :
                this.state.errorStatus? <h2>Network error</h2> :
                <BrowserRouter>
                    <Switch>
                        <Route exact path={'/'} component={Index}/>
                        <Route exact path={'/service'} component={Service}/>
                        <Route exact path={'/store'} component={Store}/>
                        <Route exact path={'/store/:slug'} component={StoreExplorer}/>
                        <Route exact path={'/project'} component={Projects}/>
                        <Route exact path={'/project/:slug'} component={ProjectExplorer}/>
                        <Route exact path={'/blog'} component={Blog}/>
                        <Route exact path={'/blog/video'} component={BlogVideo}/>
                        <Route exact path={'/blog/video/:slug'} component={BlogVideoExplorer}/>
                        <Route exact path={'/blog/:slug'} component={BlogExplorer}/>
                        <Route exact path={'/sign-in'} component={Signin}/>
                        <Route exact path={'/sign-up'} component={Register}/>
                        <Route exact path={'/user-profile'} component={UserProfile}/>
                    </Switch>
                </BrowserRouter>
        )
    }
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, aboutContent: state.aboutContent, skillContent: state.skillContent, settingContent: state.settingContent,
        portfolioContent: state.portfolioContent, backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Router);