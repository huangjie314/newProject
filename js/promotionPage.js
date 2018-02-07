$(function(){
    function init(){

        var width = $("#container").width();//计算当前窗口的宽度
        $("#container #myBottomNav").width(width);//将底部导航的宽度设置与移动设备相同
        $("#container .distribute-guide").width(width-20);
        $("#container #myBottomNav").css("display","block");

        bindEvent();
    }

    function bindEvent(){

    	$('.share-btn').click(function(){
    		$(".guide").show();
    	});


        $(".guide").click(function(){
            $(this).hide();
        });
    }

    init();
});