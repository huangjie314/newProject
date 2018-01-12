/**
 * 微商城--首页js
 */

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
        //查看订单
        $(".order-area .quick-btn .order-btn").click(function(){
            //订单个数为0时，不跳转
            var num = parseInt($(this).find(".num").text());
            if(num == 0){
                return false;
            }else{
                var href = $(this).attr("data-href");
                window.location.href = href;
            }
        });

    }
    init();
});