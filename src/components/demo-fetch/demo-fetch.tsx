import { Component, State, Listen } from '@stencil/core';


@Component({
    tag: 'demo-fetch'
})
export class DemoFetch {

    @State() method  : string = 'GET';
    @State() url     : string = 'https://jsonplaceholder.typicode.com/posts';
    @State() headers : object = {};

    @Listen('fetchResolved')
    fetchResolvedHandler(data) {
        console.log('Received from st-fetch: ', data);
    }

    @Listen('fetchError')
    fetchErrorHandler(data) {
        console.log('Received from st-fetch: ', data);
    }

    render() {
        return (
            <div>
                <st-fetch
                method={this.method}
                url={this.url}
                headers={this.headers}
                >
                </st-fetch>
            </div>
        );
    }
}