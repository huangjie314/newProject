/**
 * 练习详情界面js
 * @author lynn
 * @since 2016-07-26
 */

$(function(){
    /**
     * 初始化
     */
    function init(){
    	/*getPageOption($("#get-more"),{});*/
    	isPageScroll(function(){render(0)});
        bindEvent();
        render(1);
    }

    /**
     * 绑定事件
     */
    function bindEvent(){
    	//点击头部
    	$(".head-nav .head-item").click(function(){
    		var _this = $(this);
    		_this.siblings('.active').removeClass("active");
    		_this.addClass("active");
    		render(1);
    	})

    	//删除（假删）
    	$("#container .content-wrap").on("click",".delete-btn",function(){
    		var _this = $(this);
    		var id = _this.parents('.order-list-wrap').attr("data-id");
    		var url = "./index.php?c=dining&a=deleteOrder";
	    	var data = {id:id};
	    	showConfirmDialog("#dangerConfirmDialog",'确定要删除吗？','确认删除后该订单将永久删除','',3000,function(){
		    	getAjaxOption(data,url,function(result){
		    		if(result.errorCode == 0){//成功
		    			_this.parents(".order-list-wrap").remove();
		    		}else{
		    			showDialog("#errorDialog","删除失败!",result.errorInfo);
		    		}
		    	});
	    	});
    	});

    	//改变订单状态
    	$("#container .content-wrap").on("click",".refuse-btn.active",function(){
    		var _this = $(this);
    		var id = _this.parents('.order-list-wrap').attr("data-id");
    		var status = _this.attr("data-status");
    		var url = "./index.php?c=dining&a=updateOrderStatus";
	    	var data = {id:id,status:status};
    		var title = "确定要取消订单吗？";
    		var desc = "确定后交易取消该并自动原路退款";
	    	showConfirmDialog("#dangerConfirmDialog", title , desc ,'',3000,function(){
		    	getAjaxOption(data,url,function(result){
		    		if(result.errorCode == 0){//成功
				    	showDialog('#successDialog','操作成功','您的操作成功了','','3000',function(){render(1)});
		    		}else{
		    			showDialog("#errorDialog","操作失败!",result.errorInfo);
		    		}
		    	});
	    	});
    	});

    	//取消投诉
    	$("#container .content-wrap").on("click",".complain-cancel-btn.btn",function(){
    		var _this = $(this);
    		var id = _this.parents('.order-list-wrap').attr("data-id");
    		var url = "./index.php?c=dining&a=cancelComplain";
	    	var data = {id:id};
    		var title = "确定要取消投诉吗？";
    		var desc = "确定后投诉意见将会被撤回";
	    	showConfirmDialog("#dangerConfirmDialog", title , desc ,'',3000,function(){
		    	getAjaxOption(data,url,function(result){
		    		if(result.errorCode == 0){//成功
				    	showDialog('#successDialog','操作成功','您的操作成功了','','3000',function(){render(1)});
		    		}else{
		    			showDialog("#errorDialog","操作失败!",result.errorInfo);
		    		}
		    	});
	    	});
    	});

    	//点赞
    	$("#container .content-wrap").on("click",".no-zan",function(){
			var _this = $(this);
       		var id = _this.parents('.order-list-wrap').attr("data-id");
    		var url = "./index.php?c=dining&a=zanSender";
	    	var data = {oid:id};
       		getAjaxOption(data,url,function(result){
	    		if(result.errorCode == 0){//成功
			    	_this.removeClass('no-zan');
					_this.addClass('already-zan');
					var x = 100;
		     		var y = 200;
		       		var num = Math.floor(Math.random() * 2 + 1);
		       		var index=$('.demo').children('img').length;
		       		var rand = parseInt(Math.random() * (x - y + 1) + y);

		       		_this.append("<img src='./template/front/dining/ma16001/image/1.png'>");
		       		$("img").animate({
		       			bottom:"800px",
		       			opacity:"0",
		       			right: rand,
		       		},3000);
	    		}else{
	    			showDialog("#errorDialog","操作失败!",result.errorInfo);
	    		}
	    	});
    	});



	}

    /**
     * 分页动态渲染数据
     * @param int type    0下拉1点击
     */
    function render(type){
    	if(type == 1){
    		pageOption.page_num = 0;
    		pageOption.selector.prevAll().remove();
    	}

        var selectInfo = {
        	status:$(".head-nav .head-item.active").attr("data-status"),
        };
        selectInfo.page_num = pageOption.page_num;
        selectInfo.page_size = pageOption.page_size;
        alert(selectInfo);
        pageForm = {
            url:"./index.php?c=dining&a=pagingOrder",
            data:selectInfo,
            dataType:"json",
            success:function(result,statusText){
                if(result.errorCode == 0){
                	var html = ""
                	var myList = result.data;

                    //渲染记录列表
                    for(var i = 0; i < myList.length;i++){
                    	var obj = myList[i];
                    	var id = obj.id;
                    	//点单状态
                    	var status = obj.status;
                    	var r_state = obj.r_state;
                    	var rid = obj.rid;
                    	var status_text = status == 0?'待支付':status == 1?'待接单':status == 2 ? '待派单':status == 3?'待取餐':status == 4 ?'送餐中':status == 5 ? '交易成功':status == 6 ? '交易取消':status == 7 ? '商家取消':status == 8 ?'申请退款':status == 9 ? '退款成功':status == 10 ? '退款失败':'';
                    	var goods_list = '';
                    	for(var j = 0; j < obj.goods_list.length; j++){
                    		var goods = obj.goods_list[j];
                    		var price = (goods.price * goods.count).toFixed(2);
                    		goods_list += '<div class="dining-list"><span class="dining-name">'+goods.name+'</span><span class="dining-count"><i class="icon iconfont">&#xe614;</i>'+goods.count+'</span><span class="dining-price">'+price+'</span></div>'
                    	}
                    	var time_text = status == 5 ? '送达时间':'预定送达';
                    	var time = status == 5 ? obj.end_time||'--' : obj.estimate_time||'--';
                    	//按钮显示
                    	if(status == 1){
                    		var order_status = '<div class="order-status"><i class="icon iconfont">&#xe7c7;</i><span class="status-info">商家迟迟不接单，我要取消订单</span><span class="active-btn sender-btn refuse-btn active" data-status="6">取消订单</span></div>'
                    	}else if(status == 0){
                    		var order_status = '<div class="order-status"><i class="icon iconfont">&#xe68e;</i><span class="status-info">等不及啦！赶紧付款吧？</span><a class="active-btn active" href="./pay/request/code.php?&oid='+obj.id+'&module=diningPay">立即支付</a></div>'
                    							+ '<div class="order-status"><i class="icon iconfont">&#xe7c7;</i><span class="status-info">我不想付款了</span>'
                    							+'<span class="active-btn delete-btn active">删除订单</span>'
                    							+'</div>';
                    	}else if(status == 0 || status == 5 || status == 6 || status == 7){
                    		var order_status = '<div class="order-status"><i class="icon iconfont">&#xe7c7;</i><span class="status-info">此订单已经处理完毕</span>'
//                  							+'<span class="active-btn delete-btn active">删除订单</span>'
                    							+'</div>';
                    	}else if(status == 8){
                    		var order_status = '<div class="order-status"><i class="icon iconfont">&#xe7c7;</i><span class="status-info">申请退款</span>'
//                  							+'<span class="active-btn delete-btn active">删除订单</span>'
                    							+'</div>';
                    	}else if(status == 9){
                    		var order_status = '<div class="order-status"><i class="icon iconfont">&#xe7c7;</i><span class="status-info">退款成功</span>'
//                  							+'<span class="active-btn delete-btn active">删除订单</span>'
                    							+'</div>';
                    	}else if(status == 10){
                    		var order_status = '<div class="order-status"><i class="icon iconfont">&#xe7c7;</i><span class="status-info">退款失败</span>'
//                  							+'<span class="active-btn delete-btn active">删除订单</span>'
                    							+'</div>';
                    	}else{
                    		var order_status = "";
                    	}
                    	var text_deff = '';
                    	var sender_html = '';
                    	var zanHtml = '';
                    	if(status >= 3){
	                    	text_deff = '<span class="left-name"><i class="icon iconfont">&#xe6f5;</i>送达计时</span><span data-time="'+obj.estimate_time+'" class="order-time order-estimate-time last-item left-time">00:00:00</span>';
                    		sender_html = '<a href="./index.php?c=dining&a=orderDetail&oid='+id+'" class="order-find btn">订单追踪<a>';
                    		if(r_state == 0){
                    			sender_html += '<a href="./index.php?c=dining&a=redPacket&type=0&rid='+rid+'" class="order-share btn">分享红包<a>';
                    		}else if(r_state == 1){
                    			sender_html += '<a href="javascript:;" class="order-share-over btn">分享红包<a>';
                    		}

                    		if(status >= 5){
                    			if(obj.sender_id){
	                    			if(obj.user_complain_id == 0){
	                    				sender_html += '<a href="./index.php?c=dining&a=userComplain&type=0&oid='+id+'" class="complain-btn btn">我要投诉<a>';
	                    			}else{
	                    				sender_html += '<a href="javascript:;" class="complain-cancel-btn btn">取消投诉<a>';
	                    			}
	                    			if(obj.is_zan == 1){
	                    				zanHtml += '<div class="zan-area"><div class="zan-title">给骑手点赞</div><div class="demo zan-btn-area already-zan"><i class="icon iconfont zan-item ">&#xe760;</i> 赞</div></div>';
	                    			}else{
	                    				zanHtml += '<div class="zan-area"><div class="zan-title">给骑手点赞</div><div class="demo zan-btn-area no-zan"><i class="icon iconfont zan-item ">&#xe760;</i> 赞</div></div>';
	                    			}
	                    		}
                    		}
                    		if(status == 3 || status == 4){
//                  			if(obj.sender_id){
                    				sender_html += '<a href="tel:'+obj.shop_phone+'" class="call-sender-btn btn">一键催单<a>';
//                  			}
                    		}


                    	}

                    	var discount_money = obj.discount_money;
	                    var	cut_money = obj.cut_money;
	                    var	shopDiscountHtml = "";
                    	if(discount_money != 0 && discount_money != null && discount_money != ""){
                    		shopDiscountHtml = '<div class="shop-discount"><span class="item">折扣优惠&nbsp;</span><span class="item-price">- '+discount_money+'</span></div>';
                    	}else if(cut_money != 0 && cut_money != null && cut_money != ""){
                    		shopDiscountHtml = '<div class="shop-discount"><span class="item">满减优惠&nbsp;</span><span class="item-price">- '+cut_money+'</span></div>';
                    	}

                    	var shop_phone = obj.shop_phone||'--';
                    	//送餐员隐藏
                    	var sender_class = '';
                    	if(status == 2 || status ==1 || status == 6 || status == 7 || status == 8 || status == 0){
                    		sender_class = "hidden";
                    	}
                    	var message = obj.message != '' ? '<div class="order-list order-item">'
				    			+ '<span class="left-name">备注信息</span>'
				    			+ '<span class="order-text limit-text message">'+obj.message+'</span>'
					    		+ '</div>' : '';

                		html += '<div class="order-list-wrap" data-id="'+id+'">'
	    						+ '<div class="order-list order-item">'
	    						+ '<span class="left-name">订单编号</span>'
	    						+ '<a href="./index.php?c=dining&a=orderDetail&oid='+id+'" class="order-text"><span class="order-num">'+obj.order_num+'<span class="status-color">('+status_text+')</span></span></a>'
	    						+ '</div>'
	    						+ '<div class="order-list order-item">'
				    			+ '<span class="left-name">订餐时间</span>'
				    			+ '<span class="order-text">'+obj.add_time+'</span>'
					    		+ '</div>'
					    		+ '<div class="order-list time order-item">'
				    			+ '<span class="left-name">'+time_text+'</span>'
				    			+ '<span class="order-text">'+time+'</span>'
				    			+text_deff
					    		+ '</div>'
					    		+ message
					    		+ '<div class="order-list shop order-last"><span class="left-name"><i class="icon iconfont">&#xe710;</i>商家名称</span><span class="shop-name limit-text last-item">'+obj.shop_name+'</span></div>'
					    		+ '<div class="order-list sender order-last '+sender_class+'"><span class="left-name"><i class="icon iconfont">&#xe710;</i>商家电话</span><span class="order-sender active limit-text last-item"> <a href="tel:'+shop_phone+'">'+shop_phone+'</a></span></div>'
//					    		+ '<div class="order-list sender order-last '+sender_class+'"><span class="left-name"><i class="icon iconfont">&#xe7c9;</i>送餐人员</span><span class="order-sender active limit-text last-item">'+obj.sender_name+'( <a href="tel:'+obj.sender_phone+'">'+obj.sender_phone+'</a>)</span></div>'
					    		+ '<div class="order-list dining order-last">'
				    			+ '<span class="left-name"><i class="icon iconfont">&#xe66a;</i>配送餐品</span>'
				    			+ goods_list
				    			+ sender_html
				    			+ shopDiscountHtml
				    			+ '<div class="dining-last"><i class="icon iconfont">&#xe604;</i><span class="total-price">'+obj.real_money+'</span><span class="person-count">（'+obj.person_count+'人餐）</span></div>'
				    			+ zanHtml
					    		+ '</div>'
					    		+ order_status
				    			+ '</div>';
                    }
                }
                operateScroll(result,html);
                //倒计时
                var now = new Date();
                $("#container .order-list-wrap .order-estimate-time").each(function(){
                    var _this = $(this);
                    var timeText = _this.attr("data-time");
                    timeText = timeText.replace(/-/g,"/");
                    var endTime = Date.parse(timeText);
                    var intDiff = (endTime - now.getTime())/1000;
                    diffTime(intDiff,_this);
                });
            }
        }
        $.ajax($.extend(pageForm,scrollForm));
    }
    /**
     * 倒计时
     * @param intDiff
     * @param _this
     */
    function diffTime(intDiff,_this){
        diff();
        var setDiff= window.setInterval(diff, 1000);
        function diff(){
            var day=0,
                hour=0,
                minute=0,
                second=0;//时间默认值
            if(intDiff > 0){
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }else{
                clearInterval(setDiff);
                _this.text("计时结束");
            }
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            _this.text(hour+':'+minute+':'+second);
            if(intDiff <= 0){
                _this.text("计时结束");
            }
            intDiff--;
        }
    }
    init();
});