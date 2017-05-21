var init = function() {
    // 链接服务器
    var socket = io.connect()
    socket.on('whoAreYou', function() {
        createName()
    })
    var createName = function() {
        var name = prompt("输入你的名字", "")
        socket.emit('newUser', name)
    }
}

var sendMsg = function(socket) {
    var sendBtn = document.querySelector('#id-send-message')
    sendBtn.addEventListener('click', function() {
        var msg = document.querySelector('#my-textarea').value
        socket.emit('message', msg)
    })
}
var logOut = function(socket) {
    var logOut = document.querySelector('#id-logout')
    logOut.addEventListener('click', function() {
        socket.disconnect()
    })
}
init()
