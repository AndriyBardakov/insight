import './App.css';
import React from 'react';
import Header from './header/Header';
import Connector from './connector/Connector';
import Grid from './grid/Grid';
import Sidebar from './sidebar/Sidebar';
import { SemanticToastContainer } from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import { displayMessage, parseUrl } from './helpers';

// const WS_URL = 'ws://95.216.78.62:9002';
let ws = null;

const requestIds = {
    gridData: 1,
    dbInfo: 2
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
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { entries: [], selected: null, connected: false, serverUrl: '', dbInfo: {} };
        this.child = React.createRef();
    }

    loadGridData = (data) => {
        data = data.map((d, i) => {
            return {
                "id": i + 1,
                "type": d.type,
                "entropy": null,
                "significance": null,
                "mectric": "",
                "status": "",
                "name": d.name
            }
        });
        this.setGridData(data);
    }

    setGridData = (data) => {
        const status = {
            favourite: 0,
            normal: 1,
            hidden: 2
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

    loadDBInfo = (dbInfo) => {
        this.setState({ dbInfo });
    }

    componentDidMount() {

    }

    onSelectRow = (e, info) => {
        this.setState({ selected: info });
        const { status } = info.original;
        const index = status && status !== "normal" ? (status === "favourite" ? 1 : 2) : 0;
        this.child.current.child.current.child.current.setActiveIndex(index);
    }

    onChangeStatus = (type) => {
        const { selected, entries } = this.state;
        if (selected) {
            let row = entries.find(d => d.id === selected.original.id);
            if (row) {
                row.status = type;
                this.setGridData(entries);
                setTimeout(() => {
                    const body = document.querySelector('.rt-tbody');
                    const row = document.querySelector('.rt-tr.active');
                    body.scrollTo(0, row.offsetTop - (type === "hidden" ? 0 : 55));

                });
            }
        }
    }

    onOpenConnection = () => {
        this.setState({ connected: true });
        ws.send(JSON.stringify({
            "request_id": requestIds.gridData,
            "info": { "request_type": 2 }
        }));

        ws.send(JSON.stringify({
            "request_id": requestIds.dbInfo,
            "info": { "request_type": 6 }
        }));
    }

    onMessage = (evt) => {
        const res = JSON.parse(evt.data);

        switch (res.request_id) {
            case requestIds.gridData:
                this.setState({ serverUrl: evt.origin });
                let data = res.schema.fields;
                this.loadGridData(data);
                break;
            case requestIds.dbInfo:
                this.loadDBInfo(res.dbinfo);
                break;
            default:
                break;
        }
    }

    closeConnection = () => {
        ws.close();
        console.log('connection closed');
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

    render() {
        const { serverUrl, connected, entries, dbInfo } = this.state;
        return (
            <div className="insight-main-container ui container">
                <Header connected={connected} onChangeServer={this.onChangeServer} />
                {connected ?
                    <div style={{ height: '100%' }}>
                        <Grid data={entries} onClose={this.closeConnection} resolveData={data => data.map(row => row)} onSelect={this.onSelectRow} />
                        <Sidebar
                            ref={this.child}
                            server={serverUrl}
                            onChangeStatus={this.onChangeStatus}
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