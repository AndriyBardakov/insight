import React from 'react';
import { List, Form, Input, Button } from 'semantic-ui-react';
import MetricDescriptionItem from './MetricDescriptionItem';

class MetricDescriptionList extends React.Component {
    constructor(props) {
        super(props);
        this.childMetricDescriptionListItem = React.createRef();
    }
    state = { activeIndex: -1, data: [], metrics: {}, showList: false, emptyType: false, type: '', param1: '', param2: '' }

    onClickHandler = (e, titleProps) => {
        const { index, type } = titleProps;

        if (this.state.activeIndex === index) {
            return;
        }
        this.setState({ activeIndex: index });
        this.props.onChangeMetric(type);
    }

    setMetrics = (metrics) => {
        this.setState({ metrics });
    }

    setMetric = (metric) => {
        let activeIndex = -1;
        if (metric) {
            const item = document.querySelector('#metrics-list > .item[type=' + metric + ']');
            if (!item) {
                setTimeout(function () {
                    this.setMetric(metric);
                }.bind(this), 100);
                return;
            }
            activeIndex = item.getAttribute('index');
            activeIndex = Number(activeIndex);
        }
        this.setState({ activeIndex });
    }

    setType = (type, metric) => {
        if (type) {
            this.setState({ type });
            this.setState({ data: this.state.metrics[type] });
            this.toggleList(true);
        }
        else {
            this.toggleList(false, true);
        }
        this.setMetric(metric);
    }

    toggleList = (showList, emptyType) => {
        if (emptyType) {
            this.setState({ emptyType });
        }
        this.setState({ showList });
    }

    render() {
        const { activeIndex, showList, emptyType, param1, param2 } = this.state;

        var createItem = function (item, indx) {
            return <MetricDescriptionItem
                key={indx}
                activeIndex={activeIndex}
                type={item}
                index={indx}
                title={item}
                handleClick={this.onClickHandler}

            />;
        };

        return (
            showList ?
                <div>
                    <List divided relaxed selection ref={this.childMetricDescriptionListItem} id="metrics-list" items={this.state.data.map(createItem.bind(this))} style={{ margin: 0 }} className="description-list"></List>
                    <Form className="sidebar-content feature-form" onSubmit={() => { this.props.onSubmitParamenters(param1, param2) }}>
                        <Form.Field
                            control={Input}
                            placeholder='Parameter 1'
                            onChange={e => { this.setState({ param1: e.target.value }) }}
                            value={this.state.param1}
                            type='number'
                            min='0'
                            step="0.01"
                        />
                        <Form.Field
                            control={Input}
                            placeholder='Parameter 2'
                            onChange={e => { this.setState({ param2: e.target.value }) }}
                            value={this.state.param2}
                            type='number'
                            min='0'
                            step="0.01"
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
                (emptyType
                    ?
                    <div className="ui center aligned container label">The selected record has no type</div>
                    :
                    <div className="ui center aligned container label">No record selected</div>)
        );
    }
}

export default MetricDescriptionList;