const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient({ region: `us-east-1` });

module.exports.pictureObjectGenerator = async (
  largeAvatarKey,
  destinationBucket,
  userId
) => {
  console.log("Attempting to save picture object...");

  const avatarKey = largeAvatarKey.replace("public/", "");

  const putParams = {
    TableName: "Picture-oyj3kq3dz5ckvnkqq3pr4iq3am-masterenv",
    Item: {
      id: userId,
      key: avatarKey,
      bucket: destinationBucket,
      owner: userId,
      region: "us-east-1"
    }
  };

  try {
    const data = await dynamo.put(putParams).promise();
    console.log("Picture object created!: %j", data);
    return data;
  } catch (error) {}
};
