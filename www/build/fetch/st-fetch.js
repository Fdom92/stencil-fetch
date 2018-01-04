/*! Built with http://stenciljs.com */

fetch.loadComponents(

/**** module id (dev mode) ****/
"st-fetch",

/**** component modules ****/
function importComponent(exports, h, Context, publicPath) {
"use strict";
// @stencil/core

class StFetch {
    constructor() {
        this.headers = new Headers();
        this.method = 'GET';
        this.url = '';
        this.buttonLabel = 'Fetch';
        this.available = false;
    }
    componentDidLoad() {
        if (self.fetch) {
            this.available = true;
            let options = {
                method: this.method,
                headers: new Headers(this.headers)
            };
            this.request = new Request(this.url, options);
        }
    }
    makeRequest() {
        if (this.available) {
            fetch(this.request)
                .then(function (response) {
                this.resolved.emit(response);
            }.bind(this))
                .catch(function (err) {
                this.error.emit(err);
            }.bind(this));
        }
    }
    render() {
        return;
    }
}

exports['st-fetch'] = StFetch;
},


/***************** st-fetch *****************/
[
/** st-fetch: tag **/
"st-fetch",

/** st-fetch: members **/
[
  [ "available", /** state **/ 5, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "buttonLabel", /** prop **/ 1, /** observe attribute **/ 1, /** type string **/ 2 ],
  [ "headers", /** prop **/ 1, /** observe attribute **/ 1, /** type any **/ 1 ],
  [ "makeRequest", /** method **/ 6, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "method", /** prop **/ 1, /** observe attribute **/ 1, /** type string **/ 2 ],
  [ "request", /** state **/ 5, /** do not observe attribute **/ 0, /** type any **/ 1 ],
  [ "url", /** prop **/ 1, /** observe attribute **/ 1, /** type string **/ 2 ]
],

/** st-fetch: host **/
{},

/** st-fetch: events **/
[
  [
    /*****  st-fetch resolved ***** /
    /* event name ***/ "resolved"
  ],
  [
    /*****  st-fetch error ***** /
    /* event name ***/ "error"
  ]
]

]
);