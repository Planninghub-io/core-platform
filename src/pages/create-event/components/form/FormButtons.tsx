
interface FormButtonsProps {
  handleCancel: () => void;
}

export const FormButtons = ({ handleCancel }: FormButtonsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <button
        type="button"
        onClick={handleCancel}
        className="rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="rounded-lg bg-[#8B5CF6] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#8B5CF6]/90"
      >
        Create Event
      </button>
    </div>
  );
};
