import React, { useState } from 'react'

export type InitialForm = {
  [key: string]: string | number | boolean;
}
type RuleType = {
  required?: {
    value: boolean,
    message: string,
  };
  isAddress?: {
    message: string,
  };
  min?: {
    value: number,
    message: string,
  };
  max?: {
    value: number,
    message: string,
  };
  minLength?: {
    value: number,
    message: string,
  };
  maxLength?: {
    value: number,
    message: string,
  };
  pattern?: {
    value: RegExp,
    message: string,
  };
  validate?: {
    value: Function,
    message: string,
  };
};
type RulesType = {
  [key: string]: RuleType
}
type ErrorType = {
  [key: string]: {
    message: string
  } | null
}
type Validator = {
  [key: string]: Function
}
export default function useForm<T>({ initialForm, rules }: { initialForm: T, rules: RulesType }) {
  const [errors, setErrors]: [ErrorType, Function] = useState({});
  const [form, setForm] = useState({ ...initialForm });

  const validator: Validator = {
    required: (input: string) => {
      if (input) {
        return true;
      }
      return false;
    },
    isNumber: (input: number) => {
      return /^-?\d+(\.\d+)?$/.test(input.toString());
    },
    isAddress: (input: string) => {
      return /^0x[a-fA-F0-9]{40}$/.test(input);
    },
    isBoolean: (input: boolean) => {
      return typeof input === 'boolean';
    },
    min: (input: number, min: number) => {
      return input >= min;
    },
    max: (input: number, max: number) => {
      return input <= max;
    },
    minLength: (input: string, min: number) => {
      return input.length >= min;
    },
    maxLength: (input: string, max: number) => {
      return input.length <= max;
    },
    pattern: (input: string, pattern: RegExp) => {
      return pattern.test(input);
    },
    validate: (input: string | number | boolean, validate: Function) => {
      return validate(input);
    },
  };
  const handleValidate = (field: string, value: string | number | boolean, requires: any) => {
    const keys = Object.keys(requires);
    let i = 0;
    for (i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!validator[key](value, requires[key].value)) {
        return { [field]: { message: requires[key].message } };
      }
    }
    return { [field]: null };
  };
  const register = (field: string, value: string | number | boolean) => {
    setForm({
      ...form,
      [field]: value,
    });
    setErrors({
      ...errors,
      ...handleValidate(field, value, rules[field]),
    });


  };
  const handleSubmit = (onSubmit: Function) => {
    const formData = form as InitialForm;
    const keys = Object.keys(formData);
    let i = 0;
    let listError: ErrorType = {};
    for (i = 0; i < keys.length; i++) {
      const key = keys[i];
      listError = { ...listError, ...handleValidate(key, formData[key], rules[key]) };
    }
    setErrors({ ...listError });
    const isError = Object.keys(listError).filter(e => listError[e] != null);
    if (isError.length === 0) {
      onSubmit(formData);
    }
  };

  return ({ register, handleSubmit, setForm, form, rules, errors })
}