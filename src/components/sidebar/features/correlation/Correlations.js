import React from 'react';
import CorrelationTriangle from './CorrelationTriangle';

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
    state = { data: generateValues() }
    // state = { data: [] }

    componentDidMount() {
        let values = generateValues();
        this.setState({ data: values, selected: {} });
    }

    componentWillUnmount() {
    }

    dataFromChild = (dataFromChild) => {
        this.setState({selected: dataFromChild});
        this.props.onSelectCorrelationTriangle(dataFromChild);
    }

    setCorrelationValue = value => {
        const {selected} = this.state;
        this.childTriangle.current.updateSquare(`${selected.line1}-${selected.line2}`, value);
    }
    
    getCorrelation = () => {
        return this.state.selected;
    }

    clearSelections = () => {
        this.setState({selected: {}});
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