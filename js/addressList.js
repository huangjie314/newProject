$(function(){
	var referer = "https://cjb.huimaibuy.com/index/php?c=dining&a=userCenter";
    /*document.referrer*/
    alert(referer);//referer = https://cjb.huimaibuy.com/index/php?c=dininga=userCenter
    var params = referer.split("?")[1];
    var obj = unserialize(params);
    var c = obj.c;//是否需要重定向

	if(c != 'base_user'){
		$.cookie("return_url",document.referrer,60*1000);
	}

    /**
     * 初始化
     */
    function init(){
        var width = $("#container").width();//计算当前窗口的宽度
        $("#container .address-bottom-area").width(width);//将底部导航的宽度设置与移动设备相同
        bindEvent();
    }

    /**
     * 绑定事件
     */
    function bindEvent(){
        //用户变化屏幕方向时调用
        $(window).bind( 'orientationchange resize', function(e){
            width = $("#container").width();//计算当前窗口的宽度
            $("#container .address-bottom-area").width(width);//将底部导航的宽度设置与移动设备相同
        });
        $("#content .address-top-area .back").click(function(){
            window.location.href = $.cookie("return_url");
        });
        //弹框
        /**
         * 购物车顶部“编辑”事件,
         */
        $(".address-top-area .edit").click(function(){
            $(this).hide();//隐藏“编辑”
            $(".address-top-area .complete").show();//显现“完成”
            //隐藏选择 展现删除商品功能
            $(".address-list .item-select").hide();
            $(".address-list .item-delete").show();
            $(".address-list .item-delete .un-selected").show();
            $(".address-list .item-delete .selected").hide();

            //底部功能区对应变化
            $(".address-bottom-area #defaultAddress").hide();
            $(".address-bottom-area #addAddress").hide();

            $(".address-bottom-area #selecAllDelete").show();
            $(".address-bottom-area #selecAllDelete .all-selected").hide();
            $(".address-bottom-area #selecAllDelete .not-all-selected").show();
            $(".address-bottom-area #deleteAll span").removeClass("can-use");
            $(".address-bottom-area #deleteAll").show();

        });
        /**
         * 购物车顶部编辑“完成”事件，隐藏删除功能
         */
        $(".address-top-area .complete").click(function(){
            $(this).hide();//隐藏“完成”

            $(".address-top-area .edit").show();//显现“编辑”
            $(".address-list .item-delete").hide();
            $(".address-list .item-select").show();
            //底部功能区对应变化
            $(".address-bottom-area #selecAllDelete").hide();
            $(".address-bottom-area #deleteAll").hide();
            $(".address-bottom-area #defaultAddress").show();
            $(".address-bottom-area #addAddress").show();


        });
        /***
         * 地址底部功能区--全选功能
         */
        $(".address-bottom-area #selecAllDelete").click(function(){
            var _this = $(this);
            if(_this.hasClass("all-selected")){
                //当前为选中状态,则取消选中状态
                _this.find(".all-selected").hide();
                _this.find(".not-all-selected").show();
                _this.removeClass("all-selected");
                //将所有地址置为未选中状态
                var selector = ".item-delete";
                $(".address-bottom-area #deleteAll span").removeClass("can-use");
                $(".address-list .address-area "+selector).removeClass("selected");
                $(".address-list .address-area "+selector+" .un-selected").show();
                $(".address-list .address-area "+selector+" .selected").hide();
            }else{
                //若当前为未选中状态，则置为选中状态
                _this.find(".not-all-selected").hide();
                _this.find(".all-selected").show();
                _this.addClass("all-selected");
                //将所有商品置为选中状态
                var selector  = ".item-delete";
                $(".address-bottom-area #deleteAll span").addClass("can-use");
                $(".address-list .address-area "+selector).addClass("selected");
                $(".address-list .address-area "+selector+" .un-selected").hide();
                $(".address-list .address-area "+selector+" .selected").show();
            }
        });
        /**
         * 地址列表单选事件,地址删除--单选事件
         */
        $(".address-list .item-select,.address-list .item-delete").click(function(){
            var _this = $(this);
            if(_this.hasClass("selected")){//当前为选中状态,则取消选中状态
                if(_this.hasClass("item-delete")){
                    //当前为删除商品单选事件
                    _this.find(".selected").hide();
                    _this.find(".un-selected").show();
                    _this.removeClass("selected");

                    var selector = "";
                    //将底部功能“全选”状态置为未选中状态
                    selector = "#selecAllDelete";
                    var elem = $(".address-bottom-area "+selector);
                    if(elem.hasClass("all-selected")){
                        elem.removeClass("all-selected");
                        elem.find(".not-all-selected").show();
                        elem.find(".all-selected").hide();
                    }
                }else{
                	_this.find(".selected").show();
                	_this.find(".un-selected").hide();
                }

            }else{
                //若当前为未选中状态，则置为选中状态
                if(_this.hasClass("item-delete")){
                    //当前为删除商品单选事件
                    _this.find(".un-selected").hide();
                    _this.find(".selected").show();
                    _this.addClass("selected");
                    var selector = "",selector2 = "";
                    selector = "#selecAllDelete";
                    selector2 = ".item-delete";
                    if($(".address-list "+selector2).length == $(".address-list "+selector2+".selected").length){
                        //都为选中状态时，将底部功能“全选”状态置为选中状态
                        var elem = $(".address-bottom-area "+selector);
                        elem.addClass("all-selected");
                        elem.find(".not-all-selected").hide();
                        elem.find(".all-selected").show();
                    }
                    if($(".address-list .item-delete.selected").length > 0){
                        $(".address-bottom-area #deleteAll span").addClass("can-use");
                    }else{
                        $(".address-bottom-area #deleteAll span").removeClass("can-use");
                    }
                }else{
                    //地址单选事件
                    $(".address-list .item-select").removeClass("selected");
                    $(".address-list .item-select").find(".selected").hide();
                    $(".address-list .item-select").find(".un-selected").show();
                    _this.find(".un-selected").hide();
                    _this.find(".selected").show();
                    _this.addClass("selected");
                }

            }

            //同步维护底部“删除”按钮状态
            if(_this.hasClass("item-delete")){
                if($(".address-list .item-delete.selected").length > 0){
                    $(".address-bottom-area #deleteAll span").addClass("can-use");
                }else{
                    $(".address-bottom-area #deleteAll span").removeClass("can-use");
                }
            }
        });
        //置为默认地址
        $("#container .address-bottom-area #defaultAddress").click(function(){
        	//获取当前单选的地址选项
            var option = $("#content .address-list .item-select.selected");
            if(option.length == 0){
            	showDialog("#alertDialog","信息不完善","请选择地址再提交",'',2000);
            }else{
                var id = option.parents(".address-area").attr("data-id");
                $.ajax({
                    url:"./index.php?c=base_user&a=setDefaultAddress",
                    type:"post",
                    data:{"id":id},
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
                        	showDialog("#successDialog",'操作成功','您的默认地址已成功修改','','2000');
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
            }

        });

        //删除地址
        $("#container #deleteAll span").click(function(){
            if(!$(this).hasClass("can-use")){
                return false;//不具有删除条件时直接退出
            }

            var ids = [];
            var elems = $(".address-list .item-delete.selected");

            elems.each(function(index){
                var id = $(this).parents(".address-area").attr("data-id");
                ids.push(id);
            });

            var _this = $(this);
            ids = ids.join(",");
            showConfirmDialog("#dangerConfirmDialog","删除确认","确定要删除该条地址么",'',2000,function(){
	            $.ajax({
	                url:"./index.php?c=base_user&a=deleteAddress",
	                type:"post",
	                data:{"ids":ids},
	                dataType:"json",
	                beforeSend:function(){
	                	showDialog('#loadingDialog');
	                },
	                complete:function(){
	                	hideDialog('#loadingDialog');
	                },
	                success:function(json,statusText){
	                    if(json.errorCode == 0){
	                        window.location.reload();
	                    }else{
	                    	showDialog("#maskDialog");
	                    	showDialog("#alertDialog","删除失败","对不起！您的操作失败了",'',2000);
	                    }
	                },
	                error:function(){
	                	showDialog("#maskDialog");
	                	showDialog("#alertDialog","抱歉！网络异常","对不起！您的操作失败了",'',2000);
	                }
	            });
            });
        });

    }

    /**
     * 反序列化函数
     * @param params
     * @returns obj {}
     */
    function unserialize(params){
        var obj = {};
        var arr = params.split("&");//将字符串分隔成数组
        for(var i = 0; i < arr.length;i++){
            var name = arr[i].split("=")[0];
            var value = arr[i].split("=")[1];
            obj[name] = value;
        }
        return obj;
    }

    init();
});