import React from 'react';
import { List, Form, Input, Button } from 'semantic-ui-react';
import MetricDescriptionItem from './MetricDescriptionItem';

class MetricDescriptionList extends React.Component {
    constructor(props) {
        super(props);
        this.childMetricDescriptionListItem = React.createRef();
    }
    state = { 
        activeIndex: -1, 
        data: [], 
        metrics: {}, 
        metricParams: {},
        showList: false, 
        emptyType: false, 
        type: '', 
        valueParam1: '', 
        valueParam2: '',
        param1: {
            name: 'Parameter 1',
            type: "number",
            visible:true
        },
        param2: {
            name: 'Parameter 2',
            type: "number",
            visible:true
        }
    }

    onClickHandler = (e, titleProps) => {
        const { index, type } = titleProps;
        
        if (this.state.activeIndex === index) {
            return;
        }
        this.setState({ activeIndex: index });
        this.props.onChangeMetric(type);
        this.setMetricParams(type);
    }

    setMetricParams = (type) => {
        const { metricParams, param1, param2 } = this.state;
        const params = metricParams[type];

        if(!params || !params.parameters_amount){
            param1.visible = false;
            param2.visible = false;
        }
        else if(params.parameters_amount === 1){
            const [p1] = params.parameters;
            param1.visible = true;
            param1.name = p1.name;
            param1.type = p1.type === "double" || p1.type === "int32" ? "number" : "string";
            param2.visible = false;
        }
        else{
            const [p1, p2] = params.parameters;
            param1.visible = true;
            param1.name = p1.name;
            param1.type = p1.type === "double" || p1.type === "int32" ? "number" : "string";
            param2.visible = true;
            param2.name = p2.name;
            param2.type = p2.type === "double" || p2.type === "int32" ? "number" : "string";
        }
    }

    setMetrics = (metrics, metricParams) => {
        this.setState({ metrics, metricParams });
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
            this.setMetricParams(metric);
        }
        else {
            this.toggleList(false, true);
        }
        this.setMetric(metric);
        this.setState({valueParam1: '', valueParam2: ''});
    }

    toggleList = (showList, emptyType) => {
        if (emptyType) {
            this.setState({ emptyType });
        }
        this.setState({ showList });
    }

    render() {
        const { activeIndex, showList, emptyType, valueParam1, valueParam2, param1, param2 } = this.state;

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
                    <List divided relaxed selection id="metrics-list" 
                        ref={this.childMetricDescriptionListItem} 
                        items={this.state.data.map(createItem.bind(this))} 
                        style={{ margin: 0 }} 
                        className="description-list"></List>
                    {param1.visible || param2.visible ?
                        <Form className="sidebar-content feature-form" onSubmit={() => { this.props.onSubmitParamenters(valueParam1, valueParam2) }}>
                        {param1.visible ? <Form.Field
                                control={Input}
                                placeholder={param1.name}
                                onChange={e => { this.setState({ valueParam1: e.target.value }) }}
                                value={valueParam1}
                                type='number'
                                min='0'
                                step="0.01"
                            /> : ''}
                        {param1.visible ? <Form.Field
                                control={Input}
                                placeholder={param2.name}
                                onChange={e => { this.setState({ valueParam2: e.target.value }) }}
                                value={valueParam2}
                                type='number'
                                min='0'
                                step="0.01"
                            /> : ''}
                            <Form.Field
                                id='form-button-control-public'
                                control={Button}
                                content='Use Parameters'
                                primary
                            />
                        </Form> : ''}
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