## File Structure

- `components/`
  - React components which are independent of the area of the app they're used in
- `data/`
  - Data structures, actions and utilities related to application state and persistence
- `init/`
  - Application initialization and configuration elements
- `routes/`
  - Every route should have 2 corresponding files: Route.tsx and Screen.tsx
  - New routes need to be included in init/AppRoot.tsx
  - Route.tsx defines the url and the corresponding component to be rendered at that url.
  - Screen.tsx is the root component rendered on a route, responsible for orchestrating and laying out its children. Root components get special privileges: they're passed application state and actions as props, which they can expose to their children
- `utilities/`
  - Stateless, reusable functions and type definitions
