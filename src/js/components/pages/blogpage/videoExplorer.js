import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {thumbsOUp} from 'react-icons-kit/fa/thumbsOUp';
import {thumbsODown} from 'react-icons-kit/fa/thumbsODown';
import {eye} from 'react-icons-kit/fa/eye';
import {comment} from 'react-icons-kit/fa/comment';
import {play2} from 'react-icons-kit/icomoon/play2'
import {ic_message} from 'react-icons-kit/md/ic_message';
import {connect} from 'react-redux'
import { Player } from 'video-react';
import {bindActionCreators} from 'redux'
import $ from 'jquery'
import Modal from 'react-modal';

import HomeHeader from '../common/header';
import Footer from '../common/footer';
import SideBar from './component/sidebar';

import SubLoader from "../common/subLoader";
import ImageLoader from '../common/imageLoader'
import {SiteData} from "../data/siteMain";
import Toast from '../common/toast';

import {actionWithoutData, setContent, authorizeWithData, authorizeWithoutData, actionWithData} from '../../redux/actions'
import {verifyauth, processError, resetToken} from '../common/miscellaneous'
import Goup from '../common/go_up'
import {TimeAgo} from "../common/miscellaneous";
import {
    FacebookIcon,
    FacebookShareButton,
    GooglePlusIcon,
    GooglePlusShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    PinterestIcon,
    PinterestShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterIcon,
    TwitterShareButton, WhatsappIcon, WhatsappShareButton
} from "react-share";

const initialState = {
    blogs: null, blogReaction: null,blogGenre: null, blogView: null, blogComment: null, blogTag: null, activeBlogComment:"", activeBlog: null,
    contentPerPage: 5, currentList: 1, contentLoadmore: false, contentLoading: false,showToast: false, toastType: "success", toastContent: "",
    comment: "", commentType: 0, commentID: 0, submit: false,users: null, activeLink:null,blogCommentReaction: null,
    commentEdit: false, blogCommentReply: false, activeComment: null, commentRemove: false, modalIsOpen: false,
    commentRemoveSubmit: false, pageLoading: true,eactionData: null, reactionType: "post", reactionID: null
};

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

class VideoExplorer extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    getActiveContent(){
        this.setState({currentList: 1});
        let _blogList = this.props.blogContent.blogs;
        let slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let activeBlog = _blogList.filter(o => o.slug === slug);

        if(activeBlog.length > 0){
            this.setState({activeBlog:activeBlog});
            this.state.activeBlog = activeBlog;
        }
        else{
            this.setState({activeBlog:[]});
            this.state.activeBlog = [];
        }
        setTimeout(() => {
            this.setState({pageLoading:false});
        }, 1000);

