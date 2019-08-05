import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import { Form, Button, Divider } from 'semantic-ui-react';
import { round } from '../../../helpers';

const boxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const QualitySlider = withStyles({
    root: {
        color: '#3880ff',
        height: 2,
        padding: '15px 0',
    },
    thumb: {
        height: 22,
        width: 22,
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

// const marks = [
//     {
//         value: 0,
//         label: '0'
//     },
//     {
//         value: 1,
//         label: '1'
//     },
// ];

const roundToNumber = value => {
    return Number(round(value));
}

const numberToPercent = value => {
    return Math.round(value * 100) + '%';
}

class SignificanceAnalysis extends React.Component {
    state = {
        accuracy: 1,
        qualityRowExists:false,
        quality: [0, 100],
        min: 0,
        max: 100,
        marks: [
            {
                value: 0,
                label: '0'
            },
            {
                value: 100,
                label: '100'
            }
        ]
    };

    onChangeQuality = (e, value) => {
        this.setState({ quality: value });
    };

    setAccuracy = accuracy => {
        this.setState({ accuracy });
    }

    setQualityRow = qualityRowExists => {
        this.setState({ qualityRowExists });
    }

    setSliderRange = (min, max) => {
        min = Number(min);
        max = Number(max);
        if (min === max) {
            max += 1;
        }
        const marks = [
            {
                value: min,
                label: min
            },
            {
                value: max,
                label: max
            }
        ];
        this.setState({ marks, min, max, quality: [roundToNumber(min), roundToNumber(max)] });
        // this.setState({quality: [min, max]});
    }

    render() {
        const { quality, min, max, accuracy, qualityRowExists } = this.state;
        const { onSubmitForecast, onSubmitSignificance, onDeleteQuality } = this.props;
        return (
            <div className="sidebar-content">
                <Form className="sidebar-content feature-form" onSubmit={() => onSubmitSignificance(quality)}>
                    <QualitySlider min={roundToNumber(min)} max={roundToNumber(max)} value={quality} valueLabelDisplay="on" onChange={this.onChangeQuality} />
                    <Divider />
                    <Button primary type='submit' style={{ margin: 0 }}>Set Quality Characteristic</Button>
                    {qualityRowExists ? <Button type='button' className="btn-delete" onClick={() => {this.setQualityRow(false); onDeleteQuality();}}>Delete Quality Characteristic</Button> : ''}
                </Form>
                <h4 className="header">Forecast</h4>
                <Form className="sidebar-content feature-form" onSubmit={() => onSubmitForecast(quality)}>
                    <Button primary type='submit'>Calculate accuracy</Button>
                    {/* <Form.Field type='number' readOnly control='input' value={accuracy} /> */}
                    <div className="header" style={{marginTop: '10px'}}>
                        <span>Accuracy: </span>
                        <span className="description" style={{color:'#333333'}}>{numberToPercent(accuracy)}</span>
                    </div>
                </Form>
            </div>
        );
    }
}

export default SignificanceAnalysis;