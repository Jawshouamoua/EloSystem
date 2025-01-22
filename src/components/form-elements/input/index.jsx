import React from 'react';
import cx from '../../../utils/cx';

import FormItem from '../form-item';

const Input = (props) => {
  return (
    <input
      {...props}
    />
  );
};

const FormInput = (props) => {
  const {
    name,
    id,
    type,
    className,
    labelProps,
    wrapperProps,
    ...restProps
  } = props;

  const inputClasses = cx('form-item__input', className);

  return (
    <FormItem
      name={name}
      id={id}
      type={type}
      labelProps={labelProps}
      {...wrapperProps}
    >
      <Input
        id={id}
        type={type}
        className={inputClasses}
        {...restProps}
      />
    </FormItem>
  );
};

export { FormInput as default, Input };
