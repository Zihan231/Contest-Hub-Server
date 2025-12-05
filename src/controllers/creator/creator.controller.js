const { getContestsCollection } = require("../../config/db");

const createContest = async (req, res) => {
  try {
    const contestCollection = getContestsCollection();
    const data = req.body;

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
      message: "Contest created successfully",
      contestId: result.insertedId,
      contest: data,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server error while creating contest",
    });
  }
};

module.exports = { createContest };
