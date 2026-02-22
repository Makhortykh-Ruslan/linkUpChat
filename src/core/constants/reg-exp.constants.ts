export const PASSWORD_REGEXP = new RegExp(
  /^(?=.*\d)(?=.*[~!@#$%^&*.+:;[\]{}\-_,()"'|/])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
);

export const EMAIL_REGEXP = new RegExp(
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
);

export const HAS_UPPERCASE = /[A-Z]/;
export const HAS_LOWERCASE = /[a-z]/;
export const HAS_NUMBER = /[0-9]/;
export const HAS_SYMBOL = /[~!@#$%^&*.+:;[\]{}\-_,()"'|/]/;
