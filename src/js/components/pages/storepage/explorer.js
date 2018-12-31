import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {download} from 'react-icons-kit/icomoon/download'
import {cart} from 'react-icons-kit/icomoon/cart'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {thumbsOUp} from 'react-icons-kit/fa/thumbsOUp'
import {thumbsODown} from 'react-icons-kit/fa/thumbsODown'


import Header from '../common/header';
import Footer from '../common/footer';
import SubLoader from "../common/subLoader";
import ImageLoader from '../common/imageLoader'
import ProjectList from '../common/projectList';
import Slider1 from '../common/slider1'
import Toast from '../common/toast';

import {actionWithoutData, setContent, authorizeWithData, authorizeWithoutData, actionWithData} from '../../redux/actions'
import {verifyauth, processError, resetToken} from '../common/miscellaneous'
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
    storeContent: null, storeCapture: null, storeCategory: null, storeReaction: null, storeDownload: null, storeHighlight: null,activeHighlight:"",
    activeStore: null, activeLink:null, contentPerPage: 5, currentList: 1, contentLoadmore: false, contentLoading: false,pageLoading: true,
    showToast: false, toastType: "success", toastContent: "", comment: "", name: "", activeUser: null, activeIP: "2",
    reactionData: null, reactionType: "post", reactionID: null
};


class StoreExplorer extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    getActiveContent(){
        let goup = new Goup;
        goup.goup();
        let _storeList = this.props.storeContent.main;
        let slug = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let activeStore = _storeList.filter(o => o.slug === slug);


        if(activeStore.length > 0){
            this.setState({activeStore:activeStore});
        }
        else{
            this.setState({activeStore:[]});
        }

