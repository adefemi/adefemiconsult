import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import $ from 'jquery'
import {indentDecrease} from 'react-icons-kit/icomoon/indentDecrease'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import proptype from 'prop-types'

import SubLoader from "../../common/subLoader";
import ImageLoader from '../../common/imageLoader'
import Toast from '../../common/toast';

import {actionWithoutData, setContent, authorizeWithData, authorizeWithoutData, actionWithData} from '../../../redux/actions'

const initialState = {
    blogGenre: null, blogTag: null, showToast: false, toastType: "success", toastContent: "",
};

class SideBar extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.verifyList(this.props);
        this.componentWillReceiveProps(this.props);
    }

    verifyList(props){
        let url = "";
        
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
    }

    componentWillReceiveProps(props){
        
        if(props.blogContent.hasOwnProperty('blogGenre')){
            if(props.blogContent.blogGenre !== this.state.blogGenre){
                this.setState({blogGenre: props.blogContent.blogGenre});
            }
        }
        if(props.tagList !== this.state.blogTag){
            this.setState({blogTag: props.tagList});
        }
    }

    toggleSidebar(){
        let SideBar = $('.sidebarContainer');
        SideBar.hasClass('close') ? SideBar.removeClass('close') : SideBar.addClass('close')
    }

    getTags(){
        let tagList = [...this.state.blogTag];
        let _array = [];
        tagList.map((o, i) => {
            _array.push(
                <Link key={i} to={this.props.tagLink+'?tag='+o.title}><button >{o.title}</button></Link>
            )
        });
        return _array;
    }
    
    getVideoGenre(){
        let genreList = [...this.state.blogGenre];
        genreList.filter(o => parseInt(o.type) === 1);
        let _array = [];
        genreList.map((o, i) => {
            _array.push(
                <Link key={i} to={'/blog/video?context='+o.title.replace(' ', '-')}>
                    <li className={this.props.activeSelection === o.title && this.props.type==="video" ? "active" : null} style={{"textTransform":"capitalize"}}>{o.title}</li></Link>
            )
        });
        return _array;
    }

    getBlogGenre(){
        let genreList = [...this.state.blogGenre];
        genreList = genreList.filter(o => parseInt(o.type) === 1);
        let _array = [];
        genreList.map((o, i) => {
            _array.push(
                <Link key={i} to={'/blog?context='+o.title.replace(' ', '-')}>
                    <li className={this.props.activeSelection === o.title && this.props.type==="blog" ? "active" : null} style={{"textTransform":"capitalize"}}>{o.title}</li></Link>
            )
        });
        return _array;
    }

    render(){

        return(
            <div className={'sidebarContainer close'}>
                <button className={'selector'} onClick={() => this.toggleSidebar()}><Icon icon={indentDecrease}/></button>
                <ul>
                    <Link to={'/blog'}><h3>Latest Blog</h3></Link>

                    {
                        this.state.blogGenre === null ? <label>Loading...</label>:
                            this.getBlogGenre().length < 1 ? <label>No link available</label>:
                                this.getBlogGenre()
                    }

                    <Link to={'/blog/video'}><h3>Video Tutorials</h3></Link>
                    {
                        this.state.blogGenre === null ? <label>Loading...</label>:
                            this.getVideoGenre().length < 1 ? <label>No link available</label>:
                                this.getVideoGenre()
                    }

                    <h5>Tags</h5>
                    <div className={'tagList'}>
                        {
                            this.state.blogTag === null ? <label>Loading...</label> :
                                this.state.blogTag.length < 1 ? <h4>No tag was found!</h4>:
                                    this.getTags()
                        }
                    </div>
                </ul>
            </div>
        )
    }
}
SideBar.defaultProps = {
    activeSelection: "",
    type: null,
    tagList: null,
    tagLink: null,
};

SideBar.propTypes = {
    activeSelection: proptype.any,
    type: proptype.any,
    tagList: proptype.any,
    tagLink: proptype.any,
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

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
