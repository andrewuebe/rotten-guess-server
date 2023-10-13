type AnyObject = Record<string, unknown>;

interface ErrorResponse<TErrorData extends AnyObject = AnyObject> {
  message: string;
  code?: string;
  errorData?: TErrorData;
}

interface ApiResponse<TData = AnyObject | undefined, TErrorData extends AnyObject = AnyObject> {
  data?: TData;
  state: string;
  error?: ErrorResponse<TErrorData>;
}

function response<TData extends AnyObject = AnyObject, TErrorData extends AnyObject = AnyObject>(
  data?: TData,
  error?: ErrorResponse<TErrorData>,
  state: string = 'success',
): ApiResponse<TData, TErrorData> {
  const payload: ApiResponse<TData, TErrorData> = { state };

  if (data) {
    payload.data = data;
  }

  if (error) {
    payload.state = 'error';
    payload.error = error;
  }

  return payload;
}

function successResponse<TData extends AnyObject = AnyObject>(data?: TData): ApiResponse<TData> {
  return response(data);
}

function errorResponse<TErrorData extends AnyObject = AnyObject>(
  error: ErrorResponse<TErrorData>
): ApiResponse<AnyObject, TErrorData> {
  return response<AnyObject, TErrorData>(undefined, error, 'error');
}

export { ApiResponse, errorResponse, successResponse };
