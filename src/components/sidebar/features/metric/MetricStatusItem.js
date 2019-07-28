import React from 'react';
import { List } from 'semantic-ui-react';

const MetricStatusItem = (props) => {
    const { activeIndex, index, handleClick, title, icon } = props;
    return (
        <List.Item
            active={activeIndex === index}
            index={index}
            onClick={handleClick}
        >
            <List.Content>
                {activeIndex === index ? <List.Icon name='check circle' /> : ''}
                <List.Description>
                    {title}
                </List.Description>
                {icon ? <List.Icon name={icon} className="status-icon" /> : ''}
            </List.Content>
        </List.Item>
    );
}

export default MetricStatusItem;