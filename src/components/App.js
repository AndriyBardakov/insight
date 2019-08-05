import './App.css';
import React from 'react';
import Header from './header/Header';
import Connector from './connector/Connector';
import Grid from './grid/Grid';
import Sidebar from './sidebar/Sidebar';
import { SemanticToastContainer } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { displayMessage, parseUrl, round } from './helpers';

// const WS_URL = 'ws://95.216.78.62:9002';
let ws = null;

const protocol = {
    gridData: { id: 1, type: 2 },
    dbInfo: { id: 2, type: 6 },
    metricData: { id: 3, type: 5 },
    entropy: { id: 4, startId: 10000 },
    significance: { id: 5 },
    forecast: { id: 6 }
}

const validateIpAndPort = (input) => {
    const parts = input.split(":");
    const port = parts[1];
    let ip = parts[0].split(".");
    return validateNum(port, 1, 65535) &&
        ip.length === 4 &&
        ip.every(function (segment) {
            return validateNum(segment, 0, 255);
        });
}

const validateNum = (input, min, max) => {
    const num = +input;
    return num >= min && num <= max && input === num.toString();
}

const sendRequest = (id, type, body) => {
    let req = { "request_id": id };

    if (body) {
        req[type] = body;
    }
    else {
        req.info = { "request_type": type };
    }
    ws.send(JSON.stringify(req));
}
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { entries: [], selected: null, connected: false, serverUrl: '', dbInfo: {} };
        this.childSidebar = React.createRef();
    }

    batchEntropy = [];
    // ===> start Initial page <===

    onOpenConnection = () => {
        this.setState({ connected: true });
        const { gridData, dbInfo, metricData } = protocol;

        sendRequest(gridData.id, gridData.type);
        sendRequest(dbInfo.id, dbInfo.type);
        sendRequest(metricData.id, metricData.type);
    }

    onSubmitConnector = (url, cb) => {
        url = parseUrl(url).url;
        const prefix = parseUrl(url).prefix;

        if (validateIpAndPort(url)) {
            url = (prefix || 'ws://') + url;
            try {
                if (!ws) {
                    ws = new WebSocket(url);
                }
                else {
                    console.log('connection exists');
                }

                ws.onopen = evt => this.onOpenConnection();
                ws.onmessage = evt => this.onMessage(evt);

                ws.onerror = evt => {
                    displayMessage("error", "Error in connection establishment.");
                    ws = null;
                }
                ws.onclose = function (event) {
                    console.log("WebSocket is closed now.");
                    if (cb) {
                        cb();
                    }
                    ws = null;
                };
            }
            catch (e) {
                displayMessage("error", "Wrong Url.");
            }
        }
        else {
            // displayMessage("warning", "Invalid Url. The URL's scheme must be either 'ws' or 'wss'");
            displayMessage("warning", "Please use valid Url.");
            if (cb) {
                cb();
            }
        }
    }

    onChangeServer = () => {
        this.setState({ connected: false });
    }

    // ===> end Initial page <===

    // ===> start Grid manipulations <===

    getSelectedRowModel = (entries) => {
        const { selected } = this.state;
        if (selected) {
            let row = entries.find(d => d.id === selected.original.id);
            return row;
        }
        return null;
    }

    getQualityRowModel = entries => entries.find(d => d.status === "quality");

    loadGridData = data => {
        data = data.map((d, i) => {
            const { type, name, minvalue, maxvalue } = d;
            return {
                name,
                minvalue,
                maxvalue,
                entropy: round(d.entropy),
                id: i + 1,
                type: type === "undefined" ? "" : type,
                significance: null,
                metric: type === "int32" || type === "double" || type === "bool" ? "Euclidian" : "",
                status: ""
            }
        });
        this.setGridData(data);
    }

    setGridData = data => {
        const status = {
            quality: 0,
            favourite: 1,
            normal: 2,
            hidden: 3
        };
        const newData = data.sort((a, b) => {
            if (!a.status) a.status = "normal";
            if (!b.status) b.status = "normal";

            if (a.status === b.status) {
                return a.id > b.id ? 0 : -1;
            }
            else {
                return status[a.status] - status[b.status];
            }
        });

        this.setState({ entries: newData });
    }

    onSelectRow = (e, info) => {
        this.setState({ selected: info });
        const { status, type, metric, minvalue, maxvalue } = info.original;
        const index = status && status !== "normal" ? (status === "favourite" ? 1 : 2) : 0;
        const { childMetricsStatusList, childMetricDescriptionList } = this.childSidebar.current.childMetric.current;

        childMetricsStatusList.current.setActiveIndex(index);
        childMetricDescriptionList.current.setType(type, metric);
        this.childSidebar.current.childSignificance.current.setSliderRange(minvalue, maxvalue);
    }

    loadDefaultEntropy = () => {
        const { dbInfo, entries } = this.state;
        const { start_time, end_time } = dbInfo;
        console.log('first request')
        entries.forEach((d, indx) => {
            const body = {
                start_time,
                end_time,
                metric: d.metric,
                "field": d.name,
                "par1": '',
                "par2": ''
            };
            sendRequest(protocol.entropy.startId + indx + 1, "entropy", body);
        });
    }

    // ===> end Grid manipulations <===

    // ===> start Parameter settings <===

    onChangeStatus = type => {
        const { entries } = this.state;
        let model = this.getSelectedRowModel(entries);
        if (model) {
            model.status = type;

            this.setGridData(entries);
            const offset = this.getQualityRowModel(entries) ? 55 : 0;
            setTimeout(() => {
                const body = document.querySelector('.rt-tbody');
                const row = document.querySelector('.rt-tr.active');
                body.scrollTo(0, row.offsetTop - (type === "hidden" ? 0 : 55) - offset);
            });
        }
    }

    onChangeMetric = metric => {
        const { entries } = this.state;
        let model = this.getSelectedRowModel(entries);
        if (model) {
            model.metric = metric;
            this.setGridData(entries);
        }
    }

    onSubmitParamenters = (param1, param2) => {
        const { selected, dbInfo } = this.state;
        const { start_time, end_time } = dbInfo;
        const { name, metric } = selected.original;
        if (metric) {
            const body = {
                start_time,
                end_time,
                metric,
                "field": name,
                "par1": param1 ? Number(param1) : '',
                "par2": param2 ? Number(param2) : ''
            };
            sendRequest(protocol.entropy.id, "entropy", body);
        }
        else {
            displayMessage("warning", "Please select metric.")
        }
    }

    setEntropy = (entropy, id) => {
        const { entries } = this.state;
        let modelId = id;
        let model = this.getSelectedRowModel(entries, modelId);
        if (model) {
            model.entropy = round(entropy);
            this.setGridData(entries);
        }
    }

    setBatchEntropy = () => {
        let { entries } = this.state;
        const { batchEntropy } = this;
        entries.forEach(e => {
            let temp = batchEntropy.find(b => b.id === e.id);
            if (temp) {
                e.entropy = round(temp.value);
            }
        });
        this.setGridData(entries);
    }

    // ===> end Parameter settings <===

    // ===> start Significance <===

    onSubmitSignificance = values => {
        if (values.length) {
            const { selected, dbInfo } = this.state;
            const { start_time, end_time } = dbInfo;
            const { name } = selected.original;
            const res = values.join(';');
            const body = {
                start_time,
                end_time,
                field: name,
                response: res
            };
            sendRequest(protocol.significance.id, "significance", body);
            this.onSubmitForecast(values);
        }
    }

    setSignificance = value => {
        const { entries } = this.state;
        let model = this.getSelectedRowModel(entries);
        if (model) {
            model.significance = round(value);
            this.setGridData(entries);
        }
    }

    onSubmitForecast = (values) => {
        if (values.length) {
            const { selected, dbInfo, entries } = this.state;
            const { start_time, end_time } = dbInfo;
            const { name } = selected.original;
            const res = values.join(';');
            let fields = entries.filter(e => e.name !== name).map(e => {
                return {
                    field: e.name,
                    metric: e.metric,
                    "par1": '',
                    "par2": ''
                };
            });
            const body = {
                start_time,
                end_time,
                fields,
                response_field: name,
                response_function: res
            };

            sendRequest(protocol.forecast.id, "mdt", body);
        }
    }

    deleteQuality = () => {
        const { entries } = this.state;
        const model = this.getQualityRowModel(entries);
        if(model){
            model.status = "normal";
            this.setGridData(entries);
        }
    }

    // ===> end Significance <===

    onMessage = evt => {
        const res = JSON.parse(evt.data);
        const { gridData, dbInfo, metricData, entropy, significance, forecast } = protocol;

        switch (res.request_id) {
            case gridData.id:
                this.setState({ serverUrl: evt.origin });
                let data = res.schema.fields;
                this.loadGridData(data);
                break;
            case dbInfo.id:
                this.setState({ dbInfo: res.dbinfo });
                // this.loadDefaultEntropy();
                break;
            case metricData.id:
                const { metrics } = res;
                if (metrics && metrics.length) {
                    let obj = {};
                    for (let m of metrics) {
                        obj[m.type] = m.metrics;
                    }
                    this.childSidebar.current.childMetric.current.childMetricDescriptionList.current.setMetrics(obj);
                }
                break;
            case entropy.id:
            case significance.id:
            case forecast.id:  
                const { status, result } = res.calc_status;

                switch(res.request_id){
                    case entropy.id:
                        if (status === "complete") {
                            this.setEntropy(result.entropy);
                        }
                        break;
                    case significance.id:
                        if (status === "error") {
                            displayMessage("error", "No calculation possible for selected values.");
                        }
                        else if (status === "complete") {
                            this.setSignificance(result.significance);
                            this.deleteQuality();
                            this.onChangeStatus('quality');
                            this.childSidebar.current.childSignificance.current.setQualityRow(true);
                        }
                        break;
                    case forecast.id:
                        if (status === "complete") {
                            this.childSidebar.current.childSignificance.current.setAccuracy(result.accuracy);
                        }
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    }

    closeConnection = () => {
        ws.close();
        console.log('connection closed');
    }

    render() {
        const { serverUrl, connected, entries, dbInfo } = this.state;
        return (
            <div className="insight-main-container ui container">
                <Header connected={connected} onChangeServer={this.onChangeServer} />
                {connected ?
                    <div style={{ height: '100%' }}>
                        <Grid data={entries} onClose={this.closeConnection} resolveData={data => data.map(row => row)} onSelect={this.onSelectRow} />
                        <Sidebar
                            ref={this.childSidebar}
                            server={serverUrl}
                            onChangeStatus={this.onChangeStatus}
                            onChangeMetric={this.onChangeMetric}
                            onSubmitParamenters={this.onSubmitParamenters}
                            onSubmitSignificance={this.onSubmitSignificance}
                            onSubmitForecast={this.onSubmitForecast}
                            onDeleteQuality={this.deleteQuality}
                            dbInfo={dbInfo}
                        />
                    </div>
                    :
                    <Connector onSubmit={this.onSubmitConnector} />}
                <SemanticToastContainer position="top-right" />
            </div>
        );
    }
}

export default App;