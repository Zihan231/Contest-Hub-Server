const { ObjectId } = require("mongodb");
const { getContestsCollection } = require("../../config/db");

// Create contest
const createContest = async (req, res) => {
  try {
    const contestCollection = getContestsCollection();
    let data = req.body;
    data.participationCount = 0;
    data.winnerName = null;
    data.winnerPhoto = null;
    data.status = "pending";

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Contest data is required",
      });
    }

    const result = await contestCollection.insertOne(data);

    if (!result.acknowledged) {
      return res.status(500).json({
        message: "Failed to create contest",
      });
    }

    // Success: 201 Created
    return res.status(201).json({
      contestId: result.insertedId,
      message: "Contest created successfully",
      contest: data,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server error while creating contest",
    });
  }
};

// update contest info
const updateContest = async (req, res) => {
  try {
    const contestCollection = getContestsCollection();
    const { id: contestID } = req.params;

    const {
      contestName,
      image,
      description,
      instruction,
      entryFee,
      prizeMoney,
      tags,
      deadline,
    } = req.body;

    // validate ObjectId
    let objectId;
    try {
      objectId = new ObjectId(contestID);
    } catch (e) {
      return res.status(400).json({
        message: "Invalid contest ID",
      });
    }

    const query = { _id: objectId };
    const contestData = await contestCollection.findOne(query);

    if (!contestData) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    const oldStatus = contestData.status;

    if (oldStatus === "confirmed") {
      return res.status(409).json({
        message: "Contest is already confirmed and cannot be updated",
        currentStatus: oldStatus,
      });
    }

    // Build partial update object
    const updates = {};

    if (contestName !== undefined) updates.contestName = contestName;
    if (image !== undefined) updates.image = image;
    if (description !== undefined) updates.description = description;
    if (instruction !== undefined) updates.instruction = instruction;
    if (entryFee !== undefined) updates.entryFee = entryFee;
    if (prizeMoney !== undefined) updates.prizeMoney = prizeMoney;
    if (tags !== undefined) updates.tags = tags;
    if (deadline !== undefined) updates.deadline = deadline;

    // If no fields were sent
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided to update",
      });
    }

    const filter = { _id: objectId };
    const updateDoc = { $set: updates };

    const result = await contestCollection.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Contest not found",
      });
      }
      
    // success
    return res.status(200).json({
      message: "Contest updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to update contest",
    });
  }
};
module.exports = { createContest, updateContest };
