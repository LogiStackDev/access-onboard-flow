import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Trash, Globe, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

interface CpvResult {
  CODE: string | null;
  EN: string | null;
  FR: string | null;
  DE: string | null;
  NL: string | null;
}

interface CpvSelectorProps {
  selectedCodes: string[];
  onCodesChange: (codes: string[]) => void;
  maxCodes?: number;
}

const CpvSelector = ({ selectedCodes, onCodesChange, maxCodes = 5 }: CpvSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<CpvResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCodeDetails, setSelectedCodeDetails] = useState<CpvResult[]>([]);

  // Load details for selected codes
  useEffect(() => {
    const loadSelectedCodeDetails = async () => {
      if (selectedCodes.length === 0) {
        setSelectedCodeDetails([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("cpv")
          .select("CODE, EN, FR, DE, NL")
          .in("CODE", selectedCodes);

        if (error) {
          console.error("Error loading selected CPV codes:", error);
          return;
        }

        setSelectedCodeDetails(data || []);
      } catch (err) {
        console.error("Failed to load selected CPV codes:", err);
      }
    };

    loadSelectedCodeDetails();
  }, [selectedCodes]);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (term.length < 3) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("cpv")
        .select("CODE, EN, FR, DE, NL")
        .or(`EN.ilike.%${term}%, FR.ilike.%${term}%, DE.ilike.%${term}%, NL.ilike.%${term}%, CODE.ilike.%${term}%`)
        .limit(10);
      
      if (error) {
        console.error("Error searching CPV codes:", error);
        return;
      }
      
      // Filter out already selected codes
      const filteredResults = (data || []).filter(
        result => result.CODE && !selectedCodes.includes(result.CODE)
      );
      
      setSearchResults(filteredResults);
    } catch (err) {
      console.error("Failed to search CPV codes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCode = (code: string) => {
    if (selectedCodes.length >= maxCodes) {
      return;
    }
    
    const newCodes = [...selectedCodes, code];
    onCodesChange(newCodes);
    setSearchTerm("");
    setSearchResults([]);
    setOpen(false);
  };

  const handleRemoveCode = (codeToRemove: string) => {
    const newCodes = selectedCodes.filter(code => code !== codeToRemove);
    onCodesChange(newCodes);
  };

  const LanguageDescription = ({ label, text, bgColor }: { label: string; text: string | null; bgColor: string }) => {
    if (!text) return null;
    
    return (
      <div className="space-y-1">
        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${bgColor}`}>
          <Globe className="h-3 w-3 mr-1" />
          {label}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900">Selected CPV Codes</h3>
          <p className="text-sm text-gray-500">
            {selectedCodes.length}/{maxCodes} codes selected
          </p>
        </div>
        
        {selectedCodes.length < maxCodes && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add CPV Code
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0 shadow-xl border-0" align="start">
              <Command shouldFilter={false} className="rounded-lg">
                <CommandInput
                  placeholder="Search CPV codes (min 3 characters)..."
                  value={searchTerm}
                  onValueChange={handleSearch}
                  className="border-0 focus:ring-0"
                />
                <CommandList className="max-h-80">
                  {searchTerm.length < 3 ? (
                    <CommandEmpty>Type at least 3 characters to search</CommandEmpty>
                  ) : loading ? (
                    <CommandEmpty>
                      <div className="flex items-center justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="ml-2">Searching...</span>
                      </div>
                    </CommandEmpty>
                  ) : searchResults.length === 0 ? (
                    <CommandEmpty>No CPV codes found</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {searchResults.map((result) => (
                        <CommandItem
                          key={result.CODE}
                          onSelect={() => result.CODE && handleAddCode(result.CODE)}
                          className="cursor-pointer p-3 hover:bg-blue-50"
                        >
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs bg-blue-100 text-blue-800 border-blue-300">
                                {result.CODE}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 font-medium">{result.EN}</p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Selected codes display */}
      {selectedCodeDetails.length > 0 ? (
        <div className="space-y-4">
          {selectedCodeDetails.map((codeDetail, index) => (
            <Card key={codeDetail.CODE} className="shadow-md border-0 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-sm bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 px-3 py-1">
                      {codeDetail.CODE}
                    </Badge>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <span className="text-xs text-gray-500 font-medium">Code #{index + 1}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveCode(codeDetail.CODE!)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  <LanguageDescription 
                    label="English" 
                    text={codeDetail.EN} 
                    bgColor="bg-blue-100 text-blue-800"
                  />
                  {codeDetail.FR && (
                    <>
                      <Separator className="bg-gray-200" />
                      <LanguageDescription 
                        label="Français" 
                        text={codeDetail.FR} 
                        bgColor="bg-green-100 text-green-800"
                      />
                    </>
                  )}
                  {codeDetail.DE && (
                    <>
                      <Separator className="bg-gray-200" />
                      <LanguageDescription 
                        label="Deutsch" 
                        text={codeDetail.DE} 
                        bgColor="bg-yellow-100 text-yellow-800"
                      />
                    </>
                  )}
                  {codeDetail.NL && (
                    <>
                      <Separator className="bg-gray-200" />
                      <LanguageDescription 
                        label="Nederlands" 
                        text={codeDetail.NL} 
                        bgColor="bg-purple-100 text-purple-800"
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="p-3 bg-gray-200 rounded-full">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900">No CPV codes selected</h3>
                <p className="text-xs text-gray-500">
                  Add CPV codes that best describe your business activities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
          💡 <strong>Tip:</strong> Select CPV codes that accurately represent your business capabilities to receive relevant tender notifications.
        </p>
      </div>
    </div>
  );
};

export default CpvSelector;
