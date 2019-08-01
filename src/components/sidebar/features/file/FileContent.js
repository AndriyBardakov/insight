import React from 'react';
import { List } from 'semantic-ui-react';
import { parseUrl } from '../../../helpers';

class FileContent extends React.Component {

    parsePeriod = () => {
        const {start_time, end_time} = this.props.dbInfo;
        if(start_time && end_time){
            let startDate = new Date(start_time);
            let endDate = new Date(end_time);
            const period = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}, ${startDate.getHours()}:${startDate.getMinutes()} Uhr - ${endDate.getDate()}.${endDate.getMonth() + 1}.${endDate.getFullYear()}, ${endDate.getHours()}:${endDate.getMinutes()} Uhr`;
            return period;
        }
        return '';
    }

    getMeasuringTime = () => {
        const {start_time, end_time} = this.props.dbInfo;
        if(start_time && end_time){
            const msSec = 1000;
            const msMin = 60 * msSec;
            const msHour = 60 * msMin;
            const msDay = 24 * msHour;
            let days = 0;
            let hours = 0;
            let mins = 0;
            let seconds = 0;
            
            let diff = end_time - start_time;
            if(diff / msDay > 1){
                days = Math.round(diff / msDay);
                diff = diff - (days * msDay);
            }
            if(diff / msHour > 1){
                hours = Math.round(diff / msHour);
                diff = diff - (hours * msHour);
            }
            if(diff / msMin > 1){
                mins = Math.round(diff / msMin);
                diff = diff - (mins * msMin);
            }
            if(diff / msSec > 1){
                seconds = Math.round(diff / msSec);
                diff = diff - (seconds * msSec);
            }
            
            return `${days ? days + ' Tag' + (days > 1 ? 'e' : '') + ', ': ''}
                ${hours ? hours + ' Stunde' + (hours > 1 ? 'n' : '') + ', ' : (days ? '0 Studen, ' : '')}
                ${mins ? mins + ' Minute' + (mins > 1 ? 'n' : '') + ', ' : (days || hours ? '0 Minuten, ' : '')}
                ${seconds ? seconds + 'Sekunde' + (seconds > 1 ? 'n' : '') : (days || hours || mins ? '0 Sekunden' : '')}`; 
        }
        return '';
    }

    getTotalData = () => {
        let {data_per_parameter, number_of_parameters} = this.props.dbInfo;
        data_per_parameter = data_per_parameter || 0;
        number_of_parameters = number_of_parameters || 0;

        return data_per_parameter * number_of_parameters;
    }

    render() {
        return (
            <List className="file-content sidebar-content">
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Filename</List.Header>
                        <List.Description>
                            {parseUrl(this.props.server).url}
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Period</List.Header>
                        <List.Description>
                            {this.parsePeriod()}
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Measuring time</List.Header>
                        <List.Description>
                            {this.getMeasuringTime()}
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Number of parameters</List.Header>
                        <List.Description>
                            {this.props.dbInfo.data_per_parameter}
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Number of data</List.Header>
                        <List.Description>
                            {this.props.dbInfo.number_of_parameters}
                        </List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Content>
                        <List.Header as='a'>Total data</List.Header>
                        <List.Description>
                            {this.getTotalData()}
                        </List.Description>
                    </List.Content>
                </List.Item>
            </List>
        );
    }
};

export default FileContent;