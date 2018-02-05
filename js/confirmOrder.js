/*提交订单*/
$(function(){
 	var shop_sender_time = $('#container .order-bottom-area').attr('data-sender-time');
 	var type = $('.address-type').attr('data-type');
 	var is_plate_time = $(".order-goods-list").attr('data-is-plate-time');
    /**
     * 初始化
     */
    function init(){
    	renderSender(type);
        bindEvent();
    }

    /**
     * 绑定事件
     */
    function bindEvent(){
    	//选择地址
        $(".address-list .item-select").click(function(){
            var _this = $(this);
            if(!_this.hasClass("selected")){//当前为选中状态,则取消选中状态
                //地址单选事件
                $(".address-list .item-select").removeClass("selected");
                $(".address-list .item-select").find(".selected").hide();
                $(".address-list .item-select").find(".un-selected").show();
                _this.find(".un-selected").hide();
                _this.find(".selected").show();
                _this.addClass("selected");
                render(type,2);
            }
        });
        //点击使用积分
    	$(".balance-money p.p1 .right").click(function(){
    		var _this = $(this);
    		if(_this.parent().hasClass('active')){
    			_this.parent().removeClass('active');
    			totalPrice = getTotalMoney();
    		}else{
    			_this.parent().addClass('active');
    			var dPrice = _this.prev().find('span').text();
    		}
    		totalPrice = getTotalMoney();
    		$("#final-total-price").text(totalPrice);
    		$('.true-pay').text(totalPrice);
    	});
    	
    	//配送方式
       	$('.sending-model-list').click(function(){
       		if(is_plate_time != 2){
       			if($(this).hasClass('active')){
	       			$(this).removeClass('active');
	       			$(this).siblings().addClass('active');
	       		}else{
	       			$(this).addClass('active');
	       			$(this).siblings().removeClass('active');
	       		}
       		}
       		
       	});
       
       
       
        //提交订单
        $('.submitOrder.able.active').click(function(){
            //验证收货地址
            var _this = $(this);
            var _option = $(".address-list .item-select.selected");
            if(_option.length == 0){
                showDialog("#errorDialog","未选择地址","请先确认送餐地址",'',3000);
                return;
            }
            var balance = $('.balance-money .p1').hasClass('active') ? $(".balance-money .p1").attr("data-balance") : 0;
            var shop_id = $('#container .order-bottom-area').attr('data-shop');
            var sex = _option.attr("data-sex");
            var build_id = _option.attr("data-build-id");
            var _address = _option.parents(".address-area");
            var address_text = _address.find(".callname").text()+'--'+_address.find(".phone").text()+'--'+_address.find(".address-info").text();
            var message = $("#container .dining-info-list .content").val().trim();
            var person_count = $("#container .dining-info-list .people-num").val().trim();
            if(person_count == "" || person_count == 0 || isNaN(person_count)){
            	showDialog("#alertDialog","填写用餐人数","请填写正确的用餐人数",'',3000);
            	return;
            }
            var sending_type = $(".sending-model-list.active").attr('data-sending-type')||'0';
            var cut_money = $('.item-cut-price').attr('data-cut-price')||0;
            var discount_money = $('.item-discount-price').attr('data-discount-price')||0;
            var address_json = JSON.stringify({"call_name":_address.find(".callname").text(),"phone":_address.find(".phone").text(),"address":_address.find(".address-info").text()});
            var data = {
            	message:message,
            	person_count:person_count,
            	shop_id:shop_id,
            	address_json:address_json,
            	sex:sex,
            	build_id:build_id,
            	address_text:address_text,
            	balance:balance,
            	cut_money:cut_money,
            	discount_money:discount_money,
            	sending_type:sending_type
            };
            var url = "./index.php?c=dining&a=insertOrder";
            getAjaxOption(data,url,function(result){
            	var oid = result.data;
            	var myDate = new Date();
            	var curr = myDate.toLocaleDateString();     //获取当前日期
	    		if(result.errorCode == 0){//成功
//		    		showDialog('#successDialog','当前时间:'+curr,'专送寝室时间：（11:10-13:00，17:20-20:30）','',3000,function(){
//		    			
//		    		});
//					$('.confirm-order-dialog').show();
//					confirmOrderModal(oid);
					window.location.href = "./index.php?c=dining&a=orderList&state=0";
	    		}else if(result.errorCode == 2){//余额支付
	    			payBalance(oid);
	    		}else if(result.errorCode == 1){//失败
	    			showDialog('#errorDialog','下单失败',result.errorInfo,'',3000);
	    		}
	    	});
        });
    }
    
    /**
	 * 下单成功模态框显示方法 "fun = (param) =>{}" ES6箭头函数  <=> "fun(param){}" 
     */
    function confirmOrderModal(oid){
    	$(".oprate-confrim-btn,.confirm-order-top").click(function(){
    		$('.confirm-order-dialog').hide();
    		window.location.href = "./index.php?c=dining&a=orderList&state=0";
//  		window.location.href = "/pay/request/code.php?&oid="+oid+"&module=diningPay";
    	});
    }
    
    
    
    /**
     * 余额支付
     */
    function payBalance(oid){
    	var data = {oid:oid};
    	var url = "./index.php?c=dining&a=payBalance";
    	getAjaxOption(data,url,function(result){
    		if(result.errorCode == 0){//成功
//  			$('.confirm-order-dialog').show();
    			var rid = result.data.rid||0;
    			//$(".oprate-confrim-btn,.confirm-order-top").click(function(){
//		    		$('.confirm-order-dialog').hide();
		    		if(rid != 0){
    					window.location.href = "./index.php?c=dining&a=redPacket&rid="+rid;
    				}else{
    					window.location.href = "./index.php?c=dining&a=orderList&state=3";
    				}
		    	//});
    			
    			
//  			showDialog('#successDialog','支付成功',' ','',3000,function(){
//  				if(rid != 0){
//  					window.location.href = "./index.php?c=dining&a=redPacket&rid="+rid;
//  				}else{
//  					window.location.href = "./index.php?c=dining&a=orderList&state=3";
//  				}
//  				
//	    		});
    		}else{
    			showDialog('#errorDialog','下单失败',result.errorInfo,'',3000);
    		}
    	});
    }
    
    /**
     * 获取总价
     */
    function getTotalMoney(){
    	var balanceMoney = userBalance();
    	var totalPrice = parseFloat($(".true-money").attr('data-total-price')); //总价
		totalPrice = totalPrice - balanceMoney;
  		return (totalPrice.toFixed(2));  //结果保留两位小数
    }
    /**
     * 获取消费余额
     */
    function userBalance(){
    	var balanceMoney = $("p.active").attr('data-balance');
    	if(balanceMoney == '' || balanceMoney == undefined){
    		balanceMoney = 0;
    	}
    	return balanceMoney;
    }
	/**
     * 选择最优送餐员
     */
    function render(type){
    	if(is_plate_time == 1){
	    	if(type == 0){
	    		var url = "./index.php?c=dining&a=getBestSender";
		    	var data = {
		    		sex:$(".address-list .item-select.selected").attr("data-sex"),
		    		build_id:$(".address-list .item-select.selected").attr("data-build-id"),
		    		shop_id:$('#container .order-bottom-area').attr('data-shop')
		    	};
		    	getAjaxOption(data,url,function(result){
		    		var _this = $("#content .dining-info-area .send-time");
		    		if(result.errorCode == 0){//有结果
		    			$(".pay-method-area .pay-method .submitOrder").addClass("able").addClass('active');
			    		var html = '本次订餐将由超级邦配送，预计将于<span class="time">'+result.data.last_time+'</span>送达，超时您将可以申请赔付，祝您订餐愉快！';
		    		}else{//无结果
	    				$(".pay-method-area .pay-method .submitOrder").removeClass("able").removeClass('active');
	    				var html = '暂无对应性别的配送员，请更换商家下单';
	    				showDialog('#errorDialog','下单失败','暂无对应性别的配送员，请更换商家下单','',3000);
		    		}
		    		_this.html(html);
		    	});
	    	}
    	}
    	
    }
    
    /**
     * 首次进入页面，判断骑手是否存在
     * @param {Object} type
     */
    function renderSender(type){
    	if(is_plate_time == 1){
	    	if(type == 0){
	    		var url = "./index.php?c=dining&a=getSender";
		    	var data = {
		    		sex:$(".address-list .item-select.selected").attr("data-sex"),
		    		build_id:$(".address-list .item-select.selected").attr("data-build-id"),
		    		shop_id:$('#container .order-bottom-area').attr('data-shop')
		    	};
		    	getAjaxOption(data,url,function(result){
		    		var _this = $("#content .dining-info-area .send-time");
		    		if(result.errorCode == 0){//有结果
		    			$(".pay-method-area .pay-method .submitOrder").addClass("able").addClass('active');
			    		var html = '本次订餐将由超级邦配送，预计将于<span class="time">'+result.data.last_time+'</span>送达，超时您将可以申请赔付，祝您订餐愉快！';
		    		}else if(result.errorCode == 1){//无结果
	    				$(".pay-method-area .pay-method .submitOrder").removeClass("able").removeClass('active');
		    			var html = '对不起，不在配送时间，请稍后尝试下单';
		    			showDialog('#errorDialog','下单失败','不在配送时间,请更换商家下单','',3000);
		    		}else if(result.errorCode == 2){
		    			$(".pay-method-area .pay-method .submitOrder").removeClass("able").removeClass('active');
	    				var html = '暂无对应性别的配送员，请更换商家下单';
	    				showDialog('#errorDialog','下单失败','暂无对应性别的配送员，请更换商家下单','',3000);
		    		}
		    		_this.html(html);
		    	});
	    	}
    	}
    	
    }
    
    init();
});
