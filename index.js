var express = require("express");
var app = express();
const mysql = require("./config/db.js");

var http = require("http").createServer(app);
var io = require("socket.io")(http, {
    cors: { origin: "*", methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }
});


const port = 5000;

 

io.sockets.on('connection', async (socket) => {

    console.log("New client connected");


    mysql.connection.query("SELECT * FROM chats where user_id=1", async (err, rows) => {
        if (err) throw err;
        socket.emit('chats', rows);
    });


    socket.on('send_message', async (data) => {
        mysql.connection.query("INSERT INTO chats (user_id,other_user_id, message) VALUES (?, ?,?)", [data.user_id, data.other_user_id, data.message], async (err, rows) => {
            if (err) throw err;
            mysql.connection.query("SELECT * FROM chats where user_id=1", async (err, rows) => {
                if (err) throw err;

                socket.emit('chats', rows);
            });
        }
        );
    });

    socket.on('delete_message', async (data) => {
        mysql.connection.query("DELETE FROM chats WHERE id=?", [data.id], async (err, rows) => {
            if (err) throw err;
            mysql.connection.query("SELECT * FROM chats where user_id=1", async (err, rows) => {
                if (err) throw err;

                socket.emit('chats', rows);
            }
            );
        }
        );
    });

    socket.on('update_message', async (data) => {
        mysql.connection.query("UPDATE chats SET message=? WHERE id=?", [data.message, data.id], async (err, rows) => {
            if (err) throw err;
            mysql.connection.query("SELECT * FROM chats where user_id=1", async (err, rows) => {
                if (err) throw err;

                socket.emit('chats', rows);
            }
            );
        }
        );
    });

    socket.on('disconnect', async () => {
        console.log('user disconnected');
    });

});




http.listen(port, () => console.log('SERVIDOR INICIADO NA POTA', port))