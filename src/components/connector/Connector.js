import React from 'react';
import { Form, Input, Button, Icon } from 'semantic-ui-react';
import './Connector.css';

class Connector extends React.Component {
    _isMounted = false;
    state = { url: '', connecting: false };

    onChangeUrl = (e) => {
        this.setUrl(e.target.value);
    }

    setUrl = (url) => {
        if (this._isMounted) {
            this.setState({ url });
        }
    }

    setConnecting = (val) => {
        if (this._isMounted) {
            this.setState({ connecting: val });
        }
    }

    clearConnectorForm = () => {
        this.setUrl('');
        this.setConnecting(false);
    }

    onSubmit = () => {
        this.setConnecting(true);
        const that = this;
        this.props.onSubmit(that.state.url, () => {
            this.clearConnectorForm();
        });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.clearConnectorForm();
    }

    render() {
        const { url, connecting } = this.state;
        return (
            <div className="connector-container">
                <Form onSubmit={this.onSubmit}>
                    <Form.Field
                        id='urlInput'
                        control={Input}
                        onChange={this.onChangeUrl}
                        disabled={connecting}
                        label="Enter Url"
                        value={url}
                    />
                    <Form.Field
                        id='btnConnect'
                        control={Button}
                        disabled={connecting || !url}
                        content={connecting ? <div style={{ position: 'relative' }}><Icon loading style={{ position: 'absolute', left: '35px' }} name='spinner' /><span>Connecting...</span></div> : "Connect"}
                        type='submit'
                        style={{ width: '243px', margin: 0 }}
                        primary
                    />
                </Form>
            </div>
        );
    }
}

export default Connector;