$(function () {


    let layer = layui.layer;
    initArtCateList();
    // 函数封装 获取文章列表
    function initArtCateList() {

        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                //  console.log(res);
                // 判断状态
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 模板渲染
                let htmlStr = template('tpl-art-cate', { data: res.data })

                $('tbody').html(htmlStr);


            }

        })
    }


    // 设置一个index给close当索引
    let indexAdd = null;

    // 显示添加文章分类列表
    $('#btnAdd').on('click', function () {

        // index等于这个open
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()

        });

    })


    // 事件委托给body  添加文章分类
    $('body').on('submit', '#form-add', function (e) {

        // 阻止默认提交
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                //console.log(res);
                // 失败报错
                if (res.status !== 0) {
                    return layer.msg("提交文章分类失败");
                }
                // 清空表单
                $('#form-add')[0].reset();
                // 重新渲染列表
                initArtCateList();
                layer.msg("提交文章分类成功");
                // 关闭弹出层
                layer.close(indexAdd);
            }
        })



    })


    // 事件委托给tbody 展示表单
    let indexEdit = null;
    let form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {

        // 利用框架代码 显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()

        });

        //  获取id 发送ajax获取数据 渲染到页面
        let Id = $(this).attr('data-id')

        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + Id, // 参数直接在地址后/ 加上 
            success: function (res) {
                //console.log(res);
                if (res.status !== 0) {
                    return layer.msg("修改文章失败")
                }

                // 表单渲染
                form.val('form-edit', res.data);

            }
        })
    })

    // 事件委托给body  修改文章分类
    $('body').on('submit', '#form-edit', function (e) {

        // 阻止默认提交
        e.preventDefault();

        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                //console.log(res);
                // 失败报错
                if (res.status !== 0) {
                    return layer.msg("提交文章分类失败");
                }
                // 清空表单
                $('#form-edit')[0].reset();
                // 重新渲染列表
                initArtCateList();
                layer.msg("提交文章分类成功");
                // 关闭弹出层
                layer.close(indexEdit);
            }
        })



    })

    // 事件委托给body  删除文章
    $('tbody').on('click', '.btn-delete', function () {


        //  获取id 发送ajax获取数据 渲染到页面
        let Id = $(this).attr('data-id')

        // 弹出层
        layer.confirm('是否删除', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + Id, // 参数直接在地址后/ 加上 
                success: function (res) {
                    //console.log(res);
                    if (res.status !== 0) {
                        return layer.msg("修改文章失败")
                    }


                    layer.msg("修改文章成功");
                    // 重新渲染文章列表
                    initArtCateList()
                    // 关闭弹出层
                    layer.close(index);
                }
            })

        });

    })


})


