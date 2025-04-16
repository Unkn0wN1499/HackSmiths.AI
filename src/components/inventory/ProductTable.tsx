
import { useState } from "react";
import { Link } from "react-router-dom";
import { Product, Location } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown, Plus, Edit, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductFilters, FilterOptions } from "./ProductFilters";
import { ProductEditDialog } from "./ProductEditDialog";

interface ProductTableProps {
  products: Product[];
  locations: Location[];
  className?: string;
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
}

export function ProductTable({ products, locations, className, onAddProduct, onEditProduct }: ProductTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Product>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Extract unique categories and suppliers for filters
  const categories = [...new Set(products.map(p => p.category))];
  const suppliers = [...new Set(products.map(p => p.supplier))];

  // Filter products by search term and filters
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    // Price range filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }
    
    // Stock status filter
    if (filters.stockStatus && filters.stockStatus !== 'all') {
      if (filters.stockStatus === 'low' && product.stockLevel > product.minStockLevel) {
        return false;
      }
      if (filters.stockStatus === 'optimal' && 
          (product.stockLevel <= product.reorderPoint || product.stockLevel > product.maxStockLevel)) {
        return false;
      }
      if (filters.stockStatus === 'overstock' && product.stockLevel <= product.maxStockLevel) {
        return false;
      }
    }
    
    // Supplier filter
    if (filters.supplier && product.supplier !== filters.supplier) {
      return false;
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" 
        ? aValue - bValue 
        : bValue - aValue;
    }
    return 0;
  });

  // Handle sorting
  const handleSort = (column: keyof Product) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Handle edit product
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  // Handle save edited product
  const handleSaveProduct = (editedProduct: Product) => {
    if (onEditProduct) {
      onEditProduct(editedProduct);
    }
  };

  // Calculate active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice !== undefined) count++;
    if (filters.maxPrice !== undefined) count++;
    if (filters.stockStatus && filters.stockStatus !== 'all') count++;
    if (filters.supplier) count++;
    return count;
  };

  // Stock level indicator
  const getStockLevelIndicator = (product: Product) => {
    if (product.stockLevel <= product.minStockLevel) {
      return <Badge variant="destructive">Low</Badge>;
    } else if (product.stockLevel < product.reorderPoint) {
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Reorder</Badge>;
    } else if (product.stockLevel > product.maxStockLevel) {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Overstock</Badge>;
    } else {
      return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">Optimal</Badge>;
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8"
          />
        </div>
        <div className="flex gap-2 self-end">
          <ProductFilters
            categories={categories}
            suppliers={suppliers}
            onApplyFilters={setFilters}
            onResetFilters={() => setFilters({})}
            activeFiltersCount={getActiveFiltersCount()}
          />
          {onAddProduct && (
            <Button size="sm" onClick={onAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                <div className="flex items-center">
                  Product
                  {sortBy === "name" && (
                    <ArrowUpDown className={cn("ml-1 h-4 w-4", sortOrder === "desc" && "rotate-180")} />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("category")} className="cursor-pointer">
                <div className="flex items-center">
                  Category
                  {sortBy === "category" && (
                    <ArrowUpDown className={cn("ml-1 h-4 w-4", sortOrder === "desc" && "rotate-180")} />
                  )}
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("stockLevel")} className="cursor-pointer">
                <div className="flex items-center">
                  Stock
                  {sortBy === "stockLevel" && (
                    <ArrowUpDown className={cn("ml-1 h-4 w-4", sortOrder === "desc" && "rotate-180")} />
                  )}
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead onClick={() => handleSort("price")} className="cursor-pointer text-right">
                <div className="flex items-center justify-end">
                  Price
                  {sortBy === "price" && (
                    <ArrowUpDown className={cn("ml-1 h-4 w-4", sortOrder === "desc" && "rotate-180")} />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                    <div>{product.stockLevel}</div>
                    <div className="text-xs text-muted-foreground">Min: {product.minStockLevel} | Max: {product.maxStockLevel}</div>
                  </TableCell>
                  <TableCell>{getStockLevelIndicator(product)}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right flex justify-end space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEditClick(product)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link to={`/inventory-monitoring/${product.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Product Dialog */}
      <ProductEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        product={selectedProduct}
        locations={locations}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
