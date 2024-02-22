const Instructor = require("../Schemas/instructor");
const User = require("../Schemas/Users");

const instructorDetails = async (req, res) => {
  const userId = req.userId;
  const { bio, location, profilePicture } = req.body;

  try {
    let instructor = await Instructor.findOne({ userId });

    if (instructor) {
      instructor = await Instructor.findOneAndUpdate(
        userId,
        { bio, location, profilePicture },
        { new: true }
      );
    } else {
      instructor = new Instructor({
        userId,
        bio,
        location,
        profilePicture,
      });
      await instructor.save();
    }

    res.status(200).json({
      ok: true,
      message: "Instructor details updated successfully",
      instructor,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error updating instructor details",
      error: error.message,
    });
  }
};
const updateProfile = async (req, res) => {
  const userId = req.params.id;
  const { email, password, bio, location, profilePicture } = req.body;

  try {
    const userUpdateFields = { email, password };
    const updatedUser = await User.findByIdAndUpdate(userId, userUpdateFields, {
      new: true,
    });

    const instructorUpdateFields = { bio, location, profilePicture };
    const updatedInstructor = await Instructor.findOneAndUpdate(
      { userId },
      instructorUpdateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    res.json({
      ok: true,
      message: "Profile updated successfully",
      user: updatedUser,
      instructor: updatedInstructor,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
const instructorProfile = async (req, res) => {
  try {
    const instructorId = req.params.id;
    const instructorDetails = await Instructor.findOne({
      userId: instructorId,
    }).populate({
      path: "userId",
      select: "email name surname",
    });

    if (!instructorDetails) {
      return res
        .status(404)
        .json({ ok: false, message: "Instructor not found" });
    }

    const profileData = {
      email: instructorDetails.userId.email,
      name: instructorDetails.userId.name,
      surname: instructorDetails.userId.surname,
      bio: instructorDetails.bio,
      location: instructorDetails.location,
      profilePicture: instructorDetails.profilePicture,
    };
    console.log(profileData);
    res.json({ ok: true, profile: profileData });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error fetching instructor profile",
      error: error.message,
    });
  }
};

module.exports = { instructorDetails, updateProfile, instructorProfile };
