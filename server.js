const app = require('./app')
const mongoose = require('mongoose')
const {SERVER_PORT, DB, DB_PASSWORD} = require('./envVariables')

const PORT = SERVER_PORT || 3000
const DB_CONNECTION = DB.replace('<password>', DB_PASSWORD)

function bootstrap() {
    try {
        mongoose.connect(DB_CONNECTION)
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

bootstrap()
