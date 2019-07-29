import React from 'react';
import { Accordion, Menu } from 'semantic-ui-react';
import FileContent from './features/file/FileContent';
import Metric from './features/metric/Metric';
import SignificanceAnalysis from './features/significanceAnalysis/SignificanceAnalysis';
import Forecast from './features/forecast/Forecast';
import Correlation from './features/correlation/Correlations';

const SidebarItem = (props) => {
    const { active, title, handleClick, name, activeItem } = props;
    const contents = {
        file: <FileContent />,
        metric: <Metric />,
        parameter_settings: '',
        significance_analysis: <SignificanceAnalysis />,
        forecast: <Forecast />,
        correlation: <Correlation />
    };

    return (
        (name === "correlation" && active)  || !activeItem.correlation ?
            <Menu.Item>
                <Accordion.Title
                    active={active}
                    content={title}
                    name={name}
                    onClick={handleClick}
                />
                <Accordion.Content active={active} content={contents[title.replace(/\s/, '_').toLowerCase()]} />
            </Menu.Item>
        : null
    );
}

export default SidebarItem;