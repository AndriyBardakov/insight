import React from 'react';
import MetricStatusItem from './MetricStatusItem';
import { List } from 'semantic-ui-react';

class MetricStatusList extends React.Component{
    state = { activeIndex: 0 }

    onClickHandler = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
    }

    render(){
        const { activeIndex } = this.state;
        const statusItems = [
            { title: "Normal", icon: '' },
            { title: "Favourite", icon: 'star' },
            { title: "Hidden", icon: 'low vision' },
        ];
        const listItems = statusItems.map((item, indx) => {
            return <MetricStatusItem 
                key={indx}
                activeIndex={activeIndex}
                index={indx}
                title={item.title}
                icon={item.icon}
                handleClick={this.onClickHandler}
            
            />;
        });

        return (
            <List divided relaxed selection items={listItems} className="description-list"></List>
        );
    }
}

export default MetricStatusList;