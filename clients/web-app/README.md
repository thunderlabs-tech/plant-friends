## File Structure

- `components/`
  - React components which are independent of the area of the app they're used in
- `data/`
  - Data structures, actions and utilities related to application state and persistence
- `init/`
  - Application initialization and configuration elements
- `screens/`
  - A "screen" is the root component rendered on a route, responsible for orchestrating and laying out its children. Root components get special privileges: they're passed application state and actions as props, which they can expose to their children
  - This directory is organized according to the route navigation structure
- `services/`
  - Stateful logical units, i.e. things which need to be created and initialized, and which have associated logic and actions you can invoke on the.
- `utilities/`
  - Stateless, reusable functions and type definitions