        this.getActiveComment();

    }

    componentWillMount(){
        this.verifyList(this.props);
        this.componentWillReceiveProps(this.props);
        this.props.setContent("SET_ACTIVE_LINK", window.location.pathname);

    }

    verifyList(props){
        let url = "";
        if(!props.blogContent.hasOwnProperty('blogs')){
            url = this.props.backEndLinks.blog;
            this.props.actionWithoutData('get', url).then(
                (res) => {
                    this.props.blogContent.blogs = res.data;
                    this.props.setContent("SET_BLOG_CONTENT", this.props.blogContent);
                },
                (err) => {
                    this.setState({toastContent:"Unable to get blog content. Please reload this page!",
                        toastType:"danger", submit: false, showToast: true});
                }
            );
        }

        if(!props.blogContent.hasOwnProperty('blogComment')){
            url = this.props.backEndLinks.blogComment;
            this.props.actionWithoutData('get', url).then(
                (res) => {
                    this.props.blogContent.blogComment = res.data;
                    this.props.setContent("SET_BLOG_CONTENT", this.props.blogContent);
                },
                (err) => {
                    this.setState({toastContent:"Unable to get blog comments. Please reload this page!",
                        toastType:"danger", submit: false, showToast: true});
                }
            );
        }

        if(!props.blogContent.hasOwnProperty('blogView')){
            url = this.props.backEndLinks.blogView;
            this.props.actionWithoutData('get', url).then(
                (res) => {
                    this.props.blogContent.blogView = res.data;
                    this.props.setContent("SET_BLOG_CONTENT", this.props.blogContent);
                },
                (err) => {
                    this.setState({toastContent:"Unable to get blog views. Please reload this page!",
                        toastType:"danger", submit: false, showToast: true});
                }
            );
        }

        if(!props.blogContent.hasOwnProperty('blogReaction')){
            url = this.props.backEndLinks.blogReaction;
            this.props.actionWithoutData('get', url).then(
                (res) => {
                    this.props.blogContent.blogReaction = res.data;
                    this.props.setContent("SET_BLOG_CONTENT", this.props.blogContent);
                },
                (err) => {
                    this.setState({toastContent:"Unable to get blog reactions. Please reload this page!",
                        toastType:"danger", submit: false, showToast: true});
                }
            );
        }

        if(!props.blogContent.hasOwnProperty('blogCommentReaction')){
            url = this.props.backEndLinks.blogCommentReaction;
            this.props.actionWithoutData('get', url).then(
                (res) => {
                    this.props.blogContent.blogCommentReaction = res.data;
                    this.props.setContent("SET_BLOG_CONTENT", this.props.blogContent);
                },
                (err) => {
                    this.setState({toastContent:"Unable to get  commentt reactions. Please reload this page!",
                        toastType:"danger", submit: false, showToast: true});
                }
            );
        }

        if(!props.blogContent.hasOwnProperty('blogTag')){
            url = this.props.backEndLinks.blogTag;
            this.props.actionWithoutData('get', url).then(
                (res) => {
                    this.props.blogContent.blogTag = res.data;
                    this.props.setContent("SET_BLOG_CONTENT", this.props.blogContent);
                },
                (err) => {
                    this.setState({toastContent:"Unable to get blog reactions. Please reload this page!",
                        toastType:"danger", submit: false, showToast: true});
                }
            );
        }

        if(!props.blogContent.hasOwnProperty('blogGenre')){
            url = this.props.backEndLinks.blogGenre;
            this.props.actionWithoutData('get', url).then(
                (res) => {
                    this.props.blogContent.blogGenre = res.data;
                    this.props.setContent("SET_BLOG_CONTENT", this.props.blogContent);
                },
                (err) => {
                    this.setState({toastContent:"Unable to get blog reactions. Please reload this page!",
                        toastType:"danger", submit: false, showToast: true});
                }
            );
        }
    }

    componentWillReceiveProps(props){
        if(props.blogContent.hasOwnProperty('blogs')){
            if(props.blogContent.blogs !== this.state.blogs){
                let blogList = [...props.blogContent.blogs];
                blogList = blogList.filter(o => parseInt(o.type) === 1  && parseInt(o.publish) === 1);
                this.setState({blogs: blogList});
                this.state.blogs = blogList;
                this.getActiveContent();
            }
        }
        if(props.blogContent.hasOwnProperty('blogComment')){
            if(props.blogContent.blogComment !== this.state.blogComment){
                this.setState({blogComment: props.blogContent.blogComment});
                this.state.blogComment = props.blogContent.blogComment;
                this.getActiveComment();
            }
            else{
                this.getActiveComment();
            }
        }
        if(props.blogContent.hasOwnProperty('blogReaction')){
            if(props.blogContent.blogReaction !== this.state.blogReaction){
                this.setState({blogReaction: props.blogContent.blogReaction});
            }
        }
        if(props.blogContent.hasOwnProperty('blogCommentReaction')){
            if(props.blogContent.blogCommentReaction !== this.state.blogCommentReaction){
                this.setState({blogCommentReaction: props.blogContent.blogCommentReaction});
            }
        }
        if(props.blogContent.hasOwnProperty('blogView')){
            if(props.blogContent.blogView !== this.state.blogView){
                this.setState({blogView: props.blogContent.blogView});
            }
        }
        if(props.blogContent.hasOwnProperty('blogTag')){
            if(props.blogContent.blogTag !== this.state.blogTag){
                this.setState({blogTag: props.blogContent.blogTag});
            }
        }
        if(props.blogContent.hasOwnProperty('blogGenre')){
            if(props.blogContent.blogGenre !== this.state.blogGenre){
                this.setState({blogGenre: props.blogContent.blogGenre});
            }
        }
        if(props.userContent !== this.state.users){
            this.setState({users: props.userContent});
        }
        if(window.location.href !== this.state.activeLink){
            this.setState({activeLink:window.location.href, pageLoading: true});
            let goup = new Goup;
            goup.goup();
        }
    }

    getActiveComment(){
        if(this.state.activeBlog === null || this.state.activeBlog.length < 1 || this.state.blogComment === null) return;
        let activeComment = [...this.state.blogComment].filter(o => parseInt(o.blog_id) === parseInt(this.state.activeBlog[0].id));
        this.setState({activeBlogComment: activeComment});
    }

    getBlogs(){
        let _blogContent = [...this.state.blogs].reverse();
        _blogContent = _blogContent.filter(o => o.genre === this.state.activeBlog[0].genre && o.id !== this.state.activeBlog[0].id);

        let _tempContent = [];
        let Count = 0;
        for(let i = 0; i < _blogContent.length; i++){
            _tempContent.push(
                <div key={i} className={'video-card'}>
                    <div className={'image-con'}>
                        <ImageLoader/>
                        <img src={_blogContent[i].coverpic} alt=""/>
                    </div>
                    <div className={'playicon'} onClick={() => this.props.history.push('/blog/video/'+_blogContent[i].slug)}>
                        <Icon icon={play2} size={60}/>
                    </div>
                    <div className={'context'}>
                        <div className={'title'}>{_blogContent[i].title}</div>
                        <div className={'content'}>
                            {_blogContent[i].detail.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 150)}
                            {_blogContent[i].detail.replace(/<\/?[^>]+(>|$)/g, "").length > 150 ? "..." : null}                        </div>
                        <div className={'props'}>
                            <li><Icon icon={thumbsOUp}/><span>{this.getReactions(_blogContent[i].id, 1)}</span></li>
                            <li><Icon icon={eye}/><span>{this.getView(_blogContent[i].id)}</span></li>
                            <li><Icon icon={comment}/><span>{this.getCommentCount(_blogContent[i].id)}</span></li>
                        </div>
                    </div>
                </div>
            );
            Count++;
            if(Count >= 3){
                break;
            }
        }
        return _tempContent
    }

    editComment(obj){
        this.setState({commentEdit:true, comment:obj.comment, activeComment:obj});
        let commentContainer = $('.form-comment');
        setTimeout(() => {
            commentContainer.focus();
        }, 200)
    }

    removeComment(obj){
        this.setState({commentRemove:true, activeComment:obj, modalIsOpen: true});
    }
    cancelRemove(){
        this.setState({commentRemove:false, activeComment:null, modalIsOpen: false});
    }
    replyComment(obj){
        this.setState({blogCommentReply:true, activeComment:obj, commentType: 1, commentID:obj.id});
        let commentContainer = $('.form-comment');
        setTimeout(() => {
            commentContainer.focus();
        }, 200)
    }

    cancelEdit(){
        this.setState({commentEdit:false, comment:"", activeComment:null});
    }
    cancelReply(){
        this.setState({blogCommentReply:false, activeComment:null, commentType: 0, commentID:0});
    }

    getComment(){
        if(this.state.users === null) return;
        let _blogComment = [...this.state.activeBlogComment].reverse();
        _blogComment = _blogComment.filter(o => parseInt(o.type) === 0);
        let _userList = [...this.state.users];
        let _tempContent = [];
        let ListCount = this.state.currentList * this.state.contentPerPage;
        _blogComment.length < ListCount ? ListCount = _blogComment.length : null;
        for(let i = 0; i < ListCount; i++){
            let activeUser = _userList.filter(o => o.id === _blogComment[i].user_id)[0];
            if(this.state['blogComment'+_blogComment[i].id] === undefined){
                this.state['blogComment'+_blogComment[i].id] = false;
            }

            _tempContent.push(
                <ol key={i}>
                    <div className={'icon'}>
                        {activeUser.username.substring(0,2)}
                    </div>
                    <div className={'content'}>
                        <div className={'username'}>{activeUser.username} - <span>{TimeAgo(activeUser.created_on)}</span></div>
                        <div className={'context'} dangerouslySetInnerHTML={{__html: _blogComment[i].comment}} />
                        <div className={'controls'}>
                            {
                                this.props.userStatus === null ?
                                    <div className={'props'}>
                                        <li onClick={() => this.reactToBlogComment(1, _blogComment[i].id)}><Icon icon={thumbsOUp}/><span>{this.getCommentReactions(_blogComment[i].id, 1)}</span></li>
                                        <li onClick={() => this.reactToBlogComment(-1, _blogComment[i].id)}><Icon icon={thumbsODown}/><span>{this.getCommentReactions(_blogComment[i].id, -1)}</span></li>
                                        <li onClick={() => this.setState({['blogComment'+_blogComment[i].id]: !this.state['blogComment'+_blogComment[i].id]})}><Icon style={{"cursor":"pointer"}} icon={ic_message}/><span>{this.getCommentReply(_blogComment[i].id).length}</span></li>
                                    </div>:
                                    <div className={'props'}>
                                        <li onClick={() => this.reactToBlogComment(parseInt(this.checkIfCommentReacted(_blogComment[i].id)) > 0 ? 0 : 1, _blogComment[i].id)}>
                                            <Icon className={parseInt(this.checkIfCommentReacted(_blogComment[i].id))> 0 ? 'active':null} icon={thumbsOUp}/>
                                            <span>{this.getCommentReactions(_blogComment[i].id, 1)}</span>
                                        </li>
                                        <li onClick={() => this.reactToBlogComment(parseInt(this.checkIfCommentReacted(_blogComment[i].id)) < 0 ? 0 : -1, _blogComment[i].id)}>
                                            <Icon className={parseInt(this.checkIfCommentReacted(_blogComment[i].id))< 0 ? 'active':null} icon={thumbsODown}/>
                                            <span>{this.getCommentReactions(_blogComment[i].id, -1)}</span>
                                        </li>
                                        <li onClick={() => this.setState({['blogComment'+_blogComment[i].id]: !this.state['blogComment'+_blogComment[i].id]})}><Icon style={{"cursor":"pointer"}} icon={ic_message}/><span>{this.getCommentReply(_blogComment[i].id).length}</span></li>
                                    </div>

                            }

                            <div>
                                {
                                    this.props.userStatus !== null && this.props.userStatus.id === activeUser.id ? <button onClick={() => this.editComment(_blogComment[i])}>
                                        edit
                                    </button>: null
                                }
                                {
                                    this.props.userStatus !== null && this.props.userStatus.id === activeUser.id ? <button onClick={() => this.removeComment(_blogComment[i])}>
                                        remove
                                    </button>: null
                                }
                                <button onClick={() => this.replyComment(_blogComment[i])}>
                                    Reply
                                </button>
                            </div>

                        </div>
                        {
                            this.state['blogComment'+_blogComment[i].id] ?
                                <div className={'replies'}>
                                    {this.getCommentReply(_blogComment[i].id)}
                                </div>:
                                null
                        }

                    </div>
                </ol>
            );
        }
        _blogComment.length > ListCount ? this.state.contentLoadmore = true: this.state.contentLoadmore = false;
        return _tempContent
    }

    getCommentReply(id){
        let _blogComment = [...this.state.activeBlogComment].reverse();
        _blogComment = _blogComment.filter(o => o.blog_comment_id === id && parseInt(o.type) === 1);
        let _userList = [...this.state.users];
        let _tempContent = [];
        let ListCount = this.state.currentList * this.state.contentPerPage;
        _blogComment.length < ListCount ? ListCount = _blogComment.length : null;
        for(let i = 0; i < ListCount; i++){
            let activeUser = _userList.filter(o => o.id === _blogComment[i].user_id)[0];
            if(this.state['blogComment'+_blogComment[i].id] === undefined){
                this.state['blogComment'+_blogComment[i].id] = false;
            }
            _tempContent.push(
                <div key={i}>
                    <ol >
                        <div className={'icon'}>
                            {activeUser.username.substring(0,2)}
                        </div>
                        <div className={'content'}>
                            <div className={'username'}>{activeUser.username} - <span>{TimeAgo(activeUser.created_on)}</span></div>
                            <div className={'context'} dangerouslySetInnerHTML={{__html: _blogComment[i].comment}} />
                            <div className={'controls'}>
                                {
                                    this.props.userStatus === null ?
                                        <div className={'props'}>
                                            <li onClick={() => this.reactToBlogComment(1, _blogComment[i].id)}><Icon icon={thumbsOUp}/><span>{this.getCommentReactions(_blogComment[i].id, 1)}</span></li>
                                            <li onClick={() => this.reactToBlogComment(-1, _blogComment[i].id)}><Icon icon={thumbsODown}/><span>{this.getCommentReactions(_blogComment[i].id, -1)}</span></li>
                                            <li onClick={() => this.setState({['blogComment'+_blogComment[i].id]: !this.state['blogComment'+_blogComment[i].id]})}><Icon style={{"cursor":"pointer"}} icon={ic_message}/><span>{this.getCommentReply(_blogComment[i].id).length}</span></li>
                                        </div>:
                                        <div className={'props'}>
                                            <li onClick={() => this.reactToBlogComment(parseInt(this.checkIfCommentReacted(_blogComment[i].id)) > 0 ? 0 : 1, _blogComment[i].id)}>
                                                <Icon className={parseInt(this.checkIfCommentReacted(_blogComment[i].id))> 0 ? 'active':null} icon={thumbsOUp}/>
                                                <span>{this.getCommentReactions(_blogComment[i].id, 1)}</span>
                                            </li>
                                            <li onClick={() => this.reactToBlogComment(parseInt(this.checkIfCommentReacted(_blogComment[i].id)) < 0 ? 0 : -1, _blogComment[i].id)}>
                                                <Icon className={parseInt(this.checkIfCommentReacted(_blogComment[i].id))< 0 ? 'active':null} icon={thumbsODown}/>
                                                <span>{this.getCommentReactions(_blogComment[i].id, -1)}</span>
                                            </li>
                                            <li onClick={() => this.setState({['blogComment'+_blogComment[i].id]: !this.state['blogComment'+_blogComment[i].id]})}><Icon style={{"cursor":"pointer"}} icon={ic_message}/><span>{this.getCommentReply(_blogComment[i].id).length}</span></li>
                                        </div>

                                }
                                <div>
                                    {
                                        this.props.userStatus !== null && this.props.userStatus.id === activeUser.id ? <button onClick={() => this.editComment(_blogComment[i])}>
                                            edit
                                        </button>: null
                                    }
                                    {
                                        this.props.userStatus !== null && this.props.userStatus.id === activeUser.id ? <button onClick={() => this.removeComment(_blogComment[i])}>
                                            remove
                                        </button>: null
                                    }
                                    <button onClick={() => this.replyComment(_blogComment[i])}>
                                        Reply
                                    </button>
                                </div>

                            </div>
                        </div>
                    </ol>
                    {
                        this.state['blogComment'+_blogComment[i].id] ?
                            <div className={'replies'}>
                                {this.getCommentReply(_blogComment[i].id)}
                            </div>:
                            null
                    }
                </div>

            );
        }
        return _tempContent
    }

    loadmore(){
        this.setState({contentLoading:true});
        setTimeout(()=>{
            this.setState({currentList:this.state.currentList + 1, contentLoading: false});
        }, 1000);
    }

    closeAlert(){
        this.setState({showToast:false})
    }

    getView(contentID){
        if(this.state.blogView === null)return;
        let _viewList = [...this.state.blogView];
        _viewList = _viewList.filter(o => o.blog_id === contentID);
        return _viewList.length;

    }

    getReactions(contentID, type){
        if(this.state.blogReaction === null)return;
        let _reactionList = [...this.state.blogReaction];
        _reactionList = _reactionList.filter(o => o.blog_id === contentID && parseInt(o.value) === parseInt(type));
        return _reactionList.length;
    }

    getCommentReactions(contentID, type){

        if(this.state.blogCommentReaction === null)return;
        let _reactionList = [...this.state.blogCommentReaction];
        _reactionList = _reactionList.filter(o => o.blog_comment_id === contentID && parseInt(o.value) === parseInt(type));
        return _reactionList.length;
    }

    getCommentCount(contentID){
        if(this.state.blogComment === null)return;
        let _commentList = [...this.state.blogComment];
        _commentList = _commentList.filter(o => o.blog_id === contentID);
        return _commentList.length;
    }

    getActiveGenre(contentID){
        if(this.state.blogGenre === null)return;
        let _genreList = [...this.state.blogGenre];
        _genreList = _genreList.filter(o => o.id === contentID);
        return _genreList[0].title;
    }

    SubmitComment(access = null){
        this.setState({showToast:false});
        if(this.props.userStatus === null) {
            this.setState({toastContent:"Authentication Error!!! Only Registered user can make a comment.",
                toastType:"danger", submit: false, showToast: true});
            return;
        }

        let contents = {
            comment: this.state.comment,
            type: this.state.commentType,
            blog_id: this.state.activeBlog[0].id,
            blog_comment_id: this.state.commentID,
            user_id: this.props.userStatus.id
        };
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.blogComment;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem(SiteData.name+'-user')).access: null;
        this.props.authorizeWithData("post", url, payload, accessToken).then(
            (res) =>{
                this.props.blogContent.blogComment.push(res.data);
                this.props.setContent('SET_BLOG_CONTENT', this.props.blogContent);
                this.setState({toastContent:"Comment added successfully!",
                    toastType:"success", submit: false, showToast: true,comment: "", commentType:0 });
                if(this.state.blogCommentReply)this.cancelReply();
            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                errorObj.type === 3 ? this.SubmitComment(errorObj.content) :
                    this.setState({toastContent:errorObj.content,
                        toastType:"danger", submit: false, showToast: true});
            }
        )
    }

    UpdateComment(access = null){
        this.setState({showToast:false});

        let contents = {
            comment: this.state.comment,
        };
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.blogComment + this.state.activeComment.id;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem(SiteData.name+'-user')).access: null;
        this.props.authorizeWithData("put", url, payload, accessToken).then(
            (res) =>{
                this.props.blogContent.blogComment = res.data;
                this.props.setContent('SET_BLOG_CONTENT', this.props.blogContent);
                this.setState({toastContent:"Comment updated successfully!",
                    toastType:"success", submit: false, showToast: true, comment: ""});
                this.cancelEdit();
            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                errorObj.type === 3 ? this.SubmitComment(errorObj.content) :
                    this.setState({toastContent:errorObj.content,
                        toastType:"danger", submit: false, showToast: true});
            }
        )
    }

    RemoveComment(access = null){
        this.setState({showToast:false, commentRemoveSubmit:true});
        let url = this.props.backEndLinks.blogComment + this.state.activeComment.id;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem(SiteData.name+'-user')).access: null;
        this.props.authorizeWithoutData("delete", url, accessToken).then(
            (res) =>{
                this.props.blogContent.blogComment = res.data;
                this.props.setContent('SET_BLOG_CONTENT', this.props.blogContent);
                this.cancelRemove();
                setTimeout(() => {
                    this.setState({toastContent:"Comment removed successfully!",
                        toastType:"success", submit: false, showToast: true, commentRemoveSubmit: false});
                }, 100)
            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                errorObj.type === 3 ? this.SubmitComment(errorObj.content) :
                    this.setState({toastContent:errorObj.content,
                        toastType:"danger", submit: false, showToast: true});
            }
        )
    }

    getTagObj(tags){
        if(this.state.blogTag === null) return;
        let tagarray = tags.split(',');
        let Tags = [...this.state.blogTag].filter(o => tagarray.indexOf(o.id) > -1);
        return Tags;

    }

    checkIfReacted(blog_id, type = null){
        let _blogReaction = [...this.state.blogReaction];
        let id = this.props.userStatus.id;
        _blogReaction = _blogReaction.filter( o => o.blog_id === blog_id && o.user_id === id);
        if(_blogReaction.length > 0){
            if(type === 'id'){
                return _blogReaction[0].id
            }
            else{
                return _blogReaction[0].value
            }

        }
        else {
            return false
        }
    }

    reactToBlog(value, blog_id){
        this.setState({showToast:false});
        if(this.props.userStatus === null) {
            this.setState({toastContent:"Authentication Error!!! Only Registered user can react to post",
                toastType:"danger", submit: false, showToast: true});
            return;
        }
        this.state.reactionID = this.checkIfReacted(blog_id, 'id');
        this.state.reactionID ? this.state.reactionType = "put" : null;

        let contents = {
            blog_id: blog_id, value:value, user_id: this.props.userStatus.id,
        };
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        this.state.reactionData = payload;

        this.addReaction();
    }

    addReaction(access = null){
        let url = this.props.backEndLinks.blogReaction;
        this.state.reactionID ? url = this.props.backEndLinks.blogReaction + this.state.reactionID : null;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem(SiteData.name+'-user')).access: null;
        this.props.authorizeWithData(this.state.reactionType, url, this.state.reactionData, accessToken).then(
            (res) =>{
                if(this.state.reactionType === "post"){
                    this.props.blogContent.blogReaction.push(res.data);
                }
                else{
                    this.props.blogContent.blogReaction = res.data;
                }

                this.props.setContent('SET_BLOG_CONTENT', this.props.blogContent);
            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                errorObj.type === 3 ? this.addReaction(errorObj.content) :
                    this.setState({toastContent:errorObj.content,
                        toastType:"danger", submit: false, showToast: true});
            }
        )
    }

    checkIfCommentReacted(blog_id, type = null){
        let _blogReaction = [...this.state.blogCommentReaction];
        let id = this.props.userStatus.id;
        _blogReaction = _blogReaction.filter( o => o.blog_comment_id === blog_id && o.user_id === id);
        if(_blogReaction.length > 0){
            if(type === 'id'){
                return _blogReaction[0].id
            }
            else{
                return _blogReaction[0].value
            }

        }
        else {
            return false
        }
    }

    reactToBlogComment(value, blog_id){
        this.setState({showToast:false});
        if(this.props.userStatus === null) {
            this.setState({toastContent:"Authentication Error!!! Only Registered user can react to post",
                toastType:"danger", submit: false, showToast: true});
            return;
        }
        this.state.reactionID = this.checkIfCommentReacted(blog_id, 'id');
        this.state.reactionID ? this.state.reactionType = "put" : null;

        let contents = {
            blog_comment_id: blog_id, value:value, user_id: this.props.userStatus.id,
        };
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        this.state.reactionData = payload;

        this.addCommentReaction();
    }

    addCommentReaction(access = null){
        let url = this.props.backEndLinks.blogCommentReaction;
        this.state.reactionID ? url = this.props.backEndLinks.blogCommentReaction + this.state.reactionID : null;
        let accessToken = access;
        access === null ? accessToken = JSON.parse(localStorage.getItem(SiteData.name+'-user')).access: null;
        this.props.authorizeWithData(this.state.reactionType, url, this.state.reactionData, accessToken).then(
            (res) =>{
                if(this.state.reactionType === "post"){
                    this.props.blogContent.blogCommentReaction.push(res.data);
                }
                else{
                    this.props.blogContent.blogCommentReaction = res.data;
                }

                this.props.setContent('SET_BLOG_CONTENT', this.props.blogContent);
            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                errorObj.type === 3 ? this.addReaction(errorObj.content) :
                    this.setState({toastContent:errorObj.content,
                        toastType:"danger", submit: false, showToast: true});
            }
        )
    }

    render(){

        return(
            <div className={'wrapper'}>
                <HomeHeader history={this.props.history}/>
                {
                    this.state.showToast ?
                        <Toast type={this.state.toastType} content={this.state.toastContent} closeAlert={this.closeAlert.bind(this)}/>
                        :
                        null
                }
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={() => this.setState({modalIsOpen:false})}
                    style={customStyles}
                    contentLabel="Delete Notification"
                    ariaHideApp={false}
                >

                    <div className={'modal-class'}>
                        <h2>Delete Notification</h2>
                        <p>
                            You're about to remove your comment!
                        </p>
                        <div className={'controls'}>
                            <button onClick={() => this.cancelRemove()}>Cancel</button>
                            {
                                this.state.commentRemoveSubmit ?
                                    <button>
                                        <div className={'button-loader'}>
                                            <ol className={'loading-butt'}> </ol>
                                            <ol className={'loading-butt'}> </ol>
                                            <ol className={'loading-butt'}> </ol>
                                        </div>
                                    </button>
                                    :
                                    <button onClick={() => this.RemoveComment()}>Continue</button>
                            }


                        </div>
                    </div>
                </Modal>
                <div className={'wrapper'}>
                    <div className={'blog-container'}>
                        <SideBar tagLink={'/blog/video'} tagList={this.state.activeBlog === null || this.state.activeBlog.length < 1? null :
                            this.getTagObj(this.state.activeBlog[0].tags)}/>
                        <div className={'mainContent'}>
                            <div className={'content-display'}>
                                {
                                    this.state.activeBlog === null || this.state.pageLoading ? <div className={'left'}><SubLoader/></div> :
                                        this.state.activeBlog.length < 1 ? <div className={'left'}><h4 className={'main-notify'}>The video content you're looking for has either been removed or doesn't exist!</h4></div>:
                                            <div className={'video-explorer'}>

                                                <div className={'left'}>
                                                    <div>
                                                        <div className={'title'}>
                                                            {
                                                                this.state.activeBlog[0].title
                                                            }
                                                            &nbsp;<span>[{this.getActiveGenre(this.state.activeBlog[0].genre)}]</span>
                                                        </div>
                                                        <Player
                                                            className={'videoPlayer'}
                                                            playsInline
                                                            poster={this.state.activeBlog[0].coverpic}
                                                            src={this.state.activeBlog[0].video}
                                                        />

                                                        <div className={'controls'}>
                                                            <li><span>Posted: {TimeAgo(this.state.activeBlog[0].updated_on)}</span></li>
                                                            {
                                                                this.props.userStatus === null ?
                                                                    <div className={'props'}>
                                                                        <li onClick={() => this.reactToBlog(1, this.state.activeBlog[0].id)}><Icon icon={thumbsOUp}/><span>{this.getReactions(this.state.activeBlog[0].id, 1)}</span></li>
                                                                        <li onClick={() => this.reactToBlog(-1, this.state.activeBlog[0].id)}><Icon icon={thumbsODown}/><span>{this.getReactions(this.state.activeBlog[0].id, -1)}</span></li>
                                                                    </div>:
                                                                    <div className={'props'}>
                                                                        <li onClick={() => this.reactToBlog(parseInt(this.checkIfReacted(this.state.activeBlog[0].id)) > 0 ? 0 : 1, this.state.activeBlog[0].id)}>
                                                                            <Icon className={parseInt(this.checkIfReacted(this.state.activeBlog[0].id))> 0 ? 'active':null} icon={thumbsOUp}/>
                                                                            <span>{this.getReactions(this.state.activeBlog[0].id, 1)}</span>
                                                                        </li>
                                                                        <li onClick={() => this.reactToBlog(parseInt(this.checkIfReacted(this.state.activeBlog[0].id)) < 0 ? 0 : -1, this.state.activeBlog[0].id)}>
                                                                            <Icon className={parseInt(this.checkIfReacted(this.state.activeBlog[0].id))< 0 ? 'active':null} icon={thumbsODown}/>
                                                                            <span>{this.getReactions(this.state.activeBlog[0].id, -1)}</span>
                                                                        </li>
                                                                    </div>

                                                            }
                                                        </div>
                                                        <div className={'divider'}> </div>
                                                        <div className={'details'}  dangerouslySetInnerHTML={{__html: this.state.activeBlog[0].detail}} />
                                                        <div className={'divider'}> </div>
                                                        <div className={'shareLinks'}>
                                                            <li><FacebookShareButton
                                                                url={window.location.href}
                                                                quote={this.state.activeBlog[0].title}
                                                                className="button"
                                                            >
                                                                <FacebookIcon size={32} round={true} />
                                                            </FacebookShareButton></li>
                                                            <li><TwitterShareButton
                                                                url={window.location.href}
                                                                title={this.state.activeBlog[0].title}
                                                                className="button"
                                                            >
                                                                <TwitterIcon size={32} round={true}/>
                                                            </TwitterShareButton></li>
                                                            <li><GooglePlusShareButton
                                                                url={window.location.href}
                                                                title={this.state.activeBlog[0].title}
                                                                className="button"
                                                            >
                                                                <GooglePlusIcon size={32} round={true}/>
                                                            </GooglePlusShareButton></li>
                                                            <li><LinkedinShareButton
                                                                url={window.location.href}
                                                                title={this.state.activeBlog[0].title}
                                                                className="button"
                                                            >
                                                                <LinkedinIcon size={32} round={true}/>
                                                            </LinkedinShareButton></li>
                                                            <li><TelegramShareButton
                                                                url={window.location.href}
                                                                title={this.state.activeBlog[0].title}
                                                                className="button"
                                                            >
                                                                <TelegramIcon size={32} round={true}/>
                                                            </TelegramShareButton></li>
                                                            <li><PinterestShareButton
                                                                url={window.location.href}
                                                                title={this.state.activeBlog[0].title}
                                                                media={this.state.activeBlog[0].coverpic}
                                                                className="button"
                                                            >
                                                                <PinterestIcon size={32} round={true}/>
                                                            </PinterestShareButton></li>
                                                            <li><WhatsappShareButton
                                                                url={window.location.href}
                                                                title={this.state.activeBlog[0].title}
                                                                className="button"
                                                            >
                                                                <WhatsappIcon size={32} round={true}/>
                                                            </WhatsappShareButton></li>
                                                        </div>
                                                        <div className={'divider'}> </div>
                                                        {
                                                            this.state.blogComment === null || this.state.activeBlogComment === null ? <SubLoader/> :
                                                                this.state.activeBlogComment.length < 1 ?<h4 className={'main-notify'}>No comment found for post!</h4>:
                                                                    <div className={'comments'}>
                                                                        <div className={'heading'}>{this.state.activeBlogComment.length} Comment{this.state.activeBlogComment.length > 1 ? 's' : null}</div>
                                                                        <div className={'comment-list'}>
                                                                            {
                                                                                this.getComment()
                                                                            }

                                                                            {
                                                                                this.state.contentLoadmore ? this.state.contentLoading ? <button className={'butt-disabled loadmore'}>
                                                                                    <div className={'button-loader'}>
                                                                                        <ol className={'loading-butt'}> </ol>
                                                                                        <ol className={'loading-butt'}> </ol>
                                                                                        <ol className={'loading-butt'}> </ol>
                                                                                    </div>
                                                                                </button> : <button className={'loadmore'} onClick={() => this.loadmore()}>Load More</button> : null
                                                                            }
                                                                        </div>
                                                                    </div>

                                                        }

                                                        <div className={'add-comment'}>
                                                            <h3>{this.state.commentEdit ? "Edit" : this.state.blogCommentReply ? "Reply" : "Add"} Comment {this.state.commentEdit ? <span onClick={() => this.cancelEdit()}>Cancel Edit</span> : this.state.blogCommentReply ? <span onClick={() => this.cancelReply()}>Cancel Reply</span> : null}</h3>

                                                            <form>
                                                                {
                                                                    this.state.blogCommentReply ?
                                                                        <div className={'textToReply'}dangerouslySetInnerHTML={{__html: this.state.activeComment.comment}} />
                                                                        : null
                                                                }
                                                                <div className={'formgroup'}>
                                                            <textarea className={'form-comment'} rows="15" value={this.state.comment}
                                                                      onChange={(e) => this.setState({comment: e.target.value})}
                                                                      placeholder={'write comment'}> </textarea>
                                                                </div>
                                                                <div className={'comment-con'}>
                                                                    {
                                                                        this.state.submit ? <button className={'butt-disabled loadmore'}>
                                                                                <div className={'button-loader'}>
                                                                                    <ol className={'loading-butt'}> </ol>
                                                                                    <ol className={'loading-butt'}> </ol>
                                                                                    <ol className={'loading-butt'}> </ol>
                                                                                </div>
                                                                            </button> :
                                                                            this.state.commentEdit ?
                                                                                <button onClick={(e) =>[e.preventDefault(), this.setState({submit:true}), this.UpdateComment()]}>Update Comment</button>
                                                                                :
                                                                                <button onClick={(e) =>[e.preventDefault(), this.setState({submit:true}), this.SubmitComment()]}>Submit</button>
                                                                    }
                                                                </div>

                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={'right'}>
                                                    <div className={'heading'}>
                                                        Related Posts
                                                    </div>
                                                    {
                                                        this.state.activeBlog === null || this.state.activeBlog.length < 1 ? <SubLoader/> :
                                                            this.getBlogs().length < 1 ? <h4 className={'main-notify'}>No video content found!</h4>:
                                                                this.getBlogs()
                                                    }

                                                </div>
                                            </div>
                                }

                            </div>
                            <Footer/>

                        </div>
                    </div>
                </div>
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
        userStatus: state.userStatus, blogContent: state.blogContent, userContent: state.userContent,
        backEndLinks: state.backEndLinks,
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoExplorer);