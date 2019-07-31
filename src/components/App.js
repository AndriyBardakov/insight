import './App.css';
import React from 'react';
import Header from './header/Header';
import Connector from './connector/Connector';
import Grid from './grid/Grid';
import Sidebar from './sidebar/Sidebar';

const WS_URL = 'ws://95.216.78.62:9002';
const ws = new WebSocket(WS_URL);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { entries: [], selected: null, connected: false, serverUrl: '' };
        this.child = React.createRef();
    }

    // FOR TEST
    getData = () => {
        let newData = [];
        for (let i = 0; i < 300; i++) {
            newData.push({
                "id": i + 1,
                "type": "double",
                "entropy": 0.76,
                "significance": null,
                "mectric": "Eucledean",
                "status": i === 5 || i === 8 ? "favourite" : (i === 7 ? "hidden" : ""),
                "name": "ns=2;s=OPC.G_PANDA.FE0502.stVerschliesskopfHorizontal.stIn.rPosition",
            });
        }
        this.setGridData(newData);
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

    componentDidMount() {
        ws.onopen = () => {
            console.log('ws connection open');
        }
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

    onSubmitConnector = (url, data) => {
        this.setState({ connected: true });
        this.setState({ serverUrl: url });
        // this.getData(); // FOR TEST

        const obj = {
            "request_id": 1,
            "info": {
                "request_type": 2
            }
        };

        ws.send(JSON.stringify(obj));
        ws.onmessage = evt => {
            console.log(JSON.parse(evt.data));
            const res = JSON.parse(evt.data);
            let data = res.schema.fields;
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
    }

    onChangeServer = () => {
        this.setState({ connected: false });
    }

    render() {
        const { serverUrl, connected, entries } = this.state;
        return (
            <div className="insight-main-container ui container">
                <Header server={serverUrl} connected={connected} onChangeServer={this.onChangeServer} />
                {connected ?
                    <div style={{ height: '100%' }}>
                        <Grid data={entries} resolveData={data => data.map(row => row)} onSelect={this.onSelectRow} />
                        <Sidebar ref={this.child} onChangeStatus={this.onChangeStatus} />
                    </div>
                    :
                    <Connector onSubmit={this.onSubmitConnector} />}
            </div>
        );
    }
}

export default App;