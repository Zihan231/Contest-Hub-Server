const { ObjectId } = require("mongodb");
const {
  getContestsCollection,
  getUsersCollection,
  getPaymentsCollection,
} = require("../../config/db");
require("dotenv").config();

const stripe = require("stripe")(process.env.Payment_Key);

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
    const { decodedEmail } = req;
    // If token/decoded email missing
    if (!decodedEmail) {
      return res.status(401).json({
        message: "Unauthorized: invalid or missing token",
      });
    }
    const usersCollection = getUsersCollection();
    const query = { email: decodedEmail };
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

    const filter = { email: decodedEmail };
    const updateDoc = { $set: updates };

    const result = await usersCollection.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }
    // success
    return res.status(200).json({
      message: "Profile Updated successfully",
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
    const { contestId, userID } = req.body;

    // check if this person enrolled in this contest

    const validityQuery = {
      contestId: new ObjectId(contestId),
      participantId: new ObjectId(userID),
    };

    const valid = await paymentsCollection.findOne(validityQuery);
    if (!valid) {
      return res.status(403).json({
        message: "Forbidden access: you are already enrolled in this contest",
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

// see the participated contests
const participatedContest = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const paymentsCollection = getPaymentsCollection();

    if (!userEmail) {
      return res.status(400).json({
        message: "User email is required",
      });
    }

    const query = { participantEmail: userEmail };
    const details = await paymentsCollection.find(query).toArray();

    if (!details || details.length === 0) {
      return res.status(404).json({
        message: "No participated contests found for this user",
      });
    }

    // success
    return res.status(200).json({
      message: "Participated contests fetched successfully",
      count: details.length,
      data: details,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to fetch participated contests",
    });
  }
};

// Participate in Contest
const joinContest = async (req, res) => {
  try {
    const { decodedEmail } = req;
    const { contestID } = req.body;

    if (!contestID) {
      return res.status(400).json({
        message: "contestID and userID are required",
      });
    }

    const contestCollection = getContestsCollection();
    const usersCollection = getUsersCollection();
    const paymentsCollection = getPaymentsCollection();
    
    // Check if user exist
    const userQuery = { email: decodedEmail };
    const userExist = await usersCollection.findOne(userQuery);

    if (!userExist) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    const { name: userName, email: userEmail, photoURL: userPhoto, _id: userIDObject } = userExist;

    // validate contest ObjectId
    let contestObjectId;
    try {
      contestObjectId = new ObjectId(contestID);
    } catch (e) {
      return res.status(400).json({
        message: "Invalid contest ID",
      });
    }

    // fetching the contest
    const contestQuery = { _id: contestObjectId };
    const contestData = await contestCollection.findOne(contestQuery);

    if (!contestData) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    // check deadline
    const deadline = new Date(contestData.deadline);
    const now = new Date();
    if (now > deadline) {
      return res.status(409).json({
        message: "This contest is over, better luck next time.",
        deadline: contestData.deadline,
      });
    }

    const { contestName, entryFee, creatorEmail } = contestData;

    // check if the user already joined this contest
    const userContestQuery = {
      contestId: contestObjectId,
      participantId: userIDObject,
    };
    const alreadyExist = await paymentsCollection.findOne(userContestQuery);
    if (alreadyExist) {
      return res.status(409).json({
        message: "You have already joined this contest",
      });
    }

    // payment logic will come here later

    const inputData = {
      contestName,
      contestId: contestObjectId, // use ObjectId
      creatorEmail: creatorEmail,
      participantId: userIDObject, // use ObjectId
      participantName: userName,
      participantEmail: userEmail,
      participantPhoto: userPhoto,
      price: entryFee,
      paymentStatus: "unPaid",
      transactionId: "", // temp
      taskSubmission: null,
      submissionDate: new Date(),
    };

    // insert into payments collection
    const insertResult = await paymentsCollection.insertOne(inputData);

    if (!insertResult.acknowledged) {
      return res.status(500).json({
        message: "Failed to join contest",
      });
    }

    // increase participation count
    await contestCollection.updateOne(contestQuery, {
      $inc: { participationCount: 1 },
    });

    return res.status(201).json({
      message: "Successfully joined the contest",
      paymentId: insertResult.insertedId,
      data: inputData,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server error while joining contest",
    });
  }
};

// Winning percentage
const winRate = async (req, res) => {
  try {
    const usersCollection = getUsersCollection();
    const paymentsCollection = getPaymentsCollection();

    const userID = req.params.id;

    // validate ObjectId
    let objectId;
    try {
      objectId = new ObjectId(userID);
    } catch (e) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    // validate User
    const userFound = await usersCollection.findOne({ _id: objectId });

    if (!userFound) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const totalWin = userFound.winCount || 0;

    // find total participated contests
    const totalParticipations = await paymentsCollection.countDocuments({
      participantId: objectId,
    });

    // if no participation, win rate is 0 by definition
    if (totalParticipations === 0) {
      return res.status(200).json({
        message: "No participations found for this user",
        userId: userID,
        totalWin,
        totalParticipations,
        winRate: 0,
      });
    }

    // Win Percentage = (Total Wins / Total Participations) * 100
    const winRateValue = (totalWin / totalParticipations) * 100;
    const winRateRounded = Number(winRateValue.toFixed(2));

    return res.status(200).json({
      message: "Win rate calculated successfully",
      userId: userID,
      totalWin,
      totalParticipations,
      winRate: winRateRounded, // in percentage
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Failed to calculate win rate",
    });
  }
};

// See own profile
const getUserByEmail = async (req, res) => {
  try {
    const { decodedEmail } = req;
    const usersCollection = getUsersCollection();

    // auth middleware didn't attach email
    if (!decodedEmail) {
      return res.status(401).json({
        message: "Unauthorized: decoded email missing",
      });
    }

    const user = await usersCollection.findOne({ email: decodedEmail });

    // not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // success
    return res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (e) {
    console.error("getUserByEmail error:", e);
    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};

// payment
const proceedPayment = async (req, res) => {
  const paymentInfo = req.body;
  const amount = parseInt(paymentInfo.cost)*100;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price_data: {
          currency: 'USD',
          unit_amount: amount,
          product_data: {
            name: paymentInfo.contestName,

          }
        },
        quantity: 1,
      },
    ],
    customer_email: paymentInfo.senderEmail,

    mode: "payment",
    metadata: {
      contestId: paymentInfo.contestId
    },
    success_url: `${process.env.Site_Domain}/dashboard`,
    cancel_url: `${process.env.Site_Domain}/dashboard/profile`,
  });
  console.log(session);
  res.send({ url: session.url });
};

module.exports = {
  getContestByID,
  updateProfile,
  participantsContest,
  participatedContest,
  joinContest,
  winRate,
  getUserByEmail,
};
