-- Insert sample companies for ILEA venues and vendors
INSERT INTO companies (name, type, description, website_url, business_email, business_phone, address, verification_status) VALUES
('Austin Convention Center', 'venue', 'Premier convention and event center in downtown Austin', 'https://austinconventioncenter.com', 'events@austincc.com', '(512) 404-4000', '500 E Cesar Chavez St, Austin, TX 78701', 'verified'),
('The Driskill Hotel', 'venue', 'Historic luxury hotel and event venue in Austin', 'https://driskillhotel.com', 'events@driskill.com', '(512) 474-5911', '604 Brazos St, Austin, TX 78701', 'verified'),
('Austin Event Productions', 'vendor', 'Full-service event planning and production company', 'https://austineventpro.com', 'info@austineventpro.com', '(512) 555-0123', '1234 Event Lane, Austin, TX 78702', 'verified'),
('Lone Star Catering', 'vendor', 'Premium catering services for all event types', 'https://lonestarcatering.com', 'catering@lonestar.com', '(512) 555-0456', '5678 Catering Way, Austin, TX 78703', 'verified'),
('Capital City Venues', 'venue', 'Modern event spaces in the heart of Austin', 'https://capitalcityvenues.com', 'book@capitalcity.com', '(512) 555-0789', '9012 Venue Blvd, Austin, TX 78704', 'verified')
ON CONFLICT (id) DO NOTHING;

-- Insert sample venues
INSERT INTO venues (name, company_id, location, city, zipcode, capacity, amenities) VALUES
('Austin Convention Center Main Hall', (SELECT id FROM companies WHERE name = 'Austin Convention Center'), '500 E Cesar Chavez St, Austin, TX 78701', 'Austin', '78701', 2500, '{"venue_type": "convention_center", "space_sqft": 50000, "booking_link": "https://austinconventioncenter.com/book"}'),
('The Driskill Ballroom', (SELECT id FROM companies WHERE name = 'The Driskill Hotel'), '604 Brazos St, Austin, TX 78701', 'Austin', '78701', 400, '{"venue_type": "ballroom", "space_sqft": 8000, "booking_link": "https://driskillhotel.com/events"}'),
('Capital City Event Space', (SELECT id FROM companies WHERE name = 'Capital City Venues'), '9012 Venue Blvd, Austin, TX 78704', 'Austin', '78704', 300, '{"venue_type": "event_space", "space_sqft": 6000, "booking_link": "https://capitalcityvenues.com/reserve"}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample vendor services
INSERT INTO vendor_services (name, company_id, description, city, zipcode, price_range_start, price_range_end) VALUES
('Full Event Planning Package', (SELECT id FROM companies WHERE name = 'Austin Event Productions'), 'Complete event planning from conception to execution', 'Austin', '78702', 5000, 25000),
('Wedding Catering Service', (SELECT id FROM companies WHERE name = 'Lone Star Catering'), 'Gourmet catering for weddings and special events', 'Austin', '78703', 2500, 15000),
('Corporate Event Planning', (SELECT id FROM companies WHERE name = 'Austin Event Productions'), 'Professional corporate event planning and management', 'Austin', '78702', 3000, 20000)
ON CONFLICT (id) DO NOTHING;