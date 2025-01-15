'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  FilterX,
  Check
} from 'lucide-react';

interface Filters {
  searchQuery: string;
  specialty: string;
  status: string;
  dateRange: string;
  tags: string[];
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

const SearchAndFilters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    specialty: '',
    status: '',
    dateRange: '',
    tags: []
  });

  // Mock data for available tags
  const availableTags = [
    'ECG', 'MRI', 'CT', 'Ultrasound', 'Lab Results', 
    'Surgery', 'Emergency', 'Chronic', 'Pediatric', 'Geriatric'
  ];

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      specialty: '',
      status: '',
      dateRange: '',
      tags: []
    });
  };

  const FilterSection = ({ title, children }: FilterSectionProps) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{title}</Label>
      {children}
    </div>
  );

  const FiltersContent = () => (
    <div className="space-y-6">
      <FilterSection title="Specialty">
        <Select
          value={filters.specialty}
          onValueChange={(value) => handleFilterChange('specialty', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Specialties</SelectItem>
            <SelectItem value="cardiology">Cardiology</SelectItem>
            <SelectItem value="radiology">Radiology</SelectItem>
            <SelectItem value="neurology">Neurology</SelectItem>
            <SelectItem value="orthopedics">Orthopedics</SelectItem>
            <SelectItem value="internal">Internal Medicine</SelectItem>
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection title="Status">
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection title="Time Period">
        <Select
          value={filters.dateRange}
          onValueChange={(value) => handleFilterChange('dateRange', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Past Week</SelectItem>
            <SelectItem value="month">Past Month</SelectItem>
            <SelectItem value="year">Past Year</SelectItem>
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection title="Tags">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {filters.tags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <Collapsible>
            <CollapsibleTrigger className="text-sm text-blue-600 hover:text-blue-800">
              Add Tags <ChevronDown className="h-4 w-4 inline" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="grid grid-cols-2 gap-2">
                {availableTags
                  .filter(tag => !filters.tags.includes(tag))
                  .map(tag => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => addTag(tag)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      {tag}
                    </Button>
                  ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Search Bar and Filter Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search cases..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            className="pl-10"
          />
        </div>
        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FiltersContent />
              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={clearFilters}>
                  <FilterX className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Filters</h2>
            <div className="flex items-center gap-2">
              {(filters.specialty || filters.status || filters.dateRange || filters.tags.length > 0) && (
                <Button variant="outline" onClick={clearFilters} size="sm">
                  <FilterX className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent className="mt-4">
            <FiltersContent />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Active Filters Display */}
      {(filters.specialty || filters.status || filters.dateRange || filters.tags.length > 0) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.specialty && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Specialty: {filters.specialty}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('specialty', '')}
              />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {filters.status}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('status', '')}
              />
            </Badge>
          )}
          {filters.dateRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Time: {filters.dateRange}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange('dateRange', '')}
              />
            </Badge>
          )}
          {filters.tags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;