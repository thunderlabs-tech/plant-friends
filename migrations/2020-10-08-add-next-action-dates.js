#!/usr/bin/env node

const AWS = require("aws-sdk");
const dateFns = require("date-fns");

function scanAllPlants(docClient, plantTableName, fn) {
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

async function updatePlant(docClient, plantTableName, id, newValues) {
  const keys = Object.keys(newValues);
  const assignments = keys.map((key) => `${key} = :${key}`).join(", ");
  const expressionAttributeValues = keys.reduce((result, key) => {
    result[`:${key}`] = newValues[key];
    return result;
  }, {});

  var params = {
    TableName: plantTableName,
    Key: {
      id,
    },
    UpdateExpression: `set ${assignments}`,
    ExpressionAttributeValues: expressionAttributeValues,
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

function formatAwsDateString(date) {
  if (date === null || date === undefined) return null;
  return dateFns.format(date, "yyyy-MM-dd");
}

function parseDateString(dateStringOrUndefined) {
  if (!dateStringOrUndefined) return undefined;
  return new Date(Date.parse(dateStringOrUndefined));
}

function nextActionDueDate({ lastPerformedAt, plantCreatedAt, periodInDays }) {
  if (periodInDays === null || periodInDays === undefined) return undefined;

  const endOfPeriod = dateFns.add(lastPerformedAt || plantCreatedAt, {
    days: periodInDays,
  });

  return dateFns.startOfDay(endOfPeriod);
}

function getWaterNextAt(plant) {
  return nextActionDueDate({
    lastPerformedAt: parseDateString(plant.lastWateredAt),
    periodInDays: plant.wateringPeriodInDays,
    plantCreatedAt: parseDateString(plant.createdAt),
  });
}

function getFertilizeNextAt(plant) {
  return nextActionDueDate({
    lastPerformedAt: parseDateString(plant.lastFertilizedAt),
    periodInDays: plant.fertilizingPeriodInDays,
    plantCreatedAt: parseDateString(plant.createdAt),
  });
}

async function main(plantTableName) {
  if (!plantTableName) {
    console.log("Please provide the name of the Plant table");
    console.log(
      "You can find it in the Amplify web console (run `amplify api console`)"
    );
    process.exit(1);
  }

  AWS.config.update({ region: "eu-central-1" });

  var docClient = new AWS.DynamoDB.DocumentClient();

  await scanAllPlants(docClient, plantTableName, (plant) => {
    const waterNextAt = getWaterNextAt(plant);
    const fertilizeNextAt = getFertilizeNextAt(plant);

    updatePlant(docClient, plantTableName, plant.id, {
      waterNextAt: formatAwsDateString(waterNextAt),
      fertilizeNextAt: formatAwsDateString(fertilizeNextAt),
    }).catch((error) => {
      console.error(error);
      process.exit(1);
    });
  });
}

main(...process.argv.slice(2));
