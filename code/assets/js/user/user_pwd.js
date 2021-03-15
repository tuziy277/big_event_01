$(function () {

    let form = layui.form;

    form.verify({
        // 原密码
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        // 新密码不能跟原密码一致
        samePwd: function (value) {

            if ($('[name=oldPwd]').val() === value) {
                return "新密码不能跟原密码一致"
            }

        },

        rePwd: function (value) {

            if ($('[name=newPwd]').val() !== value) {
                return "新密码要跟确认密码一致"
            }
        }



    })



    // 修改密码
    $('.layui-form').on('submit', function (e) {

        e.preventDefault();
        //console.log(11);
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }

                layui.layer.msg("修改密码成功!");
                // 重置表单
                $('.layui-form')[0].reset();

            }
        })
    })


})