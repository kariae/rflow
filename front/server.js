const express = require('express')
const path = require('path')

const port = process.env.FRONT_PORT || 8080
const app = express()

app.use(express.static(`${__dirname}/../front-dist`))

app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '../front-dist', 'index.html'))
})

app.listen(port)

/* eslint-disable-next-line no-console */
console.log(`Server started on http://localhost:${port}`)
