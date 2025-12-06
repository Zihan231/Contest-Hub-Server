const { getContestsCollection } = require("../../config/db");

// see all contest
const getContest = async (req, res) => {
  try {
    const contestsCollection = getContestsCollection();

    const query = {
      status: "confirmed"
    }
    const contests = await contestsCollection.find(query).toArray();

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

// signUp 


module.exports = { getContest };
