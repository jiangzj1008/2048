var e = function(sel){
    var el = document.querySelector(sel)
    return el
}
var es = function(sels){
    var els = document.querySelectorAll(sels)
    return els
}

var initScreen = function() {
    var html = e('html')
    var rate = document.documentElement.clientHeight/document.documentElement.clientWidth
    if (rate < 1.5) {
        html.style.fontSize = document.documentElement.clientHeight/603*312.5+"%"
    } else {
        html.style.fontSize = document.documentElement.clientWidth/375*312.5+"%"
    }
}

initScreen()

// 打开时随机位置，生成一个2或4
var randomNum = function() {
    // 随机2/4
    var x = Math.random()
    var num = 2
    if (x >= 0.8) {
        num = 4
    }
    // 随机位置
    var ran = Math.floor(Math.random() * (15 - 0 + 1) + 0)
    // 插入
    var span = es('span')[ran]
    span.innerHTML = num
}


// 滑动时
// 1、所有滑快向同一方向滑动
// 2、遇到数字相同的滑块，合并升级
// 3、滑动结束，在剩余的空间里，随机生成一个2/4