        setTimeout(() => {
            this.setState({pageLoading:false});
        }, 1000);

    }

    componentWillMount(){
        this.verifyList(this.props);
        this.componentWillReceiveProps(this.props);
        this.props.setContent("SET_ACTIVE_LINK", window.location.pathname);
    }

    getActiveHighlight(){
        if(this.state.activeStore === null || this.state.activeStore.length < 1 || this.state.storeHighlight === null) return;
        let activeHighLight = [...this.state.storeHighlight].filter(o => parseInt(o.store_id) === parseInt(this.state.activeStore[0].id));
        this.setState({activeHighlight: activeHighLight});
    }

    verifyList(props){
        let url = "";
        if(!props.storeContent.hasOwnProperty('main')){
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
        if(!props.storeContent.hasOwnProperty('download')){
            url = this.props.backEndLinks.storeDownload;
            this.props.actionWithoutData('get', url).then(
                res => {
                    this.props.storeContent.download = res.data;
                    this.props.setContent("SET_STORE_CONTENT", this.props.storeContent);
                },
                err => {
                    alert('Unable to get store downloads. please reload page');
                }
            )
        }
        if(!props.storeContent.hasOwnProperty('highlight')){
            url = this.props.backEndLinks.storeHighlight;
            this.props.actionWithoutData('get', url).then(
                res => {
                    this.props.storeContent.highlight = res.data;
                    this.props.setContent("SET_STORE_CONTENT", this.props.storeContent);
                },
                err => {
                    alert('Unable to get store highlights. please reload page');
                }
            )
        }
        if(!props.storeContent.hasOwnProperty('capture')){
            url = this.props.backEndLinks.storeCapture;
            this.props.actionWithoutData('get', url).then(
                res => {
                    this.props.storeContent.capture = res.data;
                    this.props.setContent("SET_STORE_CONTENT", this.props.storeContent);
                },
                err => {
                    alert('Unable to get store captures. please reload page');
                }
            )
        }
        if(!props.storeContent.hasOwnProperty('storeReaction')){
            url = this.props.backEndLinks.storeReaction;
            this.props.actionWithoutData('get', url).then(
                res => {
                    this.props.storeContent.storeReaction = res.data;
                    this.props.setContent("SET_STORE_CONTENT", this.props.storeContent);
                },
                err => {
                    alert('Unable to get store captures. please reload page');
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

        this.props.actionWithoutData('get', 'https://api.ipify.org?format=json').then(
            res => {
                this.setState({activeIP: res.data.ip})
            },
            err => {
                alert('Network error. please reload page');
            }
        )
    }

    componentWillReceiveProps(props){
        if(props.storeContent.hasOwnProperty('main')){
            if(props.storeContent.main !== this.state.storeContent || window.location.href !== this.state.activeLink){
                this.setState({storeContent: props.storeContent.main, activeLink: window.location.href, pageLoading:true});
                let goup = new Goup;
                goup.goup();
                this.getActiveContent();
                this.getActiveHighlight()
            }
        }
        if(props.storeContent.hasOwnProperty('capture')){
            if(props.storeContent.capture !== this.state.storeCapture){
                this.setState({storeCapture: props.storeContent.capture});
            }
        }
        if(props.storeContent.hasOwnProperty('download')){
            if(props.storeContent.download !== this.state.storeDownload){
                this.setState({storeDownload: props.storeContent.download});
            }
        }
        if(props.storeContent.hasOwnProperty('highlight')){
            if(props.storeContent.highlight !== this.state.storeHighlight){
                this.setState({storeHighlight: props.storeContent.highlight});
                this.getActiveHighlight();
            }
            else{
                this.getActiveHighlight()
            }
        }
        if(props.storeContent.hasOwnProperty('storeReaction')){
            if(props.storeContent.storeReaction !== this.state.storeReaction){
                this.setState({storeReaction: props.storeContent.storeReaction});
            }
        }
        if(props.storeContent.hasOwnProperty('storeCategory')){
            if(props.storeContent.storeCategory !== this.state.storeContent){
                this.setState({storeCategory: props.storeContent.storeCategory});
            }
        }
        if(props.userStatus !== this.state.activeUser){
            this.setState({activeUser: props.userStatus, name: props.userStatus.username});
        }
    }

    getStore(){
        let _storeContent = [...this.state.storeContent].reverse();
        _storeContent = _storeContent.filter(o => o.id !== this.state.activeStore[0].id);
        let _tempContent = [];
        let Count = 0;
        for(let i = 0; i < _storeContent.length; i++){
            _tempContent.push(
                <ProjectList type={'store'} key={i} slug={_storeContent[i].slug} imageFile={_storeContent[i].coverpic} details={_storeContent[i].title}/>
            );
            Count++;
            if(Count >= 5){
                break;
            }
        }
        return _tempContent
    }

    getDownloadCount(){
        let _downLoads = [...this.state.storeDownload];
        let activeDownloads = _downLoads.filter(o => o.store_id === this.state.activeStore[0].id);
        let downloadCount = activeDownloads.length - 10;
        if(downloadCount > 50){
            return '50+'
        }
        else{
            return activeDownloads.length.toString();
        }
    }

    getActiveCaptures(){
        let _captures = [...this.state.storeCapture];
        let activecaptures = _captures.filter(o => o.store_id === this.state.activeStore[0].id);
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

    getActiveCategory(id){
        let _cat = [...this.state.storeCategory];
        _cat = _cat.filter(o => o.id === id)[0];
        return _cat.title;
    }

    SubmitHighlight(){
        this.setState({showToast:false});
        if(this.props.userStatus === null) {
            this.setState({toastContent:"Authentication Error!!! Only Registered user can make a comment.",
                toastType:"danger", submit: false, showToast: true});
            return;
        }
        let contents = {comment: this.state.comment, name: this.state.name, store_id: this.state.activeStore[0].id, user_id: this.props.userStatus.id};
        let payload = new FormData();
        Object.entries(contents).forEach(
            ([key, value]) => {
                payload.append(key, value)
            }
        );
        let url = this.props.backEndLinks.storeHighlight;
        this.props.actionWithData("post", url, payload).then(
            (res) =>{
                this.props.storeContent.highlight.push(res.data);
                this.props.setContent('SET_STORE_CONTENT', this.props.storeContent);
                this.setState({toastContent:"Highlight added successfully!",
                    toastType:"success", submit: false, showToast: true,comment: "", name: "", })
            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
                errorObj.type === 3 ? this.SubmitHighlight(errorObj.content) :
                    this.setState({toastContent:errorObj.content,
                        toastType:"danger", submit: false, showToast: true});
            }
        )
    }

    getReactions(contentID, type){
        if(this.state.storeReaction === null)return;
        let _reactionList = [...this.state.storeReaction];
        _reactionList = _reactionList.filter(o => o.store_id === contentID && parseInt(o.type) === parseInt(type));
        return _reactionList.length;
    }

    checkIfReacted(store_id, type = null){
        let _storeReaction = [...this.state.storeReaction];
        if(this.props.userStatus === null){
            _storeReaction = _storeReaction.filter( o => o.store_id === store_id && o.ip_address === this.state.activeIP);
        }
        else{
            _storeReaction = _storeReaction.filter( o => o.store_id === store_id && o.user_id === this.props.userStatus.id || o.ip_address === this.state.activeIP);
        }

        if(_storeReaction.length > 0){
            if(type === 'id'){
                return _storeReaction[0].id
            }
            else{
                return _storeReaction[0].type
            }

        }
        else {
            return null
        }
    }

    reactToStore(value, store_id){
        this.setState({showToast:false});
        if(this.state.activeIP === null) {
            this.setState({toastContent:"Network error!, please reload page",
                toastType:"danger", submit: false, showToast: true});
            return;
        }
        let user_id = null;
        if(this.props.userStatus !== null) {
            user_id = this.props.userStatus.id
        }
        this.state.reactionID = this.checkIfReacted(store_id, 'id');
        this.state.reactionID !== null ? this.state.reactionType = "put" : null;

        let contents = {
            store_id: store_id, type:value, user_id: user_id, ip_address: this.state.activeIP
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

    addReaction(){
        let url = this.props.backEndLinks.storeReaction;
        this.state.reactionID !== null ? url = this.props.backEndLinks.storeReaction + this.state.reactionID : null;
        this.props.actionWithData(this.state.reactionType, url, this.state.reactionData).then(
            (res) =>{
                if(this.state.reactionType === "post"){
                    this.props.storeContent.storeReaction.push(res.data);
                }
                else{
                    this.props.storeContent.storeReaction = res.data;
                }

                this.setState({reactionData: null, reactionType: "post", reactionID: null});
                this.props.setContent('SET_STORE_CONTENT', this.props.storeContent);
            },
            (err) =>{
                let errorObj = processError(err, this.props.backEndLinks.refresh);
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
                                    this.state.activeStore === null || this.state.activeStore.length < 1 ? <div className={'image-cover'}> </div>:
                                        <div className={'image-cover'} style={{'backgroundImage':'url('+this.state.activeStore[0].coverpic+')'}}>

                                        </div>
                                }
                                <div className={'inner-con'}>
                                    {
                                        this.state.activeStore === null ? <SubLoader/> :
                                            this.state.activeStore.length < 1 ? <h4 className={'main-notify'}>This store content does not exist!</h4> :
                                                <div className={'explorer-divider'}>
                                                    <div className={'left'}>
                                                        <div className={'heading'}>{this.state.activeStore[0].title}
                                                            <div className={'controls'}>
                                                                <span>
                                                                    <Icon onClick={() => this.reactToStore(parseInt(this.checkIfReacted(this.state.activeStore[0].id)) > 0 ? 0 : 1, this.state.activeStore[0].id)}
                                                                          className={parseInt(this.checkIfReacted(this.state.activeStore[0].id))> 0 ? 'active':null} icon={thumbsOUp}/>&nbsp;
                                                                    {this.getReactions(this.state.activeStore[0].id, 1)}
                                                                </span>
                                                                <span>
                                                                    <Icon onClick={() => this.reactToStore(parseInt(this.checkIfReacted(this.state.activeStore[0].id)) < 0 ? 0 : -1, this.state.activeStore[0].id)}
                                                                          className={parseInt(this.checkIfReacted(this.state.activeStore[0].id))< 0 ? 'active':null} icon={thumbsODown}/>&nbsp;
                                                                {this.getReactions(this.state.activeStore[0].id, -1)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <a href={this.state.activeStore[0].coverpic} target={'_blank'}>
                                                            <div className={'image-con'}>
                                                                <ImageLoader/>
                                                                <img src={this.state.activeStore[0].coverpic} alt=""/>
                                                            </div>
                                                        </a>
                                                        <div className={'description'}>
                                                            <div className={'detail'}  dangerouslySetInnerHTML={{__html: this.state.activeStore[0].detail}}/>

                                                            {
                                                                this.state.storeCapture === null ? <div className={'captures'}><SubLoader/></div> :
                                                                    this.state.storeCapture.length < 1 ? null :
                                                                        this.getActiveCaptures().length < 1 ? null :
                                                                            <div className={'captures'}>{<Slider1 images={this.getActiveCaptures()}/>}</div>
                                                            }

                                                            <div className={'shareLinks'}>
                                                                <li><FacebookShareButton
                                                                    url={window.location.href}
                                                                    quote={this.state.activeStore[0].title}
                                                                    className="button"
                                                                >
                                                                    <FacebookIcon size={32} round={true} />
                                                                </FacebookShareButton></li>
                                                                <li><TwitterShareButton
                                                                    url={window.location.href}
                                                                    title={this.state.activeStore[0].title}
                                                                    className="button"
                                                                >
                                                                    <TwitterIcon size={32} round={true}/>
                                                                </TwitterShareButton></li>
                                                                <li><GooglePlusShareButton
                                                                    url={window.location.href}
                                                                    title={this.state.activeStore[0].title}
                                                                    className="button"
                                                                >
                                                                    <GooglePlusIcon size={32} round={true}/>
                                                                </GooglePlusShareButton></li>
                                                                <li><LinkedinShareButton
                                                                    url={window.location.href}
                                                                    title={this.state.activeStore[0].title}
                                                                    className="button"
                                                                >
                                                                    <LinkedinIcon size={32} round={true}/>
                                                                </LinkedinShareButton></li>
                                                                <li><TelegramShareButton
                                                                    url={window.location.href}
                                                                    title={this.state.activeStore[0].title}
                                                                    className="button"
                                                                >
                                                                    <TelegramIcon size={32} round={true}/>
                                                                </TelegramShareButton></li>
                                                                <li><PinterestShareButton
                                                                    url={window.location.href}
                                                                    title={this.state.activeStore[0].title}
                                                                    media={this.state.activeStore[0].coverpic}
                                                                    className="button"
                                                                >
                                                                    <PinterestIcon size={32} round={true}/>
                                                                </PinterestShareButton></li>
                                                                <li><WhatsappShareButton
                                                                    url={window.location.href}
                                                                    title={this.state.activeStore[0].title}
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
                                                                <h3>Add Comment</h3>

                                                                <form>
                                                                    <div className={'formgroup'}>
                                                            <textarea rows="15" value={this.state.comment}
                                                                      onChange={(e) => this.setState({comment: e.target.value})}
                                                                      placeholder={'write comment'}> </textarea>
                                                                    </div>
                                                                    <div className={'formgroup'}>
                                                                        <label>Name</label>
                                                                        <input value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} type="text"/>
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
                                                    <div className={'right'}>
                                                        <div className={'cats'}>
                                                            <li>Added: <span>{TimeAgo(this.state.activeStore[0].updated_on)}</span></li>
                                                            <li>Category: <span>{this.state.storeCategory === null ? null : this.getActiveCategory(this.state.activeStore[0].type)}</span></li>
                                                            <div className={'download'}>
                                                                <div className={'title'}>Downloads</div>
                                                                <div className={'content'}>
                                                                    {this.state.storeDownload === null ? 0 : this.state.storeDownload.length < 1 ? 0 :this.getDownloadCount()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={'controls'}>
                                                            {this.state.activeStore[0].price > 0 ?
                                                                <Link className={'git'} to={'/'}>Buy for ${this.state.activeStore[0].price}&nbsp;<Icon icon={cart}/></Link> :
                                                                <Link className={'web'} to={'/'}>Download Now&nbsp;<Icon icon={download}/></Link>
                                                            }
                                                        </div>
                                                        <h3>Recently Added</h3>
                                                        <div className={'list-items'}>
                                                            {
                                                                this.state.storeContent === null || this.state.activeStore === null  || this.state.activeStore.length < 1 ? <SubLoader/> :
                                                                    this.getStore().length <1 ?<h4 className={'main-notify'}>No item found!</h4>:
                                                                        <div className={'item-list'}>
                                                                            {this.getStore()}
                                                                        </div>
                                                            }
                                                        </div>
                                                    </div>


                                                </div>
                                    }
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
        userStatus: state.userStatus, storeContent: state.storeContent,
        backEndLinks: state.backEndLinks,
    })
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreExplorer);