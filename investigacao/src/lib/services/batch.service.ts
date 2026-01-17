/**
 * Batch Service
 * Client-side service for batch CSV upload and processing
 */

import { fetchAPI } from '@/lib/api';

export interface BatchJob {
  id: string;
  tenant_id: number;
  user_id: number;
  type: 'cpf' | 'cnpj' | 'mixed';
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  total_items: number;
  processed_items: number;
  successful_items: number;
  failed_items: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  result_url: string | null;
  error_message: string | null;
}

export interface BatchItem {
  id: number;
  batch_job_id: string;
  row_number: number;
  document: string;
  document_type: 'cpf' | 'cnpj';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  investigation_id: number | null;
  result_data: string | null;
  error_message: string | null;
  processed_at: string | null;
}

export interface BatchUploadResponse {
  success: boolean;
  batch: BatchJob;
  message: string;
}

export interface BatchListResponse {
  success: boolean;
  batches: BatchJob[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface BatchDetailsResponse {
  success: boolean;
  batch: BatchJob;
  items: BatchItem[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export class BatchService {
  /**
   * Upload CSV file and create batch job
   */
  async uploadCSV(file: File): Promise<BatchUploadResponse> {
    // Use native fetch with FormData for file upload
    // fetchAPI doesn't handle FormData well, so we use custom implementation
    const token = localStorage.getItem('sb-mgpxtdykvxlfqcgnjniz-auth-token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/batch/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JSON.parse(token || '{}').access_token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Erro ao fazer upload do CSV');
    }

    return data;
  }

  /**
   * List all batch jobs
   */
  async listBatches(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<BatchListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.offset) queryParams.set('offset', params.offset.toString());
    if (params?.status) queryParams.set('status', params.status);

    return fetchAPI(`/api/batch?${queryParams.toString()}`);
  }

  /**
   * Get batch job details with items
   */
  async getBatchDetails(
    batchId: string,
    params?: { limit?: number; offset?: number }
  ): Promise<BatchDetailsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.offset) queryParams.set('offset', params.offset.toString());

    return fetchAPI(`/api/batch/${batchId}?${queryParams.toString()}`);
  }

  /**
   * Start processing a batch job
   */
  async processBatch(batchId: string): Promise<{ success: boolean; message: string; batch_id: string }> {
    return fetchAPI(`/api/batch/${batchId}/process`, {
      method: 'POST',
    });
  }

  /**
   * Delete a batch job
   */
  async deleteBatch(batchId: string): Promise<{ success: boolean; message: string }> {
    return fetchAPI(`/api/batch/${batchId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Calculate batch progress percentage
   */
  calculateProgress(batch: BatchJob): number {
    if (batch.total_items === 0) return 0;
    return Math.round((batch.processed_items / batch.total_items) * 100);
  }

  /**
   * Calculate success rate
   */
  calculateSuccessRate(batch: BatchJob): number {
    if (batch.processed_items === 0) return 0;
    return Math.round((batch.successful_items / batch.processed_items) * 100);
  }

  /**
   * Get status color for UI
   */
  getStatusColor(status: BatchJob['status']): string {
    const colors = {
      pending: 'text-yellow-500',
      processing: 'text-green-500',
      completed: 'text-green-500',
      failed: 'text-red-500',
      cancelled: 'text-gray-500',
    };
    return colors[status];
  }

  /**
   * Get status label in Portuguese
   */
  getStatusLabel(status: BatchJob['status']): string {
    const labels = {
      pending: 'Pendente',
      processing: 'Processando',
      completed: 'Concluído',
      failed: 'Falhou',
      cancelled: 'Cancelado',
    };
    return labels[status];
  }

  /**
   * Format batch type label
   */
  getTypeLabel(type: BatchJob['type']): string {
    const labels = {
      cpf: 'CPF',
      cnpj: 'CNPJ',
      mixed: 'Misto (CPF + CNPJ)',
    };
    return labels[type];
  }
}

export const batchService = new BatchService();

