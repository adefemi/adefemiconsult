import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'

import HomeSlider from './components/homeSlider';
import HomeHeader from '../common/header';
import Contact from '../common/contact';
import HomeAbout from './components/homeAbout';
import HomeTeam from './components/hometeam';
import Footer from '../common/footer';

import {actionWithoutData, setContent, authorizeWithData, authorizeWithoutData, actionWithData} from '../../redux/actions'

class Index extends React.Component{

    componentDidMount(){
        this.props.setContent("SET_ACTIVE_LINK", window.location.pathname);
    }

    render(){

        return(
            <div className={'wrapper'}>
                <HomeHeader history={this.props.history}/>
                <HomeSlider/>
                <HomeAbout/>
                <HomeTeam/>
                <Contact/>
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

export default connect(null, mapDispatchToProps)(Index);