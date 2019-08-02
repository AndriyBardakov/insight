import React from 'react';
import ReactTable from "react-table";
import "./Grid.css";
import "react-table/react-table.css";


class Grid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            selected: null
        };
    }

    static defaultProps = {
        data: []
    };

    componentWillUnmount() {
        this.props.onClose();
    }

    render() {
        const { data, onSelect } = this.props;
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
                    return status && status !== 'normal' ? (status === 'favourite' ? <i className="star icon"></i> : <i className="low vision icon"></i>) : ''
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
                    getTrProps={(state, rowInfo) => {
                        if (rowInfo && rowInfo.row) {
                            return {
                                onClick: (e) => {
                                    this.setState({
                                        selected: rowInfo.original.id
                                    });
                                    onSelect(state, rowInfo);
                                },
                                style: {
                                    background: rowInfo.original.id === this.state.selected ? '#d9eaf7' : 'inherit'
                                },
                                className: rowInfo.original.id === this.state.selected ? 'active' : ''
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