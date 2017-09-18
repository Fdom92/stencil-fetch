/*! Built with http://stenciljs.com */

(function (window, document, appNamespace, appCore, appCoreEs5, components, x) {
    'use strict';
    // create global namespace if it doesn't already exist

    (window[appNamespace] = window[appNamespace] || {}).components = components = components || [];
    // auto hide components until they been fully hydrated
    // reusing the "x" variable from the args for funzies
    x = document.createElement('style');
    x.setAttribute('data-styles', '');
    x.innerHTML = (components.map(function (c) {
        return c[0];
    }).join(',') + '{visibility:hidden}.💎{visibility:inherit}').toLowerCase();
    x.innerHTML += 'ion-app:not(.💎){display:none}';
    document.head.insertBefore(x, document.head.firstChild);
    // request the core file this browser needs
    x = document.createElement('script');
    x.src = window.customElements ? appCore : appCoreEs5;
    document.head.appendChild(x);
})(window, document, "App","build/app/app.core.js","build/app/app.core.ce.js",[["DEMO-PAYMENT","demo-payment",{"$":"demo-payment"}],["ST-PAYMENT","demo-payment",{"$":"demo-payment"},[["callback",1],["details",1],["methodData",1],["options",1]]]]);