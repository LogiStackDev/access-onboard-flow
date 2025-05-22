
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, LayoutDashboard, User } from "lucide-react";
import ProfileForm from "@/components/ProfileForm";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trialInfo, setTrialInfo] = useState<{
    start_date: string;
    end_date: string;
    is_active: boolean;
    days_left: number;
  } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in and get trial info
    const checkUserAndTrial = async () => {
      setLoading(true);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        navigate("/login");
        return;
      }
      
      const user = sessionData.session.user;
      setUser(user);
      
      // Get trial information
      const { data: trialData, error: trialError } = await supabase
        .from("trials")
        .select("*")
        .eq("user_id", user.id)
        .order("end_date", { ascending: false })
        .limit(1)
        .single();
      
      if (trialError && trialError.code !== "PGRST116") { // PGRST116 is "no rows found" error
        console.error("Error fetching trial info:", trialError);
      }
      
      if (trialData) {
        // Calculate days left in trial
        const endDate = new Date(trialData.end_date);
        const today = new Date();
        const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        setTrialInfo({
          start_date: trialData.start_date,
          end_date: trialData.end_date,
          is_active: trialData.is_active && daysLeft > 0,
          days_left: daysLeft
        });
        
        // If trial has expired, redirect to subscription page
        if (daysLeft <= 0 || !trialData.is_active) {
          navigate("/subscription");
        }
      }
      
      setLoading(false);
    };
    
    checkUserAndTrial();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT") {
          navigate("/login");
        } else if (session && event === "SIGNED_IN") {
          setUser(session.user);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Successfully signed out",
        description: "You have been logged out successfully.",
      });
      // Navigation will be handled by the auth listener
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saas-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-saas-background">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <LayoutDashboard className="h-6 w-6 text-saas-blue mr-2" />
            <h1 className="text-2xl font-bold text-saas-blue">TenderSync Dashboard</h1>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {trialInfo && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-700">Your Trial Period</h2>
                <div className="text-sm mt-1">
                  <span className="text-gray-500">Start:</span> {format(new Date(trialInfo.start_date), "PPP")} | 
                  <span className="text-gray-500 ml-2">End:</span> {format(new Date(trialInfo.end_date), "PPP")}
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                {trialInfo.days_left > 0 ? (
                  <div className={`px-3 py-1 rounded-full inline-flex items-center ${
                    trialInfo.days_left <= 3 ? 'bg-red-100 text-red-800' : 
                    trialInfo.days_left <= 7 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {trialInfo.days_left} days remaining
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-red-100 text-red-800 inline-flex items-center">
                    Trial expired
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <h2 className="text-xl font-semibold mb-4">Welcome to your dashboard</h2>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="font-medium text-gray-700">User Information</div>
                <div className="mt-2 text-sm">
                  <p><span className="font-medium">Email:</span> {user?.email}</p>
                  <p><span className="font-medium">User ID:</span> {user?.id}</p>
                  <p><span className="font-medium">Last Sign In:</span> {new Date(user?.last_sign_in_at || Date.now()).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600">This dashboard will be expanded with more features soon.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="profile">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center mb-6">
                  <User className="h-5 w-5 mr-2 text-saas-blue" />
                  <h2 className="text-xl font-semibold">Your Profile</h2>
                </div>
                <ProfileForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
