//import 'es6-promise/auto';
import is from './Helpers/Is.js';
import BroadcastDispatch from './BroadcastDispatch.js';

export default class BroadcastManager {

    constructor(channel) {
        this._dispatchers = {};
        this.defaultChannel = 'app';
        this.dispatch(channel || this.defaultChannel);
    }

    dispatch(channel) {
        channel || (channel = this.defaultChannel);

        if(this.doesDispatchExist(channel)) {
            return this._dispatchers[channel];
        }

        return this.registerDispatch(new BroadcastDispatch(channel));
    }

    doesDispatchExist(instance) {
        return !!this._dispatchers[instance.channel || instance];
    }

    registerDispatch(instance) {
        if(!is(instance, BroadcastDispatch)) {
            throw new Error('The argument must be an instance of Broadcast/BroadcastDispatch!');
        }

        if(this.doesDispatchExist(instance.channel)) {
            throw new Error('There is already a Broadcast/BroadcastDispatch instance assigned to "'+instance.channel+'"!');
        }

        return this._dispatchers[instance.channel] = instance;
    }

    unregisterDispatch(dispatch) {
        unset(this._dispatchers[dispatch.channel || dispatch]);
    }

}
