// 动画系统
// 判断滑动方向是否为0，是的话可以进行滑动
// 判断是否相等，相等可以进行滑动

var _groups = [[],[],[],[]]

var makeGroupH = function() {
    var nums = es('.num')
    for (var i = 0; i < nums.length; i++) {
        var n = nums[i]
        var c = Math.floor(i / 4)
        _groups[c].push(n)
    }
}

var moveRow = function(row) {
    var c = 0
    for (var i = 0; i < row.length; i++) {
        var r = row[i]
        if (r.innerHTML === '0') {
            c++
        } else if (i > 0 && row[i-1].innerHTML === r.innerHTML) {
            c++
        }
        var t = 0 - 1.6 * c
        r.style.transform = `translate3d(${t}rem, 0, 0)`
    }
}

var moveGroupH = function() {
    for (var i = 0; i < 4; i++) {
        var row = _groups[i]
        moveRow(row)
    }
}

var moveLeft = function() {
    makeGroupH()
    moveGroupH()
}
