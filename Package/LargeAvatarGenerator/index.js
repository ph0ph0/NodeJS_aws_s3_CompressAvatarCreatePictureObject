const { getScaledWidthAndHeight, transform } = require("../Utils");

const AVATAR_MAX_WIDTH = 175;
const AVATAR_MAX_HEIGHT = 123;

module.exports.thumbnailGenerator = async image => {
  try {
    //Get scaled thumbnail width and height
    console.log("Getting scaled avatar width and height");
    const avatarScaledDimensions = await getScaledWidthAndHeight(
      image,
      AVATAR_MAX_WIDTH,
      AVATAR_MAX_HEIGHT
    );

    //Create buffer of thumbnailImage
    console.log("Creating buffer of compressed avatar");
    const compressedAvatar = await transform(
      image,
      avatarScaledDimensions.width,
      avatarScaledDimensions.height
    );

    return compressedAvatar;
  } catch (error) {
    throw error;
  }
};
