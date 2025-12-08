const { ObjectId } = require("mongodb");
const {
  getUsersCollection,
  getContestsCollection,
} = require("../../config/db");

// see all users
const getUsers = async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const users = await usersCollection.find({}).toArray();
    return res.status(200).json(users);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

// change role
const changeRole = async (req, res) => {
  try {
    const userID = req.params.id;
    const { role } = req.body;

    // basic validation
    if (!role) {
      return res.status(400).json({
        message: "Role is required",
      });
    }

    // validate ObjectId
    let objectId;
    try {
      objectId = new ObjectId(userID);
    } catch (e) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const filter = { _id: objectId };
    const updateDoc = {
      $set: {
        role: role,
      },
    };

    const usersCollection = getUsersCollection();
    const result = await usersCollection.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      // no user found with that ID
      return res.status(404).json({
        message: "User not found",
      });
    }

    // success
    return res.status(200).json({
      message: "Role updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to update role",
    });
  }
};

// Approve / Reject Contest
const changeContestStatus = async (req, res) => {
  try {
    const contestCollection = getContestsCollection();
    const contestID = req.params.id;
    const { status } = req.body;

    // basic validation
    if (!status) {
      return res.status(400).json({
        message: "status is required",
      });
    }

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

    const filter = { _id: objectId };
    const updateDoc = {
      $set: {
        status: status,
      },
    };

    const result = await contestCollection.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    // success
    return res.status(200).json({
      message: "Status updated successfully",
      modifiedCount: result.modifiedCount,
      newStatus: status,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};

// Delete Contest
const deleteContest = async (req, res) => {
  try {
    const contestCollection = getContestsCollection();
    const contestID = req.params.id;

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
        message: "Contest is already confirmed and cannot be deleted",
        currentStatus: oldStatus,
      });
    }

    const result = await contestCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      // safety check
      return res.status(404).json({
        message: "Contest not found or already deleted",
      });
    }

    // success
    return res.status(200).json({
      message: "Contest deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to delete contest",
    });
  }
};

module.exports = { getUsers, changeRole, changeContestStatus,deleteContest };
