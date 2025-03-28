import Club from '../models/club.model.js';
import mongoose from 'mongoose';

export const getClubs = async (req, res) => {
    try {
        const clubs = await Club.find();
        res.status(200).json(clubs);
    } catch (error) {
        res.status(404).json("Error fetching clubs");
    }
}

export const createClub = async (req, res) => {
    const club = req.body;
    const userId = req.oidc.user?.sub; // Auth0 user ID

    if (!userId) return res.status(401).json("Unauthorized");

    if (!club.name) {
        return res.status(400).json("Club name is required");
    }

    const auth0Id = req.oidc.user?.sub; // Get Auth0 user ID
    if (!auth0Id) {
        return res.status(401).json("Unauthorized: User ID required");
    }

    const newClub = new Club({ name, admin: auth0Id, members: [auth0Id] });

    try {
        await newClub.save();
        res.status(201).json(newClub);
    } catch (error) {
        res.status(409).json("Error creating club");
    }
}

export const deleteClub = async (req, res) => {
    const { id } = req.params;
    const userId = req.oidc.user?.sub; // Auth0 user ID

    if (!userId) return res.status(401).json("Unauthorized");
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json("Club not found");
    }

    try {
        await Club.findByIdAndRemove(id);
        res.status(200).json("Club deleted successfully");
    } catch (error) {
        res.status(409).json("Error deleting club");
    }
}

export const updateClub = async (req, res) => {
    const { id } = req.params;
    const club = req.body;
    const userId = req.oidc.user?.sub; // Auth0 user ID

    if (!userId) return res.status(401).json("Unauthorized");

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json("Club not found");
    }

    try {
        const updatedClub = await Club.findByIdAndUpdate(id, club, { new: true });
        res.status(200).json("Club updated successfully");
    } catch (error) {
        res.status(409).json("Error updating club");
    }
}

export const joinClub = async (req, res) => {
    const { id } = req.params;
    const userId = req.oidc.user?.sub; // Auth0 user ID

    if (!userId) return res.status(401).json("Unauthorized");

    try {
        const club = await Club.findById(id);
        if (!club) return res.status(404).json("Club not found");

        if (!club.members.includes(userId)) {
            club.members.push(userId);
            await club.save();
        }

        res.status(200).json("Joined club successfully");
    } catch (error) {
        res.status(409).json("Error joining club");
    }
}

export const leaveClub = async (req, res) => {
    const { id } = req.params;
    const userId = req.oidc.user?.sub; // Auth0 user ID

    if (!userId) return res.status(401).json("Unauthorized");

    try {
        const club = await Club.findById(id);
        if (!club) return res.status(404).json("Club not found");

        if (club.members.includes(userId)) {
            club.members = club.members.filter(member => member !== userId);
            await club.save();
            return res.status(200).json("Left club successfully");
        } 

        res.status(400).json("User is not a member of this club");
    } catch (error) {
        res.status(409).json("Error leaving club");
    }
}

export const checkClubAdmin = async (req, res, next) => {
    try {
        if (!req.oidc || !req.oidc.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userId = req.oidc.user.sub; // Auth0 user ID
        const clubId = req.params.clubId || req.params.id; // Support both parameter names

        if (!clubId) {
            return res.status(400).json({ error: "Club ID is required" });
        }

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ error: "Club not found" });
        }

        if (!club.admins.includes(userId)) {
            return res.status(403).json({ error: "Access denied" });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

