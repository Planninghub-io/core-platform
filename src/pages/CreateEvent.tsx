
import { useNavigate } from "react-router-dom";
import { EventForm } from "./create-event/components/EventForm";
import { useEventForm } from "./create-event/hooks/useEventForm";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { formData, handleChange, handleSubmit } = useEventForm();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Create New Event</h1>
        <EventForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleCancel={() => navigate("/")}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
