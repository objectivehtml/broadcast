(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Broadcast = factory());
}(this, (function () { 'use strict';

var is = function (instance, proto) {
    return instance instanceof proto;
};

var isFunction = function (subject) {
    return subject !== null && typeof subject === "function";
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var BroadcastEvent = function () {
    function BroadcastEvent(key, callback) {
        classCallCheck(this, BroadcastEvent);

        this.key = key;
        this.allowMultipleEmits = true;

        if (isFunction(callback)) {
            this.handle = callback;
        }
    }

    createClass(BroadcastEvent, [{
        key: 'allowsMultipleEmits',
        value: function allowsMultipleEmits() {
            return !!this.allowMultipleEmits;
        }
    }, {
        key: 'once',
        value: function once() {
            this.allowMultipleEmits = false;

            return this;
        }
    }, {
        key: 'handle',
        value: function handle() {
            //
        }
    }]);
    return BroadcastEvent;
}();

var BroadcastReply = function () {
    function BroadcastReply(key, callback) {
        classCallCheck(this, BroadcastReply);

        this.key = key;
        this.allowMultipleRequests = false;

        if (typeof callback === "function") {
            this.handle = callback;
        }
    }

    createClass(BroadcastReply, [{
        key: "allowsMultipleRequests",
        value: function allowsMultipleRequests() {
            return !!this.allowMultipleRequests;
        }
    }, {
        key: "once",
        value: function once() {
            this.allowMultipleRequests = true;

            return this;
        }
    }, {
        key: "handle",
        value: function handle() {
            //
        }
    }]);
    return BroadcastReply;
}();

var Dispatcher = function () {
    function Dispatcher(channel) {
        classCallCheck(this, Dispatcher);

        this.channel = channel;
        this._events = [];
        this._replies = [];
    }

    createClass(Dispatcher, [{
        key: 'createEvent',
        value: function createEvent(key, callback) {
            return !is(key, BroadcastEvent) ? new BroadcastEvent(key, callback) : key;
        }
    }, {
        key: 'createReply',
        value: function createReply(key, callback) {
            return !is(key, BroadcastReply) ? new BroadcastReply(key, callback) : key;
        }
    }, {
        key: 'on',
        value: function on(key, callback) {
            var event = this.createEvent(key, callback);

            this._events.push(event);

            return event;
        }
    }, {
        key: 'once',
        value: function once(key, callback) {
            var event = this.createEvent(key, callback);

            this.on(event.once());

            return event;
        }
    }, {
        key: 'off',
        value: function off(key) {
            var removed = [];

            for (var i in this._events) {
                if (is(key, BroadcastEvent) && key == this._events[i] || key === this._events[i].key) {
                    removed.push(this._events[i]);
                    delete this._events[i];
                }
            }

            return removed;
        }
    }, {
        key: 'emit',
        value: function emit(event) {
            var args = [].slice.call(arguments).slice(1);

            for (var i in this._events) {
                if (this._events[i].key === (event.key || event)) {
                    this._events[i].handle.apply(this, args);

                    if (!this._events[i].allowsMultipleEmits()) {
                        delete this._events[i];
                    }
                }
            }
        }
    }, {
        key: 'request',
        value: function request(reply, context) {
            var args = [].slice.call(arguments).slice(1);

            if (!this._replies[reply.key || reply]) {
                throw new Error('No BroadcastReply exists by the name "' + (reply.key || reply) + '"!');
            }

            var handle = this._replies[reply.key || reply].handle;

            return new Promise(function (resolve, reject) {
                handle.apply(this, [resolve, reject].concat(args));
            });
        }
    }, {
        key: 'reply',
        value: function reply(key, callback) {
            var reply = this.createReply(key, callback);

            return this._replies[reply.key] = reply;
        }
    }, {
        key: 'stopReply',
        value: function stopReply(key) {
            delete this._replies[reply.key || reply];
        }
    }]);
    return Dispatcher;
}();

//import 'es6-promise/auto';
var BroadcastManager = function () {
    function BroadcastManager(channel) {
        classCallCheck(this, BroadcastManager);

        this._dispatchers = {};
        this.defaultChannel = 'app';
        this.dispatch(channel || this.defaultChannel);
    }

    createClass(BroadcastManager, [{
        key: 'dispatch',
        value: function dispatch(channel) {
            channel || (channel = this.defaultChannel);

            if (this.doesDispatchExist(channel)) {
                return this._dispatchers[channel];
            }

            return this.registerDispatch(new Dispatcher(channel));
        }
    }, {
        key: 'doesDispatchExist',
        value: function doesDispatchExist(instance) {
            return !!this._dispatchers[instance.channel || instance];
        }
    }, {
        key: 'registerDispatch',
        value: function registerDispatch(instance) {
            if (!is(instance, Dispatcher)) {
                throw new Error('The argument must be an instance of Broadcast/BroadcastDispatch!');
            }

            if (this.doesDispatchExist(instance.channel)) {
                throw new Error('There is already a Broadcast/BroadcastDispatch instance assigned to "' + instance.channel + '"!');
            }

            return this._dispatchers[instance.channel] = instance;
        }
    }, {
        key: 'unregisterDispatch',
        value: function unregisterDispatch(dispatch) {
            unset(this._dispatchers[dispatch.channel || dispatch]);
        }
    }]);
    return BroadcastManager;
}();

return BroadcastManager;

})));
//# sourceMappingURL=broadcast.js.map
