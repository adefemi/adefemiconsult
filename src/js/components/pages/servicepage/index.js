import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'


import Header from '../common/header';
import Contact from '../common/contact';
import Footer from '../common/footer';
import Slider from './components/slider';
import ServiceContent from './components/serviceList';


import Subloader from "../common/subLoader";

const initialState = {
    serviceContent: null
};

import {actionWithoutData, setContent} from '../../redux/actions'

class ServiceIndex extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.verifyList();
        this.componentWillReceiveProps(this.props);
        this.props.setContent("SET_ACTIVE_LINK", window.location.pathname);
    }

    verifyList(){
        let url = "";

        if(this.props.serviceContent === null){
            url = this.props.backEndLinks.service;
            this.props.actionWithoutData("get", url).then(
                res => {
                    this.props.setContent("SET_SERVICE_CONTENT",res.data);
                },
                err => {
                    this.setState({errorState:true})
                }
            )
        }
    }

    componentWillReceiveProps(props){
        if(props.serviceContent !== this.state.serviceContent){
            this.setState({serviceContent: props.serviceContent});
        }
    }

    getServices(){
        let _serviceCon = [...this.state.serviceContent];
        let _tempContent = [];
        for(let i = 0; i < _serviceCon.length; i++){
            _tempContent.push(
                <ServiceContent
                    key={i} imageFile={_serviceCon[i].coverpic}
                                title={_serviceCon[i].title} details={_serviceCon[i].detail}/>
            )
        }
        return _tempContent
    }



    render(){

        return(
            <div className={'wrapper'}>
                <Header history={this.props.history}/>
                <Slider/>
                <div className={'service-container'}>
                    {
                        this.state.serviceContent === null ? <Subloader/> :
                            this.state.serviceContent.length < 1 ? <h4 className={'main-notify'}>No service content added yet! check later!!!</h4>:
                            <div className={'service-content'}>
                                {this.getServices()}
                            </div>
                    }
                </div>
                <Contact/>
                <Footer/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, serviceContent: state.serviceContent,
        backEndLinks: state.backEndLinks,
    })
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionWithoutData: actionWithoutData, setContent: setContent,
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ServiceIndex);