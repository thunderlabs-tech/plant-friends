const baseContextValue = () => {
  throw new Error(
    "You may only call fixture functions during a live test run (i.e. inside an `it()`)",
  );
};

type TestContext = {
  [functionName: string]: () => any;
};

let getCurrentContext: () => TestContext = baseContextValue;

function newTestContext() {
  let currentContext: TestContext;
  let previousGetCurrentContextValue: () => TestContext;

  beforeEach(() => {
    previousGetCurrentContextValue = getCurrentContext;

    if (getCurrentContext === baseContextValue) {
      currentContext = {};
    } else {
      currentContext = Object.create(getCurrentContext());
    }

    getCurrentContext = () => currentContext;
  });

  afterEach(() => {
    getCurrentContext = previousGetCurrentContextValue;
  });
}

export default function fixtures<Fixtures extends { [Key: string]: () => any }>(
  fixtureFns: Fixtures,
): Fixtures {
  newTestContext();

  const result: Fixtures = {} as Fixtures;

  Object.keys(fixtureFns).forEach((fixtureName) => {
    const fixtureFn = fixtureFns[fixtureName];

    const wrapperFn = () => {
      const cachedValue = getCurrentContext()[fixtureName];
      if (cachedValue !== undefined) return cachedValue;
      const newValue = fixtureFn();
      if (newValue === undefined)
        throw new Error(
          `Fixture function '${fixtureName}' did not return a value`,
        );

      getCurrentContext()[fixtureName] = newValue;
      return newValue;
    };

    // @ts-ignore: can't express the relationship between fixtureName and the output value
    result[fixtureName] = wrapperFn;
  });

  return result;
}
