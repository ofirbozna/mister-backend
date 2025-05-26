// export default {
//     dbURL: 'mongodb+srv://ofirbozn:355684@mistertoy.hhvg7as.mongodb.net/',
//     dbName: 'toy_db',
// }


import dotenv from 'dotenv'

dotenv.config()

export default {
    dbURL:process.env.ATLAS_URL,
    dbName: process.env.ATLAS_DBNAME,
}