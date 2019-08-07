import React from 'react';
import CorrelationTriangle from './CorrelationTriangle';
const d3 = require('d3');

const getRandom = () => {
    return +Math.random().toFixed(2);
}
// START GENERATE DATA FOR TRIANGLE
const generateValues = () => {
    const arr = [
        [1, 3, 5, 6],
        [1, 3, 5, 6],
        [1, 2, 4, 5, 7, 9],
        [1, 2, 4, 5, 7, 9],
        [1, 2, 4, 5, 8, 9],
        [2, 3, 5, 6],
        [1, 3, 5, 7],
        [1, 3, 5, 6, 8],
        [1, 2, 3, 5, 7, 9],
        [1, 2, 4, 5, 7, 8],
        [1, 2, 4, 5, 7, 8]
    ];
    const values = [];

    for (let i = 0; i < arr.length; i++) {
        let childArr = arr[i];
        let valueObj = {};

        for (let k = 0; k < childArr.length; k++) {
            valueObj[childArr[k]] = getRandom();
        }

        values.push(valueObj);
    }
    return values;
}
// END GENERATE DATA FOR TRIANGLE

class Correlation extends React.Component {
    constructor(props) {
        super(props);
        this.childTriangle = React.createRef();
    }
    _isMounted = true;
    state = { data: generateValues() }

    componentDidMount() {
        let values = generateValues();
        this._isMounted = true;
        this.setState({ data: values, selected: {} });
    
        this.interval = setInterval(() => {
            if(this._isMounted){
                let v = getRandom();
                let l1 = Math.floor(Math.random() * values.length);
                let l2 = Math.floor(Math.random() * values.length);

                if (this.state.data[l1][l2] == null) {
                    // console.log("l1: " + l1 + " // l2: " + l2 + " // v: " + v);

                    let dataNew = this.state.data;
                    dataNew[l1][l2] = v;

                    this.setState({ data: dataNew });
                }
            }
        }, 1000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    dataFromChild = (dataFromChild) => {
        console.log(dataFromChild);
        this.setState({selected: dataFromChild});
        this.props.onSelectCorrelationTriangle(dataFromChild);
    }

    setCorrelationValue = value => {
        const {selected} = this.state;
        d3.select(`#txt-${selected.line1}-${selected.line2}`).text(value);
    }
    
    getCorrelation = () => {
        return this.state.selected;
    }

    render() {
        return (
            <CorrelationTriangle
                x="0"
                y="0"
                lineHeight="56"
                values={this.state.data}
                dataToParent={this.dataFromChild}
                ref={this.childTriangle}
            />
        );
    }
}

export default Correlation;