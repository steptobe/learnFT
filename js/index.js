// 订阅
function Publisher(){
    this.subs = [];
}
Publisher.prototype = {
    constructor: Publisher,
    add: function(sub){
        this.subs.push(sub);
        console.log('订阅者：',this.subs)
    },
    notify: function(){
        this.subs.forEach(function(sub){
           
            sub.update();
        });
        console.log('订阅者：',this.subs)
    }
};
// 发布
function Subscriber(node, vm, name){
    Publisher.global = this;
    this.node = node;
    this.vm = vm;
    this.name = name;
    this.update();
    Publisher.global = null; // 清空
}
Subscriber.prototype = {
    constructor: Subscriber,
    update: function(){
        let vm = this.vm;
        let node = this.node;
        let name = this.name;
        switch(this.node.nodeType){
            case 1:
                node.value = vm[name];
                console.log(this.node.nodeType,node.value)
                break;
            case 3:
                node.nodeValue = vm[name];
                break;
            default:
                break;
        }
    }
};
// 虚拟Dom
function virtualDom(node, data){
    let frag = document.createDocumentFragment(); // createdocumentfragment()方法创建了一虚拟的节点对象，节点对象包含所有属性和方法。当你想提取文档的一部分，改变，增加，或删除某些内容及插入到文档末尾可以使用createDocumentFragment() 方法。
    let child;
    // 遍历dom节点
    while(child = node.firstChild){
        console.log('标签：',child)
        compile(child, data);// 编译
        frag.appendChild(child);
    }
    
    return frag;
}
// 编译规则
function compile(node, data){
    let reg = /\{\{(.*)\}\}/g;
    if(node.nodeType === 1){ // 标签
        let attr = node.attributes;
        for(let i = 0, len = attr.length; i < len; i++){
            
            if(attr[i].nodeName === 'v-model'){
                let name = attr[i].nodeValue;
                // node.value = data[name];

                // ------------------------添加监听事件
                node.addEventListener('keyup', function(e){
                    data[name] = e.target.value;
                    console.log(attr[i].nodeName, e.target.value);
                }, false);

                new Subscriber(node, data, name);//订阅

            }
        }
        if(node.hasChildNodes()){
            node.childNodes.forEach((item) => {
                compile(item, data);
            });
        }
    }
    if(node.nodeType === 3){ // 文本节点
        if(reg.test(node.nodeValue)){
            let name = RegExp.$1;
            name = name.trim();
            // node.nodeValue = data[name];

            new Subscriber(node, data, name);
        }
    }
}

// 双向绑定
function defineReact(data, key, value){
    let publisher = new Publisher();
    Object.defineProperty(data, key, {
        set: function(newValue){
            console.log(`触发setter`);
            value = newValue;
            console.log(value);
            publisher.notify(); // 发布订阅
        },
        get: function(){
            console.log(`触发getter:`,value);
            if(Publisher.global){
                publisher.add(Publisher.global); // 添加订阅者
            }
            return value;
        }
    });
}


// 将data中数据绑定到vm实例对象上
function observe(data, vm){
    Object.keys(data).forEach((key) => {
        defineReact(vm, key, data[key]);
    })
}


function Vue(options){
    this.data = options.data;
    let id = options.el;

    observe(this.data, this); // 将每个data属相绑定到Vue的实例vm上

    //------------------------
    let container = document.getElementById(id);
    let fragment = virtualDom(container, this); // 这里通过vm对象初始化
    
    container.appendChild(fragment);
    console.log('虚拟dom：',container)

}


var vm = new Vue({
    el: 'container',
    data: {
        msg: 'Hello world!',
        inpText: 'Input text'
    }
});