const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient({ region: `us-east-1` });

module.exports.updateUserObject = async (userId, pictureObjectId) => {
  console.log("Updating user object...");

  const updateParams = {
    TableName: "User-or2wpavvmbatbhfn7vwoynk4c4-dev",
    Key: {
      id: userId
    },
    UpdateExpression: "SET userAvatarId = :pictureObjectId",
    ExpressionAttributeValues: {
      ":pictureObjectId": { S: pictureObjectId }
    },
    ReturnValues: "UPDATED_NEW"
  };

  const data = await dynamo.update(updateParams).promise();

  console.log("User updated!: %j", data);

  return data;
};
