Pinnable
========

A package enabling models to be pinned (e.g. pinning a post to the top of a feed).

### Static Methods
**PinnableModel.makePinnable(model, typeAsString, options)** - Make a model pinnable

### Prototypal Methods
**Model.prototype.pin** - Pin the model
**Model.prototype.unpin** - Unpin the model
**Model.prototype.togglePinned** - Switch the pinned state (set to pinned if undefined)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ javascript
var Post = BaseModel.extendAndSetupCollection("posts");

PinnableModel.makePinnable(Post, "post");

var post = Post.collection.findOne();
post.pin();
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
