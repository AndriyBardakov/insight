import React from 'react';
import { Accordion, Menu } from 'semantic-ui-react';
import FileContent from './features/file/FileContent';

class SidebarItem extends React.Component{

    render(){
        const contents = {
            file: <FileContent/>,
            metric:'',
            parameter_settings:'',
            significance_analysis:'',
            correlation:''
        };
        
        return (
            <Menu.Item>
                <Accordion.Title
                    active={this.props.activeIndex === 0}
                    content={this.props.title}
                    index={this.props.index}
                    onClick={this.props.handleClick}
                />
                <Accordion.Content active={this.props.activeIndex === 0} content={contents[this.props.title.replace(/\s/, '_').toLowerCase()]} />
            </Menu.Item>
        );
    }
}

export default SidebarItem;