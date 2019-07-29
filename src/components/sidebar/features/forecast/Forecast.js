import React from 'react';
import { Form, Button } from 'semantic-ui-react';

class Forecast extends React.Component {
    state = { accuracy: 100 };

    onChangeAccuracy = (e) => {
        this.setState({ accuracy: e.target.value });
    };

    onSubmitHandler = () => {
        // const { accuracy } = this.state;
        //TODO: set accuracy
    };

    render() {
        return (
            <Form className="sidebar-content feature-form" onSubmit={this.onSubmitHandler}>
                <Button primary type='submit' >Calculate accuracy</Button>
                <Form.Field type='number' min='0' max='100' control='input' onChange={this.onChangeAccuracy} value={this.state.accuracy} />
            </Form>
        );
    }
}

export default Forecast;