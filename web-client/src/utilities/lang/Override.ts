export type Override<
  Type1 extends Record<string, unknown>,
  Type2 extends Record<string, unknown>
> = Omit<Type1, keyof Type2> & Type2;
