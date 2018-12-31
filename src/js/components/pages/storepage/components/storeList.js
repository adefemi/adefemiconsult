import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import proptype from 'prop-types'

import ImageLoader from '../../common/imageLoader'

class ServiceList extends React.Component{

    render(){
        const {imageFile, title, details, type, slug} = this.props;
        return(
            <Link to={'/store/'+slug} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-duration="500">
                <li className={'store-item'}>
                    <div className={'store-img'}>
                        <ImageLoader/>
                        <img src={imageFile} alt=""/>
                    </div>
                    <div className={'store-content-list'}>
                        <div className={'item-title'}>{title}</div>
                        <div className={'item-type'}>{type}</div>
                        <div className={'store-detail'}>
                            {details.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 130)}
                            {details.replace(/<\/?[^>]+(>|$)/g, "").length > 130 ? "..." : null}
                        </div>
                    </div>
                </li>
            </Link>
        )
    }
}

ServiceList.propTypes = {
    imageFile : proptype.string.isRequired,
    title: proptype.string.isRequired,
    details: proptype.string.isRequired,
    type: proptype.string.isRequired,
    slug: proptype.string.isRequired,
};

export default ServiceList;