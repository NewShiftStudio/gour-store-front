import React, { ChangeEventHandler, FocusEventHandler, ReactElement } from 'react';
import MaskedInput, { MaskedInputProps } from 'react-text-mask';

import { InputBaseProps, TextField as MUITextField, SxProps } from '@mui/material';

export type MaskInputProps = {
  mask: MaskedInputProps['mask'];
  showMask?: MaskedInputProps['showMask'];
  value?: MaskedInputProps['value'];
  id?: string;
  label?: string;
  sx?: SxProps;
  name?: string;
  variant?: 'standard' | 'outlined' | 'filled' | undefined;
  isError?: boolean;
  type?: string;
  helperText?: string;
  endAdornment?: ReactElement;
  inputProps?: InputBaseProps['inputProps'];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
};

export function MaskInput({
  value,
  mask,
  showMask = false,
  id,
  sx,
  label,
  variant,
  type = 'text',
  isError,
  helperText,
  endAdornment,
  name,
  inputProps,
  onChange,
  onFocus,
  onBlur,
}: MaskInputProps) {
  return (
    <MaskedInput
      value={value}
      onChange={onChange}
      mask={mask}
      showMask={showMask}
      render={(ref, maskProps) => (
        <MUITextField
          fullWidth
          sx={sx}
          label={label}
          error={isError}
          id={id}
          inputRef={ref}
          name={name}
          onFocus={onFocus}
          variant={variant}
          type={type}
          helperText={helperText}
          InputProps={{ endAdornment }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          inputProps={inputProps}
          FormHelperTextProps={{
            sx: {
              margin: '3px 0 0 0',
              paddingLeft: '15px',
              width: '100%',
            },
          }}
          {...maskProps}
          onBlur={e => {
            onBlur?.(e as React.FocusEvent<HTMLInputElement>);
            maskProps.onBlur(e);
          }}
        />
      )}
    />
  );
}