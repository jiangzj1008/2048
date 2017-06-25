// 滑动
var makeGroup = function(dir) {
    var groups = [[],[],[],[]]
    var nums = es('.num')
    for (var i = 0; i < nums.length; i++) {
        var n = nums[i]
        if (dir === 'left' || dir === 'right') {
            var c = Math.floor(i / 4)
        } else if (dir === 'top' || dir === 'bottom') {
            var c = i % 4
        }
        groups[c].push(n)
    }
    return groups
}

var moveRow = function(row, dir) {
    if (dir === 'left' || dir === 'top') {
        var step = -1.6
    } else if (dir === 'right' || dir === 'bottom') {
        var step = 1.6
        row.reverse()
    }
    var count = 0
    var same = false
    for (var i = 0; i < row.length; i++) {
        var x = 0
        var y = 0
        var r = row[i]
        if (r.innerHTML === '0') {
            count++
        } else if (i > 0 && row[i-1].innerHTML === r.innerHTML) {
            // [2,2,0,0]
            // [2,2,2,0]
            // [2,2,2,2]
            if (same === false) {
                count++
            }
            same = !same
        } else if (i > 1 && row[i-2].innerHTML === r.innerHTML && row[i-1].innerHTML === '0') {
            // [2,0,2,0]
            // [2,4,2,4]
            count++
        } else if (i === 3 && row[0].innerHTML === r.innerHTML && row[1].innerHTML === '0' && row[2].innerHTML === '0') {
            // [2,0,0,2]
            count++
        }
        if (dir === 'left' || dir === 'right') {
            x = step * count
        }else if (dir === 'top' || dir === 'bottom') {
            y = step * count
        }
        r.style.transform = `translate3d(${x}rem, ${y}rem, 0)`
    }
}

var moveGroup = function(groups, direction) {
    for (var i = 0; i < 4; i++) {
        var row = groups[i]
        moveRow(row, direction)
    }
}

var move = function(direction) {
    var groups = makeGroup(direction)
    moveGroup(groups, direction)
}

// 生成新的数字
// var 
