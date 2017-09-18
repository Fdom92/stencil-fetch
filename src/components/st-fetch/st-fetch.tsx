import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'st-fetch'
})
export class StFetch {

  @Prop() method  : any;
  @Prop() url     : any;
  @Prop() headers : any;

  doFetch () {
    let options = {
      method: this.method,
      headers: this.headers
    };

    if(self.fetch) {
      let request = new Request('www.google.es', options);

      fetch(request).then(function(response) {
        return response;
      });
    } else {
        // ¿do something with XMLHttpRequest?
    }

  }

  render() {
    return (
      <div>
        <button onClick={() => this.doFetch()}>
          <span>Fetch</span>
        </button>
      </div>
    );
  }
}