
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, Trash } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">CPV Codes</label>
        <span className="text-xs text-gray-500">
          {selectedCodes.length}/{maxCodes} selected
        </span>
      </div>

      {/* Selected codes display */}
      {selectedCodeDetails.length > 0 && (
        <div className="space-y-2">
          {selectedCodeDetails.map((codeDetail) => (
            <Card key={codeDetail.CODE} className="p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {codeDetail.CODE}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{codeDetail.EN}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveCode(codeDetail.CODE!)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add new code selector */}
      {selectedCodes.length < maxCodes && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Add CPV Code
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search CPV codes (min 3 characters)..."
                value={searchTerm}
                onValueChange={handleSearch}
              />
              <CommandList>
                {searchTerm.length < 3 ? (
                  <CommandEmpty>Type at least 3 characters to search</CommandEmpty>
                ) : loading ? (
                  <CommandEmpty>Searching...</CommandEmpty>
                ) : searchResults.length === 0 ? (
                  <CommandEmpty>No CPV codes found</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {searchResults.map((result) => (
                      <CommandItem
                        key={result.CODE}
                        onSelect={() => result.CODE && handleAddCode(result.CODE)}
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {result.CODE}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{result.EN}</p>
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

      <p className="text-xs text-gray-500">
        You can select up to {maxCodes} CPV codes that best describe your business activities.
      </p>
    </div>
  );
};

export default CpvSelector;
