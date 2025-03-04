import express from 'express';
import { getClubs, createClub, deleteClub, updateClub } from '../controllers/club.controller.js';
const router = express.Router();
import pkg from 'express-openid-connect';
const { requiresAuth } = pkg;

router.get("/", getClubs);

router.post("/", createClub);

router.put("/:id", updateClub);

router.delete("/:id", deleteClub);

// This will send a response to the client from a third party middleware I used called auth0
// It provides two routes, /login and /logout, and the middleware will handle the authentication process
// The middleware will also return a logged in or logged out message, which we can use to --
// -- display different things based on the authentication status
// to try it out go to localhost:5001/login or /logout
router.get('/', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

export default router;