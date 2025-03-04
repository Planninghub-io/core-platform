
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InvitationContentEditorProps {
  editableTitle: string;
  editableDescription: string;
  setEditableTitle: (value: string) => void;
  setEditableDescription: (value: string) => void;
  className?: string;
}

export const InvitationContentEditor = ({
  editableTitle,
  editableDescription,
  setEditableTitle,
  setEditableDescription,
  className = "space-y-4 mb-4 border p-4 rounded-md"
}: InvitationContentEditorProps) => {
  return (
    <div className={className}>
      <div>
        <h3 className="text-sm font-medium mb-2">Event Title</h3>
        <Input
          value={editableTitle}
          onChange={(e) => setEditableTitle(e.target.value)}
          placeholder="Enter event title"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Event Description</h3>
        <Textarea
          value={editableDescription}
          onChange={(e) => setEditableDescription(e.target.value)}
          placeholder="Enter event description"
          rows={3}
        />
      </div>
    </div>
  );
};
