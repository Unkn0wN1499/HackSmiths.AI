
import { useState } from "react";
import { useInventoryData } from "@/hooks/useInventoryData";
import { Location, Alert } from "@/lib/mock-data";
import { fetchLocations, fetchAlerts } from "@/lib/mock-api";
import { ProductTable } from "@/components/inventory/ProductTable";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function InventoryMonitoring() {
  const { products, isLoading, addProduct, updateProduct, generateProductId } = useInventoryData();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    category: "",
    sku: "",
    price: 0,
    stockLevel: 0,
    reorderPoint: 0,
    minStockLevel: 0,
    maxStockLevel: 0,
    leadTime: 7,
    supplier: "",
    salesVelocity: 1,
    locationId: "store-001"
  });

  // Fetch locations
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: fetchLocations
  });

  // Fetch alerts
  const { data: alerts = [] } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: fetchAlerts
  });

  // Handle adding a new product
  const handleAddProduct = () => {
    const productToAdd = {
      ...newProduct,
      id: generateProductId()
    };
    
    addProduct(productToAdd);
    setIsAddDialogOpen(false);
    
    // Reset form
    setNewProduct({
      id: "",
      name: "",
      category: "",
      sku: "",
      price: 0,
      stockLevel: 0,
      reorderPoint: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
      leadTime: 7,
      supplier: "",
      salesVelocity: 1,
      locationId: "store-001"
    });
  };

  // Filter products by selected location
  const filteredProducts = selectedLocation === "all" 
    ? products 
    : products.filter(product => product.locationId === selectedLocation);

  // Get counts for different stock statuses
  const lowStockCount = filteredProducts.filter(p => p.stockLevel <= p.reorderPoint).length;
  const optimalStockCount = filteredProducts.filter(p => p.stockLevel > p.reorderPoint && p.stockLevel <= p.maxStockLevel).length;
  const overstockCount = filteredProducts.filter(p => p.stockLevel > p.maxStockLevel).length;

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory Monitoring</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Card className="md:w-1/3 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Low Stock</CardTitle>
            <CardDescription>Items below reorder point</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center">
            <div className="flex items-center w-full">
              <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center mr-4">
                <AlertTriangle className="h-8 w-8 text-rose-500" />
              </div>
              <div>
                <span className="text-3xl font-bold">{lowStockCount}</span>
                <p className="text-sm text-muted-foreground">Items needing attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:w-1/3 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Optimal Stock</CardTitle>
            <CardDescription>Items at optimal levels</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center">
            <div className="flex items-center w-full">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="text-3xl font-bold">{optimalStockCount}</span>
                <p className="text-sm text-muted-foreground">Items at ideal levels</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:w-1/3 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overstock</CardTitle>
            <CardDescription>Items above max stock level</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center">
            <div className="flex items-center w-full">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div>
                <span className="text-3xl font-bold">{overstockCount}</span>
                <p className="text-sm text-muted-foreground">Items exceeding limits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>View and filter your current inventory</CardDescription>
            </div>
            
            <Select 
              value={selectedLocation} 
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <span className="text-muted-foreground">Loading inventory data...</span>
            </div>
          ) : (
            <ProductTable 
              products={filteredProducts}
              locations={locations}
              onAddProduct={() => setIsAddDialogOpen(true)}
              onEditProduct={(product) => updateProduct(product)}
            />
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stock Level Monitoring</CardTitle>
            <CardDescription>Real-time tracking across all locations</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="low" className="text-rose-500">Low Stock</TabsTrigger>
                <TabsTrigger value="optimal" className="text-emerald-500">Optimal</TabsTrigger>
                <TabsTrigger value="overstock" className="text-blue-500">Overstock</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="rounded-md border overflow-hidden">
                  <div className="p-4 bg-muted/50">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search items..."
                        className="w-full pl-8"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    {filteredProducts.slice(0, 5).map(product => (
                      <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{product.stockLevel} units</p>
                            <p className="text-xs text-muted-foreground">
                              Min: {product.minStockLevel} | Max: {product.maxStockLevel}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {/* Similar content for other tabs */}
              <TabsContent value="low">
                <div className="space-y-2">
                  {filteredProducts
                    .filter(p => p.stockLevel <= p.reorderPoint)
                    .slice(0, 5)
                    .map(product => (
                      <div key={product.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium text-rose-500">{product.stockLevel} units</p>
                            <p className="text-xs text-muted-foreground">
                              Reorder at: {product.reorderPoint}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Order</Button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <AlertsList 
          alerts={alerts
            .filter(alert => 
              alert.type === 'low_stock' || 
              alert.type === 'overstock'
            )
            .slice(0, 10)
          } 
        />
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="stockLevel">Current Stock</Label>
                <Input
                  id="stockLevel"
                  type="number"
                  value={newProduct.stockLevel}
                  onChange={(e) => setNewProduct({ ...newProduct, stockLevel: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="minStockLevel">Min Stock</Label>
                <Input
                  id="minStockLevel"
                  type="number"
                  value={newProduct.minStockLevel}
                  onChange={(e) => setNewProduct({ ...newProduct, minStockLevel: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="maxStockLevel">Max Stock</Label>
                <Input
                  id="maxStockLevel"
                  type="number"
                  value={newProduct.maxStockLevel}
                  onChange={(e) => setNewProduct({ ...newProduct, maxStockLevel: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="reorderPoint">Reorder Point</Label>
                <Input
                  id="reorderPoint"
                  type="number"
                  value={newProduct.reorderPoint}
                  onChange={(e) => setNewProduct({ ...newProduct, reorderPoint: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="leadTime">Lead Time (days)</Label>
                <Input
                  id="leadTime"
                  type="number"
                  value={newProduct.leadTime}
                  onChange={(e) => setNewProduct({ ...newProduct, leadTime: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={newProduct.supplier}
                  onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={newProduct.locationId}
                  onValueChange={(value) => setNewProduct({ ...newProduct, locationId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
