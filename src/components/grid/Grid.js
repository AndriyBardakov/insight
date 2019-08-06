import React from 'react';
import ReactTable from "react-table";
import "./Grid.css";
import "react-table/react-table.css";


class Grid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            selected: [],
            isCorrelation: false
        };
    }

    static defaultProps = {
        data: []
    };

    componentWillUnmount() {
        this.props.onClose();
    }

    toggleCorrelation = (isCorrelation) => {
        const body = document.querySelector('.rt-tbody');

        this.setState({ isCorrelation, selected: [] });
        if (isCorrelation) {
            body.scrollTo(0, 0);
        }
    }

    setSelectedRows = (selected) => {
        this.setState({ selected });
    }

    render() {
        const { data, onSelect } = this.props;
        const { isCorrelation, selected } = this.state;
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
                        return {
                            style: {
                                overflow: isCorrelation ? 'hidden' : 'auto'
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
                                    background: selected.includes(rowId) ? '#d9eaf7' : 'inherit'
                                },
                                className: (selected.includes(rowId) ? 'active' : '')
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
                                className: (rowInfo.original.status === 'quality' ? ' quality-row' : '')
                            }
                        }
                        else {
                            return {}
                        }
                    }}
                />

            </div>
        );
    }
}

export default Grid;