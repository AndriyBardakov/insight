import React from 'react';
import ReactTable from "react-table";
import "./Grid.css";
import "react-table/react-table.css";
import { onGridSort } from '../helpers';


class Grid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            selected: [],
            selectedByIndex: [],
            isCorrelation: false
        };
        this.reactTable = React.createRef();
    }

    static defaultProps = {
        data: []
    };

    componentWillUnmount() {
        this.props.onClose();
    }

    toggleCorrelation = (isCorrelation) => {
        this.setState({ selected: [], selectedByIndex: [] });
        if (isCorrelation) {
            const body = document.querySelector('.rt-tbody');
            body.scrollTo(0, 0);
        }

        this.setState({ isCorrelation });
    }

    scrollTop = () => {
        if (this.state.isCorrelation) {
            const body = document.querySelector('.rt-tbody');
            body.scrollTo(0, 0);
        }
    }

    setSelectedRows = (selected) => {
        this.setState({ selected });
    }

    setSelectedRowsByIndex = (selectedByIndex, afterSort) => {
        const nodes = Array.prototype.slice.call(document.querySelector('.ReactTable .rt-tbody').children);
        const index = nodes.indexOf(document.querySelector('.ReactTable .quality-row'));
        if (selectedByIndex[0] <= index) {
            --selectedByIndex[0];
        }
        if (selectedByIndex[1] <= index) {
            --selectedByIndex[1];
        }
        this.setState({ selectedByIndex });

        if (afterSort) {
            const id1 = nodes[selectedByIndex[0]].getAttribute('modelid');
            const id2 = nodes[selectedByIndex[1]].getAttribute('modelid');
            const model1 = this.props.data.find(d => d.id === +id1);
            const model2 = this.props.data.find(d => d.id === +id2);
            this.props.correlationRequest(model1, model2);
        }
    }

    render() {
        const { data, onSelect, getCorrelationRows } = this.props;
        const { isCorrelation, selected, selectedByIndex } = this.state;
        const leftTextStyle = { 'textAlign': 'left' };
        const columns = [
            {
                Header: 'ID',
                accessor: 'id',
                headerStyle: leftTextStyle,
                maxWidth: 80
            },
            {
                Header: 'Type',
                accessor: 'type',
                headerStyle: leftTextStyle,
                maxWidth: 100
            },
            {
                Header: 'Entropy',
                accessor: 'entropy',
                headerStyle: leftTextStyle,
                maxWidth: 100
            },
            {
                Header: 'Significance',
                accessor: 'significance',
                headerStyle: leftTextStyle,
                maxWidth: 100
            },
            {
                Header: 'Metric',
                accessor: 'metric',
                headerStyle: leftTextStyle,
                maxWidth: 180
            },
            {
                Header: 'Status',
                accessor: 'status',
                headerStyle: leftTextStyle,
                maxWidth: 80,
                Cell: (row) => {
                    const { status } = row.original;
                    return status && status !== 'normal' ? (status === 'favourite' ? <i className="star icon"></i> : (status === 'quality' ? <span className="quality-icon"><span>Q</span><i className="star icon"></i></span> : <i className="low vision icon"></i>)) : ''
                },
                style: { textAlign: 'center' }
            },
            {
                Header: 'Parameter name',
                accessor: 'name',
                headerStyle: leftTextStyle
            }
        ];

        return (
            <div className="grid-container">
                <ReactTable
                    ref={this.reactTable}
                    data={data}
                    columns={columns}
                    pageSize={data.length}
                    // defaultPageSize={50}
                    // showPageSizeOptions={false}
                    style={{
                        height: "100%"
                    }}
                    className="-highlight"
                    getTbodyProps={(state, rowInfo, column) => {
                        let isQuality = false;
                        if (state.data.length) {
                            isQuality = state.data.some(d => d.status === "quality");
                        }
                        return {
                            style: {
                                overflow: isCorrelation ? 'hidden' : 'auto'
                            },
                            className: (isQuality ? 'quality-tbl' : '')
                        }
                    }}
                    onSortedChange={(newSorted, column, shiftKey) => {
                        onGridSort();

                        if (isCorrelation) {
                            const { line1, line2 } = getCorrelationRows();
                            let sortedData = this.reactTable.current.getResolvedState().sortedData.map(d => d._original);
                            const quality = sortedData.find(s => s.status === "quality");
                            sortedData = sortedData.filter(s => s.status !== "quality");
                            sortedData.unshift(quality);
                            if(quality){
                                this.props.getCorrelationData(sortedData);
                            }

                            if (line1 && line2) {
                                this.setSelectedRowsByIndex([+line1, +line2], true);
                            }
                        }
                    }}
                    getTrProps={(state, rowInfo) => {
                        if (rowInfo && rowInfo.row) {
                            const rowId = rowInfo.original.id;
                            return {
                                onClick: (e) => {
                                    if (!isCorrelation) {
                                        this.setState({
                                            selected: [rowId]
                                        });
                                        onSelect(state, rowInfo);
                                    }
                                },
                                style: {
                                    background: (isCorrelation ? selectedByIndex.includes(rowInfo.viewIndex) : selected.includes(rowId)) ? '#d9eaf7' : 'inherit'
                                },
                                className: (isCorrelation ? selectedByIndex.includes(rowInfo.viewIndex) : selected.includes(rowId)) ? 'active' : ''
                            }
                        }
                        else {
                            return {}
                        }
                    }}
                    getTrGroupProps={(state, rowInfo) => {
                        if (rowInfo && rowInfo.row) {
                            return {
                                style: {
                                    background: rowInfo.original.status === 'quality' ? '#e5e5e5' : 'inherit'
                                },
                                className: (rowInfo.original.status === 'quality' ? ' quality-row' : ''),
                                modelid: rowInfo.original.id
                            }
                        }
                        else {
                            return {}
                        }
                    }}
                    defaultSortMethod={(a, b, desc) => {
                        // force null and undefined to the bottom
                        a = a === null || a === undefined ? '' : a
                        b = b === null || b === undefined ? '' : b

                        if (!isNaN(Number(a))) {
                            a = Number(a);
                        }
                        if (!isNaN(Number(b))) {
                            b = Number(b);
                        }
                        // force any string values to lowercase
                        a = typeof a === 'string' ? a.toLowerCase() : a
                        b = typeof b === 'string' ? b.toLowerCase() : b
                        // Return either 1 or -1 to indicate a sort priority
                        if (a > b) {
                            return 1
                        }
                        if (a < b) {
                            return -1
                        }
                        // returning 0, undefined or any falsey value will use subsequent sorts or
                        // the index as a tiebreaker
                        return 0
                    }}
                />
                <div id="appWaitCursorBackground">
                    <div className="waiting-spinner">
                        <span>Calculation...</span>
                        <br/>
                        <i className="spinner loading icon"></i>
                    </div>
                </div>
            </div>
        );
    }
}

export default Grid;