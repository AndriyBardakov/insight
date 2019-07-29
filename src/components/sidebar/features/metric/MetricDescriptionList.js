import React from 'react';
import { List } from 'semantic-ui-react';
import MetricDescriptionItem from './MetricDescriptionItem';

class MetricDescriptionList extends React.Component {
    state = { activeIndex: 0 }

    onClickHandler = (e, titleProps) => {
        const { index } = titleProps;

        if(this.state.activeIndex === index){
            return;
        }
        this.setState({ activeIndex: index });
    }

    render() {
        const { activeIndex } = this.state;
        const metricItems = [
            { title: "MetricName 1" },
            { title: "MetricName 2" },
            { title: "MetricName 3" },
        ];

        const listItems = metricItems.map((item, indx) => {
            return <MetricDescriptionItem 
                key={indx}
                activeIndex={activeIndex}
                index={indx}
                title={item.title}
                handleClick={this.onClickHandler}
            
            />;
        });
        return (
            <List divided relaxed selection items={listItems} className="description-list"></List>
        );
    }
}

export default MetricDescriptionList;