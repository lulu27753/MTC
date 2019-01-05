$(document).ready(function(){
    //启程动画
    $(".rember").fadeIn(1000);
    $(".getAwaya").fadeIn(6000);
    $(".getAwayb").fadeIn(15000);
    $(".getAwayc").fadeIn(25000);

    //滑动翻页
    //document.addEventListener("touchmove",function(){
    var swiper = new Swiper('.swiper-container', {
        direction: 'vertical',/*
        slidesPerView: 1,
        loopedSlides :8,
         spaceBetween: 30,图片之间的空白间隙*/
        mousewheel: true,
        lazyLoading: true,
        preloadImages: false,
        observer:true,//修改swiper自己或子元素，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        onTouchStart : function() {//触控滑块时执行代码
            $('.character .card').removeClass('rotate');
        },
        onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
            swiperAnimateCache(swiper); //隐藏动画元素
            swiperAnimate(swiper); //初始化完成开始动画
        },
        onSlideChangeEnd: function(swiper){
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
            //alert(swiper.activeIndex);//当前页面的下标
            $('.timer').each(count);// 开始所有的计时器
            $('.character .card').addClass("rotate");// 开始所有的计时器
        }
    });
        //go到下一页
        $(".go").click(function(){
            swiper.slideNext();
    });
        
     //从url获取参数
    function GetQueryString(name){
    	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }   
        
    var Dao = {
    		getController: function() {
    			return $.ajax({
    				url: '/mobile/report/life/controllerTest.do',
    				//url: './mock/allDatas.json',
    				type: 'GET',
    				dataType: 'JSON'
    			})
    		}
    };
    
    
    //请求数据
    Dao.getController().done(function(data) {
    //App.call("getAD",function(res1){
     var loginUm = GetQueryString("um");
     var loginUmCode = Base64.encode(loginUm);
     // if(data.Controller=='TRUE'){
     $.ajax({
        // url:"/mobile/report/life/summaryAnnualWork.do",
         url:"http://localhost:63342/summaryAnnualWork/js/seat.json",
        data: {"um": loginUmCode,"method":"summary"},
        type: 'GET',
        dataType: 'JSON',
        success:function(n){
        	if(n.allData.length==0){
        		$(".swiper-wrapper").hide();
            	$("<div class='addPage font18pt'>抱歉，您不符合角色要求无法浏览！</div>").appendTo("#container");
        	}else{
        		var data=n.allData[0];
                if(data.DISTRIBUTEDCITY.length>15){
                	$(".cityValue").text(data.DISTRIBUTEDCITY.slice(0,15)+"...等");//城市
                }else{
                	$(".cityValue").text(data.DISTRIBUTEDCITY);//城市
                };
                $(".leaderName").text(data.LEADERNAME);//领导名称
                $(".jobMarket").text(data.JOBMARKET);//职场
                $(".strongTeam").text(data.LEADERTEAM);//团队伙伴
                $(".percentage").attr('data-to',data.COMMISSIONRATE);//佣金百分比
                $(".commissionSummaryValue").text(conversionDate(data.MAXCOMMISSIONTIME));//最高佣金日期
                $(".joinTimeValue").text(conversionDate(data.JOINTIME));//加入时间
                $(".totalDays").text(entryDays(data.JOINTIME));//加入天数
                $(".customerServices").attr('data-to',data.CUSTOMERSERVICES);//服务客户数
                $(".customerMans").attr('data-to',data.CUSTOMERMANS);//男性比例
                $(".customerWomens").attr('data-to',data.CUSTOMERWOMENS);//女性比例
                $(".maxCallLength").attr('data-to',data.MAXCALLLENGTH);//最高通话时间
                $(".talkTotalTime").attr('data-to',data.TALKTOTALTIME);//总时长
                $(".numOfCalls").attr('data-to',data.NUMOFCALLS);//拨打次数
                $(".messageSend").attr('data-to',data.MESSAGESEND);//发送聊天记录
                $(".receiveMessage").attr('data-to',data.RECEIVEMESSAGE);//接收聊天记录
                $(".wechatFriend").attr('data-to',data.WECHATFRIEND);//微信好友
                $(".leaderTeam").attr('data-to',data.LEADERTEAM);//团队伙伴
                $(".steadyPeople").attr('data-to',data.STEADYPEOPLE);//稳定战友
                $(".maxCommission").attr('data-to',data.MAXCOMMISSION);//历史佣金最高记录
                $(".charType").text(data.CHARACTER);//性格特征
                draw((data.DISTRIBUTEDCITY).split(","));
                
                if(data.ROLE=="团队长"){
                    $(".leadersss").show().siblings().hide();
                    texts();
                }else if(data.ROLE=="坐席"){
                    $(".seatss").show().siblings().hide();
                    $(".seatResult").show().siblings().hide();
                    $(".seatCommission").show().siblings().hide();
                    $(".seatWechat").show().siblings().hide();
                    $(".seatMove").show().siblings().hide();
                    $(".seatService").show().siblings().hide();
                }else if(data.ROLE=="部经理"){
                    $(".manager").show().siblings().hide();
                    texts();
                }
        	}
            
        }
     });
     // }
  //});
     });




    function  texts(){
        $(".managerResult").show().siblings().hide();
        $(".captainCommission").show().siblings().hide();
        $(".managerWechat").show().siblings().hide();
        $(".managerMove").show().siblings().hide();
        $(".managerService").show().siblings().hide();
    }

    //地图
    var data =[
       {
            "name": "北京",
            "left": " 72.07407407407408%",
            "top": "24.034188034188034%"
        },
        {
            "name": "上海",
            "left": "82.12698412698413%",
            "top": "53.111111111111114%"
        },
        {
            "name": "四川",
            "left": "46.733686067019406%",
            "top": "56.8119658119658%"
        },
       {
            "name": "广东",
            "left": "70.4867724867725%",
            "top": "73.97435897435898%"
        },
        {
            "name": "江西",
            "left": "69.89594356261023%",
            "top": "59.51282051282051%"
        },
        {
            "name": "福建",
            "left": "75.36507936507937%",
            "top": "65.64102564102564%"
        },
        {
            "name": "海口",
            "left": "59.78483245149911%",
            "top": "83.51282051282051%"
        },
        {
            "name": "广西",
            "left": "55.19929453262787%",
            "top": "70.96581196581197%"
        },
        {
            "name": "贵州",
            "left": "53.0246913580247%",
            "top": "62.70940170940172%"
        },
        {
            "name": "重庆",
            "left": "51.96649029982363%",
            "top": "54.80341880341881%"
        },
        {
            "name": "陕西",
            "left": "54.904761904761905%",
            "top": "49.1965811965812%"
        },
        {
            "name": "山西",
            "left": "64.25396825396825%",
            "top": "37.085470085470085%"
        },
        {
            "name": "宁夏",
            "left": "50.613756613756614%",
            "top": "37.94871794871795%"
        },
        {
            "name": "内蒙古",
            "left": "53.60846560846561%",
            "top": "30.39316239316239%"
        },
       {
            "name": "甘肃",
            "left": "39.682539682539684%",
            "top": "34.88888888888889%"
        },
        {
            "name": "青海",
            "left": "33.795414462081126%",
            "top": "40.78632478632478%"
        },
        {
            "name": "西藏",
            "left": "22.807760141093475%",
            "top": "49.8119658119658%"
        },
        {
            "name": "新疆",
            "left": "20.220458553791886%",
            "top": "23.923076923076923%"
        },
        {
            "name": "湖南",
            "left": "60.54673721340387%",
            "top": "62.58119658119658%"
        },
        {
            "name": "湖北",
            "left": "61.13403880070547%",
            "top": "54.95726495726495%"
        },
        {
            "name": "安徽",
            "left": "72.3068783068783%",
            "top": "50.89743589743589%"
        },
        {
            "name": "浙江",
            "left": "79.06878306878306%",
            "top": "59.3076923076923%"
        },
        {
            "name": "江苏",
            "left": "79.8941798941799%",
            "top": "54.27350427350427%"
        },
        {
            "name": "河南",
            "left": "63.72310405643739%",
            "top": "46.059829059829056%"
        },
        {
            "name": "山东",
            "left": "74.71957671957672%",
            "top": "35.07692307692308%"
        },
        {
            "name": "河北",
            "left": "69.95767195767195%",
            "top": "31.01709401709402%"
        },
        {
            "name": "天津",
            "left": "82.3668430335097%",
            "top": "25.38461538461539%"
        },
        {
            "name": "辽宁",
            "left": "82.3615520282187%",
            "top": "20.196581196581196%"
        },
        {
            "name": "黑龙江",
            "left": "83.88888888888889%",
            "top": "1.871794871794872%"
        },
        {
            "name": "吉林",
            "left": "87.47795414462081%",
            "top": "12.786324786324787%"
        },
        {
            "name": "云南",
            "left": "41.79" +
            "717813051146%",
            "top": "71.19658119658119%"
        }
    ];
    
    $('.resultMap .city').each(function (i,n) {
        data.push({
            name : $(n).attr('title'),
            left : $(n).position().left/$(n).parent().width()*100 + '%',
            top : $(n).position().top/$(n).parent().height()*100 + '%'
        });
    });
    function draw(cities) {
        $('.resultMap').empty();
        var list = [];
        if(!cities){
            list = data;
        }else{
            (cities || []).forEach(function (v) {
                (data || []).forEach(function (x) {
                    if(v == x.name){
                        list.push(x);
                    }
                });
            });
        }
        list.forEach(function (v) {/*
            var tpl = '<div title="'+v.name+'" class="city" style=" top:'+v.top+'; left:'+v.left+';">'+v.name+'</div>';*/
            var tpl = '<div class="nav" style=" top:'+v.top+'; left:'+v.left+';position:absolute;"><span style="position: absolute;z-index: 5;bottom:20px;font-size: 1rem;">'+v.name+'</span><b style="width: 6px;height: 6px;background: #fff;border-radius: 100%;display: inline-block;position: absolute;bottom: 28%;left: 25%;z-index: 5;"></b></div>';
            $('.resultMap').append(tpl);
        });
    }
    window.draw = draw;

    //转换时间
    function conversionDate(time) {
       var time=parseInt(time);
        var date=new Date(time);
        var year=date.getFullYear();
        var months=date.getMonth()+1;
        var days=date.getDate();
        return year+"年"+months+"月"+days+"日";
    }

    //入职天数
    function entryDays(jionday) {
        var todays=new Date().getTime();
        var otherday=new Date(+jionday).getTime();
       return parseInt((todays-otherday)/1000/60/60/24);
    }
});

