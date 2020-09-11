export type QueryResult<Name extends string, Result> = {
  [key in Name]: Result;
};

type Get<
  Query extends {
    [key: string]: unknown;
  },
  Field extends keyof Query
> = Exclude<Query[Field], null>;

export type QueryResultItems<
  Result extends { items: (object | null)[] | null } | null
> = Get<Exclude<Result, null>, "items">;

export type QueryResultItem<
  Result extends { items: (object | null)[] | null } | null
> = Exclude<QueryResultItems<Result>[number], null>;
