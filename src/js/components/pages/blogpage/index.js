import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {thumbsOUp} from 'react-icons-kit/fa/thumbsOUp';
import {eye} from 'react-icons-kit/fa/eye';
import {comment} from 'react-icons-kit/fa/comment';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'



import HomeHeader from '../common/header';
import Footer from '../common/footer';
import SideBar from './component/sidebar';
import SubLoader from "../common/subLoader";
import ImageLoader from '../common/imageLoader'
import Toast from '../common/toast';
import QS from 'query-string'
import Loadash from 'lodash'

import {actionWithoutData, setContent, authorizeWithData, authorizeWithoutData, actionWithData} from '../../redux/actions'

const initialState = {
    blogs: null, blogCount: 0, contentPerPage: 6, currentList: 1, contentLoadmore: false, contentLoading: false,
    blogReaction: null, blogView: null, blogComment: null, blogTag: null,blogGenre: null, showToast: false, toastType: "success", toastContent: "",
    querystring: null, queryType :"",pageLoading: false,
};


class Index extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
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

    checkQuery(){
        this.setState({pageLoading:true, querystring: null});
        setTimeout(() => {
            let searchString = QS.parse(this.props.location.search);
            if(Loadash.isEmpty(searchString)){
                this.setState({querystring:null})
            }
            else{
                if(Loadash.has(searchString, 'context')){
                    this.setState({querystring: searchString.context.replace('-',' '), queryType:'genre'})
                }
                else{
                    this.setState({querystring: searchString.tag.replace('-',' '), queryType:'tag'})
                }
            }

            this.setState({pageLoading:false});
        }, 1000)
    }

    componentWillReceiveProps(props){
        this.checkQuery();
        if(props.blogContent.hasOwnProperty('blogs')){
            if(props.blogContent.blogs !== this.state.blogs){
                let blogList = [...props.blogContent.blogs];
                blogList = blogList.filter(o => parseInt(o.type) === 0 && parseInt(o.publish) === 1);
                this.setState({blogs: blogList});
            }
        }
        if(props.blogContent.hasOwnProperty('blogComment')){
            if(props.blogContent.blogComment !== this.state.blogComment){
                this.setState({blogComment: props.blogContent.blogComment});
            }
        }
        if(props.blogContent.hasOwnProperty('blogReaction')){
            if(props.blogContent.blogReaction !== this.state.blogReaction){
                this.setState({blogReaction: props.blogContent.blogReaction});
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
    }

    getBlogs(){
        let _blogContent = [...this.state.blogs].reverse();
        if(this.state.querystring !== null && this.state.queryType === "genre"){
            let activeGenre = [...this.state.blogGenre].filter(o => o.title === this.state.querystring);
            _blogContent = _blogContent.filter(o => o.genre === activeGenre[0].id);
        }
        if(this.state.querystring !== null && this.state.queryType === "tag"){
            let activeTag = [...this.state.blogTag].filter(o => o.title === this.state.querystring);
            _blogContent = _blogContent.filter(o => o.tags.split(',').indexOf(activeTag[0].id) > -1);
        }
        let _tempContent = [];
        let ListCount = this.state.currentList * this.state.contentPerPage;
        _blogContent.length < ListCount ? ListCount = _blogContent.length : null;

        for(let i = 0; i < ListCount; i++){
            _tempContent.push(
                <div key={i} className={'blog-card'}>
                    <div className={'image-con'}>
                        <ImageLoader/>
                        <img src={_blogContent[i].coverpic} alt=""/>
                    </div>
                    <div className={'context'}>
                        <div className={'details'}>
                            <div className={'title'}>{_blogContent[i].title}</div>
                            <div className={'content'}>
                                {_blogContent[i].detail.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 150)}
                                {_blogContent[i].detail.replace(/<\/?[^>]+(>|$)/g, "").length > 150 ? "..." : null}
                            </div>
                            <div className={'props'}>
                                <li><Icon icon={thumbsOUp}/><span>{this.getReactions(_blogContent[i].id, 1)}</span></li>
                                <li><Icon icon={eye}/><span>{this.getView(_blogContent[i].id)}</span></li>
                                <li><Icon icon={comment}/><span>{this.getCommentCount(_blogContent[i].id)}</span></li>
                            </div>
                        </div>
                        <button onClick={() => this.props.history.push('/blog/'+_blogContent[i].slug)}>
                            continue Reading
                        </button>
                    </div>
                </div>
            )
        }
        _blogContent.length > ListCount ? this.state.contentLoadmore = true: this.state.contentLoadmore = false;
        return _tempContent
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

    getCommentCount(contentID){
        if(this.state.blogComment === null)return;
        let _commentList = [...this.state.blogComment];
        _commentList = _commentList.filter(o => o.blog_id === contentID);
        return _commentList.length;
    }

    loadmore(){
        this.setState({contentLoading:true});
        setTimeout(()=>{
            this.setState({currentList:this.state.currentList + 1, contentLoading: false});
        }, 500);

    }
    closeAlert(){
        this.setState({showToast:false})
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
                <div className={'wrapper'}>
                    <div className={'blog-container'}>
                        <SideBar activeSelection={this.state.querystring} tagLink={'/blog'} tagList={this.state.blogTag === null ? null : this.state.blogTag} type={'blog'}/>
                        <div className={'mainContent'}>
                            <div className={'content-display'}>
                                <div className={'head'}>Latest Blog
                                    {
                                        this.state.querystring === null ? null :
                                            this.state.queryType === "genre" ?
                                            <span>[Showing blog post of type <strong>{this.state.querystring}</strong>]</span>
                                                :
                                                <span>[Showing blog post with tag <strong>{this.state.querystring}</strong>]</span>
                                    }

                                </div>
                                <div className={'blog-container'}>
                                    {
                                        this.state.blogs === null || this.state.pageLoading ? <SubLoader/> :
                                            this.getBlogs().length < 1 ? this.state.querystring !== null ? <h4 className={'main-notify'}>No blog content was found under [{this.state.querystring}]</h4> :
                                                <h4 className={'main-notify'}>No Latest blog was found!</h4> :
                                                this.getBlogs()
                                    }
                                </div>

                                {
                                    this.state.contentLoadmore ? this.state.contentLoading ? <button className={'butt-disabled loadmore'}>
                                        <div className={'button-loader'}>
                                            <li className={'loading-butt'}> </li>
                                            <li className={'loading-butt'}> </li>
                                            <li className={'loading-butt'}> </li>
                                        </div>
                                    </button> : <button className={'loadmore'} onClick={() => this.loadmore()}>Load More</button> : null
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
        userStatus: state.userStatus, blogContent: state.blogContent,
        backEndLinks: state.backEndLinks,
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);