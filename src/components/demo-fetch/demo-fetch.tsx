import { Component, State } from '@stencil/core';


@Component({
    tag: 'demo-fetch'
})
export class DemoFetch {

    @State() method  : any = 'GET';
    @State() url     : any = 'www.google.es';
    @State() headers : any = {};

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