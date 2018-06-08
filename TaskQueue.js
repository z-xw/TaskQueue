var TaskQueue = function(keywords) {
    var _slice = Array.prototype.slice,
        _push = Array.prototype.push,
        _shift = Array.prototype.shift,
        _each = function(arr, fn) {
            for (var i = 0, item; item = arr[i]; i++) {
                fn(item, i, arr);
            }
        },
        _remove = function(arr, obj) {
            _each(arr, function(item, i) {
                if (item === obj) return arr.splice(i, 1);
            })
        };
    var MacroCommand = function() {
            this.commandList = [];
        }
        //ajax必须通过回调
        //

    MacroCommand.prototype.add = function(chain) {
        //添加要加入队列的工作
        this.commandList.push(chain);
        return chain


    }
    MacroCommand.prototype.remove = function(chain) {
        return _remove(this.commandList, chain);
    }
    MacroCommand.prototype.execute = function(chain) {
        var that = this;
        var fun;
        var first = this.commandList[0];
        // fn1.setNextFn(fn2).setNextFn(fn3).setNextFn(fn4).setNextFn(fn5).setNextFn(fn6);
        // fn1.passRequest()
        _each(this.commandList, function(item, i, arr) {
            if (i === 0) fun = item;
            fun = fun.setNextFn(that.commandList[++i]);
        })
        if (chain && typeof chain.passRequest === 'function') fn();
        else first.passRequest();

    }

    var marcoCommand = new MacroCommand();


    var Chain = function(fn) {
        this.fn = fn;
        this.succFnObj = null;
    }
    Chain.prototype.setNextFn = function(succFnObj) {
        return this.succFnObj = succFnObj;

    }
    Chain.prototype.transferSuccFn = function() {
        this.succFnObj.passRequest.apply(this.succFnObj, arguments);
    }
    Chain.prototype.passRequest = function() {
        var self = this;
        var ret = this.fn.apply(self, arguments);
        if ((typeof keywords === 'undefined') || (ret === keywords))
            return this.succFnObj && this.succFnObj.passRequest.apply(this.succFnObj, arguments);
        return ret;
    }


    var marcoCommand = new MacroCommand();

    return {

        createChain: function(fn) {
            return new Chain(fn)
        },
        addToQueue: function(chain) {
            marcoCommand.add(chain);
        },
        createAndAdd: function(fn) {
            return marcoCommand.add(new Chain(fn))
        },
        transferNextFn: function(chain) {
            chain.transferSuccFn();
        },
        removeFn: function(chain) {
            marcoCommand.remove(chain)
        },
        action: function() {
            marcoCommand.execute();
        }
    }

}

var getJSON1 = {
    ajaxFn: function(obj, cb, chain) {

        $.getJSON('json1.json', obj, function(data) {
            cb && cb(data, chain)
        })
    },
    callback: function(data, chain) {
        console.log('hah')
        list1.transferNextFn(chain);
    }
}
var getJSON2 = {
    ajaxFn: function(obj, cb, chain) {
        var args = arguments;

        $.getJSON('json2.json', obj, function(data) {
            cb && cb(data, chain)
        })
    },
    callback: function(data, chain) {
        console.log('xix')
        list1.transferNextFn(chain);
    }
}


var list1 = TaskQueue('next');

list1.createAndAdd(function() {
    console.log(1)
    return 'next'
});

list1.createAndAdd(fn = function() {
    console.log(2)
    return 'next'
});


list1.createAndAdd(function() {
    console.log(3)
    return 'next'
});
fn2 = list1.createAndAdd(function() {
    var obj = {};
    getJSON1.ajaxFn(obj, getJSON1.callback, fn2)

});

//removeFn(fn2) 从任务队列中传入fn2 找到并删除它
list1.removeFn(fn2)

fn3 = list1.createAndAdd(function() {
    var obj = {};

    getJSON2.ajaxFn(obj, getJSON2.callback, fn3)


});
list1.createAndAdd(function() {
    console.log(5)
    return 'next'
});
list1.createAndAdd(function() {
    console.log(6)

});


list1.action();

// fn1.setNextFn(fn2).setNextFn(fn3).setNextFn(fn4).setNextFn(fn5).setNextFn(fn6);
// fn1.passRequest()