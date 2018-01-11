$(function(){
	var width=$("#container").width();
	
    //初始化
    function init(){
        bindEvent();
    }

    //绑定事件
    function bindEvent(){
    	
    	//关闭自定义弹框
    	$(".my-dialog .icon-close,.my-dialog .btn-cancel-oper").click(function(){
    		$(this).parents(".my-dialog").hide();//隐藏弹框
    		$("#maskDialog").hide();//隐藏遮罩层
    	});
    	
    	//用户变化屏幕方向时调用
	    $(window).bind( 'orientationchange resize', function(e){
	        centerDialog("#loadingDialog");
	        centerDialog("#skipDialog");
	        centerDialog("#alertDialog");
	        centerDialog("#errorDialog");
	        centerDialog("#normalDialog");
	        centerDialog("#successDialog");
	        centerDialog("#dangerConfirmDialog");
	        centerDialog("#successConfirmDialog");
	    });
    }

    init();
})

/**
 * 显现自定义弹框 
 * @param selector 弹框选择器：loadingDialog/skipDialog/alertDialog/errorDialog/normalDialog/successDialog
 * @param title 弹框标题
 * @param desc 弹框描述
 * @param icon 弹框标题icon
 * @param time 弹框显现时长（毫秒）
 */
function showDialog(selector,title,desc,icon,time,callback){
	typeof(timeOut) == "undefined" ? '' : clearTimeout(timeOut);
	if(title !=""){
		$(selector).find(".title-text").html(title);
	}
	if(desc !=""){
		$(selector).find(".desc-text").html(desc);
	}
	if(icon != "" && icon != undefined){
		$(selector).find(".title-icon .icon").html(icon);
	}
	centerDialog(selector);
	if(selector !="#loadingDialog"){
		$("#maskDialog").show();	
	}else{
		$("#otherMaskDialog").show();
	}
	
	$(selector).show();
	//绑定知道了回调事件
	if(callback !=undefined && callback !=""){
		$(selector).find(".btn-cancel-oper").one('click',function(){
			callback();
			hideDialog(selector);
		});
	}
	if(time !="" && time > 0){//超时自动关闭弹框
		timeOut = setTimeout(function(){
			if(callback !=undefined && callback !=""){//判断是否有回调函数，执行回调函数
				callback();
			}
			$(selector).hide();
			if(selector !="#loadingDialog"){
				$("#maskDialog").hide();
			}else{
				$("#otherMaskDialog").hide();
			}
			
		},time);
	}
}

/**
 * 关闭弹框
 * @param selector 弹框选择器
 */
function hideDialog(selector){
	$(selector).hide();
	if(selector !="#loadingDialog"){
		$("#maskDialog").hide();
	}else{
		$("#otherMaskDialog").hide();
	}
}

//自定义确认对话框，返回true或false,确认或取消操作
function myConfirmModal(alertInfo,callback){//参数，当前操作提示文本
	if(alertInfo == undefined || alertInfo == ""){
		alertInfo = "确认当前操作吗？";
	}
	$("#myConfirmModal .modal-body").html("<p class='desc-text'>"+alertInfo+"</p>");
	$("#myConfirmModal").modal('show');//对话框显现

	//确认对话框--确认操作
	$("#myConfirmModal .btn-confirm").one('click',function(){
		$("#myConfirmModal").modal('hide');//对话框显现
		callback();//调用回调函数
	});
}
//此事件在模态框被隐藏（并且同时在 CSS 过渡效果完成）之后被触发。
$('#myConfirmModal').on('hidden.bs.modal', function (e) {
	// do something...
	$("#myConfirmModal .btn-confirm").off("click");
});

/**
 * 显现自定义确认弹框 
 * @param selector 弹框选择器:dangerConfirmDialog/normalConfirmDialog/successConfirmDialog
 * @param title 弹框标题
 * @param desc 弹框描述
 * @param icon 弹框标题icon
 * @param time 弹框显现时长（毫秒）
 * @parsm callback 确认回调事件
 */
