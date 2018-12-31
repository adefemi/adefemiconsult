import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import Slider from "react-slick";
import protypes from 'prop-types'

class Slider1 extends React.Component{

    render(){
        const {images} = this.props;
        let settings = {
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            speed: 1000,
            autoplay: true,
            autoplaySpeed: 3000,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: true,
                    }
                }
            ]
        };
        return(
            <Slider className={'sliderMain'} {...settings}>
                {
                    images.map((o,i) => {
                        return(
                            <a key={i} href={o.coverpic} target={'_blank'}><img  src={o.coverpic}/></a>
                        );
                    })
                }
            </Slider>
        )
    }
}

Slider1.propTypes = {
    images : protypes.array.isRequired
};

export default Slider1;