export type GraphqlErrorResult = {
  errors: [{ message: string }];
  extensions?: Record<string, unknown>;
};
export type GraphqlSuccessResult<T = Record<string, unknown>> = {
  data: T;
  extensions?: Record<string, unknown>;
};
export type GraphqlResult<T = Record<string, unknown>> =
  | GraphqlErrorResult
  | GraphqlSuccessResult<T>;

export function isGraphqlErrorResult<T extends Record<string, unknown>>(
  response: GraphqlResult<T>,
): response is GraphqlErrorResult {
  return Object.prototype.hasOwnProperty.call(response, "errors");
}

export function assertGraphqlSuccessResult<
  Result extends Record<string, unknown>
>(
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
