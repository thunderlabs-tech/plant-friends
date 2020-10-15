#!/usr/bin/env node

const AWS = require("aws-sdk");

function scanAll(docClient, plantTableName, fn) {
  return new Promise((resolve, reject) => {
    docClient.scan({ TableName: plantTableName }, onScan);

    function onScan(err, data) {
      if (err) {
        reject(err);
      } else {
        data.Items.forEach(fn);

        if (typeof data.LastEvaluatedKey != "undefined") {
          params.ExclusiveStartKey = data.LastEvaluatedKey;
          docClient.scan(params, onScan);
        } else {
          resolve();
        }
      }
    }
  });
}

async function updateItem(docClient, plantTableName, id, newValues) {
  const keys = Object.keys(newValues);
  const assignments = keys.map((key) => `#${key} = :${key}`).join(", ");
  const ExpressionAttributeValues = keys.reduce((result, key) => {
    result[`:${key}`] = newValues[key];
    return result;
  }, {});
  const ExpressionAttributeNames = keys.reduce((result, key) => {
    result[`#${key}`] = key;
    return result;
  }, {});

  var params = {
    TableName: plantTableName,
    Key: {
      id,
    },
    UpdateExpression: `set ${assignments}`,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
    ReturnValues: "UPDATED_NEW",
  };

  console.log(params);

  docClient.update(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to update item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
}

async function main(plantTableName, plantEventsTableName) {
  if (!plantTableName || !plantEventsTableName) {
    console.log("Please provide the name of the Plant and PlantEvents tables");
    console.log(
      "You can find it in the Amplify web console (run `amplify api console`)"
    );
    process.exit(1);
  }

  AWS.config.update({ region: "eu-central-1" });

  var docClient = new AWS.DynamoDB.DocumentClient();
  const _lastChangedAt = Date.now();

  [plantTableName, plantEventsTableName].forEach((tableName) => {
    scanAll(docClient, tableName, (plant) => {
      updateItem(docClient, tableName, plant.id, {
        _version: 0,
        _lastChangedAt,
      }).catch((error) => {
        console.error(error);
        process.exit(1);
      });
    });
  });
}

main(...process.argv.slice(2));
