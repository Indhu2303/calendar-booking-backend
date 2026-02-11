
const express = require("express");
const app = express();
const sequelize = require("./config/database");

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});

// routes
const userRoutes = require("./routes/userRoutes");
const meetingRoutes = require("./routes/meetingRoutes");

app.use("/users", userRoutes);
app.use("/meetings", meetingRoutes);

// health check
app.get("/", (req, res) => {
  res.send("Server is running");
});

// DB + server start
sequelize.authenticate()
  .then(() => {
    console.log("Database connected");

    return sequelize.sync();
  })
  .then(() => {
    console.log("All models synced");
    
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.error("DB error:", err);
  });

module.exports = app;