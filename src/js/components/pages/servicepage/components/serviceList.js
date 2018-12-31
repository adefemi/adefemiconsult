import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import proptype from 'prop-types'

import ImageLoader from '../../common/imageLoader'

class ServiceList extends React.Component{

    render(){
        const {imageFile, title, details} = this.props;
        return(
            <li className={'service-item'} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-duration="500">
                <div className={'service-svg'}>
                    <ImageLoader/>
                    <img src={imageFile} alt=""/>
                </div>
                <div className={'item-title'}>{title}</div>
                <div className={'service-detail'} dangerouslySetInnerHTML={{__html: details}} />
            </li>
        )
    }
}

ServiceList.propTypes = {
    imageFile : proptype.string.isRequired,
    title: proptype.string.isRequired,
    details: proptype.string.isRequired,
};

export default ServiceList;