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
  const contestCollection = getContestsCollection();
  const contestID = req.params;
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
};
module.exports = { createContest };
