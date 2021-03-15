// 入口函数
$(function () {

    // 1 用于获取用户信息
    getUserInfo();


    $('#btnLogOut').on('click', function () {
        layer.confirm('是否退出登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 退出清除token值
            localStorage.removeItem('token');
            // 转接到登录页面
            location.href = '/code/login.html'
            // layer在 layui已经定义好
            layer.close(index);
        });
    })

})


// 用于获取用户信息 要设置为全局函数   因为之后其他要调用到

function getUserInfo() {
    // 发送ajax
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     // 重新登录，因为token过期事件12小时
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }

            // 请求成功渲染头像
            renderAvatar(res.data);
        }
    })
}


function renderAvatar(user) {
    // 1 渲染名称 （nickname优先，如果没有，就用username）
    //console.log(user);
    let name = user.nickname || user.username;

    $('#welcome').html('欢迎&nbsp&nbsp' + name);

    // 2 渲染头像
    if (user.user_pic !== null) {
        // 有头像
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        // 没有头像
        $('.layui-nav-img').hide();
        let text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
    }





}