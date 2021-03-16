$(function () {
    // 为art-templater 定义时间过滤器
    template.defaults.imports.dataFormat = function (dtstr) {

        let dt = new Date(dtstr)

        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())


        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 在个位数的左值填充0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义1 查询参数
    let q = {
        pagenum: 1, //页码值
        pagesize: 2,    //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }



    let layer = layui.layer;

    initTable();
    // 封装初始化文章列表函数
    function initTable() {


        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg("获取列表失败")
                }
                // 获取成功渲染模版
                let htmlStr = template('tpl-table', { data: res.data })

                $('tbody').html(htmlStr);

                // 调用分页 total 数据条数
                renderPage(res.total);
            }
        })



    }

    // 3 初始化分类
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

    // 4筛选
    $('#form-search').on('submit', function (e) {

        e.preventDefault();
        // 获取
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 初始化文章列表
        initTable();
    })



    //5.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        // alert(total)


        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,//每页几条
            curr: q.pagenum, //第几页
            layout: ['count', "limit", 'page', 'skip'],
            limits: [2, 3, 5, 10],
            // 页面切换触发这个方法
            jump: function (obj, first) {
                if (!first) {
                    // 页码赋值给q中的pagenum
                    q.pagenum = obj.curr;

                    q.pagesize = obj.limit;
                    // 重新渲染页面
                    initTable();
                }


            }
        });

    }


    // 6 删除

    // var layer = layui.layer;
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取Id 进入到函数中this代指就改变了

        let Id = $(this).attr('data-id');
        layer.confirm('是否删除文章?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    layer.msg("文章删除成功");
                    // 页面汇总删除按钮个数等于1，页码大于1
                    if ($('.btn-delete').length === 1 && q.pagenum > 1) { q.pagenum--; }

                    // 更新成功 重新渲染页面中的数据
                    initTable();

                }
            })

            layer.close(index);
        });
    })





})