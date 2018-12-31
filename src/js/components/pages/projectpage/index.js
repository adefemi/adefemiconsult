import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import NoImage from '../../../../assets/images/No_Image_Available.jpg'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'


import Header from '../common/header';
import Contact from '../common/contact';
import Footer from '../common/footer';
import Slider from './components/slider';
import ProjectList from '../common/projectList';
import SubLoader from "../common/subLoader";

import {actionWithoutData, setContent} from '../../redux/actions'

const initialState = {
    portfolioContent: null, portfolioCount: 0, contentPerPage: 6, currentList: 1, contentLoadmore: false, contentLoading: false,
    showToast: false, toastType: "success", toastContent: "", portfolioCategory: null,activeCategory: 0, activeCategoryName: "",
    pageLoading: true,
};

class ProjectIndex extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.verifyList(this.props);
        this.componentWillReceiveProps(this.props);
        setTimeout(() => {
            this.setState({pageLoading:false});
        }, 1000);
        this.props.setContent("SET_ACTIVE_LINK", window.location.pathname);
    }

    verifyList(props){
        let url = "";
        if(!props.portfolioContent.hasOwnProperty('main')){
            url = this.props.backEndLinks.portfolio;
            this.props.actionWithoutData('get', url).then(
                (res) => {
                    this.props.portfolioContent.main = res.data;
                    this.props.setContent("SET_PORTFOLIO_CONTENT", this.props.portfolioContent);
                },
                (err) => {
                    alert("Unable to get portfolio content. Please reload this page!")
                }
            );
        }
        if(!props.portfolioContent.hasOwnProperty('portfolioCategory')){
            url = this.props.backEndLinks.portfolioCategory;
            this.props.actionWithoutData('get', url).then(
                (res) => {
                    this.props.portfolioContent.portfolioCategory = res.data;
                    this.props.setContent("SET_PORTFOLIO_CONTENT", this.props.portfolioContent);
                },
                (err) => {
                    alert("Unable to get portfolio content. Please reload this page!")
                }
            );
        }
    }

    componentWillReceiveProps(props){
        if(props.portfolioContent.hasOwnProperty('main')){
            if(props.portfolioContent.main !== this.state.portfolioContent){
                this.setState({portfolioContent: props.portfolioContent.main});
            }
        }
        if(props.portfolioContent.hasOwnProperty('portfolioCategory')){
            if(props.portfolioContent.portfolioCategory !== this.state.portfolioCategory){
                this.setState({portfolioCategory: props.portfolioContent.portfolioCategory});
            }
        }

    }

    getProjects(){
        let _portfolioContent = [...this.state.portfolioContent].reverse();
        if(this.state.activeCategory === 0){

        }
        else if(this.state.activeCategory === "completed" || this.state.activeCategory === "in-progress"){
            _portfolioContent = _portfolioContent.filter(o => o.status === this.state.activeCategory);
        }
        else{
            _portfolioContent = _portfolioContent.filter(o => o.category === this.state.activeCategory);
        }
        let _tempContent = [];
        let ListCount = this.state.currentList * this.state.contentPerPage;
        _portfolioContent.length < ListCount ? ListCount = _portfolioContent.length : null;

        for(let i = 0; i < ListCount; i++){
            _tempContent.push(
                <ProjectList key={i} slug={_portfolioContent[i].slug} imageFile={_portfolioContent[i].coverpic} details={_portfolioContent[i].title}/>
            )
        }
        _portfolioContent.length > ListCount ? this.state.contentLoadmore = true: this.state.contentLoadmore = false;
        return _tempContent
    }

    loadmore(){
        this.setState({contentLoading:true});
        setTimeout(()=>{
            this.setState({currentList:this.state.currentList + 1, contentLoading: false});
        }, 500);

    }

    test(obj){
        if(obj === 0){
            this.setState({pageLoading: true, activeCategory: 0});
        }
        else{
            this.setState({pageLoading: true, activeCategory: obj.id, activeCategoryName:obj.title});
        }
        setTimeout(() => {
            this.setState({pageLoading:false});
        }, 1000)
    }

    getCategories(){
        let _category = [...this.state.portfolioCategory];
        let array = [];

        _category.map((o, i) => array.push(
            <li className={this.state.activeCategory === o.id ? 'active':null} key={i} onClick={() => this.test(o)}>{o.title}</li>
            )
        );
        if(array.length > 0){
            array.push(<li key={array.length} onClick={() => this.test(0)} className={this.state.activeCategory === 0 ? 'active':null}>All</li>);
        }

        return array
    }

    setStatus(content){
        this.setState({pageLoading: true, activeCategory: content, activeCategoryName:content});
        setTimeout(() => {
            this.setState({pageLoading:false});
        }, 1000)
    }

    render(){

        return(
            <div className={'wrapper'}>
                <Header history={this.props.history}/>
                <Slider/>
                <div className={'portfolio-page'}>
                    <div className={'list-nav'}>
                        <li className={this.state.activeCategory === "completed" ? 'active':null} onClick={() => this.setStatus("completed")}>Completed</li>
                        <li className={this.state.activeCategory === "in-progress" ? 'active':null} onClick={() => this.setStatus("in-progress")}>In-progress</li>
                        {
                            this.state.portfolioCategory === null ? <h4>Loading</h4> :
                                this.state.portfolioCategory.length < 1 ? <h3 className={'main-notify'}>No category found!</h3>:
                                    this.getCategories()
                        }
                    </div>
                    <div className={'list-content'}>
                        {
                            this.state.pageLoading ?
                                <div className={'centerer'}>
                                    <SubLoader/>
                                </div>:
                                <div>
                                    <div>
                                        <div className={'title'}>Project Outlook</div>
                                    </div>
                                    {
                                        this.state.activeCategory === 0 ? null :
                                            <div className={'centerer'}>
                                                <span className={'label'}>Showing store contents in the category of <strong>{this.state.activeCategoryName}</strong></span>
                                            </div>
                                    }
                                    {
                                        this.state.portfolioContent === null || this.state.portfolioCategory === null ? <SubLoader/> :
                                            this.getProjects().length < 1 || this.state.portfolioCategory.length < 1 ?
                                                <h3 className={'main-notify'}>No content is available</h3> :
                                                <div className={'item-list'}>
                                                    {this.getProjects()}
                                                </div>
                                    }
                                    {
                                        this.state.contentLoadmore ? this.state.contentLoading ? <button className={'butt-disabled'}>
                                            <div className={'button-loader'}>
                                                <li className={'loading-butt'}> </li>
                                                <li className={'loading-butt'}> </li>
                                                <li className={'loading-butt'}> </li>
                                            </div>
                                        </button> : <button onClick={() => this.loadmore()}>Load More</button> : null
                                    }
                                </div>
                        }

                    </div>
                </div>
                <Contact/>
                <Footer/>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, portfolioContent: state.portfolioContent,
        backEndLinks: state.backEndLinks,
    })
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectIndex);