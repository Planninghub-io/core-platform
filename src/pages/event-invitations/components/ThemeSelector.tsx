
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const predefinedThemes = [
  { value: "elegant and professional", label: "Elegant & Professional" },
  { value: "colorful and vibrant", label: "Colorful & Vibrant" },
  { value: "minimalist modern", label: "Minimalist Modern" },
  { value: "dark and sophisticated", label: "Dark & Sophisticated" },
  { value: "pastel colors and soft design", label: "Pastel & Soft" },
  { value: "natural and earthy tones", label: "Natural & Earthy" },
  { value: "retro vintage style", label: "Retro Vintage" },
  { value: "futuristic and bold", label: "Futuristic & Bold" },
];

interface ThemeSelectorProps {
  themeDescription: string;
  onThemeChange: (value: string) => void;
  onClose: () => void;
  useCustomTheme: boolean;
  setUseCustomTheme: (checked: boolean) => void;
}

export const ThemeSelector = ({
  themeDescription,
  onThemeChange,
  onClose,
  useCustomTheme,
  setUseCustomTheme,
}: ThemeSelectorProps) => {
  const handleThemeSelect = (theme: string) => {
    onThemeChange(theme);
    setUseCustomTheme(false);
  };

  const handleCustomThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onThemeChange(e.target.value);
  };

  const toggleCustomTheme = (checked: boolean) => {
    setUseCustomTheme(checked);
    if (!checked) {
      // Reset to default theme when unchecking custom theme
      onThemeChange(predefinedThemes[0].value);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <Select 
        value={!useCustomTheme ? themeDescription : ""} 
        onValueChange={handleThemeSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          {predefinedThemes.map(theme => (
            <SelectItem key={theme.value} value={theme.value}>
              {theme.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="custom-theme" 
          checked={useCustomTheme}
          onCheckedChange={toggleCustomTheme}
        />
        <label
          htmlFor="custom-theme"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Use custom theme
        </label>
      </div>
      
      {useCustomTheme && (
        <div className="mt-2">
          <Input
            placeholder="e.g., Modern minimalist with soft pastel colors"
            value={themeDescription}
            onChange={handleCustomThemeChange}
          />
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-4">
        <Button onClick={onClose}>
          Apply Theme
        </Button>
      </div>
    </div>
  );
};