function showConfirmDialog(selector,title,desc,icon,time,callback){
	typeof(timeOut) == "undefined" ? '' : clearTimeout(timeOut);
	if(title !=""){
		$(selector).find(".title-text").html(title);
	}
	if(desc !=""){
		$(selector).find(".desc-text").html(desc);
	}
	if(icon !=""){
		$(selector).find(".title-icon icon").html(icon);
	}
	//绑定确认回调事件
	if(callback !=null && callback !=""){
		$(selector).find(".btn-confirm-oper").one('click',function(){
			callback();
			hideDialog(selector);
		});
	}
	centerDialog(selector);//弹框垂直居中
	$("#maskDialog").show();
	$(selector).show();//弹框显现
	if(time !="" && time > 0){//超时自动关闭弹框
        timeOut = setTimeout(function(){$(selector).hide();$("#maskDialog").hide();},time);
	}
}

//使弹框居中显示
function centerDialog(selector){
	var wHeight = $(window).outerHeight();
	var height = jQuery(selector).outerHeight();
	var top = (wHeight - height)/2;
	$(selector).css("top", top);
}

//提交用户表单时的校验规则
function formValidation(arr, $form, options) {
    // 如果JQuery.Validate检测不通过则返回false
    if(!$form.valid()){
        return false;
    }
    for(var i=0;i<arr.length;i++){
        //去除前后空格
        if(arr[i].type !='file'){
            arr[i].value=$.trim(arr[i].value);
        }
    }
}
//提交表单时的配置
var formOptions = {
    beforeSubmit : formValidation,
    type : 'post',
    dataType : 'json',
    clearForm : false, // clear all form fields after successful submit
    resetForm : false
};
/**
 * 提交系统配置信息的表单配置
 */
var options={
    success:successResponse,
    /*beforeSend:function(xhr){
        //显示“加载中。。。”
        $("#loading").modal('show');
    },
    complete:function(){
        //隐藏“加载中。。。”
        $("#loading").modal('hide');
    },*/
    error:errorResponse
};
/**
 * 添加息得到服务器响应的回调方法
 */
function successResponse(json,statusText){
    showDialog("#successDialog","操作成功！","恭喜您操作成功了");
}
/**
 *请求添加失败时（如网络不通畅、超时等）的回调方法
 */
function errorResponse(XMLHttpRequest,textStatus,errorThrown){
    showDialog("#errorDialog","操作失败！","对不起发生网络异常了");
}
/**
 * 利用bootpag插件完成
 * 分页查询方法
 * @param selector 分页页码所在选择器内
 * @param option 插件自定义配置选择
 * @param callback 翻页事件回调函数
 */
//初始化配置
var pageOption = {
    total:1,//总页数
    total_count:0,//总记录数
    page:1, //当前显示页
    pageSize:20, //每页显示的记录数
    maxVisible:4//每页最多显示的页码链接
};//分页配置项
var selectInfo = {};//模糊查询配置参数
function pagination(selector,option,callback){
    $.extend(true,pageOption,option);
    $(selector).bootpag(pageOption).on("page", function(event, pageIndex){//当前页
        //动态加载渲染数据
        callback(true,pageIndex,pageOption.pageSize);
    });
}
String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g,"");
};

function ConfirmModal(selector,title,desc,callback){
    if(title == undefined || title == ""){
        title = "对话框";
    }
    if(desc == undefined || desc == ""){
        desc = "确定要这么操作吗";
    }
    if(title !=""){
        $(selector).find(".title-text").html(title);
    }
    if(desc !=""){
        $(selector).find(".desc-text").html(desc);
    }
    $(selector).modal('show');//对话框显现

    //确认对话框--确认操作
    $(selector).find(".btn-confirm-oper").one('click',function(){
        $(selector).modal('hide');//对话框显现
        callback();//调用回调函数
    });
    //确认对话框--取消操作
    $(selector).find(".btn-cancel-oper").one('click',function(){
        $(selector).modal('hide');//对话框隐藏
    });
    //确认对话框--关闭操作
    $(selector).find(".icon-close").one('click', function(){
        $(selector).modal('hide');//对话框隐藏
    });
}

