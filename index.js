const http = require('http');
const express = require('express');
const dayjs = require("dayjs");
const cors = require("cors");

//Config de .env
require('dotenv').config();

//Creamos la app de Express
const app = express();

//Configuramos la app de Express



//configuración de la app express
app.use(cors());

//Creación del servidor
const server = http.createServer();

//Levantamos el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT);

//Listeners
server.on('listening', () => {
console.log(`server listening on ${PORT}`);
});
server.on("error", (error) => {
  console.log(error);
});

//Configuración de socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on('connection', (socket) => {
    console.log('Se ha conectado un nuevo cliente');
//Mando un mensaje a todos los clientes conectados menos al que se conecta
    socket.broadcast.emit('mensaje_chat', {
        usuario: 'INFO', mensaje: 'Se ha conectado un nuevo usuario'
    });
    socket.broadcast.emit('dibujo_pixel', {
        x: 10, y: 90, color: 'yellow'
    });
    //Actualizo el número de clientes conectados
    io.emit('clientes_conectados', io.engine.clientsCount);

    socket.on('mensaje_chat', (data) => {
        //Emito a todos los clientes conectados
        io.emit('mensaje_chat', data);
    });
    socket.on('disconnect', () => {
        io.emit('mensaje_chat', {
            usuario: 'INFO', mensaje: 'Se ha desconectado un usuario'
        });
        io.emit("clientes_conectados", io.engine.clientsCount); //vuelvo a actualizar la lista de clientes conectados
    });

});
