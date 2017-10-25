var app = new Vue({
    el: '#id-container',
    data: {
        name: '',
        users: [],
        img: undefined,
        socket: null
    },
    mounted: function () {
        this.$nextTick(function () {
            init()
        })
    },
    methods: {
        // 用户名相关
        removeUser: function(name) {
            this.users.splice(this.users.indexOf(name), 1)
        },

        // 图片相关
        dropPic: function(e) {
            e.preventDefault()
            var fileList = e.dataTransfer.files
            var i = fileList[0].type.indexOf('image')
            if (fileList.length != 0) {
                if (i != -1) {
                    // 图片预览
                    var src = window.URL.createObjectURL(fileList[0])
                    var temp = `
                        <img src='${src}' alt='图片'>
                    `
                    var preview = document.querySelector('.input-img')
                    preview.innerHTML = temp
                    // 读取图片数据
                    var reader = new FileReader()
                    reader.readAsDataURL(fileList[0])
                    reader.onload = function() {
                        app.img = this.result
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
                    <a href="${src}" target="blank">
                        <img class='output-img' src='${src}' alt=''>
                    </a>
                </div>
            `
            var output = document.querySelector('.output')
            output.innerHTML += temp
            app.scrollBottom()
        },
        outputMyImg: function(img) {
            var temp = `
                <div class='output-mine'>
                    <p class='output-user'>${app.name}:</p>
                    <a href="${img}" target="_blank">
                        <img class='output-img' src='${img}' alt=''>
                    </a>
                </div>
            `
            var output = document.querySelector('.output')
            output.innerHTML += temp
            app.scrollBottom()
        },
        sendImg: function() {
            var img = this.img
            var socket = this.socket
            if (img != undefined) {
                socket.emit('image', img)
                app.outputMyImg(img)
                app.img = undefined
                var preview = document.querySelector('.input-img')
                preview.innerHTML = ''
            }
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
            app.scrollBottom()
        },
        outputMyMsg: function(msg) {
            var temp = `
                <div class='output-mine'>
                    <p class='output-user'>${this.name}:</p>
                    <p class='output-msg'>${msg}</p>
                </div>
            `
            var output = document.querySelector('.output')
            output.innerHTML += temp
            app.scrollBottom()
        },
        sendMsg: function() {
            var socket = this.socket
            var testarea = document.querySelector('.input-area')
            var msg = testarea.value
            if (msg.trim().length != 0) {
                app.outputMyMsg(msg)
                socket.emit('message', msg)
            }
            testarea.value = ''
        },

        // 其他
        keyEvt: function(e) {
            var code = e.code
            if (code == 'Enter') {
                e.preventDefault()
                app.sendMsg()
                app.sendImg()
            }
            if (code == 'Backspace') {
                var preview = document.querySelector('.input-img')
                preview.innerHTML = ''
                this.img = undefined
            }
        },
        scrollBottom: function() {
            var output = document.querySelector('.output')
            var st = output.scrollHeight
            output.scrollTop = st
        },
        login: function(name) {
            var temp = `
                <div class='output-login'>
                    <p>${name} 加入了</p>
                </div>
            `
            var output = document.querySelector('.output')
            output.innerHTML += temp
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

var init = function() {
    // 全局变量
    app.name = prompt("输入你的名字", "")

    // socket事件
    app.socket = io.connect()
    var socket = app.socket
    socket.on('connect', function() {
        socket.emit('newUser', app.name)
        socket.on('logIn', function(userList,name) {
            if (app.users.length == 0) {
                app.users = userList
            } else {
                app.users.push(name)
            }
            app.login(name)
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
