import React from 'react';
import proptypes from 'prop-types'

class Ac_logo extends React.Component{
    render(){
        const {color, size} = this.props;
        return(
            <svg version="1.1" id="Layer_9" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 245.8 245.8">
                <rect width="245.8" height="245.8" style={{"fill":color}}/>
                <rect x="7.9" y="7.9" style={{"fill":"#FFFFFF"}} width="230.2" height="230.2"/>
                <rect x="10.1" y="10.1" width="225.8" height="225.8" style={{"fill":color}}/>
                <path style={{"fill":"#FFFFFF"}} d="M213.3,48.1V25.4c0,0-78.2,7.5-86.6,90.7v81.5v23.1h86.6v-23.1h-64.3v-81.1C149.1,116.4,152,59.3,213.3,48.1z"
                />
                <path style={{"fill":"#FFFFFF"}} d="M34.2,25.4v22.7v172.7h24.1c0-26.8,0-53.7,0-80.5h39.9c0,29.1-0.1,75.2-0.1,80.4c7.4,0,14.9,0.1,22.3,0.1v-80.5
        v-24.1C112.2,32.9,34.2,25.4,34.2,25.4z M58.3,116.1c0-20,0-40.1,0-60.1c35.9,18.3,39.6,56.2,39.9,60.1H58.3z"/>
            </svg>
        )
    }
}

Ac_logo.defaultProps = {
    color: '#000000',
    size: 100,
};

Ac_logo.propTypes = {
    color: proptypes.string,
    size: proptypes.number
};

export default Ac_logo