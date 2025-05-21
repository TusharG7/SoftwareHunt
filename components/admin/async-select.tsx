import React from "react";
import AsyncSelect from "react-select/async";
import { MultiValue, SingleValue, ActionMeta } from "react-select";

interface SelectOption {
  value: string;
  label: string;
  businessNeedsId?: string;
}

interface AsyncSelectProps {
  options?: SelectOption[];
  value?: SelectOption | SelectOption[];
  onChange?: (newValue: MultiValue<SelectOption> | SingleValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => void;
  loadOptions: (inputValue: string) => Promise<SelectOption[]>;
  placeholder?: string;
  isMulti?: boolean;
  className?: string;
  classNamePrefix?: string;
}

export function AsyncSelectComponent({
  options,
  value,
  onChange,
  loadOptions,
  placeholder,
  isMulti = false,
  className,
  classNamePrefix = "select",
}: AsyncSelectProps) {
  return (
    <AsyncSelect
      isMulti={isMulti}
      loadOptions={loadOptions}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className={className}
      classNamePrefix={classNamePrefix}
    />
  );
}