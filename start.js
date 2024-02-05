import app from "./server.js";
app.listen(parseInt(process.env.PORT), () => {
  console.log("Server running on port " + process.env.PORT);
});
