var init = function() {
    var name = prompt("输入你的名字", "")
    // var name = 'jiangzj'

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
            outputMyMsg(msg)
            socket.emit('message', msg)
            testarea.value = ''
        })
    }

    var templateMsg = function(msg) {
        var user = msg[0]
        var message = msg[1]
        var temp = `
            <div class='output-wrap'>
                <p class='output-user'>${user}:</p>
                <p class='output-msg'>${message}</p>
            </div>
        `
        return temp
    }

    var outputMsg = function(msg) {
        var newMsg = templateMsg(msg)
        var output = document.querySelector('.output')
        output.innerHTML += newMsg
    }

    var outputMyMsg = function(msg) {
        var temp = `
            <div class='output-mine'>
                <p class='output-user'>${name}:</p>
                <p class='output-msg'>${msg}</p>
            </div>
        `
        var output = document.querySelector('.output')
        output.innerHTML += temp
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
