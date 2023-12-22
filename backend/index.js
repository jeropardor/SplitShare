require('dotenv').config(); // Cargar variables de entorno desde .env


const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const corsOptions = {
//     origin: `http://${process.env.FE_HOST}:${process.env.FE_PORT}`,
// }
// app.use(cors(/* corsOptions */));


const routes = require('./src/routes/routes');
routes(app);


// simple test route
app.get("/api", (req, res) => {
    res.json({ message: "Welcome to autoTest backend service." });
});


const listener = app.listen(process.env.SERVER_PORT, (error) => {
    if (error) console.log(error);

    console.log(`Server listening on port ${listener.address().port}`);
});