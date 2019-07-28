import React from 'react';
import MetricDescriptionList from './MetricDescriptionList';
import MetricStatusList from './MetricStatusList';

class Metric extends React.Component{

    render(){
        return (
            <div className="metric-content sidebar-content">
                <h4 className="header">Description</h4>
                <MetricDescriptionList />
                <h4 className="header">Status</h4>
                <MetricStatusList />
            </div>
        );
    }
}

export default Metric;