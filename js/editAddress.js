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
    	//学校楼栋选择
		$("#addr").picker({
		    toolbarTemplate: '<header class="bar bar-nav">\
		    <button class="button button-link pull-right close-picker">确定</button>\
		    <h1 class="title">请选择楼栋</h1>\
		    </header>',
		    cols: [{
		        textAlign: 'center',
		        values:getBuild(),
		    }],
		    onClose:function(value){
		    	var value = value.value[0].split('(');
		    	$(".address-wrap .sex").val(value[1].substr(0,1) == '男' ? 1:2);
		    }
		});
    	
    	/**
    	 * 控制弹出框大小位置
    	 */
    	$("#addr").click(function(){
    		var width=$("#container").width();
    		var window_width = $(window).width();
        	$('.picker-modal').css({'max-width': width, left: (window_width - width)/2});
    	});
    	
        $("#content .address-top-area .back").click(function(){
            window.history.back(-1);
        });

        //修改地址
        $("#content table .save-address").click(function(){
            var callname = $.trim($("#content table .callname").val());
            var phone = $.trim($("#content table .phone").val());
            //var province = $("#content table #province").val();
            //var city = $("#content table #city").val();
            //var area = $("#content table #area").val();
            var sex = $(".address-wrap .sex").val();
            var addr = $.trim($("#content table #addr").val());
            var info = $.trim($("#content table #detail").val());
            if(callname == "" || phone == "" || addr == "" || info==""){
            	showDialog("#maskDialog");
            	showDialog("#alertDialog","信息不完善",'请完善信息再提交','',2000);
                return false;
            }
            var id = $(this).attr("data-id");
            $.ajax({
                url:"./index.php?c=base_user&a=updateAddress",
                type:"post",
                data:{ "id":id,
                       "addr": addr,
                       "detail" : info,
                       "phone":phone,
                       "call_name":callname,
                       sex:sex
                    },
                dataType:"json",
                beforeSend:function(){
                	showDialog('#loadingDialog');
                },
                complete:function(){
                	hideDialog('#loadingDialog');
                },
                success:function(json,statusText){
                    if(json.errorCode == 0){
                    	showDialog("#maskDialog");
                    	showDialog("#successDialog",'修改成功','您的地址信息已成功修改','','',function(){window.history.back(-1)});
                    }else{
                    	showDialog("#maskDialog");
                    	showDialog("#alertDialog","抱歉！操作异常",json.errorInfo,'',2000);
                    }

                },
                error:function(){
                	showDialog("#maskDialog");
                	showDialog("#alertDialog","抱歉！系统繁忙",'您的操作失败咯','',2000);
                }
            });
        });
       
    }
	
	/**
     * 获取门店列表
     */
    function getBuild(){
    	//发送请求
    	var myList = [];
        $.ajax({
        	async:false,
            url:"./index.php?c=base_user&a=findAllBuild",
            type:"post",
            dataType:"json",
            success:function(json,statusText){
                if(json.errorCode == 0){
                	var obj = json.data;
                	for(var i = 0; i<obj.length;i++){
                		var sex = obj[i].sex == 1 ?'男':'女';
                		var name = obj[i]['num']+'('+sex+'宿舍)';
                		myList.push(name);
                	}
                }else{
                	myList.push('暂无楼栋');
                }
            },
            error:function(){
            	showDialog('#errorDialog','',"请求失败，请稍后再试！",'');
            }
        });
    	return myList;
    }
    
    init();
});