import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import { Form, Button, Divider } from 'semantic-ui-react';

const boxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const QualitySlider = withStyles({
    root: {
        color: '#3880ff',
        height: 2,
        padding: '15px 0',
    },
    thumb: {
        height: 20,
        width: 20,
        backgroundColor: '#fff',
        boxShadow: boxShadow,
        marginTop: -10,
        marginLeft: -10,
        '&:focus,&:hover,&$active': {
            boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                boxShadow: boxShadow,
            },
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 3px)',
        top: -22,
        '& *': {
            background: 'transparent',
            color: '#000',
        },
    },
    track: {
        height: 2,
    },
    rail: {
        height: 2,
        opacity: 0.5,
        backgroundColor: '#bfbfbf',
    },
    mark: {
        backgroundColor: '#bfbfbf',
        height: 8,
        width: 1,
        marginTop: -3,
    },
    markActive: {
        backgroundColor: 'currentColor',
    },
})(Slider);

const marks = [
    {
        value: 0,
        label: '0'
    },
    {
        value: 100,
        label: '100'
    },
];


class SignificanceAnalysis extends React.Component {
    state = { quality: [30, 60] };

    onChangeQuality = (e, value) => {
        this.setState({ quality: value });
    };

    onSubmitHandler = () => {
        //var { quality } = this.state;
        //TODO: set quality
    };

    render() {
        return (
            <Form className="sidebar-content feature-form" onSubmit={this.onSubmitHandler}>
                <QualitySlider marks={marks} value={this.state.quality} valueLabelDisplay="on" onChange={this.onChangeQuality} />
                <Divider />
                <Button primary type='submit' style={{ margin: 0 }}>Set Quality</Button>
            </Form>
        );
    }
}

export default SignificanceAnalysis;