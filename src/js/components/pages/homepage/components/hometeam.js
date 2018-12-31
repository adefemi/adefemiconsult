import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {connect} from 'react-redux'
import {facebook} from 'react-icons-kit/icomoon/facebook'
import {instagram} from 'react-icons-kit/icomoon/instagram'
import {twitter} from 'react-icons-kit/icomoon/twitter'
import {googlePlus} from 'react-icons-kit/icomoon/googlePlus'
import {linkedin} from 'react-icons-kit/icomoon/linkedin'

import NoImage from "../../../../../assets/images/No_Image_Available.jpg"
import ProjectList from '../../common/projectList';
import SubLoader from "../../common/subLoader";
import ImageLoader from '../../common/imageLoader'

const initialState = {
    teamContent: null, teamCount: 0,
};


class HomePortfolio extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props){
        if(props.teamContent !== this.state.teamContent){
            this.setState({teamContent: props.teamContent});
        }

    }

    getTeam(){
        let _teamContent = [...this.state.teamContent];
        let _tempContent = [];
        let Count = 0;
        for(let i = 0; i < _teamContent.length; i++){
            _tempContent.push(
                <li key={i} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-delay={i*200} data-aos-duration="500">
                    <div className={'image-con'}>
                        <ImageLoader/>
                        <img src={_teamContent[i].coverpic} alt=""/>
                    </div>
                    <div className={'details'}>
                        <div className={'name'}>{_teamContent[i].fulname}</div>
                        <div className={'designation'}>{_teamContent[i].designation}</div>
                    </div>
                    <div className={'social-handles'}>
                        <a href={_teamContent[i].facebook === "undefined" ? '#' : _teamContent[i].facebook} target={'blank'}><Icon icon={facebook}/></a>
                        <a href={_teamContent[i].instagram === "undefined" ? '#' : _teamContent[i].instagram} target={'blank'}><Icon icon={instagram}/></a>
                        <a href={_teamContent[i].twitter === "undefined" ? '#' : _teamContent[i].twitter} target={'blank'}><Icon icon={twitter}/></a>
                        <a href={_teamContent[i].google === "undefined" ? '#' : _teamContent[i].google} target={'blank'}><Icon icon={googlePlus}/></a>
                        <a href={_teamContent[i].linkedin === "undefined" ? '#' : _teamContent[i].linkedin} target={'blank'}><Icon icon={linkedin}/></a>
                    </div>
                </li>
            )
        }
        return _tempContent
    }


    render(){
        return(
            <div className={'team-page'}>
                <div className={'inner'}>
                    <div className={'title'}>Meet The Team</div>
                    <div className={'sub-title'}>We deliver the best in our capabilities due to our joint efforts. Nothing can actually go wrong!</div>
                    <div className={'team-list'}>
                        {
                            this.state.teamContent === null ? <SubLoader/> :
                                this.state.teamContent.length < 1 ? <h3 className={'main-notify'}>No team found!</h3> :
                                    this.getTeam()
                        }
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, teamContent: state.teamContent,
        backEndLinks: state.backEndLinks,
    })
}

export default connect(mapStateToProps)(HomePortfolio);