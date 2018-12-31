import React from 'react';
import {Icon} from 'react-icons-kit';
import {github} from 'react-icons-kit/icomoon/github'
import {opera} from 'react-icons-kit/icomoon/opera'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'



import Header from '../common/header';
import Footer from '../common/footer';
import SubLoader from "../common/subLoader";
import ImageLoader from '../common/imageLoader'
import ProjectList from '../common/projectList';
import Slider1 from '../common/slider1'
import Toast from '../common/toast';

import {actionWithoutData, setContent, authorizeWithData, authorizeWithoutData, actionWithData} from '../../redux/actions'
import {processError} from '../common/miscellaneous'
import Goup from '../common/go_up'
import {TimeAgo} from "../common/miscellaneous";

import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    GooglePlusShareButton,
    GooglePlusIcon,
    LinkedinShareButton,
    LinkedinIcon,
    TelegramShareButton,
    TelegramIcon,
    PinterestShareButton,
    PinterestIcon,
    WhatsappShareButton,
    WhatsappIcon,
} from 'react-share';


const initialState = {
    portfolioContent: null, portfolioCapture: null, portfolioHighlight: null, activeHighlight:"", activePortfolio: null, activeLink:null,
    contentPerPage: 5, currentList: 1, contentLoadmore: false, contentLoading: false,showToast: false, toastType: "success", toastContent: "",
    comment: "", name: "", email: "", submit: false, activeUser: null, pageLoading: true, portfolioCategory: null,
};

class ProjectExplorer extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    getActiveContent(){
        let goup = new Goup;
        goup.goup();
        this.setState({currentList: 1});
        let _portfolioList = this.props.portfolioContent.main;
        let slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let activePortfolio = _portfolioList.filter(o => o.slug === slug);

        if(activePortfolio.length > 0){
            this.setState({activePortfolio:activePortfolio});
            this.state.activePortfolio = activePortfolio;
        }
        else{
            this.setState({activePortfolio:[]});
            this.state.activePortfolio = [];
        }
        setTimeout(() => {
            this.setState({pageLoading:false});
        }, 1000);

