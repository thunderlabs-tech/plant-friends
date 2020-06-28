export type Override<
  Type1 extends { [key: string]: any },
  Type2 extends { [key: string]: any }
> = Omit<Type1, keyof Type2> & Type2;
