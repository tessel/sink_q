var Queue = function (queueReady) {
  var queue = [];
  var queueReady = queueReady | false;
  var self = this;

  this.push = function (fn, callback) {
    queue.push({fn:fn, callback:callback});

    if (queueReady) {
      pop();
    };
  };

  // called on 'ready' to fire events stored before camera is ready
  this.ready = function () {
    unlockQueue();
    pop();
  }

  var pop = function () {
    if (queue.length == 0) {
      return;
    }
    lockQueue();
    var obj = queue.shift();
    var fn = obj.fn;
    var callback = obj.callback;
    if (callback == undefined) {
      callback = function() {};
    }
    fn(decorateCallback(callback, self.ready)); // Call Ready
  };

  var unlockQueue = function () {
    queueReady = true;
  }

  var lockQueue = function () {
    queueReady = false;
  }
}

function decorateCallback (callback, decorator) {
  return function () {
    callback.apply(callback, arguments);
    decorator();
  }
}

module.exports = Queue;