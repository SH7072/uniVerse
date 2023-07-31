const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const user=require("./Routes/userRoutes");
const post=require("./Routes/postRoutes");

dotenv.config({
    path: "./Config/config.env",
});
const app = express();

//DB connection
require("./Config/dbConnection");

// CORS
app.use(
    cors({
        origin: "*",
        credentials: false,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);


// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Error
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message, data });
});

// adding Routes
app.use("/user", user);
app.use("/post", post );

app.get("/", (req, res) =>
    res.send(
        `<h1>Hello From Server</h1>`
    )
);

app.listen(process.env.PORT, () => {
    console.log(`Server runs on port ${process.env.PORT}`);
});
