$(function () {
    // 需求1 点击显示注册框
    // 点击显示注册框 隐藏登录框
    $('#go_reg').on('click', function () {

        $('.reg_box').show();
        $('.login_box').hide();
    })

    // 点击显示登录框 隐藏注册框
    $('#go_login').on('click', function () {

        $('.login_box').show();
        $('.reg_box').hide();
    })


    // 需求二  密码框验证

    let form = layui.form;
    // verify里面是写的是对象
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            // 选择注册里面的密码 属性选择器
            let pwd = $('.reg_box input[name=password]').val()
            if (value !== pwd) {
                return "俩次密码输入不一致"
            }

        }

    })

    // 需求3 注册功能实现
    let layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg_box input[name=username]').val(),
                password: $('.reg_box input[name=password]').val()
            },
            success: function (res) {
                // 放回状态
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                } else {
                    // 提交成功后处理的代码
                    layer.msg(res.message, { icon: 6 });

                    // 手动切换菜单 
                    $('#go_login').click();

                    // 重置表单
                    $('#form_reg')[0].reset();
                }
            }
        })
    })


    // 需求4 登录功能实现
    $('#form_login').on('submit', function (e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 返回状态
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                // 提示信息 保存token 跳转到后台
                layer.msg(res.message, { icon: 6 });
                // 保存token
                localStorage.setItem('token', res.token);
                // 跳转到后台
                location.href = "/code/index.html";
            }
        })
    })



















})