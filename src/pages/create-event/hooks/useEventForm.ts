
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EventFormData } from "../types";
import { validateRequiredFields } from "../utils/formValidation";

export const useEventForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    price: "",
    imageUrl: "",
    category: "",
  });

  useEffect(() => {
    if (formData.date) {
      const startDate = new Date(formData.date);
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 2);
      setFormData(prev => ({
        ...prev,
        endDate: endDate.toISOString().slice(0, 16)
      }));
    }
  }, [formData.date]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingFields = validateRequiredFields(formData);

    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in the following fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        toast({
          title: "Error",
          description: "Please sign in to create an event",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            date: new Date(formData.date).toISOString(),
            end_date: new Date(formData.endDate).toISOString(),
            location: formData.location,
            price: parseFloat(formData.price) || null,
            image_url: formData.imageUrl,
            category: formData.category,
            user_id: userData.user.id,
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created successfully!",
      });
      
      navigate("/events-hub");
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};
