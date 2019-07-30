import React from 'react';
import { List } from 'semantic-ui-react';

const MetricStatusItem = (props) => {
    const { activeIndex, index, handleClick, title, icon, type } = props;
    const cls = activeIndex === index ? '' : 'outline';

    return (
        <List.Item
            active={activeIndex === index}
            index={index}
            onClick={handleClick}
            type={type}
        >
            <List.Content>
                <List.Icon name="check circle" className={cls} />
                <List.Description>
                    {title}
                </List.Description>
                {icon ? <List.Icon name={icon} className="status-icon" /> : ''}
            </List.Content>
        </List.Item>
    );
}

export default MetricStatusItem;