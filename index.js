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

var _result = ''
var _score = 0


// 计分
var showScore = function(score) {
    var s = e('.scorePoint')
    s.innerHTML = `${score}`
}

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

// 判断滑动方向
var SlideObj = function(){
    var startX = 0
    var startY = 0
    var endX = 0
    var endY = 0
    var GetSlideAngle = function(dx, dy) {
        return Math.atan2(dy, dx) * 180 / Math.PI
    }

    this.setStartCoord = function(evt) {
        startX = evt.touches[0].pageX
        startY = evt.touches[0].pageY
    }
    this.setEndCoord = function(evt) {
        endX = evt.changedTouches[0].pageX
        endY = evt.changedTouches[0].pageY
    }
    this.GetSlideDirection = function() {
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
        } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 'left'
        }
        return result
    }
}

// 滑动事件
var clearZero = function(arr) {
    var result = arr.filter(function(item, index, array) {
        return (item > 0)
    })
    return result
}

var mergeNum = function(arr) {
    for (var i = 0; i < arr.length; i++) {
        var a1 = arr[i]
        var a2 = arr[1 + i]
        if (a1 == a2 && a1 != 0) {
            arr[i] *= 2
            arr[1 + i] = 0
            if (arr[i] === 2048) {
                _result = 'WIN'
            }
            _score += arr[i]
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

var templateNum = function(i, j, num) {
    var top = (0.1 * (1 + 16 * i)).toFixed(1)
    var left = (0.1 * (1 + 16 * j)).toFixed(1)
    var style = `
        top:${top}rem;
        left:${left}rem;
    `
    var template = `
        <div class="num num-${num}" style="${style}">${num}</div>
    `
    return template
}

var showArr = function() {
    var temp = ''
    for (var i = 0; i < _arr.length; i++) {
        var a = _arr[i]
        for (var j = 0; j < a.length; j++) {
            var template = templateNum(i, j, a[j])
            temp += template
        }
    }
    var board = e('.board')
    board.innerHTML = temp
}

// 提示框
var showTips = function(text) {
    var tips = e('.tips')
    var box = e('.tips-box')
    box.innerHTML = `
        <h3>YOU ${text}!</h3>
        <p>SCORE:${_score}</p>
    `
    tips.style.display = 'block'
}
var bindCloseTips = function() {
    var tips = e('.tips')
    tips.addEventListener('click', function(evt){
        var target = evt.target
        if (!target.classList.contains('tips-box')) {
            tips.style.display = 'none'
        }
    })
}

// 判断胜负
var isSurvival = function(array) {
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array.length; j++) {
            var a = array[i][j]
            if (a===0) {
                _result = ''
                break
            }
            if (i>0 && a===array[i-1][j]) {
                _result = ''
                break
            }
            if (i<3 && a===array[i+1][j]) {
                _result = ''
                break
            }
            if (j>0 && a===array[i][j-1]) {
                _result = ''
                break
            }
            if (j<3 && a===array[i][j+1]) {
                _result = ''
                break
            }
        }
    }
}

var judge = function() {
    if (_result === 'WIN') {
        showTips(_result)
        return
    } else {
        _result = 'LOSE'
        isSurvival(_arr)
        if (_result === 'LOSE') {
            showTips(_result)
        }
    }
}

// 滑动间隔
var updateStatus = function() {
    var main = e('.main')
    var sliding = main.dataset.sliding
    if (sliding === 'false') {
        main.dataset.sliding = 'true'
    } else if (sliding === 'true') {
        main.dataset.sliding = 'false'
    }
}

// 根据滑动方向进行滑动
var slide = new SlideObj()
var bindSlide = function() {
    document.addEventListener('touchstart', function (ev) {
        slide.setStartCoord(ev)
    }, false)
    document.addEventListener('touchend', function (ev) {
        slide.setEndCoord(ev)
        var direction = slide.GetSlideDirection()
        var main = e('.main')
        var sliding = main.dataset.sliding
        if (direction === '' || sliding === 'true') {
            return
        } else {
            if (direction === 'left' || direction === 'right') {
                horizonSlide(direction)
            } else if (direction === 'top' || direction === 'bottom') {
                verticalSlide(direction)
            }
            move(direction)
            randomNum()
            updateStatus()
            setTimeout(function(){
                showArr()
                showScore(_score)
                judge()
                updateStatus()
            },300)
        }
    }, false)
}

// 重置事件
var reset = function() {
    _arr = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]
    _result = ''
    _score = 0
    randomNum()
    showArr()
    showScore(_score)
}

var bindReset = function() {
    var btn = e('.reset')
    btn.addEventListener('click', reset)
}

// 阻止浏览器滑动
var prevent = function() {
    var body = e('body')
    body.addEventListener('touchmove', function(evt){
        evt.preventDefault()
    })
}

initScreen()
randomNum()
showArr()
bindSlide()
bindReset()
bindCloseTips()
prevent()
