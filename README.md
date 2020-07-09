# Plant Friends

Keep your plants happy by tracking and caring for their needs.

- Production app: https://plant-friends.netlify.app/

## Monorepo Project Structure

This project contains all relevant code for Plant Friends deployment: client apps, server functions, etc. See `clients/` for the available client apps and `services/` for backend services.

We use Yarn to manage multiple projects in one repository (known as "workspaces" in Yarn terminology).

See the README in individual workspaces for project-specific info.

## Principles / Conventions

- Keep the UI tree shallow
- Keep configuration in package.json
- Avoid merge commits, but preserve meaningful commit history
- Don't enable linter warnings - either make it an error or disable the rule
- Resolve console errors immediately
- Github issue/card format:
  - **Context** describes:
    - The situation the user is in which motivates the solution described in the issue
    - Any extra information relevant to the reader that they might not otherwise be aware of (other affected systems
      etc)
  - **Proposed Solution**:
    - Describes the solution the author has in mind
    - It's phrased as "proposed" so that if the person working on the card comes up with a better solution they can
      implement that instead, as long as it solves the problem described in the issue

## Local Development

We use [netlify-dev](https://github.com/netlify/cli/blob/master/docs/netlify-dev.md) to run a local version of the Netlify environment. This serves the backend lambda functions and proxies to the local client dev server to allow testing in a production-like environment.

Netlify-dev will include all production environment variables in the local environment, so watch out.

To start the Netlify dev server:

    netlify dev

This will start the `clients/web-app` local server and proxy requests to it from the local Netlify server whose address it will print out:

    ◈ Server now ready on http://localhost:8888

### Invoking Netlify Serverless Functions

Once `netlify dev` is runnning, you can use [`netlify functions:invoke`](https://github.com/netlify/cli/blob/master/docs/netlify-dev.md#locally-testing-functions-with-netlify-functionsinvoke).

    netlify functions:invoke getPlants

## Deployment

Deployed automatically to production via Netlify.

- Netlify admin panel: https://app.netlify.com/sites/plant-friends/overview

## CI & CD

Continuous integration is managed using Github workflows. See [`.github/workflows`](.github/workflows).

Continuous deployment is managed using Netlify. See [`netlify.toml`](netlify.toml).

## Persistence / FaunaDB

Data is stored in [FaunaDB](https://dashboard.fauna.com/).

### Databases, access keys, environment variables

One database is designated for production and its access key is stored as an environment variable in Netlify.

For local development, create a new database for yourself or [run a local FaunaDB docker image](https://fauna.com/blog/setting-up-a-new-fauna-cluster-using-docker).

FaunaDB identifies which database you connect to by your access token. Once you've created a database, assign the key to the environment variable `REACT_APP_FAUNADB_ACCESS_TOKEN` (you can put it in [`.env`](clients/web-app/.env) for convenience).

### Schema

For now databases need to be set up and migrated manually. The current schema is stored in (schema/schema.gql)[schema/schema.gql]. You can upload it using the FaunaDB dashboard (go to the "GraphQL" tab and there's an "Update Schema" button).

### Staging, Netlify deploy previews

Netlify builds a copy of the app for each open PR. Currently they will all connect to the same FaunaDB staging database. In the future we could add a Netlify hook to provision a new FaunaDB database for each new deploy preview so that they don't conflict. This will be particularly important when we have automated migrations.

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
- When I'm reminded to water a plant but its soil is still damp
  - I want to not be reminded to water it until it dries out a bit
  - E.g. by skipping that reminder and increasing the time between watering reminders
- When one of my plants needs water but I haven't been reminded yet
  - I want to make it gets enough water
  - E.g. by watering it and reducing the time between waterings
