const app = require("./app")
const { createTables } = require("./src/table/table")

createTables()

PORT=process.env.PORT || 4000

app.listen
(
    PORT,()=>
    {
        console.log(`server is listening at PORT : ${PORT}`)
    }
)
