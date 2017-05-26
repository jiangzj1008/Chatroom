var init = function() {
    var name = prompt("输入你的名字", "")
    // var name = 'jiangzj'
    var users = []
    // 链接服务器
    var socket = io.connect()
    socket.on('connect', function() {
        socket.emit('newUser', name)
        socket.on('users', function(userList) {
            users = userList
            showUser(users)
        })
        socket.on('message', function(msg) {
            outputMsg(msg)
        })
        socket.on('logOut', function(name) {
            var temp = `
                <div class='output-logout'>
                    <p>${name} 离开了</p>
                </div>
            `
            var output = document.querySelector('.output')
            output.innerHTML += temp
            removeUser(name)
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
            <div class='output-others'>
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

    var showUser = function(userList) {
        var list = document.querySelector('#id-users')
        list.innerHTML = ''
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i]
            var newUser = templateUser(user)
            list.innerHTML += newUser
        }
    }

    var removeUser = function(user) {
        users.splice(users.indexOf(user), 1)
        showUser(users)
    }

    var sendPic = function() {
        var input = document.querySelector('.input-area')
        input.addEventListener('drop', function(e) {
            e.preventDefault()
            var fileList = e.dataTransfer.files
            var i = fileList[0].type.indexOf('image')
            if (fileList.length != 0) {
                if (i != -1) {
                    var src = window.URL.createObjectURL(fileList[0])
                    var filename = fileList[0].name
                    var filesize = Math.floor((fileList[0].size)/1024)

                }
            } else {
                console.log(2);
            }
        })
    }

    bindSendBtn(socket)
    sendPic()
}

init()
