const express = require("express");;
require("dotenv").config();
const database = require("./config/database");
const bodyParser = require("body-parser");

const cors = require("cors");
// Routes Ver1
const routesVer1 = require("./api/v1/routes/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

// const corsOptions = {
//   origin: 'http://example.com'
// };

// app.use(cors(corsOptions));


app.use(cors());

app.use(bodyParser.json());

routesVer1(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});