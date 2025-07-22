import type { ReactNode } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";

interface CustomFormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  options?: { label: string; value: string }[];
  customRender?: (field: any) => ReactNode;
}

export const CustomFormField = ({
  form,
  name,
  label,
  placeholder,
  type = "text",
  icon,
  className,
  disabled = false,
  required = false,
  options,
  customRender,
}: CustomFormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            {customRender ? (
              customRender(field)
            ) : (
              <div className="relative">
                {icon && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {icon}
                  </div>
                )}
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={icon ? "pl-10" : ""}
                />
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Example usage for different types of fields
export const FormFields = {
  // Text input with icon
  TextWithIcon: ({
    form,
    name,
    label,
    placeholder,
    icon,
    required,
  }: Omit<CustomFormFieldProps, "type" | "customRender">) => (
    <CustomFormField
      form={form}
      name={name}
      label={label}
      placeholder={placeholder}
      icon={icon}
      required={required}
    />
  ),

  // Date input
  Date: ({
    form,
    name,
    label,
    required,
  }: Omit<CustomFormFieldProps, "type" | "customRender">) => (
    <CustomFormField
      form={form}
      name={name}
      label={label}
      type="date"
      required={required}
    />
  ),

  // DatePicker input
  DatePicker: ({
    form,
    name,
    label,
    required,
  }: Omit<CustomFormFieldProps, "type" | "customRender">) => (
    <CustomFormField
      form={form}
      name={name}
      label={label}
      type="date"
      required={required}
    />
  ),

  // Checkbox input
  Checkbox: ({
    form,
    name,
    label,
    required,
  }: Omit<CustomFormFieldProps, "type" | "customRender">) => (
    <CustomFormField
      form={form}
      name={name}
      label={label}
      required={required}
      customRender={({ value, onChange }) => (
        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
          className="h-4 w-4 rounded border-gray-300"
        />
      )}
    />
  ),

  // Select input
  Select: ({
    form,
    name,
    label,
    options,
    required,
  }: Omit<CustomFormFieldProps, "type" | "customRender"> & {
    options: { label: string; value: string }[];
  }) => (
    <CustomFormField
      form={form}
      name={name}
      label={label}
      required={required}
      customRender={({ value, onChange }) => (
        <select
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-gray-300 p-2"
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    />
  ),
};
