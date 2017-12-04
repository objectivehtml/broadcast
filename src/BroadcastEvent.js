import isFunction from '/Helpers/isFunction';

export default class BroadcastEvent {

    constructor(key, callback) {
        this.key = key;
        this.allowMultipleEmits = true;

        if(isFunction(callback)) {
            this.handle = callback;
        }
    }

    allowsMultipleEmits() {
        return !!this.allowMultipleEmits;
    }

    once() {
        this.allowMultipleEmits = false;

        return this;
    }

    handle() {
        //
    }

}
