
$(document).ready(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 点击上传图片
    $('#btnChooseImage').on('click', function () {
        // console.log(1);
        $('#file').click();
    })

    // 上传更改头像

    $('#file').on('change', function (e) {
        // 拿到用户提交的文件
        let file = e.target.files[0];

        if (file === undefined) {
            return layui.layer.msg("请选择图片上传");
        }

        // 根据选中的文件 创建一个对应的URL地址
        let newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径 之后再创建
        $image.cropper('destroy')   // 先销毁旧的裁剪区域
            .attr('src', newImgURL) // 再重新设置图片路径
            .cropper(options) // 之后再创建

    })



    $('#btnUpload').on('click', function () {
        // 获取base64类型的头像字符串
        let dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        // 发送ajax
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {

                // 失败
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }

                // 上传成功
                layui.layer.msg("恭喜您，更换头像成功！");

                window.parent.getUserInfo();




            }
        })















    })


});





