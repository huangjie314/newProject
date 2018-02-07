$(function(){
	
	function init(){
		bindEvent();
	}
	
	function bindEvent(){
		$('.receive-btn').click(function(){
			if($(this).hasClass('unable-click')){
				return false;
			}
			var rid = $(this).attr('data-rid');
			$.ajax({
				type:"post",
				url:"./index.php?c=dining&a=getRedPacketMoney",
				async:true,
				data:{rid:rid,type:0},
				dataType:'json',
				success:function(json){
					if(json.errorCode == 0){
						showDialog("#successDialog",'恭喜领取成功'," ",'','',function(){
							window.location.href = "./index.php?c=dining&a=redPacket&type=0&rid="+rid+"&r="+Math.random();
						});
					}else if(json.errorCode == 1){
						showDialog('#alertDialog',json.errorInfo," ");
					}else if(json.errorCode == 2){
						showDialog('#alertDialog',json.errorInfo," ",'','',function(){
							$(".follow-wechat-number").show();
						});
					}
				},
				error:function(){
					showDialog("#errorDialog","网络异常，请求失败"," ");
				}
			});
		});
		
		//隐藏关注
		$(".follow-wechat-number").click(function(){
			$(".follow-wechat-number").hide();
		});
		
		//显示立即分享
		$('.share-btn').click(function(){
			$('.guide').show();
		});
		//隐藏立即分享
		$('.guide').click(function(){
			$('.guide').hide();
		});
		
		$('.list-btn-item').click(function(){
			$(this).addClass('active').siblings().removeClass('active');
			if($('.packet-list-button').hasClass('active')){
				$('.packet-list-area').show();
				$('.packet-rule-area').hide();
			}
			if($('.active-list-button').hasClass('active')){
				$('.packet-list-area').hide();
				$('.packet-rule-area').show();
			}
		});
		
		
	}
	
	
	
	
	
	
	
	
	
	
	
	init();
});
