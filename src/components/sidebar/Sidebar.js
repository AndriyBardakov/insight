import './Sidebar.css';
import React from 'react';
import { Accordion, Menu } from 'semantic-ui-react';
import FileContent from './features/file/FileContent';
import Metric from './features/metric/Metric';
import SignificanceAnalysis from './features/significanceAnalysis/SignificanceAnalysis';
import Correlation from './features/correlation/Correlations';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.childMetric = React.createRef();
        this.childSignificance = React.createRef();
        this.childCorrelation = React.createRef();
    }
    state = {
        activeItem: {
            file: false,
            metric: false,
            significanceAnalysis: false,
            forecast: false,
            correlation: false
        }
    }

    onClickHandler = (e, titleProps) => {
        const { name } = titleProps;
        const { activeItem } = this.state;
        activeItem[name] = !activeItem[name];
        this.setState({ activeItem });
        if(name === "correlation"){
            this.props.onCorrelationActive(activeItem.correlation);
        }
    }

    render() {
        const { activeItem } = this.state;
        const { server, dbInfo, onChangeStatus, onChangeMetric, onSubmitParamenters, onSubmitSignificance, onDeleteQuality, onSelectCorrelationTriangle } = this.props;
        return (
            <div className="insight-sidebar">
                <Accordion as={Menu} vertical>
                    <Menu.Item className={activeItem.correlation ? 'hidden' : ''}>
                        <Accordion.Title
                            active={activeItem.file}
                            content="Source"
                            onClick={this.onClickHandler}
                            name="file"
                        />
                        <Accordion.Content active={activeItem.file}>
                            <FileContent server={server} dbInfo={dbInfo} />
                        </Accordion.Content>
                    </Menu.Item>
                    <Menu.Item className={activeItem.correlation ? 'hidden' : ''}>
                        <Accordion.Title
                            active={activeItem.metric}
                            content="Parameter settings"
                            onClick={this.onClickHandler}
                            name="metric"
                        />
                        <Accordion.Content active={activeItem.metric}>
                            <Metric
                                ref={this.childMetric}
                                onChangeStatus={onChangeStatus}
                                onChangeMetric={onChangeMetric}
                                onSubmitParamenters={onSubmitParamenters}
                            />
                        </Accordion.Content>
                    </Menu.Item>
                    <Menu.Item className={activeItem.correlation ? 'hidden' : ''}>
                        <Accordion.Title
                            active={activeItem.significanceAnalysis}
                            content="Significance analysis"
                            onClick={this.onClickHandler}
                            name="significanceAnalysis"
                        />
                        <Accordion.Content active={activeItem.significanceAnalysis}>
                            <SignificanceAnalysis 
                                ref={this.childSignificance} 
                                onSubmitSignificance={onSubmitSignificance} 
                                onDeleteQuality={onDeleteQuality}
                            />
                        </Accordion.Content>
                    </Menu.Item>
                    <Menu.Item >
                        <Accordion.Title
                            active={activeItem.correlation}
                            content="Correlation"
                            onClick={this.onClickHandler}
                            name="correlation"
                        />
                        <Accordion.Content active={activeItem.correlation}>
                            <Correlation ref={this.childCorrelation} onSelectCorrelationTriangle={onSelectCorrelationTriangle} />
                        </Accordion.Content>
                    </Menu.Item>
                </Accordion>
            </div>
        );
    }
}

export default Sidebar;