/**
 * 微商城--首页js
 */

$(function(){
	var idList = [];
	var shop_sender_time = $('#container .goods-wrap').attr('data-sender-time');
	var is_plate_time = $('#container .goods-wrap').attr('data-is-plate-time');
    /**
     * 初始化
     */
    function init(){
        //幻灯片Swiper插件
        var mySwiper = new Swiper ('.swiper-container', {
            //direction: 'vertical',
            loop: true,
            speed:400,
            autoplay:3000,
            effect:"coverflow",//fade,cube,coverflow
            observer:true,
            // 如果需要分页器
            pagination: '.swiper-pagination',
            paginationClickable:true

            // 如果需要前进后退按钮
            //nextButton: '.swiper-button-next',
            //prevButton: '.swiper-button-prev',

            // 如果需要滚动条
            //scrollbar: '.swiper-scrollbar',
        });
        getPageOption($("#get-more"),{}); //数据展示器选择
        isPageScroll(function(){render(0)});
        render(0);
        bindEvent();
    }
    var CAN_BUY = false;
    var CAN_CLICK = true;//标识当前是否可以操作
    var standard = $("#content .recommend-goods-diplay-area .btn-buy,#content .label-goods-diplay-area .btn-buy").attr('data-standard');
    if(standard == 0){
        CAN_BUY = true;//若当前商品为“统一规格”，则可以购买
    }

    /**
     * 绑定事件
     */
    function bindEvent(){
        /***
         * 商品搜索
         */
        $(".search-goods-area .search-goods-btn").click(function(){
            var txt = $.trim($(".search-goods-area .search-text").val());//查询关键字
            window.location.href = "./index.php?c=store&a=goodsSearch&keywords="+txt;
        });
        //enter事件
        $(".search-goods-area .search-text").keydown(function(event){
            event = event ? event:window.event;
            if(event.keyCode == 13){
                $(".search-goods-area .search-goods-btn").click();
                return;
            }
        });

        //购物车弹出框显示时调整 弹框位置及大小
        $("#addCartModal").on('show.bs.modal',function(){
            $(this).addClass("modal-show");//标识当前弹出框显示
            var screenWidth = $(window).width();//屏幕宽度
            var width = $("#container").width();//获取当前主体宽度
            var cartModal = $(this).find(".modal-dialog");
            var left = (screenWidth - width)/2;//居左距离
            cartModal.width(width);
            cartModal.css("left",left);

            //发送异步请求
	        if(idList == '' && standard == 1){
	        	 //异步发送请求，获取选定套餐的记录，同步调整价格(提示用户可选的属性组合)
	            var gid = $("#content .recommend-goods-diplay-area .btn-buy,#content .label-goods-diplay-area .btn-buy").attr("data-id");
	        	$.ajax({
	                type:'post',
	                url:"./index.php?c=store&a=getPropertyData",
	                data:{"gid":gid},
	                dataType:'json',
	                beforeSend:function(xhr){
	  	            	showDialog("#loadingDialog");//显示“加载中。。。”
	  	            },
	  	            complete:function(){
	  	            	hideDialog("#loadingDialog");//隐藏“加载中。。。”
	  	            },
	                success:function(json){
	                    if(json.errorCode == 0){
                            console.log(json.data);
	                        idList = json.data;
	                    }else{
	                        //查找失败
	                    	showDialog("#alertDialog",'多规格数据失败','啊哦，未接受到多规格数据！','',1500);
	                    }
	                },
	                error:function(){
	                	showDialog("#errorDialog",'','啊哦，请求失败！','',1500);
	                }
	            });
	        }

        });
        //弹出框隐藏事件
        $("#addCartModal").on('hidden.bs.modal',function(){
            $(this).removeClass("modal-show");//标识当前弹出框隐藏
        });

        //隐藏活动图片
        $('.ingore-btn').click(function(){
        	$('.activity-model').hide();
        });

		//商品展示区域--下单
		$("#content .recommend-goods-diplay-area .btn-buy,#content .label-goods-diplay-area .btn-buy").click(function(){
			var id = $(this).attr("data-id");
			standard = $(this).attr("data-standard");//规格 0 为统一规格，1为多规格
			var inventory = $(this).attr("data-inventory");//库存
			if(standard == 0){
		        CAN_BUY = true;//若当前商品为“统一规格”，则可以购买
		    }else{//多规格时
		    	CAN_BUY = false;
		    }
			if(standard == 0 && inventory == 0){
				//为统一规格且库存没有了，提示无法下单
				responseTip(1,"抱歉，没有库存了，亲！",1500);
				return false;
			}else{
				//异步发送请求，获取商品属性
				if(CAN_CLICK == false){return false;}
				$.ajax(
                {
                    url:"./index.php?c=store&a=getGoodsInfo",
                    type:"post",
                    data:{"id":id},
                    dataType:"json",
                    beforeSend:function(){
                        CAN_CLICK = false;
                    },
                    complete:function(){
                        CAN_CLICK = true;
                    },
                    success:function(json,statusText){
                    	if(json.errorCode == 0){
                    		var goods = json.data;
                    		var unit = goods.unit ||"件";
                    		$("#addCartModal .modal-title img").attr("src",goods.thumb);//缩略图
                    		$("#addCartModal .modal-title .name").html(goods.name);//商品名称
                    		$("#addCartModal .modal-title .price-value").html(goods.price);//商品价格
                    		$("#addCartModal .modal-title .price-value").attr("data-price",goods.price);//商品价格
							$("#addCartModal .modal-title .unit").text(unit);
                    		if(standard == 1){
                    			//多规格时
                    			$("#addCartModal .modal-title .ori-price-info").hide();//隐藏原价
                    			$("#addCartModal .modal-title .inventory-area").hide();//商品库存隐藏
                    			var html = "";
                    			k = 0;
                    			//属性
                    			for(var i = 0; i < goods.propertyGroups.length;i++){
                    				var property = goods.propertyGroups[i];
                    				html +='<div class="goods-property-item" data-property-index="'+(i+1)+'">'
                    						+'<dl class="goods-prop clearfix">'
                    						  +'<dt><span>'+property.name+'</span></dt>'
                    						  +'<dd>'
                    						  	+'<ul data-name="'+property.name+'">'
                    						  	+valueList(property.valueList)
                    						  	+'</ul>'
                    						  +'</dd>'
                    						+'</dl>'
                    					  +'</div>'
                    			}
                    			$("#addCartModal .modal-body .property-group-area").attr("data-id",goods.id).html(html).show();
                    			//商品属性选择事件
                    			$("#addCartModal .property-group-area .goods-prop li a").click(propertySelectedEvent);
                    		}else{
                    			//统一规格
                    			$("#addCartModal .modal-title .ori-price").html(goods.ori_price);//商品原价
                    			$("#addCartModal .modal-title .ori-price-info").show();//显示
                    			$("#addCartModal .modal-title .inventory").html(goods.inventory);//商品库存
                    			$("#addCartModal .modal-title .inventory-area").show();//商品库存显现

                    			$("#addCartModal .modal-body .property-group-area").hide().html("");//隐藏属性
                    		}

                    		$("#addCartModal .modal-footer a").attr("data-id",goods.id);//商品主键
                    		showCartModal();//显示底部弹框

                    	}else{
                    		responseTip(1,"系统繁忙，请稍后再试！");
                    	}
                    },
                    error:errorResponse
				});
			}

		});

        /**
         * 将商品添加至购物车
         */
        $("#addCartModal .add-cart").click(function(){
            if(!CAN_BUY){
                if($("#addCartModal").hasClass("modal-show")){//购物车弹框已出现时，点击“加入购物车”提示用户
                    $("#addCartModal .property-group-area").css("border","1px solid #c00");
                }
            }else{//加入购物车
                $("#addCartModal .property-group-area").css("border","none");
				var quantity = parseInt($("#addCartModal .quantity-area .quantity-value").val());//商品数量
                var inventory = parseInt($("#addCartModal .cart-goods-info .inventory-area .inventory").text());//库存
                if(inventory == 0 || inventory < quantity){
                    //库存为0时，不能加入购物车
                    responseTip(1,"没有库存了，亲！");

                }else{

	                var gid = $(this).attr("data-id");//商品主键id
	                var gpid = 0;
	                if(standard == 1){//商品为“多规格”时
	                    var gpid = $(this).attr("data-gpid");//属性组合套餐主键
	                }else{//商品为“统一规格”时
	                    gpid = 0;//置为0，代表商品为统一规格，无套餐属性
	                }

	                //加入购物车
	                $.ajax(
	                    {
	                        url:"./index.php?c=store&a=addCartGoods",
	                        type:"post",
	                        data:{"gid":gid,"gpid":gpid,"count":quantity},
	                        dataType:"json",
	                        success:function(json,statusText){
	                            if(json.errorCode == 0){
	                                //操作成功,跳转到购物车页面
	                                //window.location.href = "./index.php?c=store&a=cartList";
	                                $("#addCartModal").modal('hide');
	                                //$(".access-cart").show();
	                                if($(".bottom-nav .mycart .cart-icon .cart-num").length == 1){
	                                	$(".bottom-nav .mycart .cart-icon .cart-num").text(parseInt($(".bottom-nav .mycart .cart-icon .cart-num").text()) + 1);
	                                }else{
	                                	$(".bottom-nav .mycart .cart-icon").append('<span class="cart-num">1</span>');
	                                }

	                            }else{
	                                //操作失败
	                                responseTip(1,"系统繁忙，请稍后再试！");

	                            }
	                        },
	                        error:errorResponse
	                    }
	                );
                }
            }
        });

		/**
         * 立即购买,跳到提交订单页面，确认提交
         */
        $("#addCartModal .buy-now").click(function(){
            if(!CAN_BUY){//
                if($(this).parents(".modal-footer").length > 0){
                    $("#addCartModal .property-group-area").css("border","1px solid #c00");
                }
                showCartModal();//若不满足条件，引导购买
                return false;
            }else{
            	var count = parseInt($("#addCartModal .quantity-area .quantity-value").val());//商品数量
                var inventory = parseInt($("#addCartModal .cart-goods-info .inventory-area .inventory").text());//库存
                if(inventory == 0 || inventory < count){
                    //库存为0时，不能加入购物车
                    responseTip(1,"没有库存了，亲！");
                }else{
                    //生成待付款订单,跳转到待付款订单页面，进行支付
                    var gid = $(this).attr("data-id");
                    var gpid = 0;
                    if(standard == 1){//商品为“多规格”时
                        var gpid = $(this).attr("data-gpid");//属性组合套餐主键
                    }else{//商品为“统一规格”时
                        gpid = 0;//置为0，代表商品为统一规格，无套餐属性
                    }


                    //跳到到提交订单界面，确认提交将生成订单--》确认支付
                    window.location.href = "./index.php?c=store&a=confirmOrder&gids="+gid+"&gpids="+gpid+"&counts="+count;

                }

                return false;
            }
        });

        //用户变化屏幕方向时调用
        $(window).bind( 'orientationchange resize', function(e){
            var width =  $("#container").width();//获取内容区域的宽度

        });


        /**数量输入框键盘事件--输入非数字无效**/
        $(".quantity-area .quantity-value").keyup(function() {
            var quantity = $(this).val();
            var ereg = /^[0-9][0-9]{0,4}$/;
            if( quantity !="" && ereg.test(quantity)){
                //非空且合法
            }else if ( quantity !="" && !ereg.test(quantity)){
                //非空且不合法
                $(this).val(1);
            }
        }).blur(function(){
                //失去焦点事件
                var quantity = $(this).val();
                if(quantity == ""|| quantity == 0){
                    $(this).val(1);

                }
        });

        /**商品数量添加事件**/
        $('.quantity-area .quantity-plus').click(function() {
            var qElem = $('.quantity-area .quantity-value');
            var value = parseInt(qElem.val());
            var now = value + 1;
            qElem.val(now);
        });
        /**商品数量减少事件**/
        $('.quantity-area .quantity-minus').click(function() {
            var qElem = $('.quantity-area .quantity-value');
            var value = parseInt(qElem.val());
            var now = value - 1;
            if(now < 1){
                now = 1;
            }
            qElem.val(now);
        });

    }

    /**
     * 分页渲染
     */
    function render(){
        var selectInfo = {
            page_num : pageOption.page_num,
            page_size : pageOption.page_size,
        };
        pageForm = {
            url:"./index.php?c=dining&a=pagingRecommend",
            data:selectInfo,
            success:function(result ,statusText){
                if(result.errorCode == 0 ){
                    var html = "";
                    var myList = result.data;
                    var order_count = myList.length;
                    //渲染预约列表
                    for(var i = 0; i < order_count;i++){
                        var obj = myList[i];
                        var id = obj.id;
                        var img_url = obj.img_url || '';
                        var thumb = obj.thumb;
                        var name = obj.shop_name;
                        var address = obj.address;
                        var content = obj.content;
                        var send_price = obj.send_price;
                        var total_count = obj.total_count;

                        var score = obj.score;
                        var star = obj.star;

                        var starHtml = '';
                        if(star > 0){
                        	var unstar = 7 - star;
                        	for(var k = 0; k < star; k++){
                        		starHtml +='<i class="icon iconfont star">&#xe641;</i>';
                        	}
                        	for(var l = 0; l < unstar; l++){
                        		starHtml +='<i class="icon iconfont unstar">&#xe642;</i>';
                        	}
                        	starHtml += '<em style="color:green; padding-left:0px;font-size:16px;">'+score+'分</em>';
                        }

						var shopMessage = "";
						var sexHtml = "";
						if(is_plate_time == 1){//超级邦订餐时间
							shopMessage = '<p><span style="color:green;">该时间段由超急邦配送至寝室</span></p>';
	                        var maleSender = obj.maleSender;
	                        var femaleSender = obj.femaleSender;
	                        var maleSenderHtml = "";
	                        var femaleSenderHtml = "";
	                        if(maleSender == 0){
	                       		maleSenderHtml = '<span style="color:red;">无</span>';
	                        }else{
	                        	maleSenderHtml = '<span style="color:green;">有</span>';
	                        }
	                        if(femaleSender == 0){
	                        	femaleSenderHtml = '<span style="color:red;">无</span>';
	                        }else{
	                        	femaleSenderHtml = '<span style="color:green">有</span>';
	                        }
	                        sexHtml =  '<span class="sender-male">男配送员：'+maleSenderHtml+'</span>&nbsp;|&nbsp;<span class="sender-female">女配送员：'+femaleSenderHtml+'</span>';
						}else{//商家自主送餐时间
							shopMessage = '<span style="color:#e57f23;">该时间段由商家配送至楼下，可预订送寝室</span>';
						}

                        var shopInfoHtml = "";
                        var discount = (obj.discount*10).toFixed(1);
                        var full_cut = obj.full_cut;
                        var is_full_cut = obj.is_full_cut;
                        var is_discount = obj.is_discount;
                        if(is_full_cut == 1){
                        	var fullCutHtml = "";
                        	if(full_cut){
	                        	for(var j = 0; j < full_cut.length; j++){
	                        		var fullCut = full_cut[j];
	                        		fullCutHtml += '满'+fullCut.full_price+'减'+fullCut.cut_price+' ';
	                        	}
	                        	shopInfoHtml = '<span class="full-cut-price"><i class="icon iconfont item-discount">&#xe7fe;</i>'+fullCutHtml+'</span>';
                        	}
                        }else if(is_discount == 1){
                        	shopInfoHtml = '<span class="full-cut-price"><i class="icon iconfont item-full-cut">&#xe878;</i>全场'+discount+'折</span>';
                        }

                        html += '<a href="./index.php?c=dining&a=shopInfo&shop_id='+id+'" class="goods-list">'
                             + '<img src="'+thumb+'" class="goods-img" />'
                             + '<div class="goods-name limit-text">'+name+'</div>'
                             + '<div class="goods-address limit-text">口碑：'+starHtml+'</div>'
                             + '<div class="goods-address limit-text">'+address+'</div>'
                             + '<div class="goods-info limit-text">送寝室时间：'+shop_sender_time+'</div>'
                             + '<div class="goods-price">配送费0</div>'
                             + '<span class="goods-sale">月售'+total_count+'份</span>'
                             //注释段代码为显示是否有男女配送员，因需求改变故注释此段，如有类似需求，可放出来

							 + sexHtml
							 + shopMessage
							 + shopInfoHtml
                             +'</a>';

                    }
                }else{
                    $(".order-count").text(0);
                }

                operateScroll(result,html);
            }
        }
        $.ajax($.extend(pageForm,scrollForm));
    }


    /**
     * 显示弹出框
     */
    function showCartModal(){
        if(!$("#addCartModal").hasClass("modal-show")){
            //当前未显示时，将其显示
            $("#addCartModal .quantity-operation-area .quantity-value").val(1);
            $("#addCartModal").modal('show');
        }
    }

    //商品属性选择事件
    function propertySelectedEvent(){
        $("#addCartModal .property-group-area").css("border","none");
        var _this = $(this);
        if(_this.parent().hasClass("prop-not-allowed")){
            //提示禁选选项值 无点击事件
            return false;
        }
        var selected_index = _this.parents(".goods-property-item").attr("data-property-index");//当前点击选中的属性顺序排序值(1/2/3)
        var clickFlag = true;//标识当前点击选项操作，true选中,false取消选中
        if(_this.parent().hasClass("prop-selected")){
            clickFlag = false;
            //当前属性已被选中，则将取消当前选中状态
            _this.parent().removeClass("prop-selected");
            //同时取消其他属性值选项不可点击选中状态标识
        }else{
            clickFlag = true;//代表点击选中操作
            //属性选中效果
            _this.parents("ul").find("li").removeClass("prop-selected");
            _this.parent().addClass("prop-selected");
        }

        //查找所有选中的和已知数组进行比较
        var subList = [];
        var _item = $(".modal-show .property-group-area .prop-selected");
        var total_times = $(".modal-show .property-group-area .goods-property-item").length;//所有的属性个数
        var selected_times = _item.length;//选中的个数
        $.each(idList,function(key,value){
        	var exists_times = 0;//匹配在数组中的个数
        	_item.each(function(){
        		var key = parseInt($(this).attr("data-key"));
        		if($.inArray(key,value.ids) < 0) return false;
        		exists_times ++;
            });
        	if(selected_times == exists_times && selected_times == total_times){//全部选中
        		subList = $.makeArray(value.ids);
        		var data = value;
        		CAN_BUY = true;
        		$(".price .price-value").html(data.price);//重置价格
                $(".price .ori-price").html(data.ori_price);//重置原价
                $(".price .inventory").html(data.inventory);//重置库存
                $(".modal-show .price .inventory-area").show();//显示库存
                $(".modal-show .price .ori-price-info").show();//显示原价
                $(".add-cart").attr("data-gpid",data.id);//套餐主键id
                $(".buy-now").attr("data-gpid",data.id);
        		return false;
        	}else{//部分选中或未选中
        		CAN_BUY = false;
        		var price = $(".modal-show .price .price-value").attr("data-price");
        		var ori_price = $(".modal-show .price .ori-price").attr("data-price");
        		var inventory = $(".modal-show .price .inventory").attr("data-inventory");
                $(".price .price-value").html(price);
                $(".price .ori-price").html(ori_price);
                $(".price .inventory").html(inventory);
    			$("#addCartModal .modal-title .ori-price-info").hide();//隐藏原价
    			$("#addCartModal .modal-title .inventory-area").hide();//商品库存隐藏
                if(selected_times == exists_times){//部分选中
        			subList = $.unique(subList.concat($.makeArray(value.ids)));
        		}
        	}

        });
        if(total_times > 1){
	        $(".modal-show .property-group-area .goods-property-item li").each(function(){
	        	if($.inArray(parseInt($(this).attr("data-key")),subList) == -1){//不存在
	        		$(this).addClass("prop-not-allowed");
	        	}else{
	        		$(this).removeClass("prop-not-allowed");
	        	}
	        });
        }
    }

    //根据属性生成属性选项
    function valueList(valueList){
    	var list = '';
    	for(var j = 0;j < valueList.length; j++){
    		var value = valueList[j];
    		list +='<li data-key="'+(k++)+'" data-value="'+value+'"><a class="property-value" href="javascritp:;">'+value+'</a><i>已选中</i></li>';
    	}
    	return list;
    }

    //获取猜你喜欢
    function getGuessUlike(){

    }
    init();
});