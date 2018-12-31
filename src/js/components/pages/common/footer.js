import React from 'react';
import {connect} from 'react-redux';


class Footer extends React.Component{


    render(){
        return(
            <div className={'footer'}>
                {
                    this.props.settingContent.hasOwnProperty('contacts') ?
                        <div dangerouslySetInnerHTML={{__html:this.props.settingContent.contacts[0].copyright}}/>
                        : null
                }

            </div>
        )
    }
}

function mapStateToProps(state) {
    return({
        userStatus: state.userStatus, backEndLinks: state.backEndLinks, settingContent : state.settingContent
    })
}
export default connect(mapStateToProps)(Footer);
