import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import proptype from 'prop-types'

import ImageLoader from './imageLoader'

class ProjectList extends React.Component{

    render(){
        const {imageFile, details,slug} = this.props;
        return(
            <div className={'port-item'} data-aos-once="true" data-aos="zoom-in" data-aos-easing="ease-out-back" data-aos-duration="500">
                <div className={'port-img'}>
                    <ImageLoader/>
                    <img src={imageFile} alt=""/>
                </div>
                <div className={'details'}>{details}
                    {
                        this.props.type === "store" ?
                            <Link to={'/store/'+slug}><button>View Content</button></Link>:
                            <Link to={'/project/'+slug}><button>View Project</button></Link>
                    }

                </div>
            </div>
        )
    }
}

ProjectList.defaultProps = {
    type : "project"
};

ProjectList.propTypes = {
    imageFile : proptype.string.isRequired,
    details: proptype.string.isRequired,
    slug: proptype.string.isRequired,
    type: proptype.string,
};

export default ProjectList;