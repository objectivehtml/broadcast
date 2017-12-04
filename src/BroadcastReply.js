export default class BroadcastReply {

    constructor(key, callback) {
        this.key = key;
        this.allowMultipleRequests = false;

        if(typeof callback === "function") {
            this.handle = callback;
        }
    }

    allowsMultipleRequests() {
        return !!this.allowMultipleRequests;
    }

    once() {
        this.allowMultipleRequests = true;

        return this;
    }

    handle() {
        //
    }

}
