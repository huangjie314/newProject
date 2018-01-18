/**
 * 练习详情界面js
 * @author lynn
 * @since 2016-07-26
 */

$(function(){
	var param = window.location.search;
	var shop_id = param.split('shop_id=')[1];
	var cid = 0
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
    	//点击分类
    	$(".dining-wrap .cate-list").click(function(){
    		var _this = $(this);
    		if(_this.hasClass("active")){
    			return false;
    		}
    		
    		if(_this.hasClass('fir')){
    			$('.dining-wrap .cate-list.active').removeClass('active');
    		}else if(_this.hasClass('sec')){
    			$('.dining-wrap .sec.active').removeClass('active');
    			$('.dining-wrap .thr.active').removeClass('active');
    		}
    		var act_this = $(".dining-wrap .cate-list.active");
    		//添加新的active样式
    		_this.addClass("active");
    		if(!_this.next().is(":visible")){
	    		if(_this.hasClass('fir')){
	    			$(".dining-wrap .sec-cate:visible").slideUp(250,"linear");
	    		}else if(_this.hasClass('sec')){
	    			$(".dining-wrap .thr-cate:visible").slideUp(250,"linear");
	    		}
	    	}
    		//移除active样式
    		if(act_this.nextAll().find('.active').length == 0 ){
    			act_this.removeClass('active');
    		}
    		//展示下级
    		if(_this.next().length != 0){
    			_this.nextAll().slideDown(250,"linear");
    		}
    		cid = _this.attr("data-id");
    		render();//渲染页面
    	})
    	
    	//点击减数量
	    $("#container").on("click",".minus",function(){
	    	var _this = $(this);
	    	var gid = _this.attr("data-id");
	    	var num = parseInt(_this.next().text())-1;
	    	_this.next().text(num);
	    	$(".dining-area .goods-num[data-id='"+gid+"']").text(num);
	    	if(num <= 0){
	    		if(_this.parents('.cartList-wrap').length > 0){//购物车列表中
	    			_this.parents('tr').remove();
	    		}
	    		$(".dining-area .minus[data-id='"+gid+"'],.dining-area .goods-num[data-id='"+gid+"']").fadeOut(250).delay(250).addClass("hidden");
	    	}
	    	renderCartData(gid,num,0,0);
	    });
	    
	    //数量加
	    $("#container").on("click",".add",function(){
	    	var _this = $(this);
	    	var gid = _this.attr("data-id");
	    	var num = parseInt(_this.prev().text())+1;
	    	if(_this.parents('.cartList-wrap').length > 0){//购物车列表中
    			_this.prev().text(num);
    		}
	    	$(".dining-area .goods-num[data-id='"+gid+"']").text(num);
    		$(".dining-area .minus[data-id='"+gid+"'],.dining-area .goods-num[data-id='"+gid+"']").removeClass("hidden").fadeIn()
	    	renderCartData(gid,num,1,0);
	    });
        
        //关闭开启购物车列表
        $(".cart-wrap").click(function(){
        	$(".cartList-wrap").fadeToggle();
        });
        $(".shut-off").click(function(){
        	$(".cartList-wrap").fadeOut();
        })
        
        //清空购物侧
        $("#container .cartList-wrap .clear-cart").click(function(){
        	var _this = $(this);
        	var ids = _this.attr('data-id');
        	if(ids != 0){
        		showConfirmDialog("#dangerConfirmDialog","清空购物车",'确定要清除购物车么？','','3000',function(){
        			var data = {ids:ids};
        			var url = "./index.php?c=dining&a=emptyCart";
        			getAjaxOption(data,url,function(result){
        				if(result.errorCode == 0){
        					renderCartData(0,0,0,1);
        				}else{
        					showDialog("#errorDialog","操作失败",result.errorInfo,'','3000');
        				}
        			})
        		})
        	}
        });
        
        //点击去付款
        $("#container .bottomNav").on("click",".payment.able.active",function(){
        	window.location.href = "./index.php?c=dining&a=confirmOrder&shop_id="+shop_id;
        });
        
        $(".banner-tap .choose-goods").click(function(){
        	$(this).addClass("cur");
        	$(this).siblings().removeClass('cur');
        	$('.goods-list-area').addClass('current');
        	$('.shop-list-area').removeClass('current');
        	$('.bottomNav.cf').show();
        	$('.cart-wrap').show();
        });
        $(".banner-tap .shop-detail").click(function(){
        	$(this).addClass("cur");
        	$(this).siblings().removeClass('cur');
        	$('.shop-list-area').addClass('current');
        	$('.goods-list-area').removeClass('current');
        	$('.bottomNav.cf').hide();
        	$('.cart-wrap').hide();
        });
        
	}
    
    /**
     * 维护相关数据
     */
    function renderCartData(gid,count,add,is_delete){
    	var url = "./index.php?c=dining&a=updateCartGoods";
    	var data = {shop_id:shop_id,gid:gid,count:count,add:add,delete:is_delete};
    	getAjaxOption(data,url,function(result){
    		var _this = $("#container .cartList-wrap .cart-goods-list");
    		var html = "";
    		var total_price = result.data.total_price || 0;
    		var total_num = result.data.total_num || 0;
    		var ids = result.data.ids || 0;
    		//相关维护
    		$("#container .cartList-wrap .clear-cart").attr("data-id",ids);
			$("#container .cart-wrap .num").text(total_num);
			$("#container .bottomNav .cart-total-price").text(total_price);
			var _pay = $("#container .bottomNav .payment");
			
			if(total_price > 0){
				_pay.addClass("active");
			}else{
				_pay.removeClass("active");
			}
    		
    		if(result.errorCode == 0){//有结果
    			for(i = 0;i<result.data.subList.length;i++){
    				var obj = result.data.subList[i];
	    			var id = obj.id;
	    			
	    			html += '<tr>'
	        				+ '<td class="col-1">'+obj.name+'</td>'
	        				+ '<td class="col-2"><i class="icon iconfont">&#xe604;</i>'+obj.price+'<span class="unit">/份</span></td>'
	        				+ '<td class="col-3">'
	        					+ '<div class="goods-count-area">'
		        					+ '<span href="javascript:" class="minus" data-id="'+obj.gid+'"><i class="icon iconfont">&#xe6d0;</i></span>'
		        					+ '<span class="goods-num">'+obj.count+'</span>'
		        					+ '<span href="javascript:" class="add" data-id="'+obj.gid+'"><i class="icon iconfont">&#xe6ce;</i></span>'
	    						+ '</div>'
	    					+ '</td>'
	    				+ '</tr>';
    			}
    		}else{//无结果
    			html = '<tr class="no-content"><td colspan="3"><i class="icon iconfont">&#xe78c;</i>不好意思！您的购物车空空~~哦！</td></tr>';
    		}
    		_this.html(html);
    	},false);
    }
    
    init();
});