
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks, RefreshCw, FilterX, CheckCircle2 } from "lucide-react";
import { CategoryData } from "./types";
import { getCategoryIcon } from "./utils";

interface ChecklistHeaderProps {
  onGenerateChecklist: () => void;
  isLoading: boolean;
  activeFilter: string | null;
  onClearFilter: () => void;
  categoryFilters: CategoryData[];
  onFilterClick: (category: string) => void;
  totalItems: number;
  completedItems: number;
  progressPercentage: number;
}

export const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({
  onGenerateChecklist,
  isLoading,
  activeFilter,
  onClearFilter,
  categoryFilters,
  onFilterClick,
  totalItems,
  completedItems,
  progressPercentage
}) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl font-bold flex items-center">
            <ListChecks className="mr-2 h-6 w-6 text-[#8B5CF6]" />
            Event Checklist
          </CardTitle>
          <CardDescription>
            Track everything you need to do for your event
          </CardDescription>
        </div>
        
        <div className="flex gap-2">
          {activeFilter && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearFilter}
              className="flex items-center"
            >
              <FilterX className="mr-1 h-4 w-4" />
              Clear Filter
            </Button>
          )}
          <Button 
            onClick={onGenerateChecklist} 
            disabled={isLoading}
            className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Checklist
              </>
            )}
          </Button>
        </div>
      </div>
      
      {totalItems > 0 && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center mr-3">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">{progressPercentage}% Complete</h3>
                <p className="text-sm text-gray-500">{completedItems} of {totalItems} tasks completed</p>
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {categoryFilters.map(category => (
              <Badge 
                key={category.value}
                className={`cursor-pointer ${activeFilter === category.value 
                  ? `bg-${category.value === 'venue' ? 'blue' : 
                      category.value === 'vendors' ? 'purple' : 
                      category.value === 'guests' ? 'green' : 
                      category.value === 'logistics' ? 'yellow' : 
                      category.value === 'budget' ? 'emerald' : 
                      category.value === 'marketing' ? 'pink' : 'gray'}-100 
                     text-${category.value === 'venue' ? 'blue' : 
                      category.value === 'vendors' ? 'purple' : 
                      category.value === 'guests' ? 'green' : 
                      category.value === 'logistics' ? 'yellow' : 
                      category.value === 'budget' ? 'emerald' : 
                      category.value === 'marketing' ? 'pink' : 'gray'}-800`
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                onClick={() => onFilterClick(category.value)}
              >
                {getCategoryIcon(category.value)}
                <span className="ml-1">{category.label}</span>
              </Badge>
            ))}
          </div>
        </>
      )}
    </>
  );
};
