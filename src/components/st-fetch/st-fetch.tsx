import { Component, Prop, EventEmitter, Event, State } from '@stencil/core';


@Component({
  tag: 'st-fetch'
})
export class StFetch {

  @Prop() headers     : object = {};
  @Prop() method      : string = 'GET';
  @Prop() url         : string;
  @Prop() buttonLabel : string = 'Fetch';

  @Event() fetchResolved : EventEmitter;
  @Event() fetchError    : EventEmitter;

  @State() available : boolean = false;
  @State() request   : any;

  componentDidLoad() {
    if(self.fetch) {
      this.available = true;
      let options = {
        method: this.method,
        headers: new Headers(this.headers)
      };

      this.request = new Request(this.url, options);
    }
  }

  doFetch () {
    fetch(this.request)
      .then(function(response) {
        this.fetchResolved.emit(response);
      }.bind(this))
      .catch(function(err) {
        this.fetchError.emit(err);
      }.bind(this));
  }

  render() {
    return this.available &&
    (
      <div>
        <button onClick={() => this.doFetch()}>
          <span>{this.buttonLabel}</span>
        </button>
      </div>
    );
  }
}