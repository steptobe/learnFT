var wrap = document.querySelector('.router-wrap');

// 实例化Router
window.Router = new Router();


// 注册路由，实现相应功能

Router.route('/', function() {
    wrap.style.backgroundColor = '#efefef'
});

Router.route('/black', '黑色', function() {
    wrap.style.backgroundColor = 'black';
});

Router.route('/green', '绿色', function() {
    wrap.style.backgroundColor = 'green';
});

Router.route('/red', '色', function() {
    wrap.style.backgroundColor = 'red';
});