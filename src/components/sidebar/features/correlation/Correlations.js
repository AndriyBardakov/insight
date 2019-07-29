import React from 'react';
import CorrelationTriangle from './CorrelationTriangle';

const values = [
    {
        1: +Math.random().toFixed(2),
        3: +Math.random().toFixed(2),
        5: +Math.random().toFixed(2),
        6: +Math.random().toFixed(2),
    },
    {
        1: 0.43,
        3: +Math.random().toFixed(2),
        5: +Math.random().toFixed(2),
        6: +Math.random().toFixed(2),
    },
    {
        1: +Math.random().toFixed(2),
        2: +Math.random().toFixed(2),
        4: +Math.random().toFixed(2),
        5: +Math.random().toFixed(2),
        7: +Math.random().toFixed(2),
        9: +Math.random().toFixed(2),
    },
    {
        1: +Math.random().toFixed(2),
        2: +Math.random().toFixed(2),
        4: +Math.random().toFixed(2),
        5: +Math.random().toFixed(2),
        7: +Math.random().toFixed(2),
        9: +Math.random().toFixed(2),
    },
    {
        1: +Math.random().toFixed(2),
        2: +Math.random().toFixed(2),
        4: +Math.random().toFixed(2),
        5: +Math.random().toFixed(2),
        8: +Math.random().toFixed(2),
        9: +Math.random().toFixed(2),
    },
    {
        2: +Math.random().toFixed(2),
        3: +Math.random().toFixed(2),
        5: +Math.random().toFixed(2),
        6: +Math.random().toFixed(2),
    },
    {
        1: +Math.random().toFixed(2),
        3: +Math.random().toFixed(2),
        5: +Math.random().toFixed(2),
        7: +Math.random().toFixed(2),
    },
    {
        1: +Math.random().toFixed(2),
        3: +Math.random().toFixed(2),
        5: +Math.random().toFixed(2),
        6: +Math.random().toFixed(2),
        8: +Math.random().toFixed(2),
    },
    {
        1: +Math.random().toFixed(2),
        2: +Math.random().toFixed(2),
        3: +Math.random().toFixed(2),
        5: +Math.random().toFixed(2),
        7: +Math.random().toFixed(2),
        9: +Math.random().toFixed(2),
    },
    {
        1: +Math.random().toFixed(2),
        2: +Math.random().toFixed(2),
        4: +Math.random().toFixed(2),
        5: +Math.random().toFixed(2),
        7: +Math.random().toFixed(2),
        8: +Math.random().toFixed(2),
    },
    {
        1: +Math.random().toFixed(2),
        2: +Math.random().toFixed(2),
        4: +Math.random().toFixed(2),
        5: +Math.random().toFixed(2),
        7: +Math.random().toFixed(2),
        8: +Math.random().toFixed(2),
    }

];

class Correlation extends React.Component {
    state = { data: values }

    componentDidMount() {

        this.interval = setInterval(() => {
            let v = +Math.random().toFixed(2);
            let l1 = Math.floor(Math.random() * values.length);
            let l2 = Math.floor(Math.random() * values.length);

            if (this.state.data[l1][l2] == null) {
                console.log("l1: " + l1 + " // l2: " + l2 + " // v: " + v);

                let dataNew = this.state.data;
                dataNew[l1][l2] = v;

                this.setState({ data: dataNew });
            }

        }, 1000);

    }

    dataFromChild = (dataFromChild) => {
        console.log(dataFromChild);
    }

    render() {
        return (
            <CorrelationTriangle
                x="0"
                y="0"
                lineHeight="56"
                values={this.state.data}
                dataToParent={this.dataFromChild}
            />
        );
    }
}

export default Correlation;