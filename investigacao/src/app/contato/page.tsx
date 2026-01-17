"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageCircle, Mail, Send, FileText, CheckCircle, Brain, Shield, Scale, Building2, TrendingUp, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WhatsAppButton from "@/components/WhatsAppButton";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const EMAIL_CONTATO = "contato@investigacaodigital.com.br";

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    assunto: "",
    mensagem: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simula envio - em produção, conectar a um backend/API
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset após 5 segundos
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ nome: "", email: "", assunto: "", mensagem: "" });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950 pt-20">
        {/* Hero Section - Compacto (UX otimizado) */}
        <section className="pt-6 pb-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-900 dark:to-navy-950">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Lado esquerdo - Padrão F */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    Fale <span className="text-green-400">Conosco</span>
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-navy-300">
                    +100 mil registros por investigação
                  </p>
                </div>
              </div>
              {/* Lado direito - Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-white text-xs"><Scale className="w-3 h-3 mr-1" />Divórcios</Badge>
                <Badge className="bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-white text-xs"><Building2 className="w-3 h-3 mr-1" />Empresas</Badge>
                <Badge className="bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-white text-xs"><TrendingUp className="w-3 h-3 mr-1" />Investidores</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container max-w-6xl mx-auto px-4 py-12">

        {/* Contact Options */}
        <div className="max-w-md mx-auto mb-12">
          {/* WhatsApp Card */}
          <Card className="bg-white dark:bg-navy-900 border-slate-300 dark:border-navy-800 hover:border-green-500/50 transition-all">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-slate-900 dark:text-white" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <CardTitle className="text-slate-900 dark:text-white">WhatsApp</CardTitle>
              <CardDescription className="text-slate-900 dark:text-slate-600 dark:text-white/60">
                Atendimento rápido e sigiloso
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <WhatsAppButton
                message="Olá! Gostaria de saber mais sobre os serviços de investigação digital."
                source="contato-whatsapp"
              >
                Iniciar conversa
              </WhatsAppButton>
              <p className="text-slate-900 dark:text-slate-500 dark:text-white/50 text-xs mt-4">
                Resposta em até 24h
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-px bg-slate-100 dark:bg-navy-800" />
          <span className="text-slate-900 dark:text-white/40 text-sm">ou preencha o formulário</span>
          <div className="flex-1 h-px bg-slate-100 dark:bg-navy-800" />
        </div>

        {/* Contact Form */}
        <Card className="bg-white dark:bg-navy-900 border-slate-300 dark:border-navy-800 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-400" />
              Formulário de Contato
            </CardTitle>
            <CardDescription className="text-slate-900 dark:text-slate-600 dark:text-white/60">
              Preencha os campos abaixo e entraremos em contato
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Mensagem enviada!</h3>
                <p className="text-slate-900 dark:text-slate-600 dark:text-white/60">Entraremos em contato em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="nome" className="text-sm text-slate-900 dark:text-slate-800 dark:text-white/80">Nome completo</label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Seu nome"
                      required
                      className="bg-slate-100 dark:bg-navy-800 border-slate-400 dark:border-navy-700 text-slate-900 dark:text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm text-slate-900 dark:text-slate-800 dark:text-white/80">E-mail</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      required
                      className="bg-slate-100 dark:bg-navy-800 border-slate-400 dark:border-navy-700 text-slate-900 dark:text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="assunto" className="text-sm text-slate-900 dark:text-slate-800 dark:text-white/80">Assunto</label>
                  <Input
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    placeholder="Sobre o que deseja falar?"
                    required
                    className="bg-slate-100 dark:bg-navy-800 border-slate-400 dark:border-navy-700 text-slate-900 dark:text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="mensagem" className="text-sm text-slate-900 dark:text-slate-800 dark:text-white/80">Mensagem</label>
                  <Textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    placeholder="Descreva como podemos ajudar..."
                    rows={5}
                    required
                    className="bg-slate-100 dark:bg-navy-800 border-slate-400 dark:border-navy-700 text-slate-900 dark:text-white placeholder:text-white/40 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-slate-900 dark:text-white font-semibold py-6"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Enviar mensagem
                    </span>
                  )}
                </Button>

                <p className="text-slate-900 dark:text-white/40 text-xs text-center">
                  Ao enviar, você concorda com nossa{" "}
                  <Link href="/privacidade" className="text-primary-400 hover:underline">
                    Política de Privacidade
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>

        </div>
      </main>
      <Footer />
    </>
  );
}


