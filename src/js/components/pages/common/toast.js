import React from 'react';
import {Icon} from 'react-icons-kit'
import {check} from 'react-icons-kit/metrize/check'
import {exclamation} from 'react-icons-kit/metrize/exclamation'
import {ic_close} from 'react-icons-kit/md/ic_close'
import PropTypes from 'prop-types';
import $ from 'jquery'

class Toast extends React.Component{
    hideToast(){
        let toastObj = $('.toast');
        toastObj.addClass('bounceOutRight');
        setTimeout(() => {
            toastObj.remove('bounceOutRight');
            this.props.closeAlert();
        }, 1000)
    }

    render(){
        return(
            <div className={"toast "+this.props.type + " animated bounceInRight"}>
                {this.props.type === "success" ?
                    <span className={'toast-icon'}><Icon size={20} icon={check} /></span> : <span className={'toast-icon'}>
                        <Icon size={20} icon={exclamation}/>
                    </span>}
                <div dangerouslySetInnerHTML={{__html: this.props.content}} />

                <button className={'toast-close'} onClick={() => this.hideToast()}>
                    <Icon icon={ic_close}/>
                </button>
            </div>
        )
    }
}

Toast.defaultProps = {
    type : "danger",
    content: "An error ocurred!"
};

Toast.propTypes = {
    type : PropTypes.string,
    content: PropTypes.string,
    closeAlert: PropTypes.func.isRequired,
};

export default Toast;