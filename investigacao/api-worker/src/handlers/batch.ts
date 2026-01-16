/**
 * Batch Investigations Handler
 * Handles CSV upload and batch processing of multiple CPF/CNPJ investigations
 */

import { Env, DecodedToken } from '../types';
import { parse } from 'csv-parse/browser/esm/sync';

interface BatchJob {
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

interface BatchItem {
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

/**
 * Generate UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validate CPF format
 */
function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/[^\d]/g, '');
  return cleaned.length === 11;
}

/**
 * Validate CNPJ format
 */
function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/[^\d]/g, '');
  return cleaned.length === 14;
}

/**
 * Detect document type
 */
function detectDocumentType(doc: string): 'cpf' | 'cnpj' | null {
  const cleaned = doc.replace(/[^\d]/g, '');
  if (cleaned.length === 11) return 'cpf';
  if (cleaned.length === 14) return 'cnpj';
  return null;
}

/**
 * Parse CSV and validate contents
 */
function parseCSV(csvContent: string): Array<{ document: string; type: 'cpf' | 'cnpj' }> {
  const records = parse(csvContent, {
    columns: false,
    skip_empty_lines: true,
    trim: true,
  });

  const items: Array<{ document: string; type: 'cpf' | 'cnpj' }> = [];
  const errors: string[] = [];

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const rowNum = i + 1;

    // Skip header row if it exists
    if (rowNum === 1 && (row[0]?.toLowerCase() === 'cpf' || row[0]?.toLowerCase() === 'cnpj' || row[0]?.toLowerCase() === 'documento')) {
      continue;
    }

    // Get document from first column
    const document = row[0]?.trim();
    if (!document) {
      errors.push(`Linha ${rowNum}: documento vazio`);
      continue;
    }

    // Detect and validate document type
    const type = detectDocumentType(document);
    if (!type) {
      errors.push(`Linha ${rowNum}: documento inválido "${document}"`);
      continue;
    }

    items.push({ document, type });
  }

  if (errors.length > 0 && items.length === 0) {
    throw new Error(`CSV inválido:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n... e mais ${errors.length - 5} erros` : ''}`);
  }

  return items;
}

/**
 * POST /api/batch/upload
 * Upload CSV file and create batch job
 */
export async function handleBatchUpload(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'Nenhum arquivo enviado' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return new Response(JSON.stringify({ error: 'Apenas arquivos CSV são permitidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Arquivo muito grande. Máximo: 5MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Read file contents
    const csvContent = await file.text();

    // Parse and validate CSV
    let items: Array<{ document: string; type: 'cpf' | 'cnpj' }>;
    try {
      items = parseCSV(csvContent);
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (items.length === 0) {
      return new Response(JSON.stringify({ error: 'CSV vazio ou sem documentos válidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate batch size (max 1000 items)
    if (items.length > 1000) {
      return new Response(JSON.stringify({ error: `Máximo de 1000 documentos por lote. Encontrados: ${items.length}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Determine batch type
    const hasCPF = items.some(item => item.type === 'cpf');
    const hasCNPJ = items.some(item => item.type === 'cnpj');
    const batchType: 'cpf' | 'cnpj' | 'mixed' =
      (hasCPF && hasCNPJ) ? 'mixed' : (hasCPF ? 'cpf' : 'cnpj');

    // Create batch job
    const batchId = generateUUID();
    const insertBatchResult = await env.DB.prepare(`
      INSERT INTO batch_jobs (
        id, tenant_id, user_id, type, filename, status, total_items
      ) VALUES (?, ?, ?, ?, ?, 'pending', ?)
    `).bind(
      batchId,
      user.tenantId,
      user.userId,
      batchType,
      file.name,
      items.length
    ).run();

    if (!insertBatchResult.success) {
      throw new Error('Falha ao criar batch job');
    }

    // Insert batch items
    const itemsInsertPromises = items.map((item, index) =>
      env.DB.prepare(`
        INSERT INTO batch_items (
          batch_job_id, row_number, document, document_type, status
        ) VALUES (?, ?, ?, ?, 'pending')
      `).bind(
        batchId,
        index + 1,
        item.document,
        item.type
      ).run()
    );

    await Promise.all(itemsInsertPromises);

    // Fetch created batch job
    const batch = await env.DB.prepare(`
      SELECT * FROM batch_jobs WHERE id = ?
    `).bind(batchId).first<BatchJob>();

    return new Response(JSON.stringify({
      success: true,
      batch,
      message: `Lote criado com sucesso: ${items.length} documentos`
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Batch upload error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Erro ao processar upload' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/batch
 * List all batch jobs for current user
 */
export async function handleListBatches(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const status = url.searchParams.get('status'); // Filter by status

    let query = `
      SELECT * FROM batch_jobs
      WHERE tenant_id = ?
    `;
    const params: any[] = [user.tenantId];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const batches = await env.DB.prepare(query).bind(...params).all<BatchJob>();

    // Get total count
    const countQuery = status
      ? `SELECT COUNT(*) as total FROM batch_jobs WHERE tenant_id = ? AND status = ?`
      : `SELECT COUNT(*) as total FROM batch_jobs WHERE tenant_id = ?`;
    const countParams = status ? [user.tenantId, status] : [user.tenantId];
    const countResult = await env.DB.prepare(countQuery).bind(...countParams).first<{ total: number }>();

    return new Response(JSON.stringify({
      success: true,
      batches: batches.results,
      pagination: {
        limit,
        offset,
        total: countResult?.total || 0
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('List batches error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Erro ao listar lotes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/batch/:id
 * Get batch job details with items
 */
export async function handleGetBatch(
  request: Request,
  env: Env,
  user: DecodedToken,
  batchId: string
): Promise<Response> {
  try {
    // Get batch job
    const batch = await env.DB.prepare(`
      SELECT * FROM batch_jobs
      WHERE id = ? AND tenant_id = ?
    `).bind(batchId, user.tenantId).first<BatchJob>();

    if (!batch) {
      return new Response(JSON.stringify({ error: 'Lote não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get batch items (with pagination)
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const items = await env.DB.prepare(`
      SELECT * FROM batch_items
      WHERE batch_job_id = ?
      ORDER BY row_number ASC
      LIMIT ? OFFSET ?
    `).bind(batchId, limit, offset).all<BatchItem>();

    return new Response(JSON.stringify({
      success: true,
      batch,
      items: items.results,
      pagination: {
        limit,
        offset,
        total: batch.total_items
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Get batch error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Erro ao buscar lote' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * POST /api/batch/:id/process
 * Start processing a batch job (async processing)
 * In production, this would use Cloudflare Queues for background processing
 */
export async function handleProcessBatch(
  request: Request,
  env: Env,
  user: DecodedToken,
  batchId: string
): Promise<Response> {
  try {
    // Get batch job
    const batch = await env.DB.prepare(`
      SELECT * FROM batch_jobs
      WHERE id = ? AND tenant_id = ?
    `).bind(batchId, user.tenantId).first<BatchJob>();

    if (!batch) {
      return new Response(JSON.stringify({ error: 'Lote não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (batch.status !== 'pending') {
      return new Response(JSON.stringify({ error: `Lote não pode ser processado. Status atual: ${batch.status}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update batch status to processing
    await env.DB.prepare(`
      UPDATE batch_jobs
      SET status = 'processing', started_at = datetime('now')
      WHERE id = ?
    `).bind(batchId).run();

    // In production, this would send messages to Cloudflare Queue
    // For now, we'll return immediately and process would happen async
    // TODO: Implement Cloudflare Queue integration

    return new Response(JSON.stringify({
      success: true,
      message: 'Processamento iniciado. Acompanhe o progresso consultando o status do lote.',
      batch_id: batchId
    }), {
      status: 202, // Accepted
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Process batch error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Erro ao iniciar processamento' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * DELETE /api/batch/:id
 * Cancel/delete a batch job
 */
export async function handleDeleteBatch(
  request: Request,
  env: Env,
  user: DecodedToken,
  batchId: string
): Promise<Response> {
  try {
    // Verify ownership
    const batch = await env.DB.prepare(`
      SELECT * FROM batch_jobs
      WHERE id = ? AND tenant_id = ?
    `).bind(batchId, user.tenantId).first<BatchJob>();

    if (!batch) {
      return new Response(JSON.stringify({ error: 'Lote não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Can only delete if not processing
    if (batch.status === 'processing') {
      return new Response(JSON.stringify({ error: 'Não é possível deletar lote em processamento' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete batch (cascade will delete items)
    await env.DB.prepare(`
      DELETE FROM batch_jobs WHERE id = ?
    `).bind(batchId).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Lote deletado com sucesso'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Delete batch error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Erro ao deletar lote' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
