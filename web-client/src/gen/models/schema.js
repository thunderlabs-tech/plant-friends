export const schema = {
  models: {
    Plant: {
      name: "Plant",
      fields: {
        id: {
          name: "id",
          isArray: false,
          type: "ID",
          isRequired: true,
          attributes: [],
        },
        name: {
          name: "name",
          isArray: false,
          type: "String",
          isRequired: true,
          attributes: [],
        },
        timeOfDeath: {
          name: "timeOfDeath",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
        },
        lastWateredAt: {
          name: "lastWateredAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: false,
          attributes: [],
        },
        wateringPeriodInDays: {
          name: "wateringPeriodInDays",
          isArray: false,
          type: "Int",
          isRequired: true,
          attributes: [],
        },
        events: {
          name: "events",
          isArray: true,
          type: {
            model: "PlantEvent",
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: "HAS_MANY",
            associatedWith: "plant",
          },
        },
      },
      syncable: true,
      pluralName: "Plants",
      attributes: [
        {
          type: "model",
          properties: {},
        },
        {
          type: "auth",
          properties: {
            rules: [
              {
                provider: "userPools",
                ownerField: "owner",
                allow: "owner",
                operations: ["create", "read", "update"],
                identityClaim: "cognito:username",
              },
            ],
          },
        },
      ],
    },
    PlantEvent: {
      name: "PlantEvent",
      fields: {
        id: {
          name: "id",
          isArray: false,
          type: "ID",
          isRequired: true,
          attributes: [],
        },
        plant: {
          name: "plant",
          isArray: false,
          type: {
            model: "Plant",
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: "BELONGS_TO",
            targetName: "plantId",
          },
        },
        type: {
          name: "type",
          isArray: false,
          type: {
            enum: "PlantEventType",
          },
          isRequired: true,
          attributes: [],
        },
        createdAt: {
          name: "createdAt",
          isArray: false,
          type: "AWSDateTime",
          isRequired: true,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: "PlantEvents",
      attributes: [
        {
          type: "model",
          properties: {},
        },
        {
          type: "key",
          properties: {
            name: "byPlant",
            fields: ["plantId", "createdAt"],
          },
        },
        {
          type: "auth",
          properties: {
            rules: [
              {
                provider: "userPools",
                ownerField: "owner",
                allow: "owner",
                operations: ["create", "read", "update"],
                identityClaim: "cognito:username",
              },
            ],
          },
        },
      ],
    },
  },
  enums: {
    PlantEventType: {
      name: "PlantEventType",
      values: ["WATERED"],
    },
  },
  nonModels: {},
  version: "0064eaa41f661b9736b96dc775470f4e",
};
