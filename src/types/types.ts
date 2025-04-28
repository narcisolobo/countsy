import { FieldError, UseFormRegister } from "react-hook-form";
import type { CounterFormValues } from "../lib/schemas/counter-schema";

export interface DrawerItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export type FormInputProps = {
  type: string;
  placeholder: string | undefined;
  name: "title" | "goal" | "value";
  label: string;
  register: UseFormRegister<CounterFormValues>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};
