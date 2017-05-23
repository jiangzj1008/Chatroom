var init = function() {
    // var name = prompt("输入你的名字", "")
    var name = 'jiangzj'

    // 链接服务器
    var socket = io.connect()
    socket.on('connect', function() {
        socket.emit('newUser', name)
        socket.on('users', function(userList) {
            addUser(userList)
        })
        socket.on('message', function(msg) {
            outputMsg(msg)
        })
    })

    var bindSendBtn = function(socket) {
        var sendBtn = document.querySelector('.btn-send')
        sendBtn.addEventListener('click', function() {
            var testarea = document.querySelector('.input-area')
            var msg = testarea.value
            socket.emit('message', msg)
            testarea.value = ''
        })
    }

    var templateMsg = function(msg) {
        var temp = `<p>${msg}</p>`
        return temp
    }

    var outputMsg = function(msg) {
        var newMsg = templateMsg(msg)
        var output = document.querySelector('.output')
        output.innerHTML += newMsg
    }

    var templateUser = function(name) {
        var temp = `<div>${name}</div>`
        return temp
    }

    var addUser = function(userList) {
        var list = document.querySelector('#id-users')
        list.innerHTML = ''
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i]
            var newUser = templateUser(user)
            list.innerHTML += newUser
        }
    }

    bindSendBtn(socket)
}

var logOut = function(socket) {
    var logOut = document.querySelector('#id-logout')
    logOut.addEventListener('click', function() {
        socket.disconnect()
    })
}
init()
