let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;

// io.use( async (socket, next) => {
//     try {
//         await addSocketIdInCache({
//             userId: socket.request._query['userId'],
//             socketId: socket.id
//         });
//         next();
//     } catch (error) {
//         // Error
//         console.error(error);
//     }
// });
var connected_user = []
io.on('connection', (socket) => {
  let userid = socket.request._query['userId']
  for (var i =0; i < connected_user.length; i++)
    if (connected_user[i].email === userid) {
        connected_user.splice(i,1);
        break;
    }
    connected_user.push({email:socket.request._query['userId'],
    name: socket.request._query['Name'],socket_id: socket.id})
    console.log('user connected',connected_user);
    setInterval(() => {
      io.emit('connected', connected_user);
  }, 20000);
    socket.on('new-message', (data) => {
        console.log(data)
        let Tomail = data.mail
        for (user of connected_user) {
            console.log("user",user)
            if (user['email'] == Tomail){
                sockid = user["socket_id"]
                data['From_mail']= socket.request._query['userId']
                io.to(sockid).emit('new-message', data);
            } 
          }
        // io.emit('new-message',message);
      });
      socket.on('disconnect', function(){
        let userid = socket.request._query['userId']
        for (var i =0; i < connected_user.length; i++)
          if (connected_user[i].email === userid) {
              connected_user.splice(i,1);
              break;
          }
        console.log('user disconnected');
      });
  
});


server.listen(port, () => {
    console.log(`started on port: ${port}`);
});
