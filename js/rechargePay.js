/*提交订单*/
$(function(){
    /**
     * 初始化
     */
    function init(){
        bindEvent();
    }

    /**
     * 绑定事件
     */
    function bindEvent(){
    	//选择类型
    	$("#container .recharge-box .item").click(function(){
    		var _this = $(this);
    		var is_send = _this.attr("is-send");
    		var send_coin = _this.attr("data-send");
    		var money = _this.attr("data-money");
    		var money_min = _this.attr("data-min");
    		//input 框获得焦点
    		if(_this.hasClass("defined-area")){
    			_this.find(".defined").focus();
    			if(is_send == 1){
    				$("#container .recharge-box .info").text('注：自定义金额满'+money_min+'元，充值赠送'+send_coin+'元');
    			}
			}    		
    		if(_this.hasClass("active")){
    			return false;
    		}
    		//标志选中
    		$("#container .recharge-box .item.active").removeClass("active");
    		_this.addClass("active");
    		if(is_send == 1 && _this.hasClass("fixed")){
				$("#container .recharge-box .info").text('注：固定金额'+money+'元，充值赠送'+send_coin+'元');
			}
    	})
    	
        //提交订单
        $("#container .recharge-box .recharge-btn").click(function(){
        	if($("#container .recharge-box .item.active").hasClass("defined-area")){
    			var defined_money = $("#container .recharge-box .item.active .defined").val().trim();
    			reg = /^[1-9]\d{0,3}$/;
    			if(!reg.test(defined_money)){
    				alert("自定义金额为1-9999元之间");
    				$("#container .recharge-box .item.active .defined").val('').focus();
    				return false;
    			}else{
    				$("#container .recharge-box .item.active").attr("data-money",defined_money);
    			}
    		}
        	var money = $("#container .recharge-box .item.active").attr("data-money");
        	var type = $("#container .recharge-box .item.active").attr("data-type");
        	var name = $("#container .recharge-btn").attr("data-name");
            $.ajax(
                {
                  type:"post",
                  url:"./index.php?c=base_user&a=insertRecharge",
                  data:{
                      "money":money,
                      "type":type,
                      "name":name
                  },
                  dataType:"json",
                  beforeSend:function(xhr){
                       //显示“加载中。。。”
                       showDialog('#loadingDialog');
                    },
                  complete:function(){
                	  //隐藏“加载中。。。”
                	  hideDialog("#loadingDialog")
                  },
                  success:function(json,statusText){
                      if(json.errorCode == 0){
                    	  showConfirmDialog('#successConfirmDialog','提交成功','快去付款吧~','','',function(){
                    		  var oid = json.data;//生成的订单记录主键
                    		  window.location.href = "./pay/request/code.php?oid="+oid+"&module=balancePay";
                    	  });
                      }else{
                    	  showDialog('#errorDialog','提交失败',' ','',1500);
                      }
                  },
                  error:function(){
                	  showDialog('#errorDialog','出错啦~','网络异常，请求失败！','',1500);
                  }
                }
            );
       });
	}
    init();
});
