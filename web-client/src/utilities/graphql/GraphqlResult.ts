export type GraphqlErrorResult = {
  errors: [{ message: string }];
  extensions?: {
    [key: string]: any;
  };
};
export type GraphqlSuccessResult<T = object> = {
  data: T;
  extensions?: {
    [key: string]: any;
  };
};
export type GraphqlResult<T = object> =
  | GraphqlErrorResult
  | GraphqlSuccessResult<T>;

export function isGraphqlErrorResult<T extends object>(
  response: GraphqlResult<T>,
): response is GraphqlErrorResult {
  return Object.prototype.hasOwnProperty.call(response, "errors");
}

export function assertGraphqlSuccessResult<Result extends object>(
  response: GraphqlResult<Result>,
): asserts response is GraphqlSuccessResult<Result> {
  if (isGraphqlErrorResult(response)) {
    throw new Error(
      `Request failed: \n${response.errors
        .map((error) => error.message)
        .join("\n")}`,
    );
  }
}
