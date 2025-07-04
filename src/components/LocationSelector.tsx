
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationSelect: (location: string) => void;
}

const LocationSelector = ({ selectedLocation, onLocationSelect }: LocationSelectorProps) => {
  const locations = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow'
  ];

  return (
    <div className="flex items-center space-x-2">
      <MapPin className="h-4 w-4 text-red-600" />
      <Select value={selectedLocation} onValueChange={onLocationSelect}>
        <SelectTrigger className="w-[140px] border-none shadow-none p-0 h-auto font-medium">
          <SelectValue placeholder="Select city" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelector;
