-- Create storage bucket for event images
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true);

-- Create storage policies for event images
CREATE POLICY "Event images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update event images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'event-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete event images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'event-images' AND auth.role() = 'authenticated');