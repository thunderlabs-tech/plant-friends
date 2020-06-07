# Plant Friends

Keep your plants happy by tracking and caring for their needs.

## Monorepo Project Structure

This project contains all relevant code for Plant Friends deployment: client apps, server functions, etc. See `clients/` for the available client apps and `services/` for backend services.

We use Yarn to manage multiple projects in one repository (known as "workspaces" in Yarn terminology).

See the README in individual workspaces for project-specific info.

## CI & CD

Continuous integration is managed using Github workflows. See [`.github/workflows`](.github/workflows).

Continuous deployment is managed using Netlify. See [`netlify.toml`](netlify.toml).

## User stories

These are implementation-agnostic descriptions of how the app fits into users' lives. We record them
here to provide direction for future features and UX design, without constraining us to a specific
implementation.

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
