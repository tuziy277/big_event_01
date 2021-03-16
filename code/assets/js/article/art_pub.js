$(function () {


    // 1 初始化分类
    let form = layui.form //导入form
    initCate();//调用函数
    // 封装函数
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 校验
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // 赋值 渲染form
                let htmlStr = template('tpl-cate', { data: res.data })

                $('[name=cate_id]').html(htmlStr);
                // 因为渲染的是options 比较复杂 需要用到render这个手动赋值
                form.render();
            }
        })
    }


    //2 初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')
    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 4 点击触动input
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })


    // 5设置图片
    $('#coverFile').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 非空校验
        if (file == undefined) {
            return;
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })


    // 6设置状态
    // 默认值为已发布
    var state = '已发布'

    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    // 7 发布文章
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 创建FormDate对象 收集数据
        var fd = new FormData(this);
        // 放入状态
        fd.append('state', state);
        // 放入图片
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                //console.log(...fd);
                // 6. 发起 ajax 数据请求

                publishArticle(fd)
            })
    })

    // 封装 添加文章的函数
    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }

                layer.msg("发布文章成功！")
                // 跳转
                //location.href = '/code/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click();
                }, 50)
            }
        })
    }



})