import './Sidebar.css';
import React from 'react';
import { Accordion, Menu } from 'semantic-ui-react';
import FileContent from './features/file/FileContent';
import Metric from './features/metric/Metric';
import SignificanceAnalysis from './features/significanceAnalysis/SignificanceAnalysis';
import Forecast from './features/forecast/Forecast';
import Correlation from './features/correlation/Correlations';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();
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
    }

    render() {
        const { activeItem } = this.state;

        return (
            <div className="insight-sidebar">
                <Accordion as={Menu} vertical>
                    {activeItem.correlation ? null :
                        <Menu.Item >
                            <Accordion.Title
                                active={activeItem.file}
                                content="File"
                                onClick={this.onClickHandler}
                                name="file"
                            />
                            <Accordion.Content active={activeItem.file}>
                                <FileContent />
                            </Accordion.Content>
                        </Menu.Item>}
                    {activeItem.correlation ? null :
                        <Menu.Item >
                            <Accordion.Title
                                active={activeItem.metric}
                                content="Parameter settings"
                                onClick={this.onClickHandler}
                                name="metric"
                            />
                            <Accordion.Content active={activeItem.metric}>
                                <Metric ref={this.child} onChangeStatus={this.props.onChangeStatus} />
                            </Accordion.Content>
                        </Menu.Item>}
                    {activeItem.correlation ? null :
                        <Menu.Item >
                            <Accordion.Title
                                active={activeItem.significanceAnalysis}
                                content="Significance analysis"
                                onClick={this.onClickHandler}
                                name="significanceAnalysis"
                            />
                            <Accordion.Content active={activeItem.significanceAnalysis}>
                                <SignificanceAnalysis />
                            </Accordion.Content>
                        </Menu.Item>}
                    {activeItem.correlation ? null :
                        <Menu.Item >
                            <Accordion.Title
                                active={activeItem.forecast}
                                content="Forecast"
                                onClick={this.onClickHandler}
                                name="forecast"
                            />
                            <Accordion.Content active={activeItem.forecast}>
                                <Forecast />
                            </Accordion.Content>
                        </Menu.Item>}
                    <Menu.Item >
                        <Accordion.Title
                            active={activeItem.correlation}
                            content="Correlation"
                            onClick={this.onClickHandler}
                            name="correlation"
                        />
                        <Accordion.Content active={activeItem.correlation}>
                            <Correlation />
                        </Accordion.Content>
                    </Menu.Item>
                </Accordion>
            </div>
        );
    }
}

export default Sidebar;