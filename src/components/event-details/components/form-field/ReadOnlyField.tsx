
import { ReadOnlyFieldProps } from './types';

export const ReadOnlyField = ({
  value,
  placeholder,
  prefix,
  handleFieldClick
}: ReadOnlyFieldProps) => (
  <div 
    className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-base ring-offset-background cursor-pointer hover:bg-gray-100"
    onClick={handleFieldClick}
  >
    {prefix && <span className="mr-1">{prefix}</span>}
    {value !== null && value !== undefined ? value.toString() : placeholder}
  </div>
);
