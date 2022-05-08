import { ServerErrors, ValidationError } from 'src/contracts';
import { Notify } from 'quasar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearServerError = (state: any, field: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (field in state) delete state[field];
};

export const groupValidationErrors = (errors: ValidationError[]) =>
  errors.reduce((acc: ServerErrors, current) => {
    if (!(current.field in acc)) acc[current.field] = [];

    acc[current.field].push(current.message);

    return acc;
  }, {});

export const notifyUser = (message: string, type: string, color: string) => {
  Notify.create({
    message,
    color: color,
    textColor: 'black',
    type: type,
    position: 'bottom',
  });
};

export const notifyUserPositive = (message: string) =>
  notifyUser(message, 'positive', 'grey-2');

export const notifyUserNegative = (message: string) =>
  notifyUser(message, 'negative', 'red-2');