        this.getActiveHighlight();

    }

    componentWillMount(){
        this.verifyList(this.props);
        this.componentWillReceiveProps(this.props);
        this.props.setContent("SET_ACTIVE_LINK", window.location.pathname);
    }

    verifyList(props){
        let url = "";
        if(!props.portfolioContent.hasOwnProperty('capture')){
            url = this.props.backEndLinks.portfolioCapture;
            this.props.actionWithoutData('get', url).then(
                res => {
                    this.props.portfolioContent.capture = res.data;
                    this.props.setContent("SET_PORTFOLIO_CONTENT", this.props.portfolioContent);
                },
                err => {
                    alert('Unable to get portfolio captures. please reload page');
                }
            )
        }
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
        if(!props.portfolioContent.hasOwnProperty('highlight')){
            url = this.props.backEndLinks.portfolioHighlight;
            this.props.actionWithoutData('get', url).then(
                (res) => {
                    this.props.portfolioContent.highlight = res.data;
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

    getActiveHighlight(){
        if(this.state.activePortfolio === null || this.state.activePortfolio.length < 1 || this.state.portfolioHighlight === null) return;
        let activeHighLight = [...this.state.portfolioHighlight].filter(o => parseInt(o.p_id) === parseInt(this.state.activePortfolio[0].id));
        this.setState({activeHighlight: activeHighLight});
    }

    componentWillReceiveProps(props){
        if(props.portfolioContent.hasOwnProperty('main')){
            if(props.portfolioContent.main !== this.state.portfolioContent || window.location.href !== this.state.activeLink){
                this.setState({portfolioContent: props.portfolioContent.main, activeLink: window.location.href, pageLoading: true});
                let goup = new Goup;
                goup.goup();
                this.getActiveContent();
            }
        }
        if(props.portfolioContent.hasOwnProperty('capture')){
            if(props.portfolioContent.capture !== this.state.portfolioCapture){
                this.setState({portfolioCapture: props.portfolioContent.capture});
            }
        }
        if(props.portfolioContent.hasOwnProperty('highlight')){
            if(props.portfolioContent.highlight !== this.state.portfolioHighlight){
                this.setState({portfolioHighlight: props.portfolioContent.highlight});
                this.state.portfolioHighlight = props.portfolioContent.highlight;
                this.getActiveHighlight();
            }
            else{
                this.getActiveHighlight();
            }
        }

        if(props.userStatus !== this.state.activeUser){
            this.setState({activeUser: props.userStatus, name: props.userStatus.username, email: props.userStatus.email});
        }

        if(props.portfolioContent.hasOwnProperty('portfolioCategory')){
            if(props.portfolioContent.portfolioCategory !== this.state.portfolioCategory){
                this.setState({portfolioCategory: props.portfolioContent.portfolioCategory});
            }
        }
    }

    getActiveCategory(id){
        let _cat = [...this.state.portfolioCategory];
        _cat = _cat.filter(o => o.id === id)[0];
        return _cat.title;
    }

    getProjects(){
        let _portfolioContent = [...this.state.portfolioContent].reverse();
        _portfolioContent = _portfolioContent.filter(o => o.id !== this.state.activePortfolio[0].id);
        let _tempContent = [];
        let Count = 0;
        for(let i = 0; i < _portfolioContent.length; i++){
            _tempContent.push(
                <ProjectList key={i} slug={_portfolioContent[i].slug} imageFile={_portfolioContent[i].coverpic} details={_portfolioContent[i].title}/>
            );
            Count++;
            if(Count >= 3){
                break;
            }
        }
        return _tempContent
    }

    getActiveCaptures(){
        let _captures = [...this.state.portfolioCapture];
        let activecaptures = _captures.filter(o => o.p_id === this.state.activePortfolio[0].id);
        return activecaptures;
    }

    getHighlight(){
        let _portfolioHighlight = [...this.state.activeHighlight].reverse();
        let _tempContent = [];
        let ListCount = this.state.currentList * this.state.contentPerPage;
        _portfolioHighlight.length < ListCount ? ListCount = _portfolioHighlight.length : null;
        for(let i = 0; i < ListCount; i++){
            _tempContent.push(
                <li key={i}>
                    <p  dangerouslySetInnerHTML={{__html: _portfolioHighlight[i].comment}}/>
                    <div className={'user'}>{_portfolioHighlight[i].name}</div>
                </li>
            );
        }
        _portfolioHighlight.length > ListCount ? this.state.contentLoadmore = true: this.state.contentLoadmore = false;
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

    SubmitHighlight(){
        this.setState({showToast:false});
        let contents = {comment: this.state.comment, name: this.state.name, email: this.state.email, p_id: this.state.activePortfolio[0].id};
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.portfolioHighlight;
        this.props.actionWithData("post", url, payload).then(
            (res) =>{
                this.props.portfolioContent.highlight.push(res.data);
                this.props.setContent('SET_PORTFOLIO_CONTENT', this.props.portfolioContent);
                this.setState({toastContent:"Highlight added successfully!",
                    toastType:"success", submit: false, showToast: true,comment: "", name: "", email: "", })
            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                errorObj.type === 3 ? this.SubmitHighlight(errorObj.content) :
                    this.setState({toastContent:errorObj.content,
                        toastType:"danger", submit: false, showToast: true});
            }
        )
    }

    render(){

        return(
            <div className={'wrapper'}>
                <Header history={this.props.history}/>
                {
                    this.state.showToast ?
                        <Toast type={this.state.toastType} content={this.state.toastContent} closeAlert={this.closeAlert.bind(this)}/>
                        :
                        null
                }
                <div className={'explorer-container'}>
                    {
                        this.state.pageLoading ? <div className={'inner-con'}>
                            <div className={'explorer-divider'}>
                                <SubLoader/>
                            </div>
                        </div>:
                            <div>
                                {
                                    this.state.activePortfolio === null || this.state.activePortfolio.length < 1 ? <div className={'image-cover'}> </div>:
                                        <div className={'image-cover'} style={{'backgroundImage':'url('+this.state.activePortfolio[0].coverpic+')'}}>

                                        </div>
                                }

                                <div className={'inner-con'}>
                                    <div className={'explorer-divider'}>
                                        <div className={'left'}>
                                            {
                                                this.state.activePortfolio === null ? <SubLoader/> :
                                                    this.state.activePortfolio.length < 1 ?
                                                        <h3 className={'main-notify'}>This project content does not exist</h3> :
                                                        <div>
                                                            <div className={'heading'}>Title: <span>{this.state.activePortfolio[0].title}</span></div>
                                                            <a href={this.state.activePortfolio[0].coverpic} target={'_blank'}>
                                                                <div className={'image-con'}>
                                                                    <ImageLoader/>
                                                                    <img src={this.state.activePortfolio[0].coverpic} alt=""/>
                                                                </div>
                                                            </a>
                                                            <div className={'description'}>
                                                                <div className={'detail'}  dangerouslySetInnerHTML={{__html: this.state.activePortfolio[0].detail}} />
                                                                {
                                                                    this.state.portfolioCapture === null ? <SubLoader/> :
                                                                        this.state.portfolioCapture.length < 1 ? null :
                                                                            this.getActiveCaptures().length < 1 ? null :
                                                                                <div className={'captures'}>
                                                                                    <Slider1 images={this.getActiveCaptures()}/>
                                                                                </div>

                                                                }

                                                                <div className={'properties'}>
                                                                    <div><span>Category: </span>{this.state.portfolioCategory === null ? null : this.getActiveCategory(this.state.activePortfolio[0].category)}</div>
                                                                    <div><span>Status: </span>{this.state.activePortfolio[0].status}</div>
                                                                </div>
                                                                <div className={'shareLinks'}>
                                                                    <li><FacebookShareButton
                                                                        url={window.location.href}
                                                                        quote={this.state.activePortfolio[0].title}
                                                                        className="button"
                                                                    >
                                                                        <FacebookIcon size={32} round={true} />
                                                                    </FacebookShareButton></li>
                                                                    <li><TwitterShareButton
                                                                        url={window.location.href}
                                                                        title={this.state.activePortfolio[0].title}
                                                                        className="button"
                                                                    >
                                                                        <TwitterIcon size={32} round={true}/>
                                                                    </TwitterShareButton></li>
                                                                    <li><GooglePlusShareButton
                                                                        url={window.location.href}
                                                                        title={this.state.activePortfolio[0].title}
                                                                        className="button"
                                                                    >
                                                                        <GooglePlusIcon size={32} round={true}/>
                                                                    </GooglePlusShareButton></li>
                                                                    <li><LinkedinShareButton
                                                                        url={window.location.href}
                                                                        title={this.state.activePortfolio[0].title}
                                                                        className="button"
                                                                    >
                                                                        <LinkedinIcon size={32} round={true}/>
                                                                    </LinkedinShareButton></li>
                                                                    <li><TelegramShareButton
                                                                        url={window.location.href}
                                                                        title={this.state.activePortfolio[0].title}
                                                                        className="button"
                                                                    >
                                                                        <TelegramIcon size={32} round={true}/>
                                                                    </TelegramShareButton></li>
                                                                    <li><PinterestShareButton
                                                                        url={window.location.href}
                                                                        title={this.state.activePortfolio[0].title}
                                                                        media={this.state.activePortfolio[0].coverpic}
                                                                        className="button"
                                                                    >
                                                                        <PinterestIcon size={32} round={true}/>
                                                                    </PinterestShareButton></li>
                                                                    <li><WhatsappShareButton
                                                                        url={window.location.href}
                                                                        title={this.state.activePortfolio[0].title}
                                                                        className="button"
                                                                    >
                                                                        <WhatsappIcon size={32} round={true}/>
                                                                    </WhatsappShareButton></li>
                                                                </div>
                                                                {
                                                                    this.state.portfolioHighlight === null || this.state.activeHighlight === null ? <SubLoader/> :
                                                                        this.state.activeHighlight.length < 1 ?<h4>No highlight found for content!</h4>:
                                                                            <div className={'highlight-con'}>
                                                                                <h3>{this.state.activeHighlight.length} Highlight{this.state.activeHighlight.length > 1 ? 's' : null}</h3>

                                                                                <div className={'contents'}>
                                                                                    {this.getHighlight()}
                                                                                </div>
                                                                                {
                                                                                    this.state.contentLoadmore ? this.state.contentLoading ? <button className={'butt-disabled'}>
                                                                                        <div className={'button-loader'}>
                                                                                            <ol className={'loading-butt'}> </ol>
                                                                                            <ol className={'loading-butt'}> </ol>
                                                                                            <ol className={'loading-butt'}> </ol>
                                                                                        </div>
                                                                                    </button> : <button onClick={() => this.loadmore()}>Load More</button> : null
                                                                                }
                                                                            </div>
                                                                }

                                                                <div className={'add-comment'}>
                                                                    <h3>Add Highlight</h3>

                                                                    <form>
                                                                        <div className={'formgroup'}>
                                                                <textarea value={this.state.comment}
                                                                          onChange={(e) => this.setState({comment: e.target.value})}
                                                                          rows="15" placeholder={'write highlight'}> </textarea>
                                                                        </div>
                                                                        <div className={'formgroup'}>
                                                                            <label>Name</label>
                                                                            <input value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} type="text"/>
                                                                        </div>
                                                                        <div className={'formgroup'}>
                                                                            <label>Email</label>
                                                                            <input value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} type="email"/>
                                                                        </div>
                                                                        <div className={'highlight-con'}>
                                                                            {
                                                                                this.state.submit ? <button className={'butt-disabled'}>
                                                                                    <div className={'button-loader'}>
                                                                                        <ol className={'loading-butt'}> </ol>
                                                                                        <ol className={'loading-butt'}> </ol>
                                                                                        <ol className={'loading-butt'}> </ol>
                                                                                    </div>
                                                                                </button> : <button onClick={(e) =>[e.preventDefault(), this.setState({submit:true}), this.SubmitHighlight()]}>Submit</button>
                                                                            }
                                                                        </div>

                                                                    </form>
                                                                </div>

                                                            </div>
                                                        </div>

                                            }


                                        </div>
                                        <div className={'right'}>
                                            {
                                                this.state.activePortfolio === null || this.state.activePortfolio.length < 1 ? null :
                                                    <div className={'cats'}>
                                                        <li>Added: <span>{TimeAgo(this.state.activePortfolio[0].created_on)}</span></li>
                                                        <li>Last Update: <span>{TimeAgo(this.state.activePortfolio[0].updated_on)}</span></li>
                                                    </div>
                                            }
                                            {
                                                this.state.activePortfolio === null || this.state.activePortfolio.length < 1 ? null :
                                                    <div className={'controls'}>
                                                        {this.state.activePortfolio[0].hosted === "undefined" ? null :
                                                            <a className={'web'} target={'blank'} href={this.state.activePortfolio[0].hosted}>View Demo&nbsp;<Icon icon={opera}/></a>
                                                        }
                                                        {this.state.activePortfolio[0].git === "undefined" ? null :
                                                            <a className={'git'} target={'blank'} href={this.state.activePortfolio[0].git}>View Github&nbsp;<Icon icon={github}/></a>
                                                        }

                                                    </div>
                                            }

                                            <h3>Recently Added</h3>
                                            <div className={'list-items'}>
                                                {
                                                    this.state.portfolioContent === null || this.state.activePortfolio === null  || this.state.activePortfolio.length < 1 ? <SubLoader/> :
                                                        this.getProjects().length < 1  ? <h4 className={'main-notify'}>No Content found</h4>:
                                                            <div className={'item-list'}>
                                                                {this.getProjects()}
                                                            </div>
                                                }
                                            </div>
                                            <br/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    }



                </div>
                <Footer/>
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
        userStatus: state.userStatus, portfolioContent: state.portfolioContent,
        backEndLinks: state.backEndLinks,
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectExplorer);
