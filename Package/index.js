const { avatarCompressor } = require("./AvatarCompressor");
const { eventDetails, downloadImage, uploadImage } = require("./Utils");
const { createPictureObject } = require("./PictureObjectCreator");
const { updateUserObject } = require("./UserObjectUpdator");

exports.handler = async event => {
  console.log("Intercepted avatar upload, event: %j", event);

  //Get event details
  const {
    sourceBucket,
    sourceKey,
    destinationBucket,
    destinationKey,
    region,
    userId
  } = eventDetails(event);

  try {
    //Download the newly added avatar from storage
    console.log("Processing avatar uploaded to storage");

    const avatar = await downloadImage(sourceKey, sourceBucket);

    //Compress the avatar image to a smaller size
    const compressedAvatar = await avatarCompressor(avatar);

    //Upload the avatar
    await uploadImage(compressedAvatar, destinationKey, destinationBucket);

    console.log(
      "Uploaded the compressed avatar to Storage! Creating Picture object.."
    );

    //Create picture object in dDB
    const pictureObject = await createPictureObject(
      destinationKey,
      destinationBucket,
      region
    );

    //Get pictureObject id
    const pictureObjectId = pictureObject.id;

    console.log("Created Picture object! Updating User object...");

    //Update the user
    await updateUserObject(userId, pictureObjectId);

    console.log("DONE ALL!");
  } catch (error) {
    console.log("ERROR!: " + error);
    throw error;
  }
};
