import React from 'react';
import { Accordion, Menu } from 'semantic-ui-react';
import FileContent from './features/file/FileContent';
import Metric from './features/metric/Metric';

const SidebarItem = (props) => {
    const { activeIndex, index, title, handleClick } = props;
    const contents = {
        file: <FileContent />,
        metric: <Metric />,
        parameter_settings: '',
        significance_analysis: '',
        correlation: ''
    };

    return (
        <Menu.Item>
            <Accordion.Title
                active={activeIndex === index}
                content={title}
                index={index}
                onClick={handleClick}
            />
            <Accordion.Content active={activeIndex === index} content={contents[title.replace(/\s/, '_').toLowerCase()]} />
        </Menu.Item>
    );
}

export default SidebarItem;