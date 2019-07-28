import './Sidebar.css';
import React from 'react';
import { Accordion, Menu } from 'semantic-ui-react';
import SidebarItem from './SidebarItem';

class Sidebar extends React.Component {
    state = { activeIndex: 1 }

    onClickHandler = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    render() {
        const { activeIndex } = this.state;
        const menuItems = [
            { title: "File" },
            { title: "Metric" },
            { title: "Parameter settings" },
            { title: "Significance analysis" },
            { title: "Correlation" }
        ];
        const items = menuItems.map((item, indx) => {
            return <SidebarItem
                key={indx}
                activeIndex={activeIndex}
                index={indx}
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