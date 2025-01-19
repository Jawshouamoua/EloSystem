import React from 'react';

import cx from '../../../utils/cx';

const FormItem = (props) => {
  const {
    name,
    id,
    className,
    type,
    labelProps = {},
    required,
    children,
    ...restProps
  } = props;

  const {
    className: labelClasses,
    placement = 'above',
    afterContent,
    ...restLabel
  } = labelProps || {};

  return (
    <div
      className={cx(
        'form-item',
        `form-item--label-${placement}`,
        `form-item--${type}`,
        `form-item--${name}`,
        required && 'required',
        className,
      )}
      {...restProps}
    >
      <label
        htmlFor={id}
        className={cx('form-item__label', labelClasses)}
        {...restLabel}
      >
        {name}{required && '*'}
      </label>
      {children}
    </div>
  )
};

export default FormItem;
