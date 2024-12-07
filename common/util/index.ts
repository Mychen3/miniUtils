import { TgErrorConst, IErrorType } from '../const';

const getErrorMessage = (error: unknown) => {
  const errorMessage =
    (error as { errorMessage: IErrorType }).errorMessage ?? (error as { message: IErrorType }).message;
  const message = TgErrorConst[errorMessage];
  return message ?? errorMessage;
};

const getErrorTypeMessage = (error: unknown) => (error as { errorMessage: IErrorType }).errorMessage;

export { getErrorMessage, getErrorTypeMessage };
