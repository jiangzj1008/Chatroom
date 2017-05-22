var init = function() {
    var name = prompt("输入你的名字", "")

    // 链接服务器
    var socket = io.connect()
    socket.on('connect', function() {
        socket.emit('newUser', name)
        socket.on('tips', function(tip) {
            console.log(tip)
            addUser(tip)
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
        var dialog = document.querySelector('#id-dialog')
        dialog.innerHTML += newMsg
    }

    var addUser = function(name) {
        var list = document.querySelector('#id-users')
        list.innerHTML += name
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
