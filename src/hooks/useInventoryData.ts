
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as db from '@/lib/db';
import { Product } from '@/lib/mock-data';
import { toast } from '@/components/ui/use-toast';

export function useInventoryData() {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the database on component mount
  useEffect(() => {
    const initialize = async () => {
      if (!isInitialized) {
        await db.initializeDatabase();
        setIsInitialized(true);
      }
    };

    initialize();
  }, [isInitialized]);

  // Query to fetch all products
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: db.getAllProducts,
    enabled: isInitialized
  });

  // Mutation to add a new product
  const addProductMutation = useMutation({
    mutationFn: (product: Product) => db.addProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Product added',
        description: 'The product has been added to the inventory.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding product',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Mutation to update a product
  const updateProductMutation = useMutation({
    mutationFn: (product: Product) => db.updateProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Product updated',
        description: 'The product has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating product',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Mutation to delete a product
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => db.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Product deleted',
        description: 'The product has been removed from the inventory.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting product',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading || !isInitialized,
    isError: productsQuery.isError,
    error: productsQuery.error,
    addProduct: addProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    generateProductId: db.generateProductId
  };
}
