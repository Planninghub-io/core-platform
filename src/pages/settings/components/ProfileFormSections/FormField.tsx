
import { FormField as HookFormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "../../hooks/useProfileForm";

interface FormFieldProps {
  form: UseFormReturn<ProfileFormValues>;
  name: keyof ProfileFormValues;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  type?: string;
  required?: boolean;
}

export const FormField = ({ 
  form, 
  name, 
  label, 
  placeholder, 
  disabled = false, 
  icon: Icon, 
  type = "text",
  required = false
}: FormFieldProps) => {
  return (
    <HookFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[#333333] font-medium">
            {label}{required && " *"}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              )}
              <Input
                {...field}
                type={type}
                disabled={disabled}
                placeholder={placeholder}
                className={`border-purple-100 ${Icon ? 'pl-9' : ''} ${disabled ? 'bg-purple-50/50 text-gray-500' : 'focus-visible:ring-[#8b73f4]/20'}`}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
