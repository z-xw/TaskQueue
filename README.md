# TaskQueue
一个制定JS的任务队列的库，并支持异步事件加入，并可为此施加职责

### 初始化
var list1 = TaskQueue('keywords')


### API
+ list1.createAndAdd(fn)
创建职责节点并加入队列  返回值为刚加入的职责链节点
传入的回调必须返回符合 创建任务队列时传入的关键词 它执行完当前任务才会往下个任务执行，这也是本库的特点所在，可以定制条件决定是否往接下来的任务继续执行;但仅支持同步回调，异步回调需手动执行list1.transferNextFn(chain);



+ list1.removeFn(chian)
传入要删除的职责链节点 从任务队列中移除该节点

+ list1.actions() 执行队列任务 可传入chain来决定从哪个节点开始

+ list1.transferNextFn(chain) 手动执行该任务对应下个任务 如何使用 请参考demo 这一块的使用有些坑后续会陆续优化


  

### 使用:

var list1 = TaskQueue('next'); //键入关键词 

``` 
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
    getJSON1.ajaxFn.call(this, obj, getJSON1.callback, fn2)

});
list1.removeFn(fn2)
fn3 = list1.createAndAdd(function() {
    var obj = {};
    getJSON2.ajaxFn.call(this, obj, getJSON2.callback, fn3)


});
list1.createAndAdd(function() {
    console.log(5)
    return 'next'
});
list1.createAndAdd(function() {
    console.log(6)

});


list1.action();
```
