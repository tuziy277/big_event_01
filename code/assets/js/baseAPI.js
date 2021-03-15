// 1 开发环境服务器地址
let baseURL = "http://api-breakingnews-web.itheima.net";
// 2 测试环境服务器地址

// 3 生产环境服务器地址



// 拦截所有ajax请求 get/post /ajax
// 处理参数
$.ajaxPrefilter(function (options) {






    // 1、手动为url添加路径前缀            拼接对应环境的服务器地址
    options.url = baseURL + options.url;



    // 2 给带 /my/ 的路径添加 Authorization 属性值

    if (options.url.indexOf('/my/') != -1) {
        // 属性值要 = 赋值
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }



        // 3 拦截所有响应，判断身份认证信息
        options.complete = function (res) {
            // 本来写在 请求函数后面 但是基本带/my/的接口都要使用这个 所以优化在baseAPI里面

            // console.log(res.responseJSON);
            let obj = res.responseJSON;
            // 如果身份认证失败  要用后台返回的数据最好复制 不然有可能符号打错
            if (obj.status == 1 && obj.message == '身份认证失败！') {
                // 1 清空本地token
                localStorage.removeItem('token');
                // 2 跳转到登录页面
                location.href = '/code/login.html'

            }





        }




    }


})