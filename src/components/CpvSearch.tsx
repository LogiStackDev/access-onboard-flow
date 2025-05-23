
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CpvResult {
  CODE: string | null;
  EN: string | null;
  FR: string | null;
  DE: string | null;
  NL: string | null;
}

const CpvSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<CpvResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const handleSearch = async () => {
    // Don't search if less than 3 characters
    if (searchTerm.length < 3) {
      return;
    }
    
    setLoading(true);
    setSearchPerformed(true);
    
    try {
      // Fix: Use textSearch instead of ilike for more accurate text matching
      const { data, error } = await supabase
        .from("cpv")
        .select("CODE, EN, FR, DE, NL")
        .or(`EN.ilike.%${searchTerm}%, FR.ilike.%${searchTerm}%, DE.ilike.%${searchTerm}%, NL.ilike.%${searchTerm}%, CODE.ilike.%${searchTerm}%`)
        .limit(20);
      
      if (error) {
        console.error("Error searching CPV codes:", error);
        return;
      }
      
      console.log("Search results:", data);
      setResults(data || []);
    } catch (err) {
      console.error("Failed to search CPV codes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Perform search when enter key is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl">Search CPV Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search CPV codes (min 3 characters)..."
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={searchTerm.length < 3 || loading}
            className="bg-saas-blue hover:bg-blue-800 ml-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" /> Search
              </>
            )}
          </Button>
        </div>

        {searchPerformed && (
          <div className="mt-4">
            {results.length === 0 ? (
              <p className="text-center text-gray-500">No results found for "{searchTerm}"</p>
            ) : (
              <>
                <p className="mb-2 text-sm text-gray-600">Found {results.length} results:</p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>English</TableHead>
                        <TableHead>French</TableHead>
                        <TableHead>German</TableHead>
                        <TableHead>Dutch</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono">{result.CODE}</TableCell>
                          <TableCell>{result.EN}</TableCell>
                          <TableCell>{result.FR}</TableCell>
                          <TableCell>{result.DE}</TableCell>
                          <TableCell>{result.NL}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CpvSearch;
