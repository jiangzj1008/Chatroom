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
        socket.on('image', function(msg) {
            outputImg(msg)
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
            if (msg != '') {
                outputMyMsg(msg)
                socket.emit('message', msg)
                testarea.value = ''
            }
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

    var outputImg = function(msg) {
        var src = msg[1]
        var name = msg[0]
        var temp = `
            <div class='output-others'>
                <p class='output-user'>${name}:</p>
                <img class='output-img' src='${src}' alt=''>
            </div>
        `
        var output = document.querySelector('.output')
        output.innerHTML += temp
    }

    var outputMyImg = function(img) {
        var temp = `
            <div class='output-mine'>
                <p class='output-user'>${name}:</p>
                <img class='output-img' src='${img}' alt=''>
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

    var img = undefined
    var dragPic = function() {
        var input = document.querySelector('.input-area')
        input.addEventListener('drop', function(e) {
            e.preventDefault()
            var fileList = e.dataTransfer.files
            var i = fileList[0].type.indexOf('image')
            if (fileList.length != 0) {
                if (i != -1) {
                    var src = window.URL.createObjectURL(fileList[0])
                    var filesize = Math.floor((fileList[0].size)/1024)
                    var temp = `
                        <img src='${src}' alt='图片'>
                    `
                    var preview = document.querySelector('.input-img')
                    preview.innerHTML = temp
                    var reader = new FileReader()
                    reader.readAsDataURL(fileList[0])
                    reader.onload = function() {
                        img = this.result
                    }
                }
            } else {
                console.log('error');
            }
        })
    }

    var sendPic = function() {
        socket.emit('image', img)
        outputMyImg(img)
        img = undefined
        var preview = document.querySelector('.input-img')
        preview.innerHTML = ''
    }

    var bindSendPic = function() {
        var btn = document.querySelector('.btn-pic')
        btn.addEventListener('click', sendPic)
    }

    var bindEnter = function() {
        var text = document.querySelector('.input-area')
        text.onkeydown = function(e) {
            var num = e.keyCode
            e.preventDefault()
            if (num == 13) {
                var testarea = document.querySelector('.input-area')
                var msg = testarea.value
                if (msg != '') {
                    outputMyMsg(msg)
                    socket.emit('message', msg)
                    testarea.value = ''
                }
            }
        }
    }

    bindSendBtn(socket)
    dragPic()
    bindSendPic()
    bindEnter()
}

init()
