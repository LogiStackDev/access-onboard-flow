
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Building, Globe, Phone, FileText } from "lucide-react";
import CpvSelector from "./CpvSelector";

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

  const handleCpvCodesChange = (codes: string[]) => {
    setProfile(prev => ({ ...prev, cpv_codes: codes }));
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saas-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Personal Information Card */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-saas-blue" />
            </div>
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-gray-50 border-gray-200 text-gray-600"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">Full Name *</Label>
              <Input
                id="full_name"
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="border-gray-200 focus:border-saas-blue focus:ring-saas-blue"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="country"
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  placeholder="Enter your country"
                  className="pl-10 border-gray-200 focus:border-saas-blue focus:ring-saas-blue"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-sm font-medium text-gray-700">Telephone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="telephone"
                  name="telephone"
                  value={profile.telephone}
                  onChange={handleChange}
                  placeholder="Enter your telephone number"
                  className="pl-10 border-gray-200 focus:border-saas-blue focus:ring-saas-blue"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information Card */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="h-5 w-5 text-green-600" />
            </div>
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">Company Name</Label>
            <Input
              id="company_name"
              name="company_name"
              value={profile.company_name}
              onChange={handleChange}
              placeholder="Enter your company name"
              className="border-gray-200 focus:border-saas-blue focus:ring-saas-blue"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company_description" className="text-sm font-medium text-gray-700">Company Description</Label>
            <Textarea
              id="company_description"
              name="company_description"
              value={profile.company_description}
              onChange={handleChange}
              placeholder="Describe your company and its activities"
              className="min-h-[120px] border-gray-200 focus:border-saas-blue focus:ring-saas-blue resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* CPV Codes Card */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            Business Activities (CPV Codes)
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Select up to 5 CPV codes that best describe your business activities for tender matching.
          </p>
        </CardHeader>
        <CardContent>
          <CpvSelector
            selectedCodes={profile.cpv_codes}
            onCodesChange={handleCpvCodesChange}
            maxCodes={5}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-8 py-3 bg-gradient-to-r from-saas-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Saving Profile...
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
