var init = function() {
    var app = new Vue({
        el: '#id-container',
        data: {
            message: ''
        },
        methods: {
            // 用户名相关
            templateUser: function(name) {
                var temp = `<div>${name}</div>`
                return temp
            },
            showUser: function(userList) {
                var list = document.querySelector('#id-users')
                list.innerHTML = ''
                for (var i = 0; i < userList.length; i++) {
                    var user = userList[i]
                    var newUser = app.templateUser(user)
                    list.innerHTML += newUser
                }
            },
            removeUser: function(name) {
                users.splice(users.indexOf(name), 1)
                app.showUser(users)
            },

            // 图片相关
            dropPic: function(e) {
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
            },
            outputImg: function(msg) {
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
            },
            outputMyImg: function(img) {
                var temp = `
                    <div class='output-mine'>
                        <p class='output-user'>${name}:</p>
                        <img class='output-img' src='${img}' alt=''>
                    </div>
                `
                var output = document.querySelector('.output')
                output.innerHTML += temp
            },
            sendPic: function() {
                socket.emit('image', img)
                app.outputMyImg(img)
                img = undefined
                var preview = document.querySelector('.input-img')
                preview.innerHTML = ''
            },

            // 文字信息相关
            outputMsg: function(msg) {
                var user = msg[0]
                var message = msg[1]
                var temp = `
                    <div class='output-others'>
                        <p class='output-user'>${user}:</p>
                        <p class='output-msg'>${message}</p>
                    </div>
                `
                var output = document.querySelector('.output')
                output.innerHTML += temp
            },
            outputMyMsg: function(msg) {
                var temp = `
                    <div class='output-mine'>
                        <p class='output-user'>${name}:</p>
                        <p class='output-msg'>${msg}</p>
                    </div>
                `
                var output = document.querySelector('.output')
                output.innerHTML += temp
            },
            sendMsg: function() {
                var testarea = document.querySelector('.input-area')
                var msg = testarea.value
                if (msg != '') {
                    app.outputMyMsg(msg)
                    socket.emit('message', msg)
                    testarea.value = ''
                }
            },

            // 其他
            enter: function(e) {
                e.preventDefault()
                var num = e.code
                if (num == 'Enter') {
                    app.sendMsg()
                }
            },
            logout: function(name) {
                var temp = `
                    <div class='output-logout'>
                        <p>${name} 离开了</p>
                    </div>
                `
                var output = document.querySelector('.output')
                output.innerHTML += temp
                app.removeUser(name)
            }
        }
    })

    // 全局变量
    var img = undefined
    var name = prompt("输入你的名字", "")
    var users = []

    // socket事件
    var socket = io.connect()
    socket.on('connect', function() {
        socket.emit('newUser', name)
        socket.on('users', function(userList) {
            users = userList
            app.showUser(users)
        })
        socket.on('message', function(msg) {
            app.outputMsg(msg)
        })
        socket.on('image', function(msg) {
            app.outputImg(msg)
        })
        socket.on('logOut', function(name) {
            app.logout(name)
        })
    })
}

init()
