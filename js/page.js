$(function(){
    /**
     * 返回顶部
     */
    $(".back-bar .back-top").click(function(){
        $('html,body').animate({'scrollTop':0},500); //返回顶部动画 数值越小时间越短
    });

//    var width = $("#container").width();//计算当前窗口的宽度
//    $("#container .bottom-nav,#container #header").width(width);//将底部导航的宽度设置与移动设备相同
//    $("#container .bottom-nav,#container #header").css("display","block");

    //用户变化屏幕方向时调用
    $(window).bind( 'orientationchange resize', function(e){
        width = $("#container").width();//计算当前窗口的宽度
//        $("#container .bottom-nav,#container #header").width(width);//将底部导航的宽度设置与移动设备相同
    });
});

/**
 * 单选复选框调用样式的方法
 */
function myCheck(){
	$("input.my-icheckbox,input.my-iradio").iCheck({
        checkboxClass:"icheckbox_minimal-blue",//颜色主题需要与引入的css保持一致
        radioClass:"iradio_minimal-blue",//颜色主题需要与引入的css保持一致
        cursor:true
    });
}

/**
 * 普通ajax样式
 */
function getAjaxOption(data,url,success,is_show){
	var is_show = is_show == undefined ? true : is_show;
	var ajaxOption = {
			async:true,
			type : 'post',
			data:data,
			url:url,
		    dataType : 'json',
		    success:success,
		    error:errorResponse
		}
	if(is_show == true){

		var hideOption = {
			beforeSend: function(){
            	showDialog("#loadingDialog");//显示“加载中。。。”
		    },
		    complete:function(){
		    	hideDialog("#loadingDialog");//隐藏“加载中。。。”
		    }
		}
		$.extend(true,ajaxOption,hideOption);
	}
	$.ajax(ajaxOption);
}

/**
 * 封装下拉显示
 */
function getPageOption(selector,option){
//	selector.text("下拉加载更多");
	selector.after('<div id="get-more-img"></div>');
	pageOption = {
			active:true,
			page_size:10,
			page_num:0,
			selector:selector,
			selector_img:$("#get-more-img"),
	}
	scrollForm = {
			async:true,
			type : 'post',
		    dataType : 'json',
		    beforeSend: function(){
		    	pageOption.selector.hide();
		    	pageOption.selector_img.show();
		    	pageOption.active = false;
		    },
		    complete:function(){
		    	pageOption.selector_img.hide();
		    	pageOption.selector.show();
		    	get_more_top = pageOption.selector.offset().top;
		    },
		    error:function(){
		    	pageOption.selector.html("很抱歉，网络异常");
		    }
	}
	$.extend(true,pageOption,option);
}

/**
 * 判断是否滚动到底
 */
function isPageScroll(callBack){
	$(window).scroll(function(){
		if(pageOption.active == true){
			var scroll_top = $(window).height() + $(window).scrollTop();
			if(scroll_top > get_more_top){
				callBack();
			}else{
				return false;
			}
		}else{
			return false;
		}
	})
}

/**
 * 滚动操作
 * @param json
 * @param html
 */
function operateScroll(json,html){
	if(json.errorCode == 0){
		pageOption.selector.before(html)
		if(json.data.length < pageOption.page_size){//判断数据是否加载完
			if(pageOption.page_num > 0){
				pageOption.selector.text("别扯了，就这么多了");
			}else{
				pageOption.selector.text('');
			}
 	    }else{
 		   pageOption.page_num += 1;
 		   pageOption.active = true;
 		   pageOption.selector.text("下拉加载更多");
 	    }
	}else{
		if(json.data == '' || json.data == null){
			if(pageOption.page_num > 0){
				pageOption.selector.html("别扯了，就这么多了");
			}else{
				pageOption.selector.html("对不起，还没有数据哦")
			}
		}else{
			pageOption.selector.html("很抱歉，操作失败，发生异常");
		}
	}
}

//滚动到指定位置
function scrollToPosition(scrollTop,time){
    if(!scrollTop){
        scrollTop = 0;
    }
    if(!time){
        time = 500;//毫秒
    }
    $('html,body').animate({'scrollTop':scrollTop+"px"},time); //滚动到指定位置的动画 数值越小时间越短
}
