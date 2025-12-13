/**
 * useBatch Hook
 * React hook for batch CSV upload and processing
 */

import { useState, useCallback } from 'react';
import { batchService, BatchJob, BatchItem } from '@/lib/services/batch.service';
import { useToast } from '@/hooks/use-toast';

export function useBatch() {
  const [batches, setBatches] = useState<BatchJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  /**
   * Upload CSV file
   */
  const uploadCSV = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const result = await batchService.uploadCSV(file);
      toast({
        title: 'Upload realizado!',
        description: result.message,
      });
      return result.batch;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no upload',
        description: error.message,
      });
      throw error;
    } finally {
      setUploading(false);
    }
  }, [toast]);

  /**
   * List batches
   */
  const fetchBatches = useCallback(async (params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }) => {
    setLoading(true);
    try {
      const result = await batchService.listBatches(params);
      setBatches(result.batches);
      return result;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar lotes',
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Process batch
   */
  const processBatch = useCallback(async (batchId: string) => {
    try {
      const result = await batchService.processBatch(batchId);
      toast({
        title: 'Processamento iniciado',
        description: result.message,
      });
      // Refresh batches list
      await fetchBatches();
      return result;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao processar lote',
        description: error.message,
      });
      throw error;
    }
  }, [toast, fetchBatches]);

  /**
   * Delete batch
   */
  const deleteBatch = useCallback(async (batchId: string) => {
    try {
      const result = await batchService.deleteBatch(batchId);
      toast({
        title: 'Lote deletado',
        description: result.message,
      });
      // Refresh batches list
      await fetchBatches();
      return result;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar lote',
        description: error.message,
      });
      throw error;
    }
  }, [toast, fetchBatches]);

  return {
    batches,
    loading,
    uploading,
    uploadCSV,
    fetchBatches,
    processBatch,
    deleteBatch,
  };
}

/**
 * Hook for single batch details
 */
export function useBatchDetails(batchId: string | null) {
  const [batch, setBatch] = useState<BatchJob | null>(null);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDetails = useCallback(async (params?: { limit?: number; offset?: number }) => {
    if (!batchId) return;

    setLoading(true);
    try {
      const result = await batchService.getBatchDetails(batchId, params);
      setBatch(result.batch);
      setItems(result.items);
      return result;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar detalhes',
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [batchId, toast]);

  return {
    batch,
    items,
    loading,
    fetchDetails,
  };
}
