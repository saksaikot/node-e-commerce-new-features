require("dotenv/config");
const mongoose = require("mongoose");

const app = require("./app");

mongoose
  .connect(process.env.MONGO_DB_URL_LOCAL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Mongodb connection Failed"));

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Running on port ${port}`));
