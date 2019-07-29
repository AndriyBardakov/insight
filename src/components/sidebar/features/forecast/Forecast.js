import React from 'react';
import { Form, Button } from 'semantic-ui-react';

class Forecast extends React.Component {
    state = { accuracy: null };

    onChangeAccuracy = (e) => {
        this.setState({ accuracy: e.target.value });
    };

    onSubmitHandler = () => {
        const accuracy = this.state.accuracy;
        //TODO: set accuracy
    };

    render() {
        return (
            <Form className="sidebar-content feature-form" onSubmit={this.onSubmitHandler}>
                <Button primary type='submit' >Calculate accuracy</Button>
                <Form.Field type='number' min='0' control='input' onChange={this.onChangeAccuracy} value={this.state.accuracy} />
            </Form>
        );
    }
}

export default Forecast;