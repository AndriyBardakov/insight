import React from 'react';
import MetricDescriptionList from './MetricDescriptionList';
import MetricStatusList from './MetricStatusList';

class Metric extends React.Component{
    constructor(props) {
        super(props);
        this.childMetricsStatusList = React.createRef();
        this.childMetricDescriptionList = React.createRef();
    }

    render(){
        const { onChangeStatus, onChangeMetric, onSubmitParamenters} = this.props;
        return (
            <div className="metric-content sidebar-content">
                <h4 className="header">Metric</h4>
                <MetricDescriptionList 
                    ref={this.childMetricDescriptionList} 
                    onChangeMetric={onChangeMetric} 
                    onSubmitParamenters={onSubmitParamenters}
                />
                <h4 className="header">Status</h4>
                <MetricStatusList 
                    ref={this.childMetricsStatusList} 
                    onChangeStatus={onChangeStatus} 
                />
            </div>
        );
    }
}

export default Metric;