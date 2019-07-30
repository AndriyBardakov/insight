import React from 'react';
import { List, Form, Input, Button } from 'semantic-ui-react';
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
            <div>
                <List divided relaxed selection items={listItems} style={{margin:0}} className="description-list"></List>
                <Form className="sidebar-content feature-form">
                    <Form.Field
                        control={Input}
                        placeholder='Parameter 1'
                    />
                    <Form.Field
                        control={Input}
                        placeholder='Parameter 2'
                    />
                    <Form.Field
                        id='form-button-control-public'
                        control={Button}
                        content='Use Parameters'
                        primary
                    />
                </Form>
            </div>
        );
    }
}

export default MetricDescriptionList;