
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: 'low' | 'optimal' | 'overstock' | 'all';
  supplier?: string;
}

interface ProductFiltersProps {
  categories: string[];
  suppliers: string[];
  onApplyFilters: (filters: FilterOptions) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
}

export function ProductFilters({ 
  categories, 
  suppliers, 
  onApplyFilters, 
  onResetFilters,
  activeFiltersCount
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    stockStatus: 'all',
    supplier: undefined
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      stockStatus: 'all',
      supplier: undefined
    });
    onResetFilters();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-4" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter Products</h4>
            <p className="text-sm text-muted-foreground">
              Customize filters to find specific products
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={filters.category || ""}
                onValueChange={(value) => setFilters({ ...filters, category: value || undefined })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label htmlFor="minPrice">Min Price ($)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    minPrice: e.target.value ? Number(e.target.value) : undefined 
                  })}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="maxPrice">Max Price ($)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    maxPrice: e.target.value ? Number(e.target.value) : undefined 
                  })}
                />
              </div>
            </div>
            
            <div className="grid gap-1">
              <Label htmlFor="stockStatus">Stock Status</Label>
              <Select 
                value={filters.stockStatus || "all"}
                onValueChange={(value: 'low' | 'optimal' | 'overstock' | 'all') => 
                  setFilters({ ...filters, stockStatus: value })
                }
              >
                <SelectTrigger id="stockStatus">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="optimal">Optimal Stock</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1">
              <Label htmlFor="supplier">Supplier</Label>
              <Select 
                value={filters.supplier || ""}
                onValueChange={(value) => setFilters({ ...filters, supplier: value || undefined })}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="All Suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Suppliers</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button size="sm" onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
