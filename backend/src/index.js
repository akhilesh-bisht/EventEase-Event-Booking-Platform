import "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";

// define PORT

const PORT = process.env.PORT || 4000;



// func for start server

const startServer = async () => {
  await connectDB();

  try {
    app.listen(PORT, () => {
      console.log("Server started at", PORT);
    });

  } catch (error) {
    console.error(`Server Error: ${error}`);
  }
};

startServer();
