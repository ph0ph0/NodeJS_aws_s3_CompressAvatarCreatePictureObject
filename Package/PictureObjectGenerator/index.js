const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient({ region: `us-east-1` });

module.exports.pictureObjectGenerator = async (
  destinationKey,
  destinationBucket,
  userId
) => {
  const putParams = {
    TableName: UserObjectTable,
    Item: {
      key: destinationKey,
      bucket: destinationBucket,
      owner: userId,
      region: "us-east-1"
    }
  };

  try {
    console.log("Attempting to save picture object...");

    const data = await dynamo.put(putParams).promise();
    console.log("Picture object created!: %j", data);
  } catch (error) {}
};
