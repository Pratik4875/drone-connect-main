const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { mongo_db_connect } = require('./Utils/MongoConnect.js');
const errorHandler = require('./Middlewares/ErrorHandler.js');
const UserRoute = require('./Routes/UserRoute.js');
const PostRoute = require('./Routes/PostRoute.js');
const PilotRoute = require("./Routes/PilotRoute.js")
const EventRoute = require("./Routes/EventRoute.js")
const CompanyRoute = require("./Routes/CompanyRoute.js")
const BookingRoute = require("./Routes/BookingRoute.js")
const ReviewRoute = require("./Routes/ReviewRoute.js")
const AdminRoute = require("./Routes/AdminRoute.js")

const port = process.env.PORT || process.env.SERVER_PORT;
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
}));
app.options('*', cors());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/post', PostRoute);
app.use('/api/v1/pilot', PilotRoute);
app.use("/api/v1/event", EventRoute)
app.use("/api/v1/company", CompanyRoute)
app.use("/api/v1/booking", BookingRoute)
app.use("/api/v1/review", ReviewRoute)
app.use("/api/v1/admin", AdminRoute)

// Error Handler Middleware
app.use(errorHandler);

// Start server only if DB is connected
const startServer =() => {
    try {
        app.listen(port, async() => {
            console.log(`Server is running on port: ${port}`);
            console.log('Connecting to the database...');
            const db = await mongo_db_connect();
            if (db) {
                console.log('Connected to the database successfully.');
            }
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

// Initialize
startServer();

module.exports = app;
