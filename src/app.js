const express = require('express');
const app = express();
const userRouter = require('./routes/user.routes')
const accountRouter = require('./routes/account.routes')
const cookieParser = require('cookie-parser')
const transactionRouter = require('./routes/transaction.routes')


app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{res.send('Project is Live')})
app.use('/api/auth', userRouter)
app.use('/api/account', accountRouter)
app.use('/api/transaction', transactionRouter)
module.exports = app;