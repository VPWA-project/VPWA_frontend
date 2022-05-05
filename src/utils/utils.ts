import { ServerErrors, ValidationError } from 'src/contracts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clearServerError = (state: any, field: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  delete state.serverValidationErrors[field];
};

export const groupValidationErrors = (errors: ValidationError[]) =>
  errors.reduce((acc: ServerErrors, current) => {
    if (!(current.field in acc)) acc[current.field] = [];

    acc[current.field].push(current.message);

    return acc;
  }, {});
