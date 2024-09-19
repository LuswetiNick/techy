require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const path = require("path");
const cookieParser = require("cookie-parser");

const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const cors = require("cors");
const corsOptions = require("./config/corsOptions");

app.use(logger);

app.use(cors(corsOptions));

// json
app.use(express.json());

app.use(cookieParser());

// Static files
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/route"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "pages", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ meesage: "404 not found" });
  } else {
    res.type("text/plain").send("404 Not Found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
