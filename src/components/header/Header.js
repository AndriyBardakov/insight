import './Header.css';
import React from 'react';
import { Popup } from 'semantic-ui-react';

class Header extends React.Component {
   
    render(){
        return (
            <div className="insight-header ui header">
                <span className="header-txt"><span style={{fontWeight:400}}>PANDA</span> <span style={{fontWeight:200}}>| Insight</span></span>
                {this.props.connected ? <button className="ui icon compact button" onClick={this.props.onChangeServer}>
                    <Popup
                        trigger={<i className="ellipsis horizontal icon"></i>}
                        content='Change server'
                        position='left center'
                    />
                </button> : null}
            </div>
        );
    }
}

export default Header;