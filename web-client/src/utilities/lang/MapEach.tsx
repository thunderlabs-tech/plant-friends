export type MapEach<Keys extends symbol | string | number, Value> = {
  [key in Keys]: Value;
};
