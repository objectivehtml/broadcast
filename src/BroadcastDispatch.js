import is from './Helpers/Is.js';
import BroadcastEvent from './BroadcastEvent.js';
import BroadcastReply from './BroadcastReply.js';

export default class Dispatcher {

    constructor(channel) {
        this.channel = channel;
        this._events = [];
        this._replies = [];
    }

    createEvent(key, callback) {
        return !is(key, BroadcastEvent) ? new BroadcastEvent(key, callback) : key;
    }

    hasEvent(key) {
        return !!this.getEvent(key);
    }

    getEvent(key) {
        return this._events[key] || null;
    }

    setEvent(key, value) {
        if(key instanceof BroadcastEvent) {
            value = key;
            key = value.key;
        }

        if(!value instanceof BroadcastEvent) {
            throw new Error('The value argument must be an instance of BroadcastEvent');
        }

        return this._events[key] = value;
    }

    getEvents() {
        return this._events;
    }

    on(key, callback) {
        const event = this.createEvent(key, callback);

        this._events.push(event);

        return event;
    }

    once(key, callback) {
        const event = this.createEvent(key, callback);

        this.on(event.once());

        return event;
    }

    off(key) {
        const removed = [];

        for(let i in this._events) {
            if(is(key, BroadcastEvent) && key == this._events[i] || key === this._events[i].key) {
                removed.push(this._events[i]);
                delete this._events[i];
            }
        }

        return removed;
    }

    emit(event) {
        const args = [].slice.call(arguments).slice(1);

        for(let i in this._events) {
            if(this._events[i].key === (event.key || event)) {
                this._events[i].handle.apply(this, args);

                if(!this._events[i].allowsMultipleEmits()) {
                    delete this._events[i];
                }
            }
        }
    }

    createReply(key, callback) {
        return !is(key, BroadcastReply) ? new BroadcastReply(key, callback) : key;
    }

    hasReply(key) {
        return !!this.getReply(key);
    }

    getReply(key) {
        return this._replies[key] || null;
    }

    setReply(key, value) {
        if(key instanceof BroadcastReply) {
            value = key;
            key = value.key;
        }

        if(!value instanceof BroadcastReply) {
            throw new Error('The value argument must be an instance of BroadcastReply');
        }

        return this._replies[key] = value;
    }

    getReplies() {
        return this._replies;
    }

    request(reply, context) {
        const args = [].slice.call(arguments).slice(1);

        if(!this._replies[reply.key || reply]) {
            throw new Error('No BroadcastReply exists by the name "'+(reply.key || reply)+'"!');
        }

        const handle = this._replies[reply.key || reply].handle;

        return new Promise(function(resolve, reject) {
            handle.apply(this, [resolve, reject].concat(args));
        });
    }

    reply(key, callback) {
        const reply = this.createReply(key, callback);

        return this._replies[reply.key] = reply;
    }

    stopReply(key) {
        delete this._replies[reply.key || reply];
    }

}
