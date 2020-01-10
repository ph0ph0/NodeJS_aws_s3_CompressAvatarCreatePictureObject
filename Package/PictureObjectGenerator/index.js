const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient({ region: `us-east-1` });

module.exports.pictureObjectGenerator = async (
  largeAvatarKey,
  destinationBucket,
  userId
) => {
  console.log("Attempting to save picture object...");

  const avatarKey = 

  const putParams = {
    TableName: "Picture-or2wpavvmbatbhfn7vwoynk4c4-dev",
    Item: {
      id: userId,
      key: largeAvatarKey,
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
