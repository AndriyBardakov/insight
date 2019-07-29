import './App.css';
import React from 'react';
import Header from './header/Header';
import Grid from './grid/Grid';
import Sidebar from './sidebar/Sidebar';

class App extends React.Component {
    state = { entries: [] };

    // FOR TEST
    getData = () => {
        var newData = [];
        for (let i = 0; i < 500; i++) {
            newData.push({
                "id": ++i,
                "type": "double",
                "entropy": 0.76,
                "significance": null,
                "mectric": "Eucledean",
                "status": "",
                "name": "ns=2;s=OPC.G_PANDA.FE0502.stVerschliesskopfHorizontal.stIn.rPosition",
            });
        }
        this.setState({ entries: newData });
    }

    componentDidMount() {
        this.getData(); // FOR TEST
    }

    render() {
        return (
            <div className="insight-main-container ui container">
                <Header />
                <Grid data={this.state.entries} />
                <Sidebar />
            </div>
        );
    }
}

export default App;