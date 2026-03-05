require("dotenv").config();

const app = require("./app");
const dbConnect = require("./config/db");

dbConnect();

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("server running on port:", PORT);
});
