import React from 'react';
import { Accordion, Menu } from 'semantic-ui-react';
import FileContent from './features/file/FileContent';
import Metric from './features/metric/Metric';
import SignificanceAnalysis from './features/significanceAnalysis/SignificanceAnalysis';

const SidebarItem = (props) => {
    const { active, index, title, handleClick, name } = props;
    const contents = {
        file: <FileContent />,
        metric: <Metric />,
        parameter_settings: '',
        significance_analysis: <SignificanceAnalysis />,
        forecast: '',
        correlation: ''
    };

    return (
        <Menu.Item>
            <Accordion.Title
                active={active}
                content={title}
                name={name}
                onClick={handleClick}
            />
            <Accordion.Content active={active} content={contents[title.replace(/\s/, '_').toLowerCase()]} />
        </Menu.Item>
    );
}

export default SidebarItem;