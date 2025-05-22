
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkUser();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsLoggedIn(!!session);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="py-4 border-b border-gray-100">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold text-saas-blue">
          TenderSync
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/benefits" className="text-gray-600 hover:text-saas-blue">
            Benefits
          </Link>
          <Link to="/customers" className="text-gray-600 hover:text-saas-blue">
            Customers
          </Link>
          <Link to="/faq" className="text-gray-600 hover:text-saas-blue">
            FAQ
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <Button className="bg-saas-blue hover:bg-blue-800 flex items-center gap-2" asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button className="bg-saas-blue hover:bg-blue-800" asChild>
                <Link to="/register">Start Free Trial</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
