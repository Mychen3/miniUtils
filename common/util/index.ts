import { TgErrorConst, IErrorType } from '../const';

const getErrorMessage = (error: unknown) => {
  const errorMessage =
    (error as { errorMessage: IErrorType }).errorMessage ?? (error as { message: IErrorType }).message;
  const message = TgErrorConst[errorMessage];
  return message ? message : errorMessage;
};

export { getErrorMessage };
