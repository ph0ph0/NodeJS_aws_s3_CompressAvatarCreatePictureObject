//This Lambda is called when a user signs up or changes their profile information.
//Each user has an avatar property on the User object, which is their display picture.
//When the avatar is uploaded to S3, this Lambda creates two compressed versions,
//and then binds the larger of the two (40x40) to the User object, allowing it
//to be retrieved.
const { avatarsGenerator } = require("./AvatarsGenerator");
const { eventDetails, downloadImage, uploadImage } = require("./Utils");
const { pictureObjectGenerator } = require("./PictureObjectGenerator");
const { updateUserObject } = require("./UserObjectUpdator");

exports.handler = async event => {
  console.log("Intercepted avatar upload, event: %j", event);

  //Get event details
  const {
    sourceBucket,
    sourceKey,
    destinationBucket,
    largeAvatarDestinationKey,
    smallAvatarDestinationKey,
    userId
  } = eventDetails(event);

  try {
    //Download the newly added avatar from storage
    console.log("Processing avatar uploaded to storage");

    const avatar = await downloadImage(sourceKey, sourceBucket);

    //Compress the avatar image to a smaller size
    const avatars = await avatarsGenerator(avatar);
    const largeAvatar = avatars.largeAvatar;
    const smallAvatar = avatars.smallAvatar;

    //Upload the avatars
    await uploadImage(
      largeAvatar,
      largeAvatarDestinationKey,
      destinationBucket
    );
    await uploadImage(
      smallAvatar,
      smallAvatarDestinationKey,
      destinationBucket
    );

    console.log(
      "Uploaded the compressed avatars to Storage! Creating Picture object.."
    );

    //Create picture object in dDB
    const pictureObject = await pictureObjectGenerator(
      largeAvatarDestinationKey,
      destinationBucket,
      userId
    );

    //The avatar picture object will have the same id as the user
    const pictureObjectId = userId;

    console.log("Created Picture object! Updating User object...");

    //Update the user object with the userAvatarId so that the avatar is bound to the user
    await updateUserObject(userId, pictureObjectId);

    console.log("DONE ALL!");
  } catch (error) {
    console.log("ERROR!: " + error);
    throw error;
  }
};
