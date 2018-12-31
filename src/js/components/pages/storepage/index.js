import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'


import Header from '../common/header';
import Contact from '../common/contact';
import Footer from '../common/footer';
import Slider from './components/slider';
import StoreContent from './components/storeList';
import SideBar from './components/sidebar';
import SubLoader from "../common/subLoader";

import {actionWithoutData, setContent} from '../../redux/actions'
import Goup from '../common/go_up'

const initialState = {
    storeContent: null, contentPerPage: 6, currentList: 1, contentLoadmore: false, contentLoading: false,
    storeCategory: null, activeCategory: 0, activeCategoryName: "", pageLoading: true,
};

class StoreIndex extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
        this.goup = new Goup;
        this.goup.goup();
    }

    componentWillMount(){
        this.verifyList();
        this.componentWillReceiveProps(this.props);
        setTimeout(() => {
            this.setState({pageLoading:false});
        }, 1000);
        this.props.setContent("SET_ACTIVE_LINK", window.location.pathname);
    }

    verifyList(){
        let url = "";
        if(!this.props.storeContent.hasOwnProperty('main')){
            url = this.props.backEndLinks.store;
            this.props.actionWithoutData('get', url).then(
                res => {
                    this.props.storeContent.main = res.data;
                    this.props.setContent("SET_STORE_CONTENT", this.props.storeContent);
                },
                err => {
                    alert('Unable to get store content. please reload page');
                }
            )
        }
        if(!this.props.storeContent.hasOwnProperty('storeCategory')){
            url = this.props.backEndLinks.storeCategory;
            this.props.actionWithoutData('get', url).then(
                res => {
                    this.props.storeContent.storeCategory = res.data;
                    this.props.setContent("SET_STORE_CONTENT", this.props.storeContent);
                },
                err => {
                    alert('Unable to get store content. please reload page');
                }
            )
        }
    }

    componentWillReceiveProps(props){
        if(props.storeContent.hasOwnProperty('main')){
            if(props.storeContent.main !== this.state.storeContent){
                this.setState({storeContent: props.storeContent.main});
            }
        }
        if(props.storeContent.hasOwnProperty('storeCategory')){
            if(props.storeContent.storeCategory !== this.state.storeCategory){
                this.setState({storeCategory: props.storeContent.storeCategory});
            }
        }
    }

    getStoreContents(){
        let _storeContent = [...this.state.storeContent].reverse();
        let _storeCategory = [...this.state.storeCategory];
        this.state.activeCategory !== 0 ? _storeContent = _storeContent.filter(o => o.type === this.state.activeCategory) : null;

        let _tempContent = [];
        let ListCount = this.state.currentList * this.state.contentPerPage;
        _storeContent.length < ListCount ? ListCount = _storeContent.length : null;
        for(let i = 0; i < ListCount; i++){
            let activeCategory = _storeCategory.filter(o => o.id === _storeContent[i].type);
            _tempContent.push(
                <StoreContent key={i}
                              imageFile={_storeContent[i].coverpic}
                              type={activeCategory[0].title}
                              title={_storeContent[i].title}
                              details={_storeContent[i].detail}
                              slug={_storeContent[i].slug}
                />
            )
        }
        _storeContent.length > ListCount ? this.state.contentLoadmore = true: this.state.contentLoadmore = false;
        return _tempContent
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
        if(this.state.storeCategory === null)return;
        let _category = [...this.state.storeCategory];
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

    loadmore(){
        this.setState({contentLoading:true});
        setTimeout(()=>{
            this.setState({currentList:this.state.currentList + 1, contentLoading: false});
        }, 1000);
    }

    render(){

        return(
            <div className={'wrapper'}>
                <Header history={this.props.history}/>
                <Slider/>
                <div className={'store-container'}>

                    {
                        this.state.pageLoading ?
                        <div className={'centerer'}>
                            <SubLoader/>
                        </div>:
                            <div>
                                <SideBar storeCategory={this.getCategories()}/>
                                {
                                    this.state.activeCategory === 0 ? null :
                                        <div className={'centerer'}>
                                            <span className={'label'}>Showing store contents in the category of <strong>{this.state.activeCategoryName}</strong></span>
                                        </div>
                                }
                                <div className={'inner'}>
                                    {
                                        this.state.storeContent === null || this.state.storeCategory === null ? <SubLoader/> :
                                            this.getStoreContents().length < 1 ? <h3 className={'main-notify'}>No Store content Available</h3> :
                                                <div className={'store-content'}>
                                                    {this.getStoreContents()}
                                                </div>
                                    }
                                </div>
                                <div className={'centerer'}>
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
                            </div>
                    }


                </div>

                <Contact/>
                <Footer/>
            </div>
        )
    }
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, storeContent: state.storeContent,
        backEndLinks: state.backEndLinks,
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreIndex);