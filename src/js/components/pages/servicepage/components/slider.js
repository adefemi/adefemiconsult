import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';


class ServiceSlider extends React.Component{

    render(){

        return(
            <div className={'sliders service'}>
                <div className={'slider-content'}>
                    <div className={'title'} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-duration="500" data-aos-anchor-placement="top-center">Our Services</div>
                    <div className={'subtitle'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="400" data-aos-duration="500">We offer services to vast areas in IT world, you won't be disappointed</div>
                </div>

            </div>
        )
    }
}

export default ServiceSlider;