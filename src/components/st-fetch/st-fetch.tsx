import { Component, Prop, EventEmitter, Event } from '@stencil/core';


@Component({
  tag: 'st-fetch'
})
export class StFetch {

  @Prop() headers     : object;
  @Prop() method      : any;
  @Prop() url         : string;
  @Prop() buttonLabel : string = 'Fetch';

  @Event() fetchResolved : EventEmitter;
  @Event() fetchError    : EventEmitter;

  doFetch () {
    let options = {
      method: this.method,
      headers: this.headers
    };

    if(self.fetch) {
      let request = new Request(this.url, options);

      fetch(request)
        .then(function(response) {
          this.fetchResolved.emit(response);
        }.bind(this))
        .catch(function(err) {
          this.fetchError.emit(err);
        }.bind(this));
    } else {
        // ¿do something with XMLHttpRequest?
        console.error('Fetch API not supported');
    }

  }

  render() {
    return (
      <div>
        <button onClick={() => this.doFetch()}>
          <span>{this.buttonLabel}</span>
        </button>
      </div>
    );
  }
}