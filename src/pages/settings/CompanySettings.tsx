
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

const CompanySettings = () => {
  const { toast } = useToast();
  const { selectedCompany } = useUserProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    business_email: "",
    business_phone: "",
    website_url: "",
  });
  const [logo, setLogo] = useState<File | null>(null);

  useEffect(() => {
    if (selectedCompany) {
      const fetchCompanyDetails = async () => {
        const { data: companyData, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', selectedCompany.id)
          .single();

        if (error) {
          console.error('Error fetching company details:', error);
          return;
        }

        setFormData({
          name: companyData.name || "",
          business_email: companyData.business_email || "",
          business_phone: companyData.business_phone || "",
          website_url: companyData.website_url || "",
        });
      };

      fetchCompanyDetails();
    }
  }, [selectedCompany]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsEditing(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setIsEditing(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    try {
      let logo_url = selectedCompany.logo_url;

      if (logo) {
        const fileExt = logo.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(fileName, logo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('company-logos')
          .getPublicUrl(fileName);

        logo_url = publicUrl;
      }

      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.name,
          business_email: formData.business_email,
          business_phone: formData.business_phone,
          website_url: formData.website_url,
          logo_url
        })
        .eq('id', selectedCompany.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company settings updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating company settings:', error);
      toast({
        title: "Error",
        description: "Failed to update company settings",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Company Logo</Label>
          <div className="flex items-center gap-4">
            {selectedCompany?.logo_url && (
              <img
                src={selectedCompany.logo_url}
                alt="Company logo"
                className="h-16 w-16 object-contain"
              />
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload New Logo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Company Legal Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_email">Company Email</Label>
          <Input
            id="business_email"
            name="business_email"
            type="email"
            value={formData.business_email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_phone">Company Phone</Label>
          <Input
            id="business_phone"
            name="business_phone"
            type="tel"
            value={formData.business_phone}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            name="website_url"
            type="url"
            value={formData.website_url}
            onChange={handleChange}
          />
        </div>
      </div>
      <Button type="submit" disabled={!isEditing}>
        Update Company Settings
      </Button>
    </form>
  );
};

export default CompanySettings;
