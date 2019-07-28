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

    render() {
        const { data } = this.props;
        const leftTextStyle = { 'textAlign': 'left'};
        const columns = [
            {
                Header: 'Type',
                accessor: 'type',
                headerStyle: leftTextStyle,
                maxWidth:100
            },
            {
                Header: 'Entropy',
                accessor: 'entropy',
                headerStyle: leftTextStyle,
                maxWidth:100
            },
            {
                Header: 'Significance',
                accessor: 'significance',
                headerStyle: leftTextStyle,
                maxWidth:100
            },
            {
                Header: 'Mectric',
                accessor: 'mectric',
                headerStyle: leftTextStyle,
                maxWidth:150
            },
            {
                Header: 'Status',
                accessor: 'status',
                headerStyle: leftTextStyle,
                maxWidth:100
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
                                        selected: rowInfo.index
                                    })
                                },
                                style: {
                                    background: rowInfo.index === this.state.selected ? '#d9eaf7' : 'inherit'
                                }
                            }
                        } else {
                            return {}
                        }
                    }}
                />

            </div>
        );
    }
}

export default Grid;