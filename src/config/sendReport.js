const axios = require('axios')
const AppError = require('../utils/AppError')

async function sendLog(log) {
   await axios.post(process.env.COPILOT_ADD_LOG_URL,
        log
    ).then((res)=>{
        return 'done'
    }).catch ((err)=> { 
        throw new AppError(err,500)})
}

module.exports = sendLog