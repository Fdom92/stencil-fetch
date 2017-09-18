/*! Built with http://stenciljs.com */

App.loadComponents(

/**** module id (dev mode) ****/
"demo-payment",

/**** component modules ****/
function importComponent(exports, h, t, Context, publicPath) {
var DemoPayment = /** @class */ (function () {
    function DemoPayment() {
        this.methodData = [
            { supportedMethods: [
                    'visa', 'mastercard', 'amex', 'discover', 'maestro',
                    'diners', 'jcb', 'unionpay', 'bitcoin'
                ]
            }
        ];
        this.details = {
            displayItems: [{
                    label: "Original donation amount",
                    amount: { currency: "USD", value: "65.00" }
                },
                {
                    label: "Friends and family discount",
                    amount: { currency: "USD", value: "-10.00" }
                }],
            total: {
                label: "Total",
                amount: { currency: "USD", value: "55.00" }
            }
        };
        this.options = {};
        this.callback = function () {
            console.log('Payment success from callback!!');
        };
    }
    DemoPayment.prototype.render = function () {
        return (h("div", 0,
            h("h2", 0, t("Check out the new Payment API")),
            h("st-payment", { "p": { "methodData": this.methodData, "details": this.details, "options": this.options, "callback": this.callback } })));
    };
    return DemoPayment;
}());

var StPayment = /** @class */ (function () {
    function StPayment() {
    }
    StPayment.prototype.doPayment = function () {
        if ('PaymentRequest' in window) {
            this.request = new PaymentRequest(this.methodData, this.details, this.options);
            this.show(this.callback);
        }
        else {
            console.log('Payment Request API not supported');
        }
    };
    StPayment.prototype.show = function (cb) {
        this.request.show()
            .then(function (paymentResponse) {
            cb && cb();
            paymentResponse.complete("success");
        }).catch(function (err) {
            console.error(err.message);
        });
    };
    StPayment.prototype.abort = function (ok) {
        if (this.request)
            this.request.abort()
                .then(ok)
                .catch(function (err) {
                console.error(err.message);
            });
    };
    StPayment.prototype.render = function () {
        var _this = this;
        return (h("div", 0,
            h("button", { "c": { "btn": true }, "o": { "click": function () { return _this.doPayment(); } }, "a": { "type": "button" } },
                h("span", 0, t("Buy")))));
    };
    return StPayment;
}());

exports['DEMO-PAYMENT'] = DemoPayment;
exports['ST-PAYMENT'] = StPayment;
},


/***************** demo-payment *****************/
[
/** demo-payment: tag **/
"DEMO-PAYMENT",

/** demo-payment: members **/
[
  [ "callback", /** state **/ 5 ],
  [ "details", /** state **/ 5 ],
  [ "methodData", /** state **/ 5 ],
  [ "options", /** state **/ 5 ]
],

/** demo-payment: host **/
{}

],

/***************** st-payment *****************/
[
/** st-payment: tag **/
"ST-PAYMENT",

/** st-payment: members **/
[
  [ "abort", /** method **/ 6 ],
  [ "callback", /** prop **/ 1 ],
  [ "details", /** prop **/ 1 ],
  [ "methodData", /** prop **/ 1 ],
  [ "options", /** prop **/ 1 ],
  [ "request", /** state **/ 5 ]
],

/** st-payment: host **/
{}

]
)