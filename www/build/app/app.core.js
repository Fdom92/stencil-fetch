/*! Built with http://stenciljs.com */

(function(Context,appNamespace,publicPath){"use strict";
(function (window, document, Context, appNamespace, publicPath) {
    "use strict";

    function isDef(v) {
        return v !== undefined && v !== null;
    }
    function isUndef(v) {
        return v === undefined || v === null;
    }

    function isObject(v) {
        return v !== null && typeof v === 'object';
    }

    function isFunction(v) {
        return typeof v === 'function';
    }
    function toDashCase(str) {
        return str.replace(/([A-Z])/g, function (g) {
            return '-' + g[0].toLowerCase();
        });
    }

    function noop() {}

    function getElementReference(elm, ref) {
        if (ref === 'child') {
            return elm.firstElementChild;
        }
        if (ref === 'parent') {
            return getParentElement(elm) || elm;
        }
        if (ref === 'body') {
            return elm.ownerDocument.body;
        }
        if (ref === 'document') {
            return elm.ownerDocument;
        }
        if (ref === 'window') {
            return elm.ownerDocument.defaultView;
        }
        return elm;
    }
    function getParentElement(elm) {
        if (elm.parentElement) {
            // normal element with a parent element
            return elm.parentElement;
        }
        if (elm.parentNode && elm.parentNode.host) {
            // shadow dom's document fragment
            return elm.parentNode.host;
        }
        return null;
    }

    /**
     * This constants file is largely for minification tricks, and to
     * have easy to read variable names. Enums would make more sense
     * in most cases, but doing values like this as constants allows
     * minifiers to just place the raw value directly in source, and in
     * production there is no variable at all. For example, the minifier
     * turns data[BUNDLE_ID] turns into data[0] for production builds.
     */
    /**
     * Member Types
     */
    var MEMBER_PROP = 1;
    var MEMBER_PROP_STATE = 2;
    var MEMBER_PROP_CONTEXT = 3;
    var MEMBER_PROP_CONNECT = 4;
    var MEMBER_STATE = 5;
    var MEMBER_METHOD = 6;
    var MEMBER_ELEMENT_REF = 7;
    /**
     * Prop Change Meta Indexes
     */
    var PROP_CHANGE_PROP_NAME = 0;
    var PROP_CHANGE_METHOD_NAME = 1;
    /**
     * Property Types
     */

    var TYPE_BOOLEAN = 1;
    var TYPE_NUMBER = 2;
    /**
     * JS Property to Attribute Name Options
     */
    var ATTR_LOWER_CASE = 1;
    /**
     * Priority Levels
     */
    var PRIORITY_HIGH = 3;

    var PRIORITY_LOW = 1;
    /**
     * Slot Meta
     */
    var SLOT_TAG = 0;
    var HAS_SLOTS = 1;
    var HAS_NAMED_SLOTS = 2;
    /**
     * SSR Attribute Names
     */
    var SSR_VNODE_ID = 'ssrv';
    var SSR_CHILD_ID = 'ssrc';
    /**
     * Node Types
     */
    var ELEMENT_NODE = 1;
    var TEXT_NODE = 3;
    var COMMENT_NODE = 8;
    /**
     * Key Name to Key Code Map
     */
    var KEY_CODE_MAP = {
        'enter': 13,
        'escape': 27,
        'space': 32,
        'tab': 9
    };
    /**
     * CSS class that gets added to the host element
     * after the component has fully hydrated
     */
    var HYDRATED_CSS = '💎';
    /**
     * Namespaces
     */

    /**
     * File names and value
     */

    /**
     * Errors
     */

    var QUEUE_EVENTS_ERROR = 2;
    var WILL_LOAD_ERROR = 3;
    var DID_LOAD_ERROR = 4;
    var INIT_INSTANCE_ERROR = 5;
    var RENDER_ERROR = 6;
    var INITIAL_LOAD_ERROR = 7;

    function initElementListeners(plt, elm) {
        // so the element was just connected, which means it's in the DOM
        // however, the component instance hasn't been created yet
        // but what if an event it should be listening to get emitted right now??
        // let's add our listeners right now to our element, and if it happens
        // to receive events between now and the instance being created let's
        // queue up all of the event data and fire it off on the instance when it's ready
        var cmpMeta = plt.getComponentMeta(elm);
        var listeners = cmpMeta.listenersMeta;
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                if (listener.eventDisabled) continue;
                (elm._listeners = elm._listeners || {})[listener.eventName] = addEventListener(plt, elm, listener.eventName, createListenerCallback(elm, listener.eventMethodName), listener.eventCapture, listener.eventPassive);
            }
        }
    }
    function createListenerCallback(elm, eventMethodName) {
        // create the function that gets called when the element receives
        // an event which it should be listening for
        return function onEvent(ev) {
            if (elm.$instance) {
                // instance is ready, let's call it's member method for this event
                elm.$instance[eventMethodName](ev);
            } else {
                // instance is not ready!!
                // let's queue up this event data and replay it later
                // when the instance is ready
                (elm._queuedEvents = elm._queuedEvents || []).push(eventMethodName, ev);
            }
        };
    }
    function replayQueuedEventsOnInstance(elm) {
        // the element has an instance now and
        // we already added the event listeners to the element
        var queuedEvents = elm._queuedEvents;
        if (queuedEvents) {
            // events may have already fired before the instance was even ready
            // now that the instance is ready, let's replay all of the events that
            // we queued up earlier that were originally meant for the instance
            for (var i = 0; i < queuedEvents.length; i += 2) {
                // data was added in sets of two
                // first item the eventMethodName
                // second item is the event data
                // take a look at initElementListener()
                elm.$instance[queuedEvents[i]](queuedEvents[i + 1]);
            }
            // no longer need this data, be gone with you
            delete elm._queuedEvents;
        }
    }
    function enableEventListener(plt, instance, eventName, shouldEnable, attachTo) {
        if (instance) {
            var elm = instance.__el;
            var cmpMeta = plt.getComponentMeta(elm);
            var listenerMeta = cmpMeta.listenersMeta;
            if (listenerMeta) {
                var deregisterFns = elm._listeners = elm._listeners || {};
                for (var i = 0; i < listenerMeta.length; i++) {
                    var listener = listenerMeta[i];
                    if (listener.eventName === eventName) {
                        if (shouldEnable && !deregisterFns[eventName]) {
                            var attachToEventName = attachTo ? attachTo + ':' + eventName : eventName;
                            deregisterFns[eventName] = addEventListener(plt, elm, attachToEventName, createListenerCallback(elm, listener.eventMethodName), listener.eventCapture, listener.eventPassive);
                        } else if (!shouldEnable && deregisterFns[eventName]) {
                            deregisterFns[eventName]();
                            delete elm._listeners[eventName];
                        }
                        return;
                    }
                }
            }
        }
    }
    function addEventListener(plt, elm, eventName, listenerCallback, useCapture, usePassive) {
        // depending on the event name, we could actually be
        // attaching this element to something like the document or window
        var splt = eventName.split(':');
        if (elm && splt.length > 1) {
            // document:mousemove
            // parent:touchend
            // body:keyup.enter
            elm = getElementReference(elm, splt[0]);
            eventName = splt[1];
        }
        if (!elm) {
            // something's up, let's not continue and just return a noop()
            return noop;
        }
        // test to see if we're looking for an exact keycode
        splt = eventName.split('.');
        var testKeyCode = 0;
        if (splt.length > 1) {
            // looks like this listener is also looking for a keycode
            // keyup.enter
            eventName = splt[0];
            testKeyCode = KEY_CODE_MAP[splt[1]];
        }
        // create the our internal event listener callback we'll be firing off
        // within it is the user's event listener callback and some other goodies
        function eventListener(ev) {
            if (testKeyCode > 0 && ev.keyCode !== testKeyCode) {
                // we're looking for a specific keycode
                // but the one we were given wasn't the right keycode
                return;
            }
            // fire the user's component event listener callback
            // if the instance isn't ready yet, this listener is already
            // set to handle that and re-queue the update when it is ready
            listenerCallback(ev);
            if (elm.$instance) {
                // only queue an update if this element itself is a host element
                // and only queue an update if host element's instance is ready
                // once its instance has been created, it'll then queue the update again
                // queue it up for an update which then runs a re-render
                elm._queueUpdate();
                // test if this is the user's interaction
                if (isUserInteraction(eventName)) {
                    // so turns out that it's very important to flush the queue NOW
                    // this way the app immediately reflects whatever the user just did
                    plt.queue.flush();
                }
            }
        }
        // get our event listener options
        // mainly this is used to set passive events if this browser supports it
        var eventListenerOpts = plt.getEventOptions(useCapture, usePassive);
        // ok, good to go, let's add the actual listener to the dom element
        elm.addEventListener(eventName, eventListener, eventListenerOpts);
        // return a function which is used to remove this very same listener
        return function removeListener() {
            if (elm) {
                elm.removeEventListener(eventName, eventListener, eventListenerOpts);
            }
        };
    }
    function isUserInteraction(eventName) {
        for (var i = 0; i < USER_INTERACTIONS.length; i++) {
            if (eventName.indexOf(USER_INTERACTIONS[i]) > -1) {
                return true;
            }
        }
        return false;
    }
    var USER_INTERACTIONS = ['touch', 'mouse', 'pointer', 'key', 'focus', 'blur', 'drag'];
    function detachListeners(elm) {
        var deregisterFns = elm._listeners;
        if (deregisterFns) {
            var eventNames = Object.keys(deregisterFns);
            for (var i = 0; i < eventNames.length; i++) {
                deregisterFns[eventNames[i]]();
            }
            elm._listeners = null;
        }
    }

    class VNode {}

    /**
     * Production h() function based on Preact by
     * Jason Miller (@developit)
     * Licensed under the MIT License
     * https://github.com/developit/preact/blob/master/LICENSE
     *
     * Modified for Stencil's compiler and vdom
     */
    var stack = [];
    function h(nodeName, vnodeData, child) {
        var children = void 0,
            lastSimple = void 0,
            simple = void 0,
            i = void 0;
        for (i = arguments.length; i-- > 2;) {
            stack.push(arguments[i]);
        }
        while (stack.length) {
            if ((child = stack.pop()) && child.pop !== undefined) {
                for (i = child.length; i--;) {
                    stack.push(child[i]);
                }
            } else {
                if (typeof child === 'boolean') child = null;
                if (simple = typeof nodeName !== 'function') {
                    if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
                }
                if (simple && lastSimple) {
                    children[children.length - 1].vtext += child;
                } else if (children === undefined) {
                    children = [simple ? t(child) : child];
                } else {
                    children.push(simple ? t(child) : child);
                }
                lastSimple = simple;
            }
        }
        var vnode = new VNode();
        vnode.vtag = nodeName;
        vnode.vchildren = children;
        if (vnodeData) {
            // data object was provided
            vnode.vattrs = vnodeData.a;
            vnode.vprops = vnodeData.p;
            vnode.vclass = vnodeData.c;
            vnode.vstyle = vnodeData.s;
            vnode.vlisteners = vnodeData.o;
            vnode.vkey = vnodeData.k;
            vnode.vnamespace = vnodeData.n;
            // x = undefined: always check both data and children
            // x = 0 skip checking only data on update
            // x = 1 skip checking only children on update
            // x = 2 skip checking both data and children on update
            vnode.skipDataOnUpdate = vnodeData.x === 0 || vnodeData.x === 2;
            vnode.skipChildrenOnUpdate = vnodeData.x > 0;
        } else {
            // no data object was provided
            // so no data, so don't both checking data
            vnode.skipDataOnUpdate = true;
            // since no data was provided, than no x was provided
            // if no x was provided then we need to always check children
            // if if there are no children at all, then we know never to check children
            vnode.skipChildrenOnUpdate = !children || children.length === 0;
        }
        return vnode;
    }
    function t(textValue) {
        var vnode = new VNode();
        vnode.vtext = textValue;
        return vnode;
    }

    function createVNodesFromSsr(domApi, rootElm) {
        var allSsrElms = rootElm.querySelectorAll('[' + SSR_VNODE_ID + ']'),
            elm,
            ssrVNodeId,
            ssrVNode,
            i,
            ilen = allSsrElms.length,
            j,
            jlen;
        if (rootElm._hasLoaded = ilen > 0) {
            for (i = 0; i < ilen; i++) {
                elm = allSsrElms[i];
                ssrVNodeId = domApi.$getAttribute(elm, SSR_VNODE_ID);
                ssrVNode = elm._vnode = new VNode();
                ssrVNode.vtag = domApi.$tagName(ssrVNode.elm = elm).toLowerCase();
                for (j = 0, jlen = elm.childNodes.length; j < jlen; j++) {
                    addChildSsrVNodes(domApi, elm.childNodes[j], ssrVNode, ssrVNodeId, true);
                }
            }
        }
    }
    function addChildSsrVNodes(domApi, node, parentVNode, ssrVNodeId, checkNestedElements) {
        var nodeType = domApi.$nodeType(node);
        var previousComment;
        var childVNodeId, childVNodeSplt, childVNode;
        if (checkNestedElements && nodeType === ELEMENT_NODE) {
            childVNodeId = domApi.$getAttribute(node, SSR_CHILD_ID);
            if (childVNodeId) {
                // split the start comment's data with a period
                childVNodeSplt = childVNodeId.split('.');
                // ensure this this element is a child element of the ssr vnode
                if (childVNodeSplt[0] === ssrVNodeId) {
                    // cool, this element is a child to the parent vnode
                    childVNode = new VNode();
                    childVNode.vtag = domApi.$tagName(childVNode.elm = node).toLowerCase();
                    // this is a new child vnode
                    // so ensure its parent vnode has the vchildren array
                    if (!parentVNode.vchildren) {
                        parentVNode.vchildren = [];
                    }
                    // add our child vnode to a specific index of the vnode's children
                    parentVNode.vchildren[childVNodeSplt[1]] = childVNode;
                    // this is now the new parent vnode for all the next child checks
                    parentVNode = childVNode;
                    // if there's a trailing period, then it means there aren't any
                    // more nested elements, but maybe nested text nodes
                    // either way, don't keep walking down the tree after this next call
                    checkNestedElements = childVNodeSplt[2] !== '';
                }
            }
            // keep drilling down through the elements
            for (var i = 0; i < node.childNodes.length; i++) {
                addChildSsrVNodes(domApi, node.childNodes[i], parentVNode, ssrVNodeId, checkNestedElements);
            }
        } else if (nodeType === TEXT_NODE && (previousComment = node.previousSibling) && domApi.$nodeType(previousComment) === COMMENT_NODE) {
            // split the start comment's data with a period
            childVNodeSplt = domApi.$getTextContent(previousComment).split('.');
            // ensure this is an ssr text node start comment
            // which should start with an "s" and delimited by periods
            if (childVNodeSplt[0] === 's' && childVNodeSplt[1] === ssrVNodeId) {
                // cool, this is a text node and it's got a start comment
                childVNode = t(domApi.$getTextContent(node));
                childVNode.elm = node;
                // this is a new child vnode
                // so ensure its parent vnode has the vchildren array
                if (!parentVNode.vchildren) {
                    parentVNode.vchildren = [];
                }
                // add our child vnode to a specific index of the vnode's children
                parentVNode.vchildren[childVNodeSplt[2]] = childVNode;
            }
        }
    }
    function assignHostContentSlots(domApi, elm, slotMeta) {
        // compiler has already figured out if this component has slots or not
        // if the component doesn't even have slots then we'll skip over all of this code
        var childNodes = elm.childNodes;
        if (slotMeta === HAS_NAMED_SLOTS) {
            // looks like this component has named slots
            // so let's loop through each of the childNodes to the host element
            // and pick out the ones that have a slot attribute
            // if it doesn't have a slot attribute, than it's a default slot
            var slotName = void 0;
            var defaultSlot = void 0;
            var namedSlots = void 0;
            for (var i = 0, childNodeLen = childNodes.length; i < childNodeLen; i++) {
                var childNode = childNodes[i];
                if (domApi.$nodeType(childNode) === 1 && (slotName = domApi.$getAttribute(childNode, 'slot')) != null) {
                    // is element node
                    // this element has a slot name attribute
                    // so this element will end up getting relocated into
                    // the component's named slot once it renders
                    namedSlots = namedSlots || {};
                    if (namedSlots[slotName]) {
                        namedSlots[slotName].push(childNode);
                    } else {
                        namedSlots[slotName] = [childNode];
                    }
                } else {
                    // this is a text node
                    // or it's an element node that doesn't have a slot attribute
                    // let's add this node to our collection for the default slot
                    if (defaultSlot) {
                        defaultSlot.push(childNode);
                    } else {
                        defaultSlot = [childNode];
                    }
                }
            }
            // keep a reference to all of the initial nodes
            // found as immediate childNodes to the host element
            elm._hostContentNodes = {
                defaultSlot: defaultSlot,
                namedSlots: namedSlots
            };
        } else if (slotMeta === HAS_SLOTS) {
            // this component doesn't have named slots, but it does
            // have at least a default slot, so the work here is alot easier than
            // when we're not looping through each element and reading attribute values
            elm._hostContentNodes = {
                defaultSlot: childNodes.length ? Array.apply(null, childNodes) : null
            };
        }
    }

    function createDomControllerClient(win, now) {
        var readCBs = [];
        var writeCBs = [];
        var rafPending = false;
        function raf(cb) {
            return win.requestAnimationFrame(cb);
        }
        function domRead(cb) {
            readCBs.push(cb);
            if (!rafPending) {
                rafPending = true;
                raf(rafFlush);
            }
        }
        function domWrite(cb) {
            writeCBs.push(cb);
            if (!rafPending) {
                rafPending = true;
                raf(rafFlush);
            }
        }
        function rafFlush(timeStamp, startTime, cb, err) {
            try {
                startTime = now();
                // ******** DOM READS ****************
                while (cb = readCBs.shift()) {
                    cb(timeStamp);
                }
                // ******** DOM WRITES ****************
                while (cb = writeCBs.shift()) {
                    cb(timeStamp);
                    if (now() - startTime > 8) {
                        break;
                    }
                }
            } catch (e) {
                err = e;
            }
            if (rafPending = readCBs.length > 0 || writeCBs.length > 0) {
                raf(rafFlush);
            }
            if (err) {
                console.error(err);
            }
        }
        return {
            read: domRead,
            write: domWrite,
            raf: raf
        };
    }

    function createDomApi(document) {
        // using the $ prefix so that closure is
        // cool with property renaming each of these
        return {
            $documentElement: document.documentElement,
            $head: document.head,
            $body: document.body,
            $nodeType: function nodeType(node) {
                return node.nodeType;
            },
            $createEvent: function createEvent() {
                return document.createEvent('CustomEvent');
            },
            $createElement: function createElement(tagName) {
                return document.createElement(tagName);
            },
            $createElementNS: function createElementNS(namespace, tagName) {
                return document.createElementNS(namespace, tagName);
            },
            $createTextNode: function createTextNode(text) {
                return document.createTextNode(text);
            },
            $createComment: function createComment(data) {
                return document.createComment(data);
            },
            $insertBefore: function insertBefore(parentNode, childNode, referenceNode) {
                parentNode.insertBefore(childNode, referenceNode);
            },
            $removeChild: function removeChild(parentNode, childNode) {
                return parentNode.removeChild(childNode);
            },
            $appendChild: function appendChild(parentNode, childNode) {
                parentNode.appendChild(childNode);
            },
            $childNodes: function childNodes(node) {
                return node.childNodes;
            },
            $parentNode: function parentNode(node) {
                return node.parentNode;
            },
            $nextSibling: function nextSibling(node) {
                return node.nextSibling;
            },
            $tagName: function tagName(elm) {
                return elm.tagName;
            },
            $getTextContent: function (node) {
                return node.textContent;
            },
            $setTextContent: function setTextContent(node, text) {
                node.textContent = text;
            },
            $getAttribute: function getAttribute(elm, key) {
                return elm.getAttribute(key);
            },
            $setAttribute: function setAttribute(elm, key, val) {
                elm.setAttribute(key, val);
            },
            $setAttributeNS: function $setAttributeNS(elm, namespaceURI, qualifiedName, val) {
                elm.setAttributeNS(namespaceURI, qualifiedName, val);
            },
            $removeAttribute: function removeAttribute(elm, key) {
                elm.removeAttribute(key);
            }
        };
    }

    var EMPTY = {};
    var DEFAULT_OPTS = null;
    function updateElement(plt, nodeOps, oldVnode, newVnode) {
        var isUpdate = oldVnode != null;
        oldVnode = oldVnode || EMPTY;
        newVnode = newVnode || EMPTY;
        var key,
            cur,
            elm = newVnode.elm,
            oldData,
            newData;
        // update attrs
        if (oldVnode.vattrs || newVnode.vattrs) {
            oldData = oldVnode.vattrs || EMPTY;
            newData = newVnode.vattrs || EMPTY;
            // update modified attributes, add new attributes
            for (key in newData) {
                cur = newData[key];
                if (oldData[key] !== cur) {
                    if (BOOLEAN_ATTRS[key] === 1) {
                        if (cur) {
                            nodeOps.$setAttribute(elm, key, '');
                        } else {
                            nodeOps.$removeAttribute(elm, key);
                        }
                    } else {
                        if (key.charCodeAt(0) !== 120 /* xChar */) {
                                nodeOps.$setAttribute(elm, key, cur);
                            } else if (key.charCodeAt(3) === 58 /* colonChar */) {
                                // Assume xml namespace
                                nodeOps.$setAttributeNS(elm, XML_NS$1, key, cur);
                            } else if (key.charCodeAt(5) === 58 /* colonChar */) {
                                // Assume xlink namespace
                                nodeOps.$setAttributeNS(elm, XLINK_NS$1, key, cur);
                            } else {
                            nodeOps.$setAttribute(elm, key, cur);
                        }
                    }
                }
            }
            // remove removed attributes
            // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
            // the other option is to remove all attributes with value == undefined
            if (isUpdate) {
                for (key in oldData) {
                    if (!(key in newData)) {
                        nodeOps.$removeAttribute(elm, key);
                    }
                }
            }
        }
        // update class
        if (oldVnode.vclass || newVnode.vclass) {
            oldData = oldVnode.vclass || EMPTY;
            newData = newVnode.vclass || EMPTY;
            if (isUpdate) {
                for (key in oldData) {
                    if (!newData[key]) {
                        elm.classList.remove(key);
                    }
                }
            }
            for (key in newData) {
                cur = newData[key];
                if (cur !== oldData[key]) {
                    elm.classList[newData[key] ? 'add' : 'remove'](key);
                }
            }
        }
        // update props
        if (oldVnode.vprops || newVnode.vprops) {
            oldData = oldVnode.vprops || EMPTY;
            newData = newVnode.vprops || EMPTY;
            if (isUpdate) {
                for (key in oldData) {
                    if (newData[key] === undefined) {
                        // only delete the old property when the
                        // new property is undefined, otherwise we'll
                        // end up deleting getters/setters
                        delete elm[key];
                    }
                }
            }
            for (key in newData) {
                cur = newData[key];
                if (oldData[key] !== cur && (key !== 'value' || elm[key] !== cur)) {
                    elm[key] = cur;
                }
            }
        }
        // update style
        if (oldVnode.vstyle || newVnode.vstyle) {
            oldData = oldVnode.vstyle || EMPTY;
            newData = newVnode.vstyle || EMPTY;
            if (isUpdate) {
                for (key in oldData) {
                    if (!newData[key]) {
                        elm.style[key] = '';
                    }
                }
            }
            for (key in newData) {
                cur = newData[key];
                if (cur !== oldData[key]) {
                    elm.style[key] = cur;
                }
            }
        }
        // update event listeners
        oldData = oldVnode.vlisteners;
        newData = newVnode.vlisteners;
        if (oldData || newData) {
            if (!DEFAULT_OPTS) {
                DEFAULT_OPTS = plt.getEventOptions();
            }
            // remove existing listeners which no longer used
            if (isUpdate && oldData && oldVnode.assignedListener) {
                // if element changed or deleted we remove all existing listeners unconditionally
                for (key in oldData) {
                    // remove listener if existing listener removed
                    if (!newData || !newData[key]) {
                        oldVnode.elm.removeEventListener(key, oldVnode.assignedListener, DEFAULT_OPTS);
                    }
                }
            }
            // add new listeners which has not already attached
            if (newData) {
                // reuse existing listener or create new
                cur = newVnode.assignedListener = oldVnode.assignedListener || createListener();
                // update vnode for listener
                cur.vnode = newVnode;
                // if element changed or added we add all needed listeners unconditionally
                for (key in newData) {
                    // add listener if new listener added
                    if (!oldData || !oldData[key]) {
                        elm.addEventListener(key, cur, DEFAULT_OPTS);
                    }
                }
            }
        }
    }
    function createListener() {
        return function handler(event) {
            handleEvent(event, handler.vnode);
        };
    }
    function handleEvent(event, vnode) {
        var eventName = event.type,
            on = vnode.vlisteners;
        // call event handler(s) if they exists
        if (on && on[eventName]) {
            invokeHandler(on[eventName], vnode, event);
        }
    }
    function invokeHandler(handler, vnode, event) {
        if (isFunction(handler)) {
            // call function handler
            handler.call(vnode, event, vnode);
        } else if (isObject(handler)) {
            // call handler with arguments
            if (isFunction(handler[0])) {
                // special case for single argument for performance
                if (handler.length === 2) {
                    handler[0].call(vnode, handler[1], event, vnode);
                } else {
                    var args = handler.slice(1);
                    args.push(event);
                    args.push(vnode);
                    handler[0].apply(vnode, args);
                }
            } else {
                // call multiple handlers
                for (var i = 0; i < handler.length; i++) {
                    invokeHandler(handler[i]);
                }
            }
        }
    }
    var BOOLEAN_ATTRS = {
        'allowfullscreen': 1,
        'async': 1,
        'autofocus': 1,
        'autoplay': 1,
        'checked': 1,
        'controls': 1,
        'disabled': 1,
        'enabled': 1,
        'formnovalidate': 1,
        'hidden': 1,
        'multiple': 1,
        'noresize': 1,
        'readonly': 1,
        'required': 1,
        'selected': 1,
        'spellcheck': 1
    };
    var XLINK_NS$1 = 'http://www.w3.org/1999/xlink';
    var XML_NS$1 = 'http://www.w3.org/XML/1998/namespace';

    /**
     * Virtual DOM patching algorithm based on Snabbdom by
     * Simon Friis Vindum (@paldepind)
     * Licensed under the MIT License
     * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
     *
     * Modified for Stencil's renderer and slot projection
     */
    function createRenderer(plt, domApi) {
        // createRenderer() is only created once per app
        // the patch() function which createRenderer() returned is the function
        // which gets called numerous times by each component
        function createElm(vnode, parentElm, childIndex) {
            var i = 0;
            if (vnode.vtag === SLOT_TAG) {
                if (hostContentNodes) {
                    // special case for manually relocating host content nodes
                    // to their new home in either a named slot or the default slot
                    var namedSlot = vnode.vattrs && vnode.vattrs.name;
                    var slotNodes = void 0;
                    if (isDef(namedSlot)) {
                        // this vnode is a named slot
                        slotNodes = hostContentNodes.namedSlots && hostContentNodes.namedSlots[namedSlot];
                    } else {
                        // this vnode is the default slot
                        slotNodes = hostContentNodes.defaultSlot;
                    }
                    if (isDef(slotNodes)) {
                        // the host element has some nodes that need to be moved around
                        // we have a slot for the user's vnode to go into
                        // while we're moving nodes around, temporarily disable
                        // the disconnectCallback from working
                        plt.tmpDisconnected = true;
                        for (; i < slotNodes.length; i++) {
                            // remove the host content node from it's original parent node
                            // then relocate the host content node to its new slotted home
                            domApi.$appendChild(parentElm, domApi.$removeChild(domApi.$parentNode(slotNodes[i]), slotNodes[i]));
                        }
                        // done moving nodes around
                        // allow the disconnect callback to work again
                        plt.tmpDisconnected = false;
                    }
                }
                // this was a slot node, we do not create slot elements, our work here is done
                // no need to return any element to be added to the dom
                return null;
            }
            if (isDef(vnode.vtext)) {
                // create text node
                vnode.elm = domApi.$createTextNode(vnode.vtext);
            } else {
                // create element
                var elm = vnode.elm = vnode.vnamespace ? domApi.$createElementNS(vnode.vnamespace, vnode.vtag) : domApi.$createElement(vnode.vtag);
                // add css classes, attrs, props, listeners, etc.
                updateElement(plt, domApi, null, vnode);
                var children = vnode.vchildren;
                if (isDef(ssrId)) {
                    // SSR ONLY: this is an SSR render and this
                    // logic does not run on the client
                    // give this element the SSR child id that can be read by the client
                    domApi.$setAttribute(vnode.elm, SSR_CHILD_ID, ssrId + '.' + childIndex + (hasChildNodes(children) ? '' : '.'));
                }
                if (children) {
                    var childNode = void 0;
                    for (; i < children.length; ++i) {
                        // create the node
                        childNode = createElm(children[i], elm, i);
                        // return node could have been null
                        if (childNode) {
                            if (isDef(ssrId) && childNode.nodeType === 3) {
                                // SSR ONLY: add the text node's start comment
                                domApi.$appendChild(elm, domApi.$createComment('s.' + ssrId + '.' + i));
                            }
                            // append our new node
                            domApi.$appendChild(elm, childNode);
                            if (isDef(ssrId) && childNode.nodeType === 3) {
                                // SSR ONLY: add the text node's end comment
                                domApi.$appendChild(elm, domApi.$createComment('/'));
                            }
                        }
                    }
                }
            }
            return vnode.elm;
        }
        function addVnodes(parentElm, before, vnodes, startIdx, endIdx) {
            var childNode = void 0;
            for (; startIdx <= endIdx; ++startIdx) {
                var vnodeChild = vnodes[startIdx];
                if (isDef(vnodeChild)) {
                    if (isDef(vnodeChild.vtext)) {
                        childNode = domApi.$createTextNode(vnodeChild.vtext);
                    } else {
                        childNode = createElm(vnodeChild, parentElm, startIdx);
                    }
                    if (isDef(childNode)) {
                        vnodeChild.elm = childNode;
                        domApi.$insertBefore(parentElm, childNode, before);
                    }
                }
            }
        }
        function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var vnode = vnodes[startIdx];
                if (isDef(vnode)) {
                    if (isDef(vnode.elm)) {
                        invokeDestroy(vnode);
                    }
                    domApi.$removeChild(parentElm, vnode.elm);
                }
            }
        }
        function updateChildren(parentElm, oldCh, newCh) {
            var oldStartIdx = 0,
                newStartIdx = 0;
            var oldEndIdx = oldCh.length - 1;
            var oldStartVnode = oldCh[0];
            var oldEndVnode = oldCh[oldEndIdx];
            var newEndIdx = newCh.length - 1;
            var newStartVnode = newCh[0];
            var newEndVnode = newCh[newEndIdx];
            var oldKeyToIdx = void 0;
            var idxInOld = void 0;
            var elmToMove = void 0;
            var node = void 0;
            while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                if (oldStartVnode == null) {
                    oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
                } else if (oldEndVnode == null) {
                    oldEndVnode = oldCh[--oldEndIdx];
                } else if (newStartVnode == null) {
                    newStartVnode = newCh[++newStartIdx];
                } else if (newEndVnode == null) {
                    newEndVnode = newCh[--newEndIdx];
                } else if (isSameVnode(oldStartVnode, newStartVnode)) {
                    patchVNode(oldStartVnode, newStartVnode);
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else if (isSameVnode(oldEndVnode, newEndVnode)) {
                    patchVNode(oldEndVnode, newEndVnode);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (isSameVnode(oldStartVnode, newEndVnode)) {
                    patchVNode(oldStartVnode, newEndVnode);
                    domApi.$insertBefore(parentElm, oldStartVnode.elm, domApi.$nextSibling(oldEndVnode.elm));
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                } else if (isSameVnode(oldEndVnode, newStartVnode)) {
                    patchVNode(oldEndVnode, newStartVnode);
                    domApi.$insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                } else {
                    if (isUndef(oldKeyToIdx)) {
                        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                    }
                    idxInOld = oldKeyToIdx[newStartVnode.vkey];
                    if (isUndef(idxInOld)) {
                        // new element
                        node = createElm(newStartVnode, parentElm, newStartIdx);
                        newStartVnode = newCh[++newStartIdx];
                    } else {
                        elmToMove = oldCh[idxInOld];
                        if (elmToMove.vtag !== newStartVnode.vtag) {
                            node = createElm(newStartVnode, parentElm, idxInOld);
                        } else {
                            patchVNode(elmToMove, newStartVnode);
                            oldCh[idxInOld] = undefined;
                            node = elmToMove.elm;
                        }
                        newStartVnode = newCh[++newStartIdx];
                    }
                    if (node) {
                        domApi.$insertBefore(parentElm, node, oldStartVnode.elm);
                    }
                }
            }
            if (oldStartIdx > oldEndIdx) {
                addVnodes(parentElm, newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm, newCh, newStartIdx, newEndIdx);
            } else if (newStartIdx > newEndIdx) {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
        function isSameVnode(vnode1, vnode2) {
            // compare if two vnode to see if they're "technically" the same
            // need to have the same element tag, and same key to be the same
            return vnode1.vtag === vnode2.vtag && vnode1.vkey === vnode2.vkey;
        }
        function createKeyToOldIdx(children, beginIdx, endIdx) {
            var i = void 0,
                map = {},
                key = void 0,
                ch = void 0;
            for (i = beginIdx; i <= endIdx; ++i) {
                ch = children[i];
                if (ch != null) {
                    key = ch.vkey;
                    if (key !== undefined) {
                        map.k = i;
                    }
                }
            }
            return map;
        }
        function patchVNode(oldVnode, newVnode) {
            var elm = newVnode.elm = oldVnode.elm;
            var oldChildren = oldVnode.vchildren;
            var newChildren = newVnode.vchildren;
            if (isUndef(newVnode.vtext)) {
                // element node
                if ((!isUpdate || !newVnode.skipDataOnUpdate) && newVnode.vtag !== SLOT_TAG) {
                    // either this is the first render of an element OR it's an update
                    // AND we already know it's possible it could have changed
                    // this updates the element's css classes, attrs, props, listeners, etc.
                    updateElement(plt, domApi, oldVnode, newVnode);
                }
                if (isDef(oldChildren) && isDef(newChildren)) {
                    // looks like there's child vnodes for both the old and new vnodes
                    if (!isUpdate || !newVnode.skipChildrenOnUpdate) {
                        // either this is the first render of an element OR it's an update
                        // AND we already know it's possible that the children could have changed
                        updateChildren(elm, oldChildren, newChildren);
                    }
                } else if (isDef(newChildren)) {
                    // no old child vnodes, but there are new child vnodes to add
                    if (isDef(oldVnode.vtext)) {
                        // the old vnode was text, so be sure to clear it out
                        domApi.$setTextContent(elm, '');
                    }
                    // add the new vnode children
                    addVnodes(elm, null, newChildren, 0, newChildren.length - 1);
                } else if (isDef(oldChildren)) {
                    // no new child vnodes, but there are old child vnodes to remove
                    removeVnodes(elm, oldChildren, 0, oldChildren.length - 1);
                }
            } else if (elm._hostContentNodes && elm._hostContentNodes.defaultSlot) {
                // this element has slotted content
                var parentElement = elm._hostContentNodes.defaultSlot[0].parentElement;
                domApi.$setTextContent(parentElement, newVnode.vtext);
                elm._hostContentNodes.defaultSlot = [parentElement.childNodes[0]];
            } else {
                // update the text content for the text only vnode
                domApi.$setTextContent(elm, newVnode.vtext);
            }
        }
        // internal variables to be reused per patch() call
        var isUpdate = void 0,
            hostContentNodes = void 0,
            ssrId = void 0;
        return function patch(oldVnode, newVnode, isUpdatePatch, hostElementContentNodes, ssrPatchId) {
            // patchVNode() is synchronous
            // so it is safe to set these variables and internally
            // the same patch() call will reference the same data
            isUpdate = isUpdatePatch;
            hostContentNodes = hostElementContentNodes;
            ssrId = ssrPatchId;
            // synchronous patch
            patchVNode(oldVnode, newVnode);
            if (isDef(ssrId)) {
                // SSR ONLY: we've been given an SSR id, so the host element
                // should be given the ssr id attribute
                domApi.$setAttribute(oldVnode.elm, SSR_VNODE_ID, ssrId);
            }
            // return our new vnode
            return newVnode;
        };
    }
    function invokeDestroy(vnode) {
        if (vnode.vlisteners && vnode.assignedListener) {
            for (var key in vnode.vlisteners) {
                vnode.elm.removeEventListener(key, vnode.vlisteners, false);
            }
        }
        if (isDef(vnode.vchildren)) {
            for (var i = 0; i < vnode.vchildren.length; ++i) {
                vnode.vchildren[i] && invokeDestroy(vnode.vchildren[i]);
            }
        }
    }
    function hasChildNodes(children) {
        // SSR ONLY: check if there are any more nested child elements
        // if there aren't, this info is useful so the client runtime
        // doesn't have to climb down and check so many elements
        if (children) {
            for (var i = 0; i < children.length; i++) {
                if (children[i].vtag !== SLOT_TAG || hasChildNodes(children[i].vchildren)) {
                    return true;
                }
            }
        }
        return false;
    }

    function createQueueClient(domCtrl, now) {
        var raf = domCtrl.raf;
        var highPromise = Promise.resolve();
        var highCallbacks = [];
        var mediumCallbacks = [];
        var lowCallbacks = [];
        var resolvePending = false;
        var rafPending = false;
        function doHighPriority() {
            // holy geez we need to get this stuff done and fast
            // all high priority callbacks should be fired off immediately
            while (highCallbacks.length > 0) {
                highCallbacks.shift()();
            }
            resolvePending = false;
        }
        function doWork() {
            var start = now();
            // always run all of the high priority work if there is any
            doHighPriority();
            while (mediumCallbacks.length > 0 && now() - start < 40) {
                mediumCallbacks.shift()();
            }
            if (mediumCallbacks.length === 0) {
                // we successfully drained the medium queue or the medium queue is empty
                // so now let's drain the low queue with our remaining time
                while (lowCallbacks.length > 0 && now() - start < 40) {
                    lowCallbacks.shift()();
                }
            }
            // check to see if we still have work to do
            if (rafPending = mediumCallbacks.length > 0 || lowCallbacks.length > 0) {
                // everyone just settle down now
                // we already don't have time to do anything in this callback
                // let's throw the next one in a requestAnimationFrame
                // so we can just simmer down for a bit
                raf(flush);
            }
        }
        function flush() {
            // always run all of the high priority work if there is any
            doHighPriority();
            // always force a bunch of medium callbacks to run, but still have
            // a throttle on how many can run in a certain time
            var start = now();
            while (mediumCallbacks.length > 0 && now() - start < 4) {
                mediumCallbacks.shift()();
            }
            if (rafPending = mediumCallbacks.length > 0 || lowCallbacks.length > 0) {
                // still more to do yet, but we've run out of time
                // let's let this thing cool off and try again in the next ric
                raf(doWork);
            }
        }
        function add(cb, priority) {
            if (priority === PRIORITY_HIGH) {
                // uses Promise.resolve() for next tick
                highCallbacks.push(cb);
                if (!resolvePending) {
                    // not already pending work to do, so let's tee it up
                    resolvePending = true;
                    highPromise.then(doHighPriority);
                }
            } else {
                if (priority === PRIORITY_LOW) {
                    lowCallbacks.push(cb);
                } else {
                    // defaults to medium priority
                    // uses requestIdleCallback
                    mediumCallbacks.push(cb);
                }
                if (!rafPending) {
                    // not already pending work to do, so let's tee it up
                    rafPending = true;
                    raf(doWork);
                }
            }
        }
        return {
            add: add,
            flush: flush
        };
    }

    function getNowFunction(window) {
        // performance.now() polyfill
        // required for client-side only
        var perf = window.performance = window.performance || {};
        if (!perf.now) {
            var appStart = Date.now();
            perf.now = function () {
                return Date.now() - appStart;
            };
        }
        return function now() {
            return perf.now();
        };
    }

    function parseComponentRegistry(cmpRegistryData, registry, attr) {
        // tag name will always be upper case
        var cmpMeta = {
            tagNameMeta: cmpRegistryData[0],
            membersMeta: {
                // every component defaults to always have
                // the mode and color properties
                // but only color should observe any attribute changes
                'mode': { memberType: MEMBER_PROP },
                'color': { memberType: MEMBER_PROP, attribName: 'color' }
            }
        };
        // this comonent's module id
        cmpMeta.moduleId = cmpRegistryData[1];
        // map of the modes w/ bundle id and style data
        cmpMeta.styleIds = cmpRegistryData[2] || {};
        // parse member meta
        // this data only includes props that are attributes that need to be observed
        // it does not include all of the props yet
        parseMembersData(cmpMeta, cmpRegistryData[3], attr);
        if (cmpRegistryData[4]) {
            // parse listener meta
            cmpMeta.listenersMeta = cmpRegistryData[4].map(parseListenerData);
        }
        // slot
        cmpMeta.slotMeta = cmpRegistryData[5];
        // bundle load priority
        cmpMeta.loadPriority = cmpRegistryData[6];
        return registry[cmpMeta.tagNameMeta] = cmpMeta;
    }
    function parseListenerData(listenerData) {
        return {
            eventName: listenerData[0],
            eventMethodName: listenerData[1],
            eventDisabled: !!listenerData[2],
            eventPassive: !!listenerData[3],
            eventCapture: !!listenerData[4]
        };
    }
    function parseMembersData(cmpMeta, memberData, attr) {
        if (memberData) {
            cmpMeta.membersMeta = cmpMeta.membersMeta || {};
            for (var i = 0; i < memberData.length; i++) {
                var d = memberData[i];
                cmpMeta.membersMeta[d[0]] = {
                    memberType: d[1],
                    attribName: attr === ATTR_LOWER_CASE ? d[0].toLowerCase() : toDashCase(d[0]),
                    propType: d[2],
                    ctrlId: d[3]
                };
            }
        }
    }
    function parseComponentMeta(registry, moduleImports, cmpMetaData, attr) {
        // tag name will always be upper case
        var cmpMeta = registry[cmpMetaData[0]];
        // get the component class which was added to moduleImports
        // using the tag as the key on the export object
        cmpMeta.componentModule = moduleImports[cmpMetaData[0]];
        // component members
        parseMembersData(cmpMeta, cmpMetaData[1], attr);
        // host element meta
        cmpMeta.hostMeta = cmpMetaData[2];
        // component instance events
        if (cmpMetaData[3]) {
            cmpMeta.eventsMeta = cmpMetaData[3].map(parseEventData);
        }
        // component instance prop WILL change methods
        cmpMeta.propsWillChangeMeta = cmpMetaData[4];
        // component instance prop DID change methods
        cmpMeta.propsDidChangeMeta = cmpMetaData[5];
        // is shadow
        cmpMeta.isShadowMeta = !!cmpMetaData[6];
    }
    function parseEventData(d) {
        return {
            eventName: d[0],
            eventMethodName: d[1] || d[0],
            eventBubbles: !d[2],
            eventCancelable: !d[3],
            eventComposed: !d[4]
        };
    }
    function parsePropertyValue(propType, propValue) {
        // ensure this value is of the correct prop type
        if (isDef(propValue)) {
            if (propType === TYPE_BOOLEAN) {
                // per the HTML spec, any string value means it is a boolean "true" value
                // but we'll cheat here and say that the string "false" is the boolean false
                return propValue === 'false' ? false : propValue === '' || !!propValue;
            }
            if (propType === TYPE_NUMBER) {
                // force it to be a number
                return parseFloat(propValue);
            }
        }
        // not sure exactly what type we want
        // so no need to change to a different type
        return propValue;
    }

    function attributeChangedCallback(plt, elm, attribName, oldVal, newVal) {
        // only react if the attribute values actually changed
        if (oldVal !== newVal) {
            // normalize the attribute name w/ lower case
            attribName = attribName.toLowerCase();
            // using the known component meta data
            // look up to see if we have a property wired up to this attribute name
            var propsMeta = plt.getComponentMeta(elm).membersMeta;
            if (propsMeta) {
                for (var propName in propsMeta) {
                    if (propsMeta[propName].attribName === attribName) {
                        // cool we've got a prop using this attribute name the value will
                        // be a string, so let's convert it to the correct type the app wants
                        // below code is ugly yes, but great minification ;)
                        elm[propName] = parsePropertyValue(propsMeta[propName].propType, newVal);
                        break;
                    }
                }
            }
        }
    }

    function connectedCallback(plt, elm) {
        // do not reconnect if we've already created an instance for this element
        if (!elm._hasConnected) {
            // first time we've connected
            elm._hasConnected = true;
            // if somehow this node was reused, ensure we've removed this property
            delete elm._hasDestroyed;
            // initialize our event listeners on the host element
            // we do this now so that we can listening to events that may
            // have fired even before the instance is ready
            initElementListeners(plt, elm);
            // register this component as an actively
            // loading child to its parent component
            registerWithParentComponent(plt, elm);
            // add to the queue to load the bundle
            // it's important to have an async tick in here so we can
            // ensure the "mode" attribute has been added to the element
            // place in high priority since it's not much work and we need
            // to know as fast as possible, but still an async tick in between
            plt.queue.add(function () {
                // get the component meta data about this component
                var cmpMeta = plt.getComponentMeta(elm);
                // only collects slot references if this component even has slots
                plt.connectHostElement(elm, cmpMeta.slotMeta);
                // start loading this component mode's bundle
                // if it's already loaded then the callback will be synchronous
                plt.loadBundle(cmpMeta, elm, function loadComponentCallback() {
                    // we've fully loaded the component mode data
                    // let's queue it up to be rendered next
                    elm._queueUpdate();
                });
            }, PRIORITY_HIGH);
        }
    }
    function registerWithParentComponent(plt, elm) {
        // find the first ancestor host element (if there is one) and register
        // this element as one of the actively loading child elements for its ancestor
        var ancestorHostElement = elm;
        while (ancestorHostElement = getParentElement(ancestorHostElement)) {
            // climb up the ancestors looking for the first registered component
            if (plt.getComponentMeta(ancestorHostElement)) {
                // we found this elements the first ancestor host element
                // if the ancestor already loaded then do nothing, it's too late
                if (!ancestorHostElement._hasLoaded) {
                    // keep a reference to this element's ancestor host element
                    elm._ancestorHostElement = ancestorHostElement;
                    // ensure there is an array to contain a reference to each of the child elements
                    // and set this element as one of the ancestor's child elements it should wait on
                    if (ancestorHostElement._activelyLoadingChildren) {
                        ancestorHostElement._activelyLoadingChildren.push(elm);
                    } else {
                        ancestorHostElement._activelyLoadingChildren = [elm];
                    }
                }
                break;
            }
        }
    }

    function disconnectedCallback(plt, elm) {
        // only disconnect if we're not temporarily disconnected
        // tmpDisconnected will happen when slot nodes are being relocated
        if (!plt.tmpDisconnected) {
            // ok, let's officially destroy this thing
            // set this to true so that any of our pending async stuff
            // doesn't continue since we already decided to destroy this node
            elm._hasDestroyed = true;
            // call instance Did Unload and destroy instance stuff
            // if we've created an instance for this
            var instance = elm.$instance;
            if (instance) {
                // call the user's componentDidUnload if there is one
                instance.componentDidUnload && instance.componentDidUnload();
                elm.$instance = instance.__el = instance.__values = instance.__values.__propWillChange = instance.__values.__propDidChange = null;
            }
            // detatch any event listeners that may have been added
            // this will also set _listeners to null if there are any
            detachListeners(elm);
            // destroy the vnode and child vnodes if they exist
            elm._vnode && invokeDestroy(elm._vnode);
            if (elm._hostContentNodes) {
                // overreacting here just to reduce any memory leak issues
                elm._hostContentNodes = elm._hostContentNodes.defaultSlot = elm._hostContentNodes.namedSlots = null;
            }
            // fuhgeddaboudit
            // set it all to null to ensure we forget references
            // and reset values incase this node gets reused somehow
            // (possible that it got disconnected, but the node was reused)
            elm._root = elm._vnode = elm._ancestorHostElement = elm._activelyLoadingChildren = elm._hasConnected = elm._isQueuedForUpdate = elm._hasLoaded = null;
        }
    }

    function initEventEmitters(plt, componentEvents, instance) {
        if (componentEvents) {
            componentEvents.forEach(function (eventMeta) {
                instance[eventMeta.eventMethodName] = {
                    emit: function eventEmitter(data) {
                        var eventData = {
                            bubbles: eventMeta.eventBubbles,
                            composed: eventMeta.eventComposed,
                            cancelable: eventMeta.eventCancelable,
                            detail: data
                        };
                        plt.emitEvent(instance.__el, eventMeta.eventName, eventData);
                    }
                };
            });
        }
    }

    function queueUpdate(plt, elm) {
        // only run patch if it isn't queued already
        if (!elm._isQueuedForUpdate) {
            elm._isQueuedForUpdate = true;
            // run the patch in the next tick
            plt.queue.add(function queueUpdateNextTick() {
                // no longer queued
                elm._isQueuedForUpdate = false;
                // vdom diff and patch the host element for differences
                update(plt, elm);
            });
        }
    }
    function update(plt, elm) {
        // everything is async, so somehow we could have already disconnected
        // this node, so be sure to do nothing if we've already disconnected
        if (!elm._hasDestroyed) {
            var isInitialLoad = !elm.$instance;
            if (isInitialLoad) {
                // haven't created a component instance for this host element yet
                try {
                    initComponentInstance(plt, elm);
                } catch (e) {
                    plt.onError(INIT_INSTANCE_ERROR, e, elm);
                }
            }
            // if this component has a render function, let's fire
            // it off and generate a vnode for this
            try {
                elm._render(!isInitialLoad);
            } catch (e) {
                plt.onError(RENDER_ERROR, e, elm);
            }
            if (isInitialLoad) {
                try {
                    elm._initLoad();
                } catch (e) {
                    plt.onError(INITIAL_LOAD_ERROR, e, elm);
                }
            }
        }
    }

    function initProxy(plt, elm, instance, cmpMeta) {
        // used to store instance data internally so that we can add
        // getters/setters with the same name, and then do change detection
        var values = instance.__values = {};
        if (cmpMeta.propsWillChangeMeta) {
            // this component has prop WILL change methods, so init the object to store them
            values.__propWillChange = {};
        }
        if (cmpMeta.propsDidChangeMeta) {
            // this component has prop DID change methods, so init the object to store them
            values.__propDidChange = {};
        }
        if (cmpMeta.membersMeta) {
            for (var memberName in cmpMeta.membersMeta) {
                // add getters/setters for @Prop()s
                var memberMeta = cmpMeta.membersMeta[memberName];
                var memberType = memberMeta.memberType;
                if (memberType === MEMBER_PROP_CONTEXT) {
                    // @Prop({ context: 'config' })
                    var contextObj = plt.getContextItem(memberMeta.ctrlId);
                    if (isDef(contextObj)) {
                        defineProperty(instance, memberName, contextObj.getContext && contextObj.getContext(elm) || contextObj);
                    }
                } else if (memberType === MEMBER_PROP_CONNECT) {
                    // @Prop({ connect: 'ion-loading-ctrl' })
                    defineProperty(instance, memberName, plt.propConnect(memberMeta.ctrlId));
                } else if (memberType === MEMBER_METHOD) {
                    // add a value getter on the dom's element instance
                    // pointed at the instance's method
                    defineProperty(elm, memberName, instance[memberName].bind(instance));
                } else if (memberType === MEMBER_ELEMENT_REF) {
                    // add a getter to the element reference using
                    // the member name the component meta provided
                    defineProperty(instance, memberName, elm);
                } else {
                    // @Prop and @State
                    initProp(memberName, memberType, memberMeta.attribName, memberMeta.propType, values, plt, elm, instance, cmpMeta.propsWillChangeMeta, cmpMeta.propsDidChangeMeta);
                }
            }
        }
    }
    function initProp(memberName, memberType, attribName, propType, internalValues, plt, elm, instance, propWillChangeMeta, propDidChangeMeta) {
        if (memberType === MEMBER_STATE) {
            // @State() property, so copy the value directly from the instance
            // before we create getters/setters on this same property name
            internalValues[memberName] = instance[memberName];
        } else {
            // @Prop() property, so check initial value from the proxy element and instance
            // before we create getters/setters on this same property name
            // we do this for @Prop(state: true) also
            var hostAttrValue = elm.getAttribute(attribName);
            if (hostAttrValue !== null) {
                // looks like we've got an initial value from the attribute
                internalValues[memberName] = parsePropertyValue(propType, hostAttrValue);
            } else if (elm[memberName] !== undefined) {
                // looks like we've got an initial value on the proxy element
                internalValues[memberName] = parsePropertyValue(propType, elm[memberName]);
            } else if (instance[memberName] !== undefined) {
                // looks like we've got an initial value on the instance already
                internalValues[memberName] = instance[memberName];
            }
        }
        var i = 0;
        if (propWillChangeMeta) {
            // there are prop WILL change methods for this component
            for (; i < propWillChangeMeta.length; i++) {
                if (propWillChangeMeta[i][PROP_CHANGE_PROP_NAME] === memberName) {
                    // cool, we should watch for changes to this property
                    // let's bind their watcher function and add it to our list
                    // of watchers, so any time this property changes we should
                    // also fire off their @PropWillChange() method
                    internalValues.__propWillChange[memberName] = instance[propWillChangeMeta[i][PROP_CHANGE_METHOD_NAME]].bind(instance);
                }
            }
        }
        if (propDidChangeMeta) {
            // there are prop DID change methods for this component
            for (i = 0; i < propDidChangeMeta.length; i++) {
                if (propDidChangeMeta[i][PROP_CHANGE_PROP_NAME] === memberName) {
                    // cool, we should watch for changes to this property
                    // let's bind their watcher function and add it to our list
                    // of watchers, so any time this property changes we should
                    // also fire off their @PropDidChange() method
                    internalValues.__propDidChange[memberName] = instance[propDidChangeMeta[i][PROP_CHANGE_METHOD_NAME]].bind(instance);
                }
            }
        }
        function getValue() {
            // get the property value directly from our internal values
            return internalValues[memberName];
        }
        function setValue(newVal) {
            // check our new property value against our internal value
            var oldVal = internalValues[memberName];
            // TODO: account for Arrays/Objects
            if (newVal !== oldVal) {
                // gadzooks! the property's value has changed!!
                if (internalValues.__propWillChange && internalValues.__propWillChange[memberName]) {
                    // this instance is watching for when this property WILL change
                    internalValues.__propWillChange[memberName](newVal, oldVal);
                }
                // set our new value!
                internalValues[memberName] = newVal;
                if (internalValues.__propDidChange && internalValues.__propDidChange[memberName]) {
                    // this instance is watching for when this property DID change
                    internalValues.__propDidChange[memberName](newVal, oldVal);
                }
                // looks like this value actually changed, we've got work to do!
                // queue that we need to do an update, don't worry
                // about queuing up millions cuz this function
                // ensures it only runs once
                queueUpdate(plt, elm);
            }
        }
        if (memberType === MEMBER_PROP || memberType === MEMBER_PROP_STATE) {
            // @Prop() and @Prop({ state: true })
            // have both getters and setters on the DOM element
            // @State() getters and setters should not be assigned to the element
            defineProperty(elm, memberName, undefined, getValue, setValue);
        }
        if (memberType === MEMBER_PROP_STATE || memberType === MEMBER_STATE) {
            // @Prop({ state: true }) and @State()
            // have both getters and setters on the instance
            defineProperty(instance, memberName, undefined, getValue, setValue);
        } else if (memberType === MEMBER_PROP) {
            // @Prop() only has getters, but not setters on the instance
            defineProperty(instance, memberName, undefined, getValue, function invalidSetValue() {
                // this is not a stateful @Prop()
                // so do not update the instance or host element
                // TODO: remove this warning in prod mode
                console.warn('@Prop() "' + memberName + '" on "' + elm.tagName.toLowerCase() + '" cannot be modified.');
            });
        }
    }
    function defineProperty(obj, propertyKey, value, getter, setter) {
        // minification shortcut
        var descriptor = {
            configurable: true
        };
        if (value !== undefined) {
            descriptor.value = value;
        } else {
            if (getter) {
                descriptor.get = getter;
            }
            if (setter) {
                descriptor.set = setter;
            }
        }
        Object.defineProperty(obj, propertyKey, descriptor);
    }
    function proxyControllerProp(domApi, controllerComponents, obj, ctrlTag, proxyMethodName) {
        obj[proxyMethodName] = function () {
            var orgArgs = arguments;
            return new Promise(function (resolve) {
                var ctrlElm = controllerComponents[ctrlTag];
                if (!ctrlElm) {
                    ctrlElm = controllerComponents[ctrlTag] = domApi.$createElement(ctrlTag);
                    domApi.$appendChild(domApi.$body, ctrlElm);
                }
                ctrlElm.componentOnReady(function (ctrlElm) {
                    ctrlElm[proxyMethodName].apply(ctrlElm, orgArgs).then(resolve);
                });
            });
        };
    }

    function createThemedClasses(mode, color, classList) {
        var allClasses = {};
        return classList.split(' ').reduce(function (classObj, classString) {
            classObj[classString] = true;
            if (mode) {
                classObj[classString + '-' + mode] = true;
                if (color) {
                    classObj[classString + '-' + color] = true;
                    classObj[classString + '-' + mode + '-' + color] = true;
                }
            }
            return classObj;
        }, allClasses);
    }

    function render(plt, elm, isUpdateRender) {
        var instance = elm.$instance;
        var cmpMeta = plt.getComponentMeta(elm);
        if (isUpdateRender) {
            // fire off the user's componentWillUpdate method (if one was provided)
            // componentWillUpdate runs BEFORE render() has been called
            // but only BEFORE an UPDATE and not before the intial render
            instance.componentWillUpdate && instance.componentWillUpdate();
        }
        // if this component has a render function, let's fire
        // it off and generate the child vnodes for this host element
        // note that we do not create the host element cuz it already exists
        var vnodeChildren = instance.render && instance.render();
        var vnodeHostData = instance.hostData && instance.hostData();
        var hostMeta = cmpMeta.hostMeta;
        if (vnodeChildren || vnodeHostData || hostMeta) {
            if (hostMeta) {
                vnodeHostData = Object.keys(hostMeta).reduce(function (hostData, key) {
                    switch (key) {
                        case 'theme':
                            hostData['class'] = hostData['class'] || {};
                            hostData['class'] = Object.assign(hostData['class'], createThemedClasses(instance.mode, instance.color, hostMeta['theme']));
                    }
                    return hostData;
                }, vnodeHostData || {});
            }
            // looks like we've got child nodes to render into this host element
            // or we need to update the css class/attrs on the host element
            // if we haven't already created a vnode, then we give the renderer the actual element
            // if this is a re-render, then give the renderer the last vnode we already created
            var oldVNode = elm._vnode || new VNode();
            oldVNode.elm = elm;
            // normalize host data keys to abbr. key
            if (vnodeHostData) {
                vnodeHostData.a = vnodeHostData['attrs'];
                vnodeHostData.c = vnodeHostData['class'];
                vnodeHostData.s = vnodeHostData['style'];
                vnodeHostData.o = vnodeHostData['on'];
            }
            // each patch always gets a new vnode
            // the host element itself isn't patched because it already exists
            // kick off the actual render and any DOM updates
            elm._vnode = plt.render(oldVNode, h(null, vnodeHostData, vnodeChildren), isUpdateRender, elm._hostContentNodes);
        }
        if (isUpdateRender) {
            // fire off the user's componentDidUpdate method (if one was provided)
            // componentDidUpdate runs AFTER render() has been called
            // but only AFTER an UPDATE and not after the intial render
            instance.componentDidUpdate && instance.componentDidUpdate();
        }
    }

    function initHostConstructor(plt, HostElementConstructor) {
        // let's wire up our functions to the host element's prototype
        // we can also inject our platform into each one that needs that api
        HostElementConstructor.connectedCallback = function () {
            connectedCallback(plt, this);
        };
        HostElementConstructor.attributeChangedCallback = function (attribName, oldVal, newVal) {
            attributeChangedCallback(plt, this, attribName, oldVal, newVal);
        };
        HostElementConstructor.disconnectedCallback = function () {
            disconnectedCallback(plt, this);
        };
        HostElementConstructor.componentOnReady = function (cb) {
            componentOnReady(this, cb);
        };
        HostElementConstructor._queueUpdate = function () {
            queueUpdate(plt, this);
        };
        HostElementConstructor._initLoad = function () {
            initLoad(plt, this);
        };
        HostElementConstructor._render = function (isInitialRender) {
            render(plt, this, isInitialRender);
        };
    }
    function componentOnReady(elm, cb) {
        if (!elm._hasDestroyed) {
            if (elm._hasLoaded) {
                cb(elm);
            } else {
                (elm._onReadyCallbacks = elm._onReadyCallbacks || []).push(cb);
            }
        }
    }
    function initComponentInstance(plt, elm) {
        // using the component's class, let's create a new instance
        var cmpMeta = plt.getComponentMeta(elm);
        var instance = elm.$instance = new cmpMeta.componentModule();
        // let's automatically add a reference to the host element on the instance
        instance.__el = elm;
        // so we've got an host element now, and a actual instance
        // let's wire them up together with getter/settings
        // the setters are use for change detection and knowing when to re-render
        initProxy(plt, elm, instance, cmpMeta);
        // add each of the event emitters which wire up instance methods
        // to fire off dom events from the host element
        initEventEmitters(plt, cmpMeta.eventsMeta, instance);
        // reply any event listeners on the instance that were queued up between the time
        // the element was connected and before the instance was ready
        try {
            replayQueuedEventsOnInstance(elm);
        } catch (e) {
            plt.onError(QUEUE_EVENTS_ERROR, e, elm);
        }
        // fire off the user's componentWillLoad method (if one was provided)
        // componentWillLoad only runs ONCE, after instance's element has been
        // assigned as the host element, but BEFORE render() has been called
        try {
            instance.componentWillLoad && instance.componentWillLoad();
        } catch (e) {
            plt.onError(WILL_LOAD_ERROR, e, elm);
        }
    }
    function initLoad(plt, elm) {
        var instance = elm.$instance;
        // it's possible that we've already decided to destroy this element
        // check if this element has any actively loading child elements
        if (instance && !elm._hasDestroyed && (!elm._activelyLoadingChildren || !elm._activelyLoadingChildren.length)) {
            // cool, so at this point this element isn't already being destroyed
            // and it does not have any child elements that are still loading
            // ensure we remove any child references cuz it doesn't matter at this point
            elm._activelyLoadingChildren = null;
            // sweet, this particular element is good to go
            // all of this element's children have loaded (if any)
            elm._hasLoaded = true;
            try {
                // fire off the user's elm.componentOnReady() callbacks that were
                // put directly on the element (well before anything was ready)
                if (elm._onReadyCallbacks) {
                    elm._onReadyCallbacks.forEach(function (cb) {
                        cb(elm);
                    });
                    delete elm._onReadyCallbacks;
                }
                // fire off the user's componentDidLoad method (if one was provided)
                // componentDidLoad only runs ONCE, after the instance's element has been
                // assigned as the host element, and AFTER render() has been called
                // we'll also fire this method off on the element, just to
                instance.componentDidLoad && instance.componentDidLoad();
            } catch (e) {
                plt.onError(DID_LOAD_ERROR, e, elm);
            }
            // add the css class that this element has officially hydrated
            elm.classList.add(HYDRATED_CSS);
            // ( •_•)
            // ( •_•)>⌐■-■
            // (⌐■_■)
            // load events fire from bottom to top, the deepest elements first then bubbles up
            // if this element did have an ancestor host element
            if (elm._ancestorHostElement) {
                // ok so this element already has a known ancestor host element
                // let's make sure we remove this element from its ancestor's
                // known list of child elements which are actively loading
                var ancestorsActivelyLoadingChildren = elm._ancestorHostElement._activelyLoadingChildren;
                var index = ancestorsActivelyLoadingChildren && ancestorsActivelyLoadingChildren.indexOf(elm);
                if (index > -1) {
                    // yup, this element is in the list of child elements to wait on
                    // remove it so we can work to get the length down to 0
                    ancestorsActivelyLoadingChildren.splice(index, 1);
                }
                // the ancestor's initLoad method will do the actual checks
                // to see if the ancestor is actually loaded or not
                // then let's call the ancestor's initLoad method if there's no length
                // (which actually ends up as this method again but for the ancestor)
                !ancestorsActivelyLoadingChildren.length && elm._ancestorHostElement._initLoad();
                // fuhgeddaboudit, no need to keep a reference after this element loaded
                delete elm._ancestorHostElement;
            }
        }
    }

    function createPlatformClient(Context, App, win, doc, publicPath) {
        var registry = { 'HTML': {} };
        var moduleImports = {};
        var moduleCallbacks = {};
        var loadedModules = {};
        var loadedStyles = {};
        var pendingModuleRequests = {};
        var controllerComponents = {};
        var domApi = createDomApi(doc);
        var now = getNowFunction(win);
        // initialize Core global object
        Context.dom = createDomControllerClient(win, now);
        Context.addListener = function addListener(elm, eventName, cb, opts) {
            return addEventListener(plt, elm, eventName, cb, opts && opts.capture, opts && opts.passive);
        };
        Context.enableListener = function enableListener(instance, eventName, enabled, attachTo) {
            enableEventListener(plt, instance, eventName, enabled, attachTo);
        };
        Context.emit = function emitEvent(elm, eventName, data) {
            elm && elm.dispatchEvent(new WindowCustomEvent(Context.eventNameFn ? Context.eventNameFn(eventName) : eventName, data));
        };
        Context.isClient = true;
        Context.isServer = false;
        // create the platform api which is used throughout common core code
        var plt = {
            registerComponents: registerComponents,
            defineComponent: defineComponent,
            getComponentMeta: getComponentMeta,
            propConnect: propConnect,
            getContextItem: getContextItem,
            loadBundle: loadBundle,
            queue: createQueueClient(Context.dom, now),
            connectHostElement: connectHostElement,
            emitEvent: Context.emit,
            getEventOptions: getEventOptions,
            onError: onError
        };
        // create the renderer that will be used
        plt.render = createRenderer(plt, domApi);
        // setup the root element which is the mighty <html> tag
        // the <html> has the final say of when the app has loaded
        var rootElm = domApi.$documentElement;
        rootElm._activelyLoadingChildren = [];
        rootElm._initLoad = function appLoadedCallback() {
            // this will fire when all components have finished loaded
            rootElm._hasLoaded = true;
        };
        // if the HTML was generated from SSR
        // then let's walk the tree and generate vnodes out of the data
        createVNodesFromSsr(domApi, rootElm);
        function getComponentMeta(elm) {
            // get component meta using the element
            // important that the registry has upper case tag names
            return registry[elm.tagName];
        }
        function connectHostElement(elm, slotMeta) {
            // set the "mode" property
            if (!elm.mode) {
                // looks like mode wasn't set as a property directly yet
                // first check if there's an attribute
                // next check the app's global
                elm.mode = domApi.$getAttribute(elm, 'mode') || Context.mode;
            }
            // host element has been connected to the DOM
            if (!domApi.$getAttribute(elm, SSR_VNODE_ID)) {
                // this host element was NOT created with SSR
                // let's pick out the inner content for slot projection
                assignHostContentSlots(domApi, elm, slotMeta);
            }
        }
        function registerComponents(components) {
            // this is the part that just registers the minimal amount of data
            // it's basically a map of the component tag name to its associated external bundles
            return (components || []).map(function (data) {
                return parseComponentRegistry(data, registry);
            });
        }
        function defineComponent(cmpMeta, HostElementConstructor) {
            // initialize the properties on the component module prototype
            initHostConstructor(plt, HostElementConstructor.prototype);
            // add which attributes should be observed
            var observedAttributes = [];
            // at this point the membersMeta only includes attributes which should
            // be observed, it does not include all props yet, so it's safe to
            // loop through all of the props (attrs) and observed them
            for (var propName in cmpMeta.membersMeta) {
                // initialize the actual attribute name used vs. the prop name
                // for example, "myProp" would be "my-prop" as an attribute
                // and these can be configured to be all lower case or dash case (default)
                if (cmpMeta.membersMeta[propName].attribName) {
                    observedAttributes.push(
                    // dynamically generate the attribute name from the prop name
                    // also add it to our array of attributes we need to observe
                    cmpMeta.membersMeta[propName].attribName);
                }
            }
            HostElementConstructor.observedAttributes = observedAttributes;
            // define the custom element
            win.customElements.define(cmpMeta.tagNameMeta.toLowerCase(), HostElementConstructor);
        }
        App.loadComponents = function loadComponents(moduleId, importFn) {
            var args = arguments;
            // import component function
            // inject globals
            importFn(moduleImports, h, t, Context, publicPath);
            for (var i = 2; i < args.length; i++) {
                // parse the external component data into internal component meta data
                // then add our set of prototype methods to the component module
                parseComponentMeta(registry, moduleImports, args[i]);
            }
            // fire off all the callbacks waiting on this module to load
            var callbacks = moduleCallbacks[moduleId];
            if (callbacks) {
                for (i = 0; i < callbacks.length; i++) {
                    callbacks[i]();
                }
                delete moduleCallbacks[moduleId];
            }
            // remember that we've already loaded this module
            loadedModules[moduleId] = true;
        };
        function loadBundle(cmpMeta, elm, cb) {
            var moduleId = cmpMeta.moduleId;
            if (loadedModules[moduleId]) {
                // sweet, we've already loaded this module
                cb();
            } else {
                // never seen this module before, let's start the request
                // and add it to the callbacks to fire when it has loaded
                if (moduleCallbacks[moduleId]) {
                    moduleCallbacks[moduleId].push(cb);
                } else {
                    moduleCallbacks[moduleId] = [cb];
                }
                // start the request for the component module
                requestModule(moduleId);
                // we also need to load the css file in the head
                // we've already figured out and set "mode" as a property to the element
                var styleId = cmpMeta.styleIds[elm.mode] || cmpMeta.styleIds.$;
                if (styleId && !loadedStyles[styleId]) {
                    // this style hasn't been added to the head yet
                    loadedStyles[styleId] = true;
                    // append this link element to the head, which starts the request for the file
                    var linkElm = domApi.$createElement('link');
                    linkElm.href = publicPath + styleId + '.css';
                    linkElm.rel = 'stylesheet';
                    // insert these styles after the last styles we've already inserted
                    // which could include the SSR styles, or the loader's hydrate css script's styles
                    var insertedStyles = domApi.$head.querySelectorAll('[data-styles]');
                    var insertBeforeRef = insertedStyles[insertedStyles.length - 1] || domApi.$head.firstChild;
                    if (insertBeforeRef) {
                        insertBeforeRef = insertBeforeRef.nextSibling;
                    }
                    domApi.$insertBefore(domApi.$head, linkElm, insertBeforeRef);
                }
            }
        }
        function requestModule(moduleId) {
            // create the url we'll be requesting
            var url = publicPath + moduleId + '.js';
            if (pendingModuleRequests[url]) {
                // we're already actively requesting this url
                // no need to do another request
                return;
            }
            // let's kick off the module request
            // remember that we're now actively requesting this url
            pendingModuleRequests[url] = true;
            // create a sript element to add to the document.head
            var scriptElm = domApi.$createElement('script');
            scriptElm.charset = 'utf-8';
            scriptElm.async = true;
            scriptElm.src = url;
            // create a fallback timeout if something goes wrong
            var tmrId = setTimeout(onScriptComplete, 120000);
            function onScriptComplete() {
                clearTimeout(tmrId);
                scriptElm.onerror = scriptElm.onload = null;
                domApi.$removeChild(scriptElm.parentNode, scriptElm);
                // remove from our list of active requests
                delete pendingModuleRequests[url];
            }
            // add script completed listener to this script element
            scriptElm.onerror = scriptElm.onload = onScriptComplete;
            // inject a script tag in the head
            // kick off the actual request
            domApi.$appendChild(domApi.$head, scriptElm);
        }
        var WindowCustomEvent = win.CustomEvent;
        if (typeof WindowCustomEvent !== 'function') {
            // CustomEvent polyfill
            WindowCustomEvent = function CustomEvent(event, data) {
                var evt = domApi.$createEvent();
                evt.initCustomEvent(event, data.bubbles, data.cancelable, data.detail);
                return evt;
            };
            WindowCustomEvent.prototype = win.Event.prototype;
        }
        // test if this browser supports event options or not
        var supportsEventOptions = false;
        try {
            win.addEventListener('eopt', null, Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsEventOptions = true;
                }
            }));
        } catch (e) {}
        function getEventOptions(useCapture, usePassive) {
            return supportsEventOptions ? {
                capture: !!useCapture,
                passive: !!usePassive
            } : !!useCapture;
        }
        function onError(type, err, elm) {
            console.error(type, err, elm.tagName);
        }
        function propConnect(ctrlTag) {
            var obj = {};
            proxyControllerProp(domApi, controllerComponents, obj, ctrlTag, 'create');
            return obj;
        }
        function getContextItem(contextKey) {
            return Context[contextKey];
        }
        return plt;
    }

    var App = window[appNamespace] = window[appNamespace] || {};
    var plt = createPlatformClient(Context, App, window, document, publicPath);
    plt.registerComponents(App.components).forEach(function (cmpMeta) {
        plt.defineComponent(cmpMeta, class HostElement extends HTMLElement {});
    });
})(window, document, Context, appNamespace, publicPath);
})({},"App","build/app/");