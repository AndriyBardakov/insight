import React from 'react';
import { List } from 'semantic-ui-react';

const MetricDescriptionItem = (props) => {
    const { activeIndex, index, handleClick, title } = props;
    return (
        <List.Item
            active={activeIndex === index}
            index={index}
            onClick={handleClick}
        >
            {activeIndex === index ? <List.Icon name='check circle' /> : ''}
            <List.Content>
                <List.Description>
                    {title}
                </List.Description>
            </List.Content>
        </List.Item>
    );
}

export default MetricDescriptionItem;