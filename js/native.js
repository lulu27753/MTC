//这里是天下通webview公共js调native的js
;
(function(window, undefined) {
    window.App = {};
    /**
     * 常量定义
     */
    var ua = navigator.userAgent.toUpperCase(), callindex = 0;
    // 当前环境是否为Android平台
    App.IS_ANDROID = ua.indexOf('ANDROID') != -1;
    // 当前环境是否为IOS平台
    App.IS_IOS = ua.indexOf('IPHONE OS') != -1;
    App.IS_MOBILE = App.IS_ANDROID || App.IS_IOS;
    /**
     * 调用一个Native方法
     * 
     * @param {String}
     *            name 方法名称
     */
    App.call = function(name) {
        // return;
        // 获取传递给Native方法的参数
        var args = Array.prototype.slice.call(arguments, 1);
        var callback = '', item = null;
        callindex++;
        // 遍历参数
        for ( var i = 0, len = args.length; i < len; i++) {
            item = args[i];
            if (item === "undefined") {
                item = '';
            }

            // 如果参数是一个Function类型, 则将Function存储到window对象, 并将函数名传递给Native
            if (typeof (item) == 'function') {
                callback = name + 'Callback' + callindex;
                window[callback] = item;
                item = callback;
            }
            args[i] = item;
        }
        if (App.IS_ANDROID) {// Android平台
            // if(name=="setTitle"){
            // return;
            // }
            try {
                for ( var i = 0, len = args.length; i < len; i++) {
                    // args[i] = '"' + args[i] + '"';
                    args[i] = '\'' + args[i] + '\'';
                }
                eval('window.android.' + name + '(' + args.join(',') + ')');
            } catch (e) {
                console.log(e)
            }
        } else if (App.IS_IOS) {// IOS平台
            if (args.length) {
                args = '|' + args.join('|');
            }
            // IOS通过location.href调用Native方法, _call变量存储一个随机数确保每次调用时URL不一致

            location.href = '#ios:' + name + args + '|' + callindex;

            /*
             * var iframe = document.createElement("iframe"); iframe.src =
             * '#ios:' + name + args + '|' + callindex; iframe.style.display =
             * "none"; document.body.appendChild(iframe);
             * iframe.parentNode.removeChild(iframe); iframe= null;
             */
        }
    }

}(window));;
// 下面是以前的财酷调native,改造
(function() {
    var ua = navigator.userAgent.toLowerCase(), toString = Object.prototype.toString, slice = Array.prototype.slice;

    // 定义平台适配器============== start
    var adapter = window.adapter = {};
    adapter.android = ua.indexOf('android') != -1;
    adapter.ios = ua.indexOf('iphone os') != -1;
    adapter.ipad = ua.indexOf('ipad') != -1;
    adapter.mobile = adapter.android || adapter.ios || adapter.ipad;

    // 定义平台适配器============== end

    // 定义native接口 ============== start
    var lastShowLoadTime = 0;
    window.APP = {
        // @private
        // 公共引用的空函数
        _fn : function() {
        },
        /**
         * 页面初始化方法
         */
        init : function() {

        },
        // 返回按键
        // 当安卓设备点击物理返回键时调用
        onBack : function() {
            //
        },
        /**
         * 申请报销单
         */
        travelOrders : function() {
            APP.redirect('travel-orders.html', fCloud.TITLE.TRAVEL_ORDERS)
        },
        /**
         * 报销查询
         */
        travelQuery : function() {
            APP.redirect('myafr.html?new=1', fCloud.TITLE.MYAFR);
        },
        /**
         * 我的订单
         */
        myOrder : function() {
            APP.redirect('order.html', fCloud.TITLE.ORDER);
        },
        /**
         * 页面跳转
         * 
         * @param {String}
         *            url 跳转地址
         * @param {String}
         *            title 标题栏
         * @param {Number}
         *            type 跳转类型, 1 <, 2 >
         */
        redirect : function(url, title, type) {
            if (fCloud.PageMode == false) {

                var host = location.host;
                url = 'http://' + host + '/fcs/pamo/' + url;

                App.call('href', url);
            } else {
                location.href = url;
            }

        },
        /**
         * 跳转到主页
         * 
         * @param {Number}
         *            type 跳转类型, 1 <, 2 >
         */
        toIndex : function() {
            APP.redirect('index.html?from=back');
        },

        /**
         * 设置头部(如果之前头部被隐藏, 调用该方法后会自动显示)
         * 
         * @param {String}
         *            title 头部标题文字
         * @param {String}
         *            leftType 左侧按钮类型
         * @param {String}
         *            leftContent 左侧按钮值
         * @param {Function}
         *            leftCallback 左侧按钮回调函数
         * @param {String}
         *            rightType 右侧按钮类型（为空时表示没有右侧按钮）
         * @param {String}
         *            rightContent 右侧按钮值（为空时表示没有右侧按钮）
         * @param {Function}
         *            rightCallback 右侧按钮回调函数（为空时表示没有右侧按钮）
         * 
         * 类型： IMAGE BUTTON TEXT
         * 
         * 值（当类型为IMAGE时使用）： BACK MENU FILTER ADD
         * 
         */
        headerShow : function(title, leftType, leftContent, leftCallback, rightType, rightContent, rightCallback) {
            if (fCloud.PageMode == false) {// 表示运行在壳上,不要页面自己的抬头
                APP.setHomeTitle(0,[],0,function(){});
                fCloud.blur();
                // 显示抬头
                App.call('changeTitle', title);
                // 返回 的回调函数
                if (_.isFunction(leftCallback)) {
                    window.back = function() {
                        // 隐藏右边按钮
                        App.call('hideMenu');
                        leftCallback();
                    }
                    window.back = leftCallback;
                }
                // return;
                if (_.isFunction(rightCallback)) {
                    // 右边
                    // oldAlert('right')
                    App.call('showMenu', rightContent, rightCallback);
                } else {
                    // 隐藏右边按钮
                    App.call('hideMenu');
                }

                return;
            }
            // 下面是如果在浏览器上调试
            var navigat = $('#navigator'), back = navigat.find('.back'), other = navigat.find('.other')
            navigat.find('.title').text(title);
            if (_.isFunction(leftCallback)) {
                back.unbind('tap');
                back.on('tap', function(e) {
                    leftCallback()
                });
            }

            if (rightType === 'TEXT')
                navigat.find('.other').text(rightContent);
            // (rightType==='TEXT')&&navigat.find('.other').text(rightContent)
            if (_.isFunction(rightCallback)) {
                other.unbind('tap') // stz: 避免绑定两次而触发两次！
                if (rightContent.length >= 1) {
                    // 不显示空按钮，不指定事件
                    other.on('tap', function(e) {
                        rightCallback();
                    })
                }
            }
            if (_.isFunction(leftCallback)) {
                navigat.find('.back').text('返回');
                back.unbind('tap') // stz: 避免绑定两次而触发两次！

                // 不显示空按钮，不指定事件
                back.on('tap', function(e) {
                    console.log('leftcallback');
                    leftCallback();
                })

            }
            navigat.show();
        },
        /** 强制关闭加载动画 */
        loadForceFinish : function() {
            var self = this;
            setTimeout(function() {
                
                if (fCloud.ajaxSending !=0) {
                    return;
                }
                if (fCloud.PageMode) {
                    fCloud.lockScreen('hide');
                    $('#comLoadingPic').hide();
                } else {
                    App.call('hideLoading');
                    App.call('loadFinish');
                }
                self.loaded = true;
            }, 500);

        },
        /**
         * 显示加载动画
         */
        loadingBegin : function() {
            if (fCloud.ajaxSending++ != 0) {
                return;
            }
            if (fCloud.PageMode) {
                fCloud.lockScreen();
                $('#comLoadingPic').show();
            } else {
                App.call('showLoading');
            }

        },
        /**
         * 隐藏加载动画
         */
        loadingFinish : function() {
            var self = this;
            // 延迟取消掉加载框，不然安卓上，请求多了，加载框会一闪一闪
            setTimeout(function() {
                
                if (--fCloud.ajaxSending !=0) {
                    return;
                }

                if (self.loaded) {
                    if (fCloud.PageMode) {
                        fCloud.lockScreen('hide');
                        $('#comLoadingPic').hide();
                    } else {
                        App.call('hideLoading');
                        App.call('loadFinish');
                    }

                } else {
                    if (fCloud.PageMode) {
                        fCloud.lockScreen('hide');
                        $('#comLoadingPic').hide();
                    } else {
                        App.call('hideLoading');
                        App.call('loadFinish');
                    }
                    self.loaded = true;
                }
            }, 500);

        },
        /**
         * type是预定机票ydjp还是预定酒店ydjd backUrl从万里通页面的左上角返回的页面(保留跟壳联调完后在测试环境测试)
         */
        toWLT : function(type, backUrl,toUrl) {
            backUrl = 'backFromWLT.html';
            var url = "";
            var host = location.host;
            var serviceUrl = 'http://' + host + '/fcs/do/travel/GoToWLT';
            backUrl = 'http://' + host + '/fcs/pamo/' + backUrl;
            APP.getPasession(function(pasession) {
                if (pasession) {
                    // test start
                    var index;
                    if (adapter.ios) {
                        index = pasession.indexOf("PASESSION=");
                        pasession = pasession.substr(index + 10);
                    } else {
                        index = pasession.indexOf("=");
                        pasession = pasession.substr(index + 1);
                    }
                } 
                if (type === 'ydjp') {// 预定机票
                    url = serviceUrl + '?type=flight&appHomeUrl=' + backUrl +'&pasession='+pasession;
                } else if (type === "ydjd") {// 预定酒店
                    url = serviceUrl + '?type=hotel&appHomeUrl=' + backUrl +'&pasession='+pasession;
                } else if (type === "ckpc") {
                    url = 'http://' + host + '/fcs/do/trip/open/openFcsJumpCar/execute?source=1&appHomeUrl=' + backUrl;
                }else if (type == 'delayPolicy') { //跳转延误险理赔或者购买页面
                    if(toUrl.indexOf('?') != -1){
                        url = toUrl+'&pasession='+pasession;
                    }else{
                        url = toUrl+'?pasession='+pasession;
                    }
                } else {
                    console.log('error type:' + type);
                }
                // oldAlert('跳转万里通url:'+url);
                if (fCloud.PageMode == true) {
                    window.location.href = url;
                } else {
                    App.call('toWLT', url);
                }
            });

        },
        /**
         * 酒店预订
         */
        toHotel : function() {
            APP.toWLT('ydjd');
        },
        /**
         * 机票预订
         */
        toAirplane : function() {
            APP.toWLT('ydjp');
        },
        /**
         * 财酷拼车
         */
        toCarpool : function() {
            APP.toWLT('ckpc');
        },
        /**
         * 跳转到第三方地址
         */
        toURL : function(url, backurl, backTitle, cancelUrlName) {
            fCloud.data('back', {
                backurl : backurl,
                backTitle : backTitle
            });
            location.href = url;
        },

        toLogin : function() {
            // 以前是调壳，现在改为打印错误日志
            console.error('用户没登录');
        },

        getPhoto : function(callback) {
            if (fCloud.PageMode) {
                return;
            }
            App.call('getPhoto', function(result) {
                callback(result);
            });
        },
        getPasession : function(callback) {
            // oldAlert('getps');
            if (fCloud.PageMode) {
                // 这个参数没意义，方便commonjs里面判断是否存在pasession
                callback('nopasession');
                return;
            }
            //update by zyb  2014/10/21
            App.call("getPasession",function(pasession){
                if(pasession!=null&&pasession!=undefined){
                    callback(pasession);
                }
            });
        },
        getPhoneNumber : function(callback) {
            if (fCloud.PageMode) {
                callback(fCloud.getParam('phoneNumber'));
                return;
            }
            App.call('getPhoneNumber', function(phoneNumber) {
                callback(phoneNumber);
            });
        },
        // 返回native首页，工作台
        toNativeHome : function() {
            if (fCloud.PageMode) {
                return;
            }
            App.call('backToHome');
        },
        // 从万里通页面返回后，调用native通知把下面按钮去掉加上抬头
        WltGoCaiku : function() {
            if (fCloud.PageMode) {
                return;
            }
            App.call('WltGoCaiku');
        },
        openFCSMap : function(callback){
            if (fCloud.PageMode) {
                return;
            }
            App.call('openFCSMap',callback);
        },
        /**
         * 酒店定位
         *(String latitude,String longitude,String place,String city)
         */
        hotelLocation: function (latitude, longitude, place, city) {
            if (fCloud.PageMode) {
                return;
            }
            App.call('hotelLocation', latitude, longitude, place, city);
        },
        /**
         * 导航
         * (String latitude,String longitude,String place,String city)
         */
        toNavigation:function(latitude,longitude,place,city){
            if (fCloud.PageMode) {
                return;
            }
            App.call('toNavigation',latitude,longitude,place,city);
        },
        /**
         * 日程
         * (String date,String title,String event,String callback
         */
        toAgenda:function(sdata,edata,title,event,callback){
            if (fCloud.PageMode) {
                return;
            }
            App.call('toAgenda',sdata,edata,title,event,callback);
        },

        /**
         * 酷宝箱公司地址跳转百度地图
         */
        getAddressInfo:function(city,address,addressName){
            if (fCloud.PageMode) {
                return;
            }
            App.call('getAddressInfo',city,address,addressName);
        },
        /**
         * 打开浏览器
         */
        toAD : function(url){
            App.call('toAD',url);
        },
        /**
         * 设置头部筛选
         */
        setHomeTitle : function(type,title,index,callback){
            if (fCloud.PageMode) {
                callback(1);
                return;
            }
            App.call('setHomeTitle',type,title,index,callback);
        },
        /**
         *
         */
        getClientVersion : function(callback){
            if (fCloud.PageMode) {
                callback("2.1.4");
                return;
            }
            App.call('getClientVersion',callback);
        },
        /**
         *快乐打点
         */
        onEvent : function(evtDataId,evtDateLabel){
            if (fCloud.PageMode || adapter.android) {
                //android先不打点，
                return;
            }
            App.call('sendTalkingData',evtDataId,evtDateLabel);
        }
    }
    // 定义native接口 ============== end
})();