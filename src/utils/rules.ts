const startWithUpperCase = (str: string) => {
  return str.length > 0 && str.charAt(0) === str.charAt(0).toUpperCase();
};

export const emailRules = [
  // https://www.w3resource.com/javascript/form/email-validation.php
  (val: string) => !!val || 'Email is required',
  (val: string) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) ||
    'Email is invalid',
];

export const firstnameRules = [
  (val: string) => !!val || 'Firstname is required',
  (val: string) =>
    startWithUpperCase(val) || 'Firstname must start with uppercase',
];

export const lastnameRules = [
  (val: string) =>
    (!!val && startWithUpperCase(val)) || 'Lastname must start with uppercase',
];

export const nicknameRules = [(val: string) => !!val || 'Nickname is required'];

export const passwordRules = [
  (val: string) =>
    (!!val && val.length >= 8) || 'Password must be at least 8 characters long',
];

export const channelNameRules = [
  (val: string) => !!val || 'Name is required'
]