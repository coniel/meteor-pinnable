Pinnable = {};

var pinnableMethods = {
    togglePinned: function() {
        var pinned = true;
        if (typeof this.pinned !== 'undefined') {
            pinned = !this.pinned;
        }
        return this._meteorMethods.setPinned.callPromise({_id: this._id, pinned: pinned});
    },
    pin: function() {
        return this._meteorMethods.setPinned.callPromise({_id: this._id, pinned: true});
    },
    unpin: function() {
        return this._meteorMethods.setPinned.callPromise({_id: this._id, pinned: false});
    }
};

Pinnable.makePinnable = function(model, options) {

    options = options || {};

    _.extend(model.prototype, pinnableMethods);
    model.appendSchema({
        "pinned":{
            type: Boolean,
            autoValue: function() {
                if (this.isInsert) {
                    return false;
                }
            },
            optional: true
        }
    });

    model._meteorMethods.setPinned = new ValidatedMethod({
        name: model._objectType + '.setPinned',
        mixins: [CallPromiseMixin, LoggedInMixin],
        validate: model.getSubSchema(["_id", "pinned"], null, true),
        checkLoggedInError: {
            error: 'notLogged',
            message: 'You need to be logged in to call this method',//Optional
            reason: 'You need to login' //Optional
        },
        run({_id, pinned}) {
            var video = model.collection.findOne({_id: _id});

            // Get the parent object
            var parent;
            if (typeof object.linkedObject === 'function') {
                parent = object.linkedObject();
            }

            var checkOnType = object.linkedObjectType;
            var checkOnId = parent._id;

            if (parent.linkedObjectType && parent.linkedObjectId) {
                if (!SortableModel.options[checkOnType] || (SortableModel.options[checkOnType] && !!SortableModel.options[checkOnType].authorizeOnGrandParent)) {
                    // If the linked object has a prent, validate against the parent
                    checkOnType = parent.linkedObjectType;
                    checkOnId = parent.linkedObjectId;
                }
            }


            var checkType = 'video';

            if (options.checkType) {
                if (options.checkType === 'composite') {
                    checkType = checkOnType + "Video";
                } else {
                    checkType = video[options.checkType];
                }
            }

            if (Can.createIn(checkType, video, checkOnType, checkOnId)) {
                console.log(_id);
                model.collection.update({_id: _id}, {$set: {pinned: pinned}}, (error, result) => {
                    console.log(error);
                });
            }
        }
    });
};

Can.addPermissionType("pin");