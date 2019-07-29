import React from 'react';
import { List } from 'semantic-ui-react';

const MetricDescriptionItem = (props) => {
    const { activeIndex, index, handleClick, title } = props;
    const cls = activeIndex === index ? '' : 'outline';

    return (
        <List.Item
            active={activeIndex === index}
            index={index}
            onClick={handleClick}
        >
            <List.Icon name="check circle" className={cls} />
            <List.Content>
                <List.Description>
                    {title}
                </List.Description>
            </List.Content>
        </List.Item>
    );
}

export default MetricDescriptionItem;