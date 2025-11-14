
-- Insert Austin ILEA vendors into vendor_services table
INSERT INTO vendor_services (name, description, city, zipcode, price_range_start, price_range_end, company_id) VALUES
('EVA Events', 'Full-service event planning and coordination specializing in corporate and social events', 'Austin', '78701', 2500, 15000, (SELECT id FROM companies WHERE name = 'EVA Events' LIMIT 1)),
('Vibe & Vision Production', 'Creative event production company offering audiovisual services, lighting, and staging', 'Austin', '78702', 1500, 25000, (SELECT id FROM companies WHERE name = 'Vibe & Vision Production' LIMIT 1)),
('Alfred''s Catering', 'Premium catering services for weddings, corporate events, and special occasions', 'Austin', '78703', 25, 85, (SELECT id FROM companies WHERE name = 'Alfred''s Catering' LIMIT 1)),
('Gameplan', 'Interactive entertainment and team building solutions for corporate events', 'Austin', '78704', 500, 5000, (SELECT id FROM companies WHERE name = 'Gameplan' LIMIT 1)),
('BigTime Creative', 'Creative design and branding services for events and corporate experiences', 'Austin', '78705', 1000, 8000, (SELECT id FROM companies WHERE name = 'BigTime Creative' LIMIT 1)),
('KMFA Classical 89.5 Event Center', 'Elegant venue space perfect for receptions, meetings, and intimate gatherings', 'Austin', '78756', 800, 3500, (SELECT id FROM companies WHERE name = 'KMFA Classical 89.5' LIMIT 1)),
('Roam Rental Company', 'Premium party and event rental equipment including furniture, linens, and decor', 'Austin', '78757', 200, 2500, (SELECT id FROM companies WHERE name = 'Roam Rental Company' LIMIT 1)),
('Balcones Country Club', 'Prestigious country club venue offering golf course views and elegant event spaces', 'Austin', '78746', 5000, 20000, (SELECT id FROM companies WHERE name = 'Balcones Country Club' LIMIT 1)),
('Regal Rooms', 'Luxury lounge and private dining spaces for exclusive events and celebrations', 'Austin', '78701', 2000, 12000, (SELECT id FROM companies WHERE name = 'Regal Rooms' LIMIT 1)),
('Premier Entertainment', 'Professional DJ services, live music, and entertainment for all types of events', 'Austin', '78702', 800, 4000, (SELECT id FROM companies WHERE name = 'Premier Entertainment' LIMIT 1)),
('Marcela Outside', 'Outdoor event specialist providing unique venue spaces and natural settings', 'Austin', '78703', 1200, 6000, (SELECT id FROM companies WHERE name = 'Marcela Outside' LIMIT 1)),
('Mandola''s Italian Kitchen', 'Authentic Italian catering and private dining experiences for special events', 'Austin', '78704', 18, 65, (SELECT id FROM companies WHERE name = 'Mandola''s Italian Kitchen' LIMIT 1)),
('Peachy Keen Photo Camper', 'Mobile photo booth services with vintage camper and custom backdrops', 'Austin', '78705', 400, 1200, (SELECT id FROM companies WHERE name = 'Peachy Keen Photo Camper' LIMIT 1)),
('Full Spectrum Ice Sculptures', 'Custom ice sculptures and specialty ice services for elegant events', 'Austin', '78756', 300, 2000, (SELECT id FROM companies WHERE name = 'Full Spectrum Ice Sculptures' LIMIT 1)),
('Texas Tiki Time', 'Tropical-themed event services including tiki bars, decor, and entertainment', 'Austin', '78757', 600, 3500, (SELECT id FROM companies WHERE name = 'Texas Tiki Time' LIMIT 1)),
('Tiny Pies- Burnet Road', 'Gourmet mini pies catering for events, meetings, and special occasions', 'Austin', '78756', 8, 25, (SELECT id FROM companies WHERE name = 'Tiny Pies' LIMIT 1)),
('Circuit of the Americas', 'World-class motorsports venue offering unique event spaces and experiences', 'Austin', '78617', 10000, 50000, (SELECT id FROM companies WHERE name = 'Circuit of the Americas' LIMIT 1)),
('Xtreme Xhibits', 'Custom trade show displays, event exhibits, and interactive experiences', 'Austin', '78758', 2000, 15000, (SELECT id FROM companies WHERE name = 'Xtreme Xhibits' LIMIT 1));

-- Create corresponding companies for these vendors if they don't exist
INSERT INTO companies (name, type, business_email, business_phone, website_url) VALUES
('EVA Events', 'vendor', 'info@evaevents.com', '(512) 555-0101', 'www.evaevents.com'),
('Vibe & Vision Production', 'vendor', 'hello@vibeandvision.com', '(512) 555-0102', 'www.vibeandvision.com'),
('Alfred''s Catering', 'vendor', 'events@alfredscatering.com', '(512) 555-0103', 'www.alfredscatering.com'),
('Gameplan', 'vendor', 'contact@gameplanaustin.com', '(512) 555-0104', 'www.gameplanaustin.com'),
('BigTime Creative', 'vendor', 'hello@bigtimecreative.com', '(512) 555-0105', 'www.bigtimecreative.com'),
('KMFA Classical 89.5', 'venue', 'events@kmfa.org', '(512) 555-0106', 'www.kmfa.org'),
('Roam Rental Company', 'vendor', 'info@roamrental.com', '(512) 555-0107', 'www.roamrental.com'),
('Balcones Country Club', 'venue', 'events@balconescc.com', '(512) 555-0108', 'www.balconescc.com'),
('Regal Rooms', 'venue', 'bookings@regalrooms.com', '(512) 555-0109', 'www.regalrooms.com'),
('Premier Entertainment', 'vendor', 'book@premierentertainment.com', '(512) 555-0110', 'www.premierentertainment.com'),
('Marcela Outside', 'venue', 'info@marcelaoutside.com', '(512) 555-0111', 'www.marcelaoutside.com'),
('Mandola''s Italian Kitchen', 'vendor', 'catering@mandolas.com', '(512) 555-0112', 'www.mandolas.com'),
('Peachy Keen Photo Camper', 'vendor', 'book@peachykeen.com', '(512) 555-0113', 'www.peachykeen.com'),
('Full Spectrum Ice Sculptures', 'vendor', 'orders@fullspectrumice.com', '(512) 555-0114', 'www.fullspectrumice.com'),
('Texas Tiki Time', 'vendor', 'aloha@texastikitime.com', '(512) 555-0115', 'www.texastikitime.com'),
('Tiny Pies', 'vendor', 'catering@tinypies.com', '(512) 555-0116', 'www.tinypies.com'),
('Circuit of the Americas', 'venue', 'events@circuitoftheamericas.com', '(512) 555-0117', 'www.circuitoftheamericas.com'),
('Xtreme Xhibits', 'vendor', 'info@xtremexhibits.com', '(512) 555-0118', 'www.xtremexhibits.com')
ON CONFLICT (name) DO NOTHING;
