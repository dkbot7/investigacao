/**
 * Dashboard - Investigação em Lote
 * Upload e processamento de CSV com múltiplos CPFs/CNPJs
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  Play,
  Trash2,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useBatch } from '@/hooks/useBatch';
import { batchService, BatchJob } from '@/lib/services/batch.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function BatchPage() {
  const { batches, loading, uploading, uploadCSV, fetchBatches, processBatch, deleteBatch } = useBatch();
  const { toast } = useToast();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast({
          variant: 'destructive',
          title: 'Arquivo inválido',
          description: 'Apenas arquivos CSV são permitidos',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadCSV(selectedFile);
      setUploadModalOpen(false);
      setSelectedFile(null);
      fetchBatches();
    } catch (error) {
      // Error already handled by hook
    }
  };

  const handleProcess = async (batchId: string) => {
    try {
      await processBatch(batchId);
    } catch (error) {
      // Error already handled by hook
    }
  };

  const handleDelete = async (batchId: string) => {
    if (!confirm('Tem certeza que deseja deletar este lote?')) return;

    try {
      await deleteBatch(batchId);
    } catch (error) {
      // Error already handled by hook
    }
  };

  const getStatusIcon = (status: BatchJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Investigação em Lote
        </h1>
        <p className="text-slate-600 dark:text-navy-300">
          Faça upload de CSV com múltiplos CPFs/CNPJs para processar investigações em massa
        </p>
      </div>

      {/* Upload Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Novo Lote</CardTitle>
          <CardDescription>
            Faça upload de um arquivo CSV com documentos para investigar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Instructions */}
            <div className="p-4 bg-blue-50 dark:bg-navy-800 rounded-lg border border-blue-200 dark:border-navy-700">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Como preparar seu CSV
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 ml-6 list-disc">
                <li>Uma coluna com CPF ou CNPJ (com ou sem formatação)</li>
                <li>Primeira linha pode ser cabeçalho (será ignorada se detectada)</li>
                <li>Máximo de 1000 documentos por arquivo</li>
                <li>Tamanho máximo do arquivo: 5MB</li>
              </ul>
            </div>

            {/* Upload Button */}
            <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto">
                  <Upload className="w-5 h-5 mr-2" />
                  Fazer Upload de CSV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload de CSV</DialogTitle>
                  <DialogDescription>
                    Selecione um arquivo CSV com CPFs ou CNPJs para processar
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>

                  {selectedFile && (
                    <div className="p-4 bg-slate-50 dark:bg-navy-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-slate-500">
                            {(selectedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUploadModalOpen(false);
                        setSelectedFile(null);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={!selectedFile || uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Enviar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Batches List */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Seus Lotes
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {!loading && batches.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-navy-300">
                Nenhum lote criado ainda. Faça upload do seu primeiro CSV!
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && batches.length > 0 && (
          <div className="space-y-4">
            {batches.map((batch) => (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(batch.status)}
                        <div>
                          <h3 className="font-semibold text-lg">{batch.filename}</h3>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <Badge variant="outline">
                              {batchService.getTypeLabel(batch.type)}
                            </Badge>
                            <span>{batch.total_items} documentos</span>
                            <span>•</span>
                            <span>
                              {new Date(batch.created_at).toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {batch.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleProcess(batch.id)}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Processar
                          </Button>
                        )}

                        {batch.status === 'completed' && batch.result_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={batch.result_url} download>
                              <Download className="w-4 h-4 mr-1" />
                              Baixar Resultados
                            </a>
                          </Button>
                        )}

                        {batch.status !== 'processing' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(batch.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    {batch.status === 'processing' || batch.status === 'completed' ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-navy-300">
                            Progresso
                          </span>
                          <span className="font-medium">
                            {batch.processed_items} / {batch.total_items} ({batchService.calculateProgress(batch)}%)
                          </span>
                        </div>
                        <Progress value={batchService.calculateProgress(batch)} />

                        <div className="flex items-center gap-6 text-sm pt-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>{batch.successful_items} sucesso</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span>{batch.failed_items} falhas</span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {/* Error Message */}
                    {batch.error_message && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-300">
                          {batch.error_message}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
