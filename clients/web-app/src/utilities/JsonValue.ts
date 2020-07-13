export type JsonScalar = string | number | boolean | undefined | null | Date;

type JsonValue = JsonScalar | { [key: string]: JsonValue } | JsonValue[];

export default JsonValue;
