import React from 'react';
import MetricStatusItem from './MetricStatusItem';
import { List } from 'semantic-ui-react';

class MetricStatusList extends React.Component {
    state = { activeIndex: 0 }

    onClickHandler = (e, titleProps) => {
        const { index, type } = titleProps;

        if (this.state.activeIndex === index) {
            return;
        }
        this.setActiveIndex(index);
        this.props.onChangeStatus(type);
    }

    setActiveIndex = (index) => {
        this.setState({ activeIndex: index });
    }

    render() {
        const { activeIndex } = this.state;
        const statusItems = [
            { title: "Normal", icon: '', type: "normal" },
            { title: "Favourite", icon: 'star', type: "favourite" },
            { title: "Hidden", icon: 'low vision', type: "hidden" },
        ];
        const listItems = statusItems.map((item, indx) => {
            return <MetricStatusItem
                key={indx}
                activeIndex={activeIndex}
                index={indx}
                type={item.type}
                title={item.title}
                icon={item.icon}
                handleClick={this.onClickHandler}
            // onChangeStatus={this.props.onChangeStatus}
            />;
        });

        return (
            <List divided relaxed selection items={listItems} className="description-list"></List>
        );
    }
}

export default MetricStatusList;