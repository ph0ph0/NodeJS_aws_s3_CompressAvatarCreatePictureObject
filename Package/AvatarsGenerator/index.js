const { getScaledWidthAndHeight, transform } = require("../Utils");

const LARGE_AVATAR_MAX_WIDTH = 40;
const LARGE_AVATAR_MAX_HEIGHT = 40;

const SMALL_AVATAR_MAX_WIDTH = 23;
const SMALL_AVATAR_MAX_HEIGHT = 23;

module.exports.avatarsGenerator = async image => {
  try {
    //Get scaled large avatar width and height
    console.log("Getting scaled large avatar width and height");
    const largeAvatarScaledDimensions = await getScaledWidthAndHeight(
      image,
      LARGE_AVATAR_MAX_WIDTH,
      LARGE_AVATAR_MAX_HEIGHT
    );

    //Create buffer of large avatar
    console.log("Creating buffer of large avatar");
    const largeAvatar = await transform(
      image,
      largeAvatarScaledDimensions.width,
      largeAvatarScaledDimensions.height
    );

    //Get scaled small avatar width and height
    console.log("Getting scaled small avatar width and height");
    const smallAvatarScaledDimensions = await getScaledWidthAndHeight(
      image,
      SMALL_AVATAR_MAX_WIDTH,
      SMALL_AVATAR_MAX_HEIGHT
    );

    //Create buffer of small avatar
    console.log("Creating buffer of small avatar");
    const smallAvatar = await transform(
      image,
      smallAvatarScaledDimensions.width,
      smallAvatarScaledDimensions.height
    );

    return {
      largeAvatar: largeAvatar,
      smallAvatar: smallAvatar
    };
  } catch (error) {
    throw error;
  }
};
