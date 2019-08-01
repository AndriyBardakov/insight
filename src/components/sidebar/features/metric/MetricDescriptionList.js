import React from 'react';
import { List, Form, Input, Button } from 'semantic-ui-react';
import MetricDescriptionItem from './MetricDescriptionItem';

class MetricDescriptionList extends React.Component {
    state = { activeIndex: 0, data: [], metrics: {}, showList: false , type: '' }

    onClickHandler = (e, titleProps) => {
        const { index } = titleProps;

        if(this.state.activeIndex === index){
            return;
        }
        this.setState({ activeIndex: index });
    }

    setMetrics = (metrics) => {
        this.setState({metrics});
    }

    setType = (type) => {
        this.setState({type});
        this.setState({data: this.state.metrics[type]});
        this.toggleList(true);
    }

    toggleList = (showList) => {
        this.setState({showList});
    }

    render() {
        const { activeIndex, showList } = this.state;

        var createItem = function(item, indx) {
            return <MetricDescriptionItem 
                key={indx}
                activeIndex={activeIndex}
                index={indx}
                title={item}
                handleClick={this.onClickHandler}
            
            />;
        };

        return (
            showList ?
             <div>
                <List divided relaxed selection items={this.state.data.map(createItem.bind(this))} style={{margin:0}} className="description-list"></List>
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
            :
            <div className="ui center aligned container label">No entry selected</div>
        );
    }
}

export default MetricDescriptionList;