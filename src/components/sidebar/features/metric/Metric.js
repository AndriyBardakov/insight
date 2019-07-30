import React from 'react';
import MetricDescriptionList from './MetricDescriptionList';
import MetricStatusList from './MetricStatusList';

class Metric extends React.Component{
    constructor(props) {
        super(props);
        this.child = React.createRef();
    }

    render(){
        const { onChangeStatus } = this.props;
        return (
            <div className="metric-content sidebar-content">
                <h4 className="header">Metric</h4>
                <MetricDescriptionList />
                <h4 className="header">Status</h4>
                <MetricStatusList ref={this.child} onChangeStatus={onChangeStatus} />
            </div>
        );
    }
}

export default Metric;