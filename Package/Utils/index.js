const AWS = require("aws-sdk");
const sharp = require("sharp");
const s3 = new AWS.S3();

module.exports.eventDetails = event => {
  console.log("Getting event details...");
  const sourceBucket = event.Records[0].s3.bucket.name;
  const sourceKey = event.Records[0].s3.object.key;
  const lastSlash = sourceKey.lastIndexOf("/");
  const fileName = sourceKey.substring(lastSlash + 1);
  //GET USERID FROM UPLOAD
  const lastFullStop = fileName.lastIndexOf(".");
  const userId = fileName.substring(0, lastFullStop);
  console.log(`Got userId!: ${userId}`);
  const destinationBucket = sourceBucket;
  const largeAvatarDestinationKey =
    "public/userAvatars-large-40x40/" + fileName;
  const smallAvatarDestinationKey =
    "public/userAvatars-small-23x23/" + fileName;

  //Prevent Recursion: Ensure lambda only triggered on initial upload
  if (sourceKey.includes("large")) {
    const error = new Error("Preventing recursion on uploaded avatar");
    context.done(error, null);
    throw error;
  }

  console.log("Got event details!");

  return {
    sourceBucket: sourceBucket,
    sourceKey: sourceKey,
    destinationBucket: destinationBucket,
    largeAvatarDestinationKey: largeAvatarDestinationKey,
    smallAvatarDestinationKey: smallAvatarDestinationKey,
    userId: userId
  };
};

const getSize = image => {
  return new Promise((resolve, reject) => {
    console.log("getting size...");
    sharp(image).toBuffer((err, data, info) => {
      if (err) reject(err);
      else resolve(info);
    });
  });
};

module.exports.getScaledWidthAndHeight = async (
  image,
  max_width,
  max_height
) => {
  const imageSize = await getSize(image);
  console.log(
    "imageSize, width: " + imageSize.width + " height: " + imageSize.height
  );
  const scalingFactor = Math.min(
    max_width / imageSize.width,
    max_height / imageSize.height
  );
  console.log("scalingFactor: " + scalingFactor);

  const width = Math.round(scalingFactor * imageSize.width);
  const height = Math.round(scalingFactor * imageSize.height);
  console.log("scaledWidth: " + width + ", scaledHeight: " + height);

  return {
    width: width,
    height: height
  };
};

module.exports.transform = async (image, width, height) => {
  return await sharp(image)
    .resize(width, height, {
      fit: "contain"
    })
    .toBuffer();
};

module.exports.downloadImage = async (key, bucket) => {
  console.log("Downloading image: " + key);
  try {
    const uploadedImage = await s3
      .getObject({ Bucket: bucket, Key: key })
      .promise();
    const image = uploadedImage.Body;

    console.log("Downloaded image!");
    return image;
  } catch (error) {
    throw error;
  }
};

module.exports.uploadImage = async (
  image,
  destinationKey,
  destinationBucket
) => {
  try {
    console.log("Uploading image: " + destinationKey);
    await s3
      .putObject({
        Bucket: destinationBucket,
        Key: destinationKey,
        Body: image
      })
      .promise();

    console.log("Uploaded image!");
    return;
  } catch {
    throw error;
  }
};
