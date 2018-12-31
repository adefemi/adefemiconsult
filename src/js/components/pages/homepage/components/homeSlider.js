import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {chevronDown} from 'react-icons-kit/ionicons/chevronDown'
import $ from 'jquery';


class HomeSlider extends React.Component{
    constructor(props) {
        super(props);

    }

    scrollToService(){
        let button = $('.slider-proceed');
        let elementTop = button.offset().top + button.outerHeight() - 10;
        $('html, body, div').animate({scrollTop: elementTop}, 500)
    }

    render(){
        return(
            <div className={'adefemi-slider'}>
                <div className={'slider-proceed'} onClick={() => this.scrollToService()}>
                    <Icon icon={chevronDown}/>
                </div>
                <div className={'slider-content'}>
                    <div className={'title'} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-duration="500" data-aos-anchor-placement="top-center">Welcome to Adefemi Consult</div>
                    <div className={'subtitle'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="400" data-aos-duration="500">How may we be of Help</div>

                    <Link to={'/service'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out" data-aos-delay="600" data-aos-duration="700">
                        <button >
                            View Our Services
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default HomeSlider;