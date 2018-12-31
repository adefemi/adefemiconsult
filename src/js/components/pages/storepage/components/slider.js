import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';


class ServiceSlider extends React.Component{

    render(){

        return(
            <div className={'sliders store'}>
                <div className={'slider-content'}>
                    <div className={'title'} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-duration="500" data-aos-anchor-placement="top-center">Store Contents</div>
                    <div className={'subtitle'} data-aos-once="true" data-aos="fade-up" data-aos-easing="ease-out-back" data-aos-delay="400" data-aos-duration="500">We provide finished products ready for use. Games, Web-applications, Mobile-applications, all at your disposal. Enjoy!!!</div>
                </div>

            </div>
        )
    }
}

export default ServiceSlider;