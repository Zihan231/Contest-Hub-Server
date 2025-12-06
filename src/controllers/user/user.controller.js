const { ObjectId } = require("mongodb");
const {
  getContestsCollection,
  getUsersCollection,
  getPaymentsCollection,
} = require("../../config/db");

// get Contest by Id
const getContestByID = async (req, res) => {
  try {
    const contestCollection = getContestsCollection();
    const { id: contestID } = req.params; // /contest/:id

    // validate ObjectId
    let objectId;
    try {
      objectId = new ObjectId(contestID);
    } catch (e) {
      return res.status(400).json({
        message: "Invalid contest ID",
      });
    }

    // check if contest is available
    const query = { _id: objectId };
    const contestExist = await contestCollection.findOne(query);

    if (!contestExist) {
      return res.status(404).json({
        message: "Contest Not Found",
      });
    }

    // success
    return res.status(200).json({
      message: "Contest fetched successfully",
      data: contestExist,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to fetch contest",
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const UserID = req.params;

    // validate ObjectId
    let objectId;
    try {
      objectId = new ObjectId(UserID);
    } catch (e) {
      return res.status(400).json({
        message: "Invalid contest ID",
      });
    }

    const query = { _id: objectId };
    const userExist = await usersCollection.findOne(query);

    if (!userExist) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    const { name, photoURL, bio, address } = req.body;

    // Build partial update object
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (photoURL !== undefined) updates.photoURL = photoURL;
    if (bio !== undefined) updates.bio = bio;
    if (address !== undefined) updates.address = address;

    // If no fields were sent
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided to update",
      });
    }

    const filter = { _id: objectId };
    const updateDoc = { $set: updates };

    const result = await usersCollection.updateOne(filter, updateDoc);

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

// see participants in a contest
const participantsContest = async (req, res) => {
  try {
    const paymentsCollection = getPaymentsCollection();
    const contestId = req.params.id;

    // fetching all participants for this contest
    const query = { contestId };

    const participantsData = await paymentsCollection
      .find(query, {
        projection: {
          participantName: 1,
          participantEmail: 1,
          participantPhoto: 1,
          _id: 0,
        },
      })
      .toArray();

    if (participantsData.length === 0) {
      return res.status(404).json({
        message: "No participants found for this contest",
      });
    }
    // success
    return res.status(200).json({
      message: "Data fetched successfully",
      participantsData,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to fetch data",
    });
  }
};

module.exports = { getContestByID, updateProfile, participantsContest };
