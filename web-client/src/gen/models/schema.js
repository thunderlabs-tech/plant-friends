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
        lastFertilizedAt: {
          name: "lastFertilizedAt",
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
        fertilizingPeriodInDays: {
          name: "fertilizingPeriodInDays",
          isArray: false,
          type: "Int",
          isRequired: false,
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
          isArrayNullable: false,
          association: {
            connectionType: "HAS_MANY",
            associatedWith: "plantId",
          },
        },
        waterNextAt: {
          name: "waterNextAt",
          isArray: false,
          type: "AWSDate",
          isRequired: true,
          attributes: [],
        },
        fertilizeNextAt: {
          name: "fertilizeNextAt",
          isArray: false,
          type: "AWSDate",
          isRequired: false,
          attributes: [],
        },
        owner: {
          name: "owner",
          isArray: false,
          type: "String",
          isRequired: true,
          attributes: [],
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
        plantId: {
          name: "plantId",
          isArray: false,
          type: "ID",
          isRequired: true,
          attributes: [],
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
        owner: {
          name: "owner",
          isArray: false,
          type: "String",
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
      values: ["WATERED", "FERTILIZED"],
    },
  },
  nonModels: {},
  version: "66890bff1024f8b8d6b837ea14ce7f9f",
};
