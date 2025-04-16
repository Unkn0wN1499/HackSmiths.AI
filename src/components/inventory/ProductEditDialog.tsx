
import { useState, useEffect } from "react";
import { Product, Location } from "@/lib/mock-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  locations: Location[];
  onSave: (product: Product) => void;
}

export function ProductEditDialog({ open, onOpenChange, product, locations, onSave }: ProductEditDialogProps) {
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  
  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setEditedProduct({ ...product });
    }
  }, [product]);

  const handleSave = () => {
    if (editedProduct) {
      onSave(editedProduct);
      onOpenChange(false);
    }
  };

  if (!editedProduct) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product: {product?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={editedProduct.name}
                onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={editedProduct.category}
                onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={editedProduct.sku}
                onChange={(e) => setEditedProduct({ ...editedProduct, sku: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                value={editedProduct.price}
                onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="stockLevel">Current Stock</Label>
              <Input
                id="stockLevel"
                type="number"
                value={editedProduct.stockLevel}
                onChange={(e) => setEditedProduct({ ...editedProduct, stockLevel: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="minStockLevel">Min Stock</Label>
              <Input
                id="minStockLevel"
                type="number"
                value={editedProduct.minStockLevel}
                onChange={(e) => setEditedProduct({ ...editedProduct, minStockLevel: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="maxStockLevel">Max Stock</Label>
              <Input
                id="maxStockLevel"
                type="number"
                value={editedProduct.maxStockLevel}
                onChange={(e) => setEditedProduct({ ...editedProduct, maxStockLevel: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="reorderPoint">Reorder Point</Label>
              <Input
                id="reorderPoint"
                type="number"
                value={editedProduct.reorderPoint}
                onChange={(e) => setEditedProduct({ ...editedProduct, reorderPoint: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="leadTime">Lead Time (days)</Label>
              <Input
                id="leadTime"
                type="number"
                value={editedProduct.leadTime}
                onChange={(e) => setEditedProduct({ ...editedProduct, leadTime: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                value={editedProduct.supplier}
                onChange={(e) => setEditedProduct({ ...editedProduct, supplier: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Select
                value={editedProduct.locationId}
                onValueChange={(value) => setEditedProduct({ ...editedProduct, locationId: value })}
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

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="salesVelocity">Sales Velocity (units/day)</Label>
            <Input
              id="salesVelocity"
              type="number"
              step="0.1"
              value={editedProduct.salesVelocity}
              onChange={(e) => setEditedProduct({ ...editedProduct, salesVelocity: parseFloat(e.target.value) })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
