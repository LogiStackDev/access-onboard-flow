
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

type ProfileData = {
  email: string;
  full_name: string;
  company_name: string;
  company_description: string;
  country: string;
  telephone: string;
  cpv_codes: string[];
};

const ProfileForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData>({
    email: "",
    full_name: "",
    company_name: "",
    company_description: "",
    country: "",
    telephone: "",
    cpv_codes: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      
      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/login");
        return;
      }
      
      const user = sessionData.session.user;
      
      // Get user's profile data from the profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error && error.code !== "PGRST116") { // PGRST116 is "no rows found" error
        console.error("Error fetching profile:", error);
        toast({
          title: "Error loading profile",
          description: "Failed to load your profile data",
          variant: "destructive",
        });
      }
      
      // Set email from auth and other data from profile if available
      setProfile({
        email: user.email || "",
        full_name: data?.full_name || "",
        company_name: data?.company_name || "",
        company_description: data?.company_description || "",
        country: data?.country || "",
        telephone: data?.telephone || "",
        cpv_codes: data?.cpv_codes || [],
      });
      
      setLoading(false);
    };
    
    loadProfile();
  }, [navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate("/login");
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // Upsert profile data to the profiles table
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          full_name: profile.full_name,
          company_name: profile.company_name,
          company_description: profile.company_description,
          country: profile.country,
          telephone: profile.telephone,
          cpv_codes: profile.cpv_codes,
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saas-blue"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            disabled
            className="bg-gray-50"
          />
          <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            name="company_name"
            value={profile.company_name}
            onChange={handleChange}
            placeholder="Enter your company name"
          />
        </div>
        
        <div>
          <Label htmlFor="company_description">Company Description</Label>
          <Textarea
            id="company_description"
            name="company_description"
            value={profile.company_description}
            onChange={handleChange}
            placeholder="Describe your company"
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={profile.country}
            onChange={handleChange}
            placeholder="Enter your country"
          />
        </div>
        
        <div>
          <Label htmlFor="telephone">Telephone</Label>
          <Input
            id="telephone"
            name="telephone"
            value={profile.telephone}
            onChange={handleChange}
            placeholder="Enter your telephone number"
          />
        </div>
        
        <div>
          <Label htmlFor="cpv_codes">CPV Codes</Label>
          <Input
            id="cpv_codes"
            name="cpv_codes"
            value={profile.cpv_codes.join(", ")}
            onChange={(e) => {
              const codes = e.target.value
                .split(",")
                .map((code) => code.trim())
                .filter((code) => code.length > 0);
              setProfile((prev) => ({ ...prev, cpv_codes: codes }));
            }}
            placeholder="Enter CPV codes separated by commas"
          />
          <p className="text-sm text-gray-500 mt-1">Separate codes with commas</p>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isSaving}
        className="w-full bg-saas-blue hover:bg-blue-800"
      >
        {isSaving ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
};

export default ProfileForm;
