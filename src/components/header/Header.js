import './Header.css';
import React from 'react';

class Header extends React.Component {
    static defaultProps = {
        fileName: 'Demo'
    }
    onClickHandler = () => {

    }
    render(){
        return (
            <div className="insight-header ui header">
                <span className="header-txt">This is {this.props.fileName}</span>
                <button className="ui icon compact button" onClick={this.onClickHandler}>
                    <i className="ellipsis horizontal icon"></i>
                </button>
            </div>
        );
    }
}

export default Header;