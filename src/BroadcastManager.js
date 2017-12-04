import 'es6-promise/auto';
import is from './Helpers/Is';
import BroadcastDispatch from './BroadcastDispatch';

export default class BroadcastManager {

    constructor() {
        this._dispatchers = {};
    }

    dispatch(channel) {
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
