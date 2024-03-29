import './App.css';
import React from 'react';
import Header from './header/Header';
import Connector from './connector/Connector';
import Grid from './grid/Grid';
import Sidebar from './sidebar/Sidebar';
import { SemanticToastContainer } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { displayMessage, parseUrl, round, onGridSort, setWaitingCursor } from './helpers';

// const WS_URL = 'ws://95.216.78.62:9002';
let ws = null;

const protocol = {
    gridData: { id: 1, type: 2 },
    dbInfo: { id: 2, type: 6 },
    metricData: { id: 3, type: 5 },
    entropy: { id: 4, startId: 10000 },
    significance: { id: 5 },
    forecast: { id: 6 },
    correlation: { id: 7, batchId: 8 }
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
        this.state = { entries: [], selected: null, connected: false, serverUrl: '', dbInfo: {}, correlation: [], correlationIds: {} };
        this.childSidebar = React.createRef();
        this.childGrid = React.createRef();
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
                    setWaitingCursor(false);
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
            model.significance = null;

            this.setGridData(entries);
            const offset = this.getQualityRowModel(entries) ? 55 : 0;
            setTimeout(() => {
                const body = document.querySelector('.rt-tbody');
                const row = document.querySelector('.rt-tr.active');
                if (row) {
                    body.scrollTo(0, row.offsetTop - (type === "hidden" ? 0 : 55) - offset);
                    this.childGrid.current.scrollTop();
                }
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
                "par1": param1 ? +param1 : '',
                "par2": param2 ? +param2 : ''
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
    // ===> end Parameter settings <===

    // ===> start Significance <===
    onSubmitSignificance = values => {
        if (values.length) {
            const { selected, dbInfo } = this.state;
            const { start_time, end_time } = dbInfo;
            if (selected) {
                const { name } = selected.original;
                const res = values.join(';');
                const body = {
                    start_time,
                    end_time,
                    field: name,
                    response: res
                };
                this.removeCorrelationTriangle();
                setWaitingCursor(true);
                sendRequest(protocol.significance.id, "significance", body);
                this.onSubmitForecast(values);
            }
            else {
                displayMessage("warning", "Please select parameter first.");
            }
        }
    }

    setSignificance = values => {
        const { entries } = this.state;
        entries.forEach(entry => {
            let model = values.find(v => v.field === entry.name);
            if (model) {
                entry.significance = round(model.value);
            }
        });
        this.setGridData(entries);
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

    deleteQuality = (clearSelected) => {
        const { entries } = this.state;
        const model = this.getQualityRowModel(entries);
        if (model) {
            model.status = "normal";
            this.setGridData(entries);
        }
        onGridSort(true);
        if (clearSelected) {
            this.setState({ selected: null });
        }
        this.childSidebar.current.childCorrelation.current.clearSelections();
        this.removeCorrelationTriangle();
    }
    // ===> end Significance <===

    // ===> start Correlation <===
    toggleCorrelation = active => {
        this.childGrid.current.toggleCorrelation(active);
        this.setState({ correlation: [] });
        this.clearCorrelationTriangle();
    }

    onSelectCorrelationTriangle = ({ line1, line2 }) => {
        const { entries } = this.state;
        let result = [];
        const index1 = +line1;
        const index2 = +line2;
        const entry1 = entries[index1];
        const entry2 = entries[index2];

        result.push(index1);
        result.push(index2);

        this.setState({ correlation: result });
        this.childGrid.current.setSelectedRowsByIndex(result);
        this.correlationRequest(entry1, entry2);
    }

    correlationRequest = (entry1, entry2) => {
        const { dbInfo } = this.state;
        const { start_time, end_time } = dbInfo;

        const body = {
            start_time,
            end_time,
            fields: [
                { name: entry1.name, metric: entry1.metric },
                { name: entry2.name, metric: entry2.metric }
            ]
        };

        sendRequest(protocol.correlation.id, "correlation", body);
    }

    getCorrelationData = (data) => {
        const { entries, correlationIds } = this.state;
        const { dbInfo } = this.state;
        const { start_time, end_time } = dbInfo;
        const lines = 11;
        const targetData = data || entries;
        let fields = [];

        for (let i = 0; i < lines; i++) {
            let model = targetData[i];
            const { name, metric } = model;
            fields.push({ name, metric });
            correlationIds[name] = i;
        }
        this.setState({ correlationIds });
        const body = {
            start_time,
            end_time,
            fields
        };
        sendRequest(protocol.correlation.batchId, "correlation", body);
    }

    getCorrelationRows = () => {
        // return this.state.correlation;
        return this.childSidebar.current.childCorrelation.current.getCorrelation();
    }

    clearCorrelationTriangle = () => {
        this.childSidebar.current.childCorrelation.current.childTriangle.current.clearSelections();
    }

    removeCorrelationTriangle = () => {
        const el = document.getElementById('triangle_svg');
        if (el) {
            el.remove();
        }
    }
    // ===> end Correlation <===

    onMessage = evt => {
        const res = JSON.parse(evt.data);
        const { gridData, dbInfo, metricData, entropy, significance, forecast, correlation } = protocol;

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
                const { metrics, params } = res;
                if (metrics && metrics.length) {
                    let objMetrics = {};
                    let objParams = {};
                    for (let m of metrics) {
                        objMetrics[m.type] = m.metrics;
                    }
                    for (let p of params) {
                        objParams[p.metric_name] = {
                            parameters: p.parameters,
                            parameters_amount: p.parameters_amount
                        };
                    }
                    this.childSidebar.current.childMetric.current.childMetricDescriptionList.current.setMetrics(objMetrics, objParams);
                }
                break;
            case entropy.id:
            case significance.id:
            case forecast.id:
            case correlation.id:
            case correlation.batchId:
                const { status, result } = res.calc_status;

                switch (res.request_id) {
                    case entropy.id:
                        if (status === "complete") {
                            this.setEntropy(result.entropy);
                        }
                        break;
                    case significance.id:
                        if (status === "error") {
                            displayMessage("error", "No calculation possible for selected values.");
                            setWaitingCursor(false);
                        }
                        else if (status === "complete") {
                            this.setSignificance(result.significance);
                            this.deleteQuality();
                            this.onChangeStatus('quality');
                            this.childSidebar.current.childSignificance.current.setQualityRow(true);
                            setWaitingCursor(false);
                            onGridSort();
                            this.childSidebar.current.childCorrelation.current.childTriangle.current.triangleInit();
                            this.getCorrelationData();
                        }
                        break;
                    case forecast.id:
                        if (status === "complete") {
                            this.childSidebar.current.childSignificance.current.setAccuracy(result.accuracy);
                        }
                        break;
                    case correlation.id:
                        if (status === "complete") {
                            const res = result.correlation[0].correlation;
                            this.childSidebar.current.childCorrelation.current.setCorrelationValue(round(res));
                        }
                        break;
                    case correlation.batchId:
                        if (status === "complete") {
                            const { correlationIds } = this.state;
                            console.log('correlation data: ' + JSON.stringify(result.correlation));
                            result.correlation.forEach(({ field1, field2, correlation }) => {
                                this.childSidebar.current.childCorrelation.current.childTriangle.current.updateSquare(`${correlationIds[field1]}-${correlationIds[field2]}`, correlation);
                            });
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
                        <Grid
                            data={entries}
                            onClose={this.closeConnection}
                            resolveData={data => data.map(row => row)}
                            onSelect={this.onSelectRow}
                            getCorrelationRows={this.getCorrelationRows}
                            correlationRequest={this.correlationRequest}
                            getCorrelationData={this.getCorrelationData}
                            ref={this.childGrid}
                        />
                        <Sidebar
                            ref={this.childSidebar}
                            server={serverUrl}
                            onChangeStatus={this.onChangeStatus}
                            onChangeMetric={this.onChangeMetric}
                            onSubmitParamenters={this.onSubmitParamenters}
                            onSubmitSignificance={this.onSubmitSignificance}
                            onDeleteQuality={this.deleteQuality}
                            onCorrelationActive={this.toggleCorrelation}
                            onSelectCorrelationTriangle={this.onSelectCorrelationTriangle}
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