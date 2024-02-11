import * as dotenv from "dotenv";
import app from "./server.js";
dotenv.config();
app.listen(process.env.SERVER_URL, () => {
  console.log("SERVER STARTED ON PORT: ", process.env.SERVER_URL);
});
