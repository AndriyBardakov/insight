import React from 'react';
import { List } from 'semantic-ui-react';

class FileContent extends React.Component {
    state = {
        descriptions: {
            filename: '',
            period: '',
            measuringTime: '',
            numberOfParams: '',
            numberOfData: '',
            totalData: ''
        }
    };

    componentDidMount() {
        // FOR TEST
        this.setState({
            descriptions: {
                filename: "Dateiname.json",
                period: "20.01, 4:08 - 21.01, 3:44",
                measuringTime: "9 days, 3 hours, 5 minutes, 1 seconds",
                numberOfParams: "150",
                numberOfData: "50.000",
                totalData: "1.050.000"
            }
        });
    }

    render() {
        return (
            <List className="file-content sidebar-content">
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Filename</List.Header>
                        <List.Description>
                            {this.state.descriptions.filename}
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Period</List.Header>
                        <List.Description>
                            {this.state.descriptions.period}
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Measuring time</List.Header>
                        <List.Description>
                            {this.state.descriptions.measuringTime}
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Number of parameters</List.Header>
                        <List.Description>
                            {this.state.descriptions.numberOfParams}
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Number of data</List.Header>
                        <List.Description>
                            {this.state.descriptions.numberOfData}
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Total data</List.Header>
                        <List.Description>
                            {this.state.descriptions.totalData}
                        </List.Description>
                    </List.Content>
                </List.Item>
            </List>
        );
    }
};

export default FileContent;