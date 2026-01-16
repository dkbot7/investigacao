"use client";

import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FileArchive,
  File,
  Download,
  ExternalLink,
} from "lucide-react";

interface DownloadCardProps {
  title: string;
  description?: string;
  href: string;
  filename?: string;
  fileSize?: string;
  fileType?: "pdf" | "doc" | "xls" | "image" | "zip" | "other";
  version?: string;
  external?: boolean;
}

const fileTypeConfig = {
  pdf: {
    icon: FileText,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    label: "PDF",
  },
  doc: {
    icon: FileText,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    label: "DOC",
  },
  xls: {
    icon: FileSpreadsheet,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    label: "XLS",
  },
  image: {
    icon: FileImage,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    label: "IMG",
  },
  zip: {
    icon: FileArchive,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    label: "ZIP",
  },
  other: {
    icon: File,
    color: "text-slate-500 dark:text-navy-400",
    bgColor: "bg-navy-500/10",
    label: "FILE",
  },
};

export default function DownloadCard({
  title,
  description,
  href,
  filename,
  fileSize,
  fileType = "other",
  version,
  external = false,
}: DownloadCardProps) {
  const config = fileTypeConfig[fileType];
  const Icon = config.icon;

  return (
    <a
      href={href}
      download={!external ? filename || true : undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-start gap-4 p-4 my-4 rounded-xl border border-blue-500/10 bg-white dark:bg-white/50 dark:bg-navy-900/50 hover:bg-white dark:bg-navy-900 hover:border-blue-500/20 transition-all group"
    >
      {/* File Icon */}
      <div className={`p-3 rounded-lg ${config.bgColor}`}>
        <Icon className={`w-6 h-6 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors truncate">
            {title}
          </h4>
          {version && (
            <span className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded-full">
              v{version}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-slate-500 dark:text-navy-400 line-clamp-2 mb-2">{description}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-slate-900 dark:text-navy-500">
          <span className={`px-1.5 py-0.5 rounded ${config.bgColor} ${config.color}`}>
            {config.label}
          </span>
          {fileSize && <span>{fileSize}</span>}
          {filename && <span className="truncate max-w-[200px]">{filename}</span>}
        </div>
      </div>

      {/* Download Icon */}
      <div className="flex-shrink-0 p-2 text-slate-500 dark:text-navy-400 group-hover:text-blue-400 transition-colors">
        {external ? (
          <ExternalLink className="w-5 h-5" />
        ) : (
          <Download className="w-5 h-5" />
        )}
      </div>
    </a>
  );
}
