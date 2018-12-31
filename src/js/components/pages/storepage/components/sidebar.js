import React from 'react';
import {Link} from 'react-router-dom'
import {Icon} from 'react-icons-kit';
import {arrowRight} from 'react-icons-kit/icomoon/arrowRight'
import {arrowLeft} from 'react-icons-kit/icomoon/arrowLeft'
import proptype from 'prop-types'

const initialState = {
    active: false,
};

class SideBar extends React.Component{

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    toggleSideBar(){
        this.setState({active: !this.state.active})
    }


    render(){
        return(
            <div className={this.state.active?'sidebar-main sidebar-show':'sidebar-main'}>
                <button className={'sidebar-controller'} onClick={() => this.toggleSideBar()}>
                    <Icon  icon={this.state.active?arrowLeft:arrowRight}/>
                </button>
                <div className={'mainList'}>
                    {
                        this.props.storeCategory === null ? <h4>Loading</h4> :
                            this.props.storeCategory.length < 1 ? <h3 className={'main-notify'}>No category found!</h3>:
                                this.props.storeCategory
                    }
                </div>

            </div>
        )
    }
}

SideBar.defaultProps = {
    storeCategory: null
};

SideBar.propTypes = {
    storeCategory: proptype.any
};

export default SideBar;