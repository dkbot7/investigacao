"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listarJobs } from "@/lib/services/dados.service";
import type { Job } from "@/lib/types/dados.types";

interface JobMonitorProps {
  autoRefresh?: boolean;
  refreshInterval?: number; // ms
  onJobComplete?: (job: Job) => void;
  showCompleted?: boolean;
}

export function JobMonitor({
  autoRefresh = true,
  refreshInterval = 3000, // 3 seconds
  onJobComplete,
  showCompleted = true,
}: JobMonitorProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(autoRefresh);

  // Load jobs
  const loadJobs = async () => {
    try {
      setError(null);
      const response = await listarJobs();

      // Filter based on showCompleted
      const filteredJobs = showCompleted
        ? response.jobs
        : response.jobs.filter(
            (j) => j.status === "pending" || j.status === "processing"
          );

      // Check for newly completed jobs
      if (onJobComplete) {
        filteredJobs.forEach((job) => {
          const oldJob = jobs.find((j) => j.id === job.id);
          if (
            oldJob &&
            oldJob.status !== "completed" &&
            job.status === "completed"
          ) {
            onJobComplete(job);
          }
        });
      }

      setJobs(filteredJobs);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar jobs");
    } finally {
      setLoading(false);
    }
  };

  // Polling effect
  useEffect(() => {
    loadJobs();

    if (isPolling) {
      const interval = setInterval(loadJobs, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [isPolling, refreshInterval]);

  // Get status badge
  const getStatusBadge = (status: Job["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Processando
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Concluído
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Falhou
          </Badge>
        );
    }
  };

  // Get job type label
  const getJobTypeLabel = (type: Job["type"]) => {
    switch (type) {
      case "consultar_cpf_batch":
        return "Consulta CPF (Lote)";
      case "refresh_cache_cpf":
        return "Atualizar Cache CPF";
      case "consultar_cnpj_batch":
        return "Consulta CNPJ (Lote)";
      default:
        return type;
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="ml-2 text-slate-600 dark:text-white/60">
            Carregando jobs...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <Button
            onClick={loadJobs}
            size="sm"
            variant="ghost"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-6">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-slate-400 dark:text-white/20 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-white/60">
            Nenhum job em andamento
          </p>
          <p className="text-sm text-slate-500 dark:text-white/40 mt-1">
            Os jobs aparecerão aqui quando você importar funcionários
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-navy-700">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Jobs em Processamento
          </h3>
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            {jobs.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsPolling(!isPolling)}
            size="sm"
            variant="ghost"
            className={
              isPolling
                ? "text-blue-400 hover:text-blue-300"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-white"
            }
            title={isPolling ? "Auto-refresh ativado" : "Auto-refresh desativado"}
          >
            <RefreshCw
              className={`w-4 h-4 ${isPolling ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="divide-y divide-slate-200 dark:divide-navy-700">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 hover:bg-slate-50 dark:hover:bg-navy-800/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {getJobTypeLabel(job.type)}
                  </span>
                  {getStatusBadge(job.status)}
                </div>
                <p className="text-sm text-slate-600 dark:text-white/60">
                  Iniciado: {formatDate(job.created_at)}
                </p>
                {job.tenant_code && (
                  <p className="text-xs text-slate-500 dark:text-white/40 mt-1">
                    Tenant: {job.tenant_code}
                  </p>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {(job.status === "processing" || job.status === "completed") && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-white/60">
                    Progresso: {job.items_processed}/{job.items_total}
                  </span>
                  <span className="text-blue-400 font-medium">
                    {job.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-navy-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      job.status === "completed"
                        ? "bg-emerald-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
                {job.items_failed > 0 && (
                  <p className="text-xs text-red-400">
                    {job.items_failed} falhas
                  </p>
                )}
              </div>
            )}

            {/* Error Message */}
            {job.status === "failed" && job.error_message && (
              <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400">
                {job.error_message}
              </div>
            )}

            {/* Completion Time */}
            {job.status === "completed" && job.completed_at && (
              <p className="text-xs text-emerald-400 mt-2">
                Concluído: {formatDate(job.completed_at)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
