import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './cfg/db.js';
import { auth } from 'express-openid-connect';
import routes from './routes/routes.js';

dotenv.config();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUERBASEURL,
  };


const app = express();
app.use(auth(config));
app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
    connectDB();
    console.log(`Running on port ${PORT}`);
});

