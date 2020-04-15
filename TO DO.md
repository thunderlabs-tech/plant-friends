# General Plan

1. Build a simple UI
2. Connect it to a backend
3. Build an iOS app to receive notifications

# Features

- Which plants need to be watered?
  - Necessary data:
    - Plant
      - last time watered
      - watering frequency
  - Necessary client/server interactions
    - Get list of plants needing watering
  - Necessary UI:
    - Show list of plants which need watering
- Mark plant as watered
  - Necessary UI
    - Button etc indicating that a plant was watered
  - Necessary client-server interactions
    - Mark plant watered
    - Update to list of plants
  - User story:
    - Given there is an "Azalea" in the list of plants that need to be watered
    - When I press the "watered plant" button on the "Azalea"
    - The list of plants that need to be watered should no longer include the "Azalea"
- Receive notification that a plant needs watering
  - User story:
    - Given there is a plant which needs watering today
    - When the time reaches 9AM
    - Then I should receive a notification that the plant needs watering
- Add new plant
- Remove plant
- Edit/update a plant
- Log in
- Sign up

# TO DO

- [ ] How do migrations work?
- [ ] Investigate Prisma as an alternative to Fauna
- [ ] Data storage skeleton
  - [ ] Automatically create FaunaDB database
  - [x] Define types in TS
  - [x] Generate schema from type definitions
  - [ ] Automatically upload schema to Fauna
  - [ ] How can I run a local version of the DB for development?
    - https://fauna.com/blog/setting-up-a-new-fauna-cluster-using-docker
    - https://app.fauna.com/releases/enterprise/2.11.2

# NOTES

- https://pusher.com/tutorials/graphql-typescript
- Investigate Apollo
