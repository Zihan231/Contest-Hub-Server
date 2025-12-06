const { ObjectId } = require("mongodb");
const {
  getContestsCollection,
  getUsersCollection,
  getPaymentsCollection,
} = require("../../config/db");

// Create contest
const createContest = async (req, res) => {
  try {
    const contestCollection = getContestsCollection();
    let data = req.body;
    data.participationCount = 0;
    data.winnerEmail = null;
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

    // feting the contest if available ok else error
    const query = { _id: objectId };
    const contestData = await contestCollection.findOne(query);

    if (!contestData) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    // if status confirm can't delete/update
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

// Delete Own contest
const deleteContest = async (req, res) => {
  try {
    const contestCollection = getContestsCollection();
    const { id: contestID } = req.params;

    // validate ObjectId
    let objectId;
    try {
      objectId = new ObjectId(contestID);
    } catch (e) {
      return res.status(400).json({
        message: "Invalid contest ID",
      });
    }

    // fetching the contest
    const query = { _id: objectId };
    const contestData = await contestCollection.findOne(query);

    if (!contestData) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    // if status confirmed can't delete
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

// see participants in a contest
const getParticipants = async (req, res) => {
  try {
    const paymentsCollection = getPaymentsCollection();
    const { contestId, userEmail } = req.body;

    // check if this person enrolled in this contest

    const validityQuery = {
      contestId: new ObjectId(contestId),
      creatorEmail: userEmail,
    };

    const valid = await paymentsCollection.findOne(validityQuery);
    if (!valid) {
      return res.status(403).json({
        message: "Forbidden access: This is not your contest",
      });
    }

    // fetching all participants for this contest
    const query = { contestId: new ObjectId(contestId) };

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

// Declare a winner
const declareWinner = async (req, res) => {
  try {
    const winnerID = req.body.winnerID;
    const contestID = req.body.contestID;

    // validate ObjectId
    let winnerObjectId;
    let contestObjectId;
    try {
      winnerObjectId = new ObjectId(winnerID);
    } catch (e) {
      return res.status(400).json({
        message: "Invalid winner ID",
      });
    }

    try {
      contestObjectId = new ObjectId(contestID);
    } catch (e) {
      return res.status(400).json({
        message: "Invalid contest ID",
      });
    }

    // Check if user exist
    const usersCollection = getUsersCollection();
    const winnerQuery = { _id: winnerObjectId };
    const userExist = await usersCollection.findOne(winnerQuery);

    if (!userExist) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    const {
      name: winnerName,
      email: winnerEmail,
      photoURL: winnerPhoto,
    } = userExist;

    // check if contest exist
    const contestCollection = getContestsCollection();
    const contestQuery = { _id: contestObjectId };
    const contestExist = await contestCollection.findOne(contestQuery);

    if (!contestExist) {
      return res.status(404).json({
        message: "Contest Not Found",
      });
    }

    // if contest is approved by the admins
    if (
      contestExist.status === "pending" ||
      contestExist.status === "rejected"
    ) {
      return res.status(409).json({
        message:
          "Contest is not confirmed yet, you cannot declare the winner now. Wait for deadline finish",
      });
    }

    // check deadline
    const deadline = new Date(contestExist.deadline);
    const now = new Date();
    if (now < deadline) {
      return res.status(409).json({
        message: "You cannot declare the winner before the contest deadline.",
        deadline: contestExist.deadline,
      });
    }

    // if contest has winner already
    if (
      contestExist.winnerName ||
      contestExist.winnerEmail ||
      contestExist.winnerPhoto
    ) {
      return res.status(409).json({
        message: "This contest is over and winner is already declared.",
      });
    }

    // Declare the winner
    const Update = {
      $set: {
        winnerName,
        winnerEmail,
        winnerPhoto,
      },
    };
    const filter = { _id: contestObjectId };
    const result = await contestCollection.updateOne(filter, Update);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    // success
    return res.status(200).json({
      message: "Winner declared successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to update contest",
    });
  }
};

// see own created contests
const getContestByEmail = async (req, res) => {
  try {
    const userEmail = req.params.email;

    if (!userEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const contestCollection = getContestsCollection();

    const query = { creatorEmail: userEmail };
    const contests = await contestCollection.find(query).toArray();

    if (!contests || contests.length === 0) {
      return res.status(404).json({
        message: "No contests found for this email",
      });
    }

    // success
    return res.status(200).json({
      message: "Contests fetched successfully",
      count: contests.length,
      data: contests,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to fetch contests",
    });
  }
};

module.exports = { createContest, updateContest, deleteContest, declareWinner,getParticipants,getContestByEmail };
