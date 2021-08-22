// 创建Router构造函数
function Router() {
    this.currentRoute = '';
    this.routes = {};
    this.init();
}

// 注册路由函数
Router.prototype.route = function(path, title = '单页面', callback) {

    // 根据type类型，选择相应的history api。  
    this.routes[path] = function(type) {
        if (type == 1) {
            history.pushState({
                path: path
            }, title, path);
        } else if (type == 2) {
            history.replaceState({
                path: path
            }, title, path);
        }
        callback();
    }
}

// 更新页面
Router.prototype.refresh = function(path, type) {
    this.routes[path](type);
}

// 初始化
Router.prototype.init = function() {

    var self = this;

    // 重新加载函数，这里使用的主机是http://localhost:8088/
    window.addEventListener('load', function() {
        self.currentRoute = location.href.slice(location.href.indexOf('/', 8));
        console.log(self.currentRoute);
        self.refresh(self.currentRoute);
    });

    // 当用户点击前进后退按钮时触发函数
    window.addEventListener('popstate', function() {
        console.log('history.state.path:', history.state.path);
        self.currentRoute = history.state.path;
        self.refresh(self.currentRoute, 2);
    }, false);

    // 对所有的link标签进行绑定事件
    var historyLinks = document.querySelectorAll('.history-link');
    for (var i = 0, len = historyLinks.length; i < len; i++) {
        historyLinks[i].onclick = function(e) {
            // 阻止默认
            e.preventDefault();
            self.currentRoute = e.target.getAttribute('href');
            self.refresh(self.currentRoute, 1);
        }
    }
}