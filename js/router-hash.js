 // 创建Router构造函数
 // currentHash为当前hash值，routes为路径对象
 function Router() {
     this.currentHash = '/';
     this.routes = {};
 }

 // 注册路径，每个路径对应一个回调函数。 
 Router.prototype.route = function(path, callback) {
     this.routes[path] = callback || function() {
         alert('未定义回调函数！');
     }
 }

 // 更新页面函数
 Router.prototype.refresh = function() {
     this.currentHash = location.hash.slice(1) || '/';
     console.log('页面', location.hash.slice(1))
     this.routes[this.currentHash]();
 }

 // 初始化
 Router.prototype.init = function() {
     var self = this;
     window.addEventListener('load', function() {
         self.refresh();
     }, false);

     window.addEventListener('hashchange', function() {
         self.refresh();
         console.log('hash切换')
     });
 }

 var wrap = document.querySelector('.router-wrap');

 window.Router = new Router();
 Router.route('/', function() {
     wrap.style.backgroundColor = '#fefefe';
 });

 Router.route('/black', function() {
     wrap.style.backgroundColor = 'black';
     var p = document.createElement('P');
     var text = document.createTextNode('hhahah');
     p.appendChild(text);
     wrap.appendChild(p);
 });

 Router.route('/green', function() {
     wrap.style.backgroundColor = 'green';
     wrap.style.color = 'yellow';
 });

 Router.route('/red', function() {
     wrap.style.backgroundColor = 'red';
 });

 Router.init();