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

    if (!club.name) {
        return res.status(400).json("Club name is required");
    }

    const newClub = new Club(club);
    try {
        await newClub.save();
        res.status(201).json(newClub);
    } catch (error) {
        res.status(409).json("Error creating club");
    }
}

export const deleteClub = async (req, res) => {
    const { id } = req.params;

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