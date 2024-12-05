import { TgErrorConst, IErrorType } from '../const';

const getErrorMessage = (error: unknown) => {
  const errorMessage = (error as { errorMessage: IErrorType }).errorMessage;
  const message = TgErrorConst[errorMessage];
  return message ? message : errorMessage;
};

export { getErrorMessage };
