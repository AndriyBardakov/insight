import './Sidebar.css';
import React from 'react';
import { Accordion, Menu } from 'semantic-ui-react';
import SidebarItem from './SidebarItem';

class Sidebar extends React.Component {
    state = {
        activeItem: {
            file: false,
            metric: false,
            parameterSettings: false,
            significanceAnalysis: false,
            forecast: false,
            correlation: false
        }
    }

    onClickHandler = (e, titleProps) => {
        const { name } = titleProps;
        const { activeItem } = this.state;
        activeItem[name] = !activeItem[name];
        this.setState({ activeItem });
    }

    render() {
        const { activeItem } = this.state;
        const menuItems = [
            { name: "file", title: "File" },
            { name: "metric", title: "Metric" },
            { name: "parameterSettings", title: "Parameter settings" },
            { name: "significanceAnalysis", title: "Significance analysis" },
            { name: "forecast", title: "Forecast" },
            { name: "correlation", title: "Correlation" }
        ];
        const items = menuItems.map((item, indx) => {
            return <SidebarItem
                key={indx}
                active={activeItem[item.name]}
                name={item.name}
                title={item.title}
                handleClick={this.onClickHandler}
            />
        });

        return (
            <div className="insight-sidebar">
                <Accordion as={Menu} vertical>
                    {items}
                </Accordion>
            </div>
        );
    }
}

export default Sidebar;