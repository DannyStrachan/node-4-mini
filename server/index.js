require('dotenv').config({ path: __dirname + '/../.env' })
const express = require('express')
const session = require('express-session')
const { SERVER_PORT, SESSION_SECRET } = process.env
const mc = require('./messagesCtrl')

const app = express()
app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

app.use((req, res, next) => {
    let badWords = ['knucklehead', 'jerk', 'internet explorer']
    if (req.body.message) {
        for (let i = 0; i < badWords.length; i++) {
            let regex = new RegExp(badWords[i], 'g')
            req.body.message = req.body.message.replace(regex, '$!&#*')
        }
    }
    next()
})


app.get('/api/messages', mc.getAllMessages)

app.post('/api/message', mc.createMessage)

app.get('/api/messages/history', mc.history)



app.listen(SERVER_PORT, () => {
    console.log(`Server is listening on port ${SERVER_PORT}`)
})