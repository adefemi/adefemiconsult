import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {download3} from 'react-icons-kit/icomoon/download3'
import {connect} from 'react-redux'

import $ from 'jquery'

import ImageLoader from '../../common/imageLoader'
import SubLoader from '../../common/subLoader';

let ProgressState = 0;

function setProgress() {
    if(ProgressState > 0) return;
    ProgressState = 1;
    $('.progress').each(function(){
        let $this = $(this);
        $(this).find('.guage').animate({
            width: $(this).attr('data-percent')+"%"
        },3000);

        $(this).find('.seek').animate({
            left: $(this).attr('data-percent')+"%"
        },3000);

        $({someValue: 0}).animate({someValue: $this.attr('data-percent')}, {
            duration: 3000,
            easing:'swing', // can be anything
            step: function() {
                $this.find('.seek').text(Math.ceil(this.someValue));
            }
        });
    });
}

const initialState = {
  aboutContent: null, skillSets: null
};

class HomeAbout extends React.Component{
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillUnmount(){
        ProgressState = 0;
    }

    componentWillMount(){
        this.componentWillReceiveProps(this.props);
    }

    setLoading(){
        $.fn.isInViewport = function() {
            let elementTop = $(this).offset().top;
            let elementBottom = elementTop + $(this).outerHeight();

            let viewportTop = window.pageYOffset;
            let viewportBottom = viewportTop + $(window).height();

            return elementBottom > viewportTop && elementTop < viewportBottom;
        };

        $(window).on('resize scroll', function() {
            if(window.location.pathname !== '/') return;
            if ($('.skillset-wrapper').isInViewport()) {
                setProgress();
            }
        });
    }

    componentWillReceiveProps(props){
        if(props.aboutContent !== this.state.aboutContent){
            this.setState({aboutContent: props.aboutContent});
        }
        if(props.skillContent !== this.state.skillSets){
            this.setState({skillSets: props.skillContent});
        }
    }

    getSkillSets(){
        let _skillsetList = [...this.state.skillSets];
        let _skillArray = [];
        let count = 0;
        for(let i = 0; i < _skillsetList.length; i++){
            count += 1;
            _skillArray.push(
                <div key={i} className={'item'}>
                    <div className={'label'}>{_skillsetList[i].name}</div>
                    <div className={'progress'} data-percent={_skillsetList[i].value}>
                        <div className={'guage'}> </div>
                        <div className={'seek'}>0</div>
                    </div>
                </div>
            );
            if(count >= 10) break;
        }
        setTimeout(() => {
            this.setLoading();
        }, 1000);
        return _skillArray;
    }

    render(){
        return(
            <div className={'about-me'}>
                <div className={'top'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out" data-aos-duration="500">

                    <div className={'about-image-hover'}>
                        <div className={'userimage'}>
                            <ImageLoader/>
                            <img src={this.state.aboutContent === null ? '' : this.state.aboutContent.coverpic} alt=""/>
                        </div>
                        <div className={'about-content-main'}>
                            {
                                this.state.aboutContent === null ? <SubLoader/>:
                                    <div>
                                        <div className={'title'}>{this.state.aboutContent.fulname}</div>
                                        <div className={'sub-title'}>{this.state.aboutContent.designation}</div>
                                    </div>
                            }


                        </div>
                    </div>
                    <div className={'about-content'} >
                        <div className={'heading'}>About Me...</div>

                            {
                                this.state.aboutContent === null ? <p>Loading...</p> :
                                    <div className={'details'}>
                                        <div dangerouslySetInnerHTML={{__html: this.state.aboutContent.statement}}/>
                                        <a href={this.state.aboutContent.resume} target={'blank'}>
                                            <button className={'resumeDownload'}><Icon icon={download3}/>&nbsp;Download Resume</button>
                                        </a>
                                    </div>

                            }


                    </div>
                </div>
                <div className={'skillset-container'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out" data-aos-duration="500">
                    <div className={'skillset-wrapper'}>
                        {
                            this.state.skillSets === null ? <h3>Loading...</h3> :
                                this.getSkillSets()
                        }
                    </div>
                    <div className={'skillset-Info'}>
                        <div className={'heading'}>SKILLS</div>
                        <p>We provide an adequate measure of skills needed to build trendy IT concepts and ensure standard product. </p>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, aboutContent: state.aboutContent, skillContent: state.skillContent,
        backEndLinks: state.backEndLinks,
    })
}

export default connect(mapStateToProps)(HomeAbout);