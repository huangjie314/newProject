/**
 * 练习详情界面js
 * @author lynn
 * @since 2016-07-26
 */

$(function(){
	var shop_sender_time = $('#container .goods-wrap').attr('data-sender-time');
	var is_plate_time = $('#container .goods-wrap').attr('data-is-plate-time');
    /**
     * 初始化
     */
    function init(){
       /* getPageOption($("#get-more"),{});*/
    	isPageScroll(function(){render(0)});
        bindEvent();
        render(1);
    }

    /**
     * 绑定事件
     */
    function bindEvent(){
    	$(".top-area .top-item").click(function(){
    		var _this = $(this);
    		if(_this.hasClass("active")){
	    		if(_this.hasClass("all")){//全部
	    			return;
	    		}else if(_this.hasClass("rank")){//销量
	    			_this.removeClass("active");
	    			$('.top-item.rank .sale').html('&#xe6f4;');
	    			render(1);
	    		}else{//筛选
	    			if($(".top-area .top-item .select").hasClass("rotate")){//影藏状态
		    			$(".top-area .top-item .select").removeClass("rotate").addClass("rerotate");
		    			$("#container .label-area").fadeOut(250).delay(250).addClass("hidden");
	    			}else{//显示状态
	    				$(".top-area .top-item .select").removeClass("rerotate").addClass("rotate");
	    				$("#container .label-area").removeClass("hidden").fadeIn(250);
	    			}
	    		}
    		}else{
    			if(_this.hasClass("all")){//全部
    				if($(".top-area .list").hasClass("active")){
    					$(".top-area .list").removeClass("active");
	    				$(".top-area .top-item .select").removeClass("rotate").addClass("rerotate");
	    				$("#container .label-area").fadeOut(250).delay(250).addClass("hidden");
	    				$("#container .label-area .label-list.active").removeClass("active");
    					$(".top-area .top-item .label-name").text("筛选");
    				}
    				_this.addClass("active");
    				render(1);
	    		}else if(_this.hasClass("rank")){//销量
	    			_this.addClass("active");
	    			$('.top-item .sale').html('&#xe6f9;');
	    			render(1);
	    		}else{//筛选
	    			$(".top-area .all").removeClass("active");
	    			$(".top-area .top-item .select").removeClass("rerotate").addClass("rotate");
	    			$("#container .label-area").removeClass("hidden").fadeIn(250);
	    			_this.addClass("active");

	    		}

    		}
    	})

    	//点击标签
    	$("#container .label-area .label-list").click(function(){
    		var _this = $(this);
    		$(".top-area .label-name").text(_this.find(".label-name").text());
    		_this.siblings(".active").removeClass("active");
    		$(".top-area .top-item .select").removeClass("rotate").addClass("rerotate");
    		_this.addClass("active").parents(".label-area").fadeOut(250).delay(250).addClass("hidden");
    		render(1);
    	});

    	//搜索
    	$(".search-area .search-btn").click(function(){
            render(1);
        });
        //enter事件
        $(".search-area .search-input").keydown(function(event){
            event = event ? event:window.event;
            if(event.keyCode == 13){
                render(1);
            }
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

    	var id = $(".label-area .label-list.active").attr("data-gids");
    	var shop_name = $(".search-area .search-input").val().trim();
    	var sort = $(".top-area .rank").hasClass('active') ? 1 : 0;
        var selectInfo = {
        	shop_name:shop_name,
        	id :id,
        	sort:sort
        };
        selectInfo.page_num = pageOption.page_num;
        selectInfo.page_size = pageOption.page_size;
        pageForm = {
            url:"./index.php?c=dining&a=pagingShop",
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
								+ '<img src="'+obj.thumb+'" class="goods-img" />'
								+ '<div class="goods-name limit-text">'+obj.shop_name+'</div>'
								+ '<div class="goods-address limit-text">口碑：'+starHtml+'</div>'
								+ '<div class="goods-address limit-text">'+obj.address+'</div>'
								+ '<div class="goods-info limit-text">配送时间'+shop_sender_time+'</div>'
								+ '<div class="goods-price">配送费0</div>'
								+ '<span class="goods-sale">月售'+obj.total_count+'份</span>'
//								+ '<span class="sender-male">男配送员：'+maleSenderHtml+'</span>&nbsp;|&nbsp;'
//	                            + '<span class="sender-female">女配送员：'+femaleSenderHtml+'</span>'
								+ sexHtml
							 	+ shopMessage
							 	+ shopInfoHtml
	                            +'</a>';
                    }
                }
                operateScroll(result,html);
            }
        }
        $.ajax($.extend(pageForm,scrollForm));
    }

    init();
});