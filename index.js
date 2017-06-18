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

var _arr = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
]

var _isWin

// 随机生成一个2或4
var countZeroNum = function(arr) {
    var count = 0
    for (var i = 0; i < arr.length; i++) {
        var a  = arr[i]
        for (var j = 0; j < a.length; j++) {
            if (a[j] == 0) {
                count++
            }
        }
    }
    return count
}

var randomChange = function(x, num) {
    var n = 0
    for (var i = 0; i < _arr.length; i++) {
        var a = _arr[i]
        for (var j = 0; j < a.length; j++) {
            if (a[j] == 0) {
                n++
            }
            if (n == x) {
                a[j] = num
                console.log(i,j);
                return
            }
        }
    }
}

var randomNum = function() {
    // 随机2/4
    var ran = Math.random()
    var num = 2
    if (ran >= 0.8) {
        num = 4
    }
    // 获取0的个数
    var count = countZeroNum(_arr)
    // 在0的个数内随机一个数字
    if (count > 0) {
        var x = Math.floor(Math.random() * (count - 0)) + 1
        randomChange(x, num)
    }
}

// 滑动时
// 0、判断滑动方向
var _startX = 0
var _startY = 0

var GetSlideAngle = function(dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI
}

var GetSlideDirection = function(startX, startY, endX, endY) {
    var dy = startY - endY
    var dx = endX - startX
    var result = ''
    //如果滑动距离太短
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return result
    }
    // 判断方向
    var angle = GetSlideAngle(dx, dy)
    if (angle >= -45 && angle < 45) {
        result = 'right'
    } else if (angle >= 45 && angle < 135) {
        result = 'top'
    } else if (angle >= -135 && angle < -45) {
        result = 'bottom'
    }
    else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 'left'
    }
    return result
}


// 1、所有滑快向同一方向滑动
var clearZero = function(arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == 0) {
            arr.splice(i, 1)
            i--
        }
    }
    return arr
}

var mergeNum = function(arr) {
    for (var i = 0; i < arr.length; i++) {
        var a1 = arr[i]
        var a2 = arr[1 + i]
        if (a1 == a2 && a1 != 0) {
            arr[i] *= 2
            arr[1 + i] = 0
            if (arr[i] === 2048) {
                _isWin = true
            }
        }
    }
    return arr
}

var supplementZero = function(arr) {
    while (arr.length < 4) {
        arr.push(0)
    }
    return arr
}

var handleRow = function(arr, direction) {
    if (direction == '') {
        return arr
    }
    if (direction == 'right') {
        arr.reverse()
    }
    // 清零
    var a = clearZero(arr)
    // 合并
    var b = mergeNum(a)
    // 清零
    var c = clearZero(b)
    // 补零
    var d = supplementZero(c)
    if (direction == 'right') {
        d.reverse()
    }
    return d
}

var horizonSlide = function(direction) {
    var newArr = []
    for (var i = 0; i < _arr.length; i++) {
        var a = _arr[i]
        var row = handleRow(a, direction)
        newArr.push(row)
    }
    _arr = newArr
}

var rotateArrLeft = function(arr) {
    var newArr = []
    for (var j = 3; j >= 0; j--) {
        var row = []
        for (var i = 0; i < arr.length; i++) {
            row.push(arr[i][j])
        }
        newArr.push(row)
    }
    return newArr
}

var rotateArrRight = function(arr) {
    var newArr = []
    for (var i = 0; i < arr.length; i++) {
        var row = []
        for (var j = 3; j >= 0; j--) {
            row.push(arr[j][i])
        }
        newArr.push(row)
    }
    return newArr
}

var verticalSlide = function(direction) {
    if (direction == 'top') {
        var dir = 'left'
    } else if (direction == 'bottom') {
        var dir = 'right'
    }
    // 重新排列二维数组（想象将数组向左旋转90度）
    _arr = rotateArrLeft(_arr)
    // 进行水平滑动
    horizonSlide(dir)
    // 重新排列数组（将数组向右旋转90度）
    _arr = rotateArrRight(_arr)
}

var generateNum = function(i, j, num) {
    var top = 0.1 + 1.6 * i + 'rem'
    var left = 0.1 + 1.6 * j + 'rem'
    var style = `
        top:${top};
        left:${left};
    `
    var template = `
        <div class="num num-${num}" style="${style}">${num}</div>
    `
    var board = e('.board')
    board.innerHTML += template
}

var clearBoard = function() {
    var board = e('.board')
    board.innerHTML = ''
}

var showArr = function() {
    var cells = es('.cell')
    var n = 0
    clearBoard()
    for (var i = 0; i < _arr.length; i++) {
        var a = _arr[i]
        for (var j = 0; j < a.length; j++) {
            if (a[j] != 0) {
                generateNum(i, j, a[j])
            } else {
                // cells[n].innerHTML = ''
            }
            n++
        }
    }
}

var win = function() {
    if (_isWin === true) {
        alert('you win!')
    }
}

// 根据滑动方向进行滑动
var direction = ''
var bindSlide = function() {
    document.addEventListener('touchstart', function (ev) {
        _startX = ev.touches[0].pageX
        _startY = ev.touches[0].pageY
    }, false)
    document.addEventListener('touchend', function (ev) {
        var endX = ev.changedTouches[0].pageX
        var endY =  ev.changedTouches[0].pageY
        direction = GetSlideDirection(_startX, _startY, endX, endY)
        if (direction == 'left' || direction == 'right') {
            horizonSlide(direction)
            randomNum()
        } else if (direction == 'top' || direction == 'bottom') {
            verticalSlide(direction)
            randomNum()
        }
        showArr()
        win()
    }, false)
}


initScreen()
randomNum()
showArr()
bindSlide()
