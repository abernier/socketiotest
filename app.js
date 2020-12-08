require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const bodyParser   = require('body-parser');
const session = require('express-session')

const app = express();

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000']
}

app.use(cors(corsOptions));

const server = require('http').createServer(app);
const io = require("socket.io")(server, {
  cors: corsOptions
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const sessionMiddleware = session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
})
app.use(sessionMiddleware)

// Expose io to req
app.use((req, res, next) => {
  req.io = io
  next()
})

io.on("connection", (socket) => {
  console.log('client connected', socket.id)


  socket.on('order:subscribe', (orderId) => {
    console.log('client has subscribed to order #:', orderId)
    
    // join a room: this allow us to `io.to(orderId).emit()` -> see: https://socket.io/docs/v3/rooms/#Sample-use-cases
    socket.join(`${orderId}`)
  })
});

const index = require('./routes/index');
app.use('/api', index);

// catch 404 and render a not-found.hbs template
app.use((req, res, next) => {
  const err = new Error('404')
  next(err)
});

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`Express is listening on port ${port}`))