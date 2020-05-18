# Plant Friends

Keep your plants happy by tracking and caring for their needs.

## User stories

- When I get up in the morning
  - I want to water my plants
  - Eg. by seeing a list of which plants need water
  - And checking off each one as I water it
- When one of my plants is dead
  - I want to avoid getting reminders about it
  - E.g. by removing it from the list
- When one of my plants looks a bit dry
  - I want to know when it was last watered
  - E.g. by using filtering the list by its name
  - Or by navigating by the room it's in
- When I'm going away for a few days
  - I want to make sure my plants will have enough water
  - E.g. by seeing a calendar / time ordered list of when plants will need water
  - So that I can water them before I leave
- When I'm on a different device
  - I want to have access to my data
  - E.g. by authenticating as the same user
- When I'm using another app which can use my data / I want to back up my data
  - I want to be able to download my data
  - E.g. as CSV
- When my plants need fertilizer
  - I want to fertilize my plants
  - E.g. by seeing a list of which plants need to be fertilized
- When I have a new plant / a plant is unwell
  - I want to make sure it has the sun / temperature / humidity it needs
  - E.g. by seeing data about the type of plant it is and its needs

## TO DO

- Split plant list and TO DO list
  - (This allows more actions in the future than just watering)
  - Add tabs to switch between lists
- [ ] Add unit tests
  - [ ] All actions
  - [ ] Action-invoking UI elements
- [ ] Add E2E test:
  - [ ] Add a plant
  - [ ] Water a plant
- Remove a plant
  - Add graveyard (trash) migration
  - Add "move to graveyard" action
  - Add a way to see graveyard
- Search
- Replace "new plant" UI with something less intrusive, which isn't always present
- Schedule view
  - Group plants by day they next need to be watered
- Add plant photos
  - Show as avatars in list instead of letter avatars when available
  - Store as a list of photos
- Add more plant info
  - Allow entering manually
  - How much sun it needs
  - How frequently to water it
  - A link to more info (wiki, e.g.)
  - Desired temperature
- Restore scroll position when transitioning to list
- Add plant types for my plants
  - Suggest all plant info based on plant type
  - Allow overriding type defaults for individual plants
- Allow searching to enter a plant type
- Add navigation by location, e.g. "living room"
  - Show all locations, number of plants needing attention in each location as a red badge
  - Show all plants in location as a list as normal
- Show future watering schedule as a calendar
- Receive notification that a plant needs watering
  - User story:
    - Given there is a plant which needs watering today
    - When the time reaches 9AM
    - Then I should receive a notification that the plant needs watering
- Export data function
  - To CSV
  - So I can reimport it when I implement the backend
- Sync data between devices
- Log in
- Sign up
- [ ] Data storage skeleton
  - [ ] Automatically create FaunaDB database
  - [x] Define types in TS
  - [x] Generate schema from type definitions
  - [ ] Automatically upload schema to Fauna
  - [ ] How can I run a local version of the DB for development?
    - https://fauna.com/blog/setting-up-a-new-fauna-cluster-using-docker
    - https://app.fauna.com/releases/enterprise/2.11.2
  - [ ] How do migrations work?
- [ ] Investigate Prisma as an alternative to Fauna
- [ ] Correct types for RMWC:
  - [ ] Elevation - `z` property is typed as `number` but should only be numbers from 0-24
  - [ ] Theme - theme provider options is just a string keyed object
  - [ ] TextField
    - [ ] Event handler type uses "any" for `FormEvent<any>` resulting in untyped change handlers
    - [ ] File is misnamed - is `textfield` should be `text-field` 🤦‍♂️

## NOTES

- https://pusher.com/tutorials/graphql-typescript
- Investigate Apollo
- Potential plant databases:
  - http://www.worldfloraonline.org
  - https://plants.sc.egov.usda.gov/java/
  - https://pfaf.org/user/DatabaseSearhResult.aspx
  - https://garden.org/plants/search/text/?q=basil
- Replace Material UI:
  - Try react-toolbox.io instead of Material UI
  - Or https://rmwc.io/

# DONE

- ✅ Which plants need to be watered?
  - Necessary data:
    - Plant
      - last time watered
      - watering frequency
  - Necessary client/server interactions
    - Get list of plants needing watering
  - Necessary UI:
    - Show list of plants which need watering
- ✅ Mark plant as watered
  - Necessary UI
    - Button etc indicating that a plant was watered
  - Necessary client-server interactions
    - Mark plant watered
    - Update to list of plants
  - User story:
    - Given there is an "Azalea" in the list of plants that need to be watered
    - When I press the "watered plant" button on the "Azalea"
    - The list of plants that need to be watered should no longer include the "Azalea"
- ✅ Persist plants
- ✅ Deploy app
- ✅ Add new plant
- ✅ Edit/update a plant
  - Add react router
  - Add edit route
  - Add update plant action
  - Add form
- ✅ Add refresh action
- ✅ Add plant letter avatars
- ✅ Next water at
- ✅ Replace Material UI
