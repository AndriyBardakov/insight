import React from 'react';
import { Form, Button } from 'semantic-ui-react';

class Forecast extends React.Component{

    render(){
        return (
            <Form className="sidebar-content feature-form">
                <Button primary type='submit'>Calculate accuracy</Button>
                <Form.Field type='number' control='input'  />
            </Form>
        );
    }
}

export default Forecast;