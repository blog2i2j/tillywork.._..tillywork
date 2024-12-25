const validationUtils = {
  rules: {
    required: (v: any) =>
      (v !== undefined && v !== null && v !== '') || 'This field is required',
    email: (v: string) => !v || /.+@.+\..+/.test(v) || 'Email must be valid',
    phoneNumber: (v: string) =>
      !v || /^\+?(\d.*){3,}$/.test(v) || 'Phone number must be valid',
    array: {
      required: (v: any[]) => (!!v && v.length > 0) || 'This field is required',
    },
    currency: (v: string) =>
      !v || /^\d+(\.\d{1,2})?$/.test(v) || 'Invalid currency format',
  },
};

export default validationUtils;
