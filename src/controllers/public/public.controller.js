const { getContestsCollection } = require("../../config/db");

const getContest = async (req, res) => {
  try {
    const contestsCollection = getContestsCollection();

    const contests = await contestsCollection.find({}).toArray();

    if (!contests || contests.length === 0) {
      return res.status(404).json({
        message: "No contests found",
      });
    }
    // Success
    return res.status(200).json({
      message: "Contests fetched successfully",
      data: contests,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to fetch contests",
    });
  }
};

module.exports = { getContest };
