$(function () {

    // 定义一个遍历 为layui里面form属性
    let form = layui.form;


    // form属性里面有一个方法 verify 用对象
    form.verify({

        nickname: function (value) {
            if (value.trim().length <= 1 || value.trim().length > 6) {
                return "输入的昵称需要在2~6位之间";
            }

        }



    })

    // 2 渲染个人资料
    initUserInfo();

    // 导出 
    let layer = layui.layer;

    // 封装函数
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',

            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);

                }

                // 成功后渲染
                form.val('formUserInfo', res.data)
            }
        })
    }


    // 3 重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault();

        //用上面的方法重新渲染
        initUserInfo();
    })



    // 修改用户的资料

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();

        // console.log($(this).serialize());
        //console.log($(this));
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);


                if (res.status !== 0) {

                    return layer.msg('用户信息修改失败')
                }
                layer.msg("恭喜您，用户信息修改成功！")

                // 用这个页面在父页面下 而渲染方法挂在全局 
                // 调用父页面中的更新用户信息和头像的办法
                //console.log(window.parent);

                window.parent.getUserInfo();
            }
        })

    })



})