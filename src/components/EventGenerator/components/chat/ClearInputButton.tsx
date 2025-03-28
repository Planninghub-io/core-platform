
import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ClearInputButtonProps {
  prompt: string;
  isGenerating: boolean;
  onClear: () => void;
}

export const ClearInputButton: React.FC<ClearInputButtonProps> = ({
  prompt,
  isGenerating,
  onClear
}) => {
  if (!prompt || isGenerating) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClear}
      className="text-gray-400 hover:text-gray-600"
      aria-label="Clear input"
    >
      <RotateCcw size={16} />
    </button>
  );
};
