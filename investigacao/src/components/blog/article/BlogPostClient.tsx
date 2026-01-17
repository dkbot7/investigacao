"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Hash } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import {
  ArticleHeader,
  ArticleContent,
  TableOfContents,
  ReadingProgress,
  RelatedPosts,
  AuthorCard,
  CodeBlock,
  Callout,
  KeyStat,
  ArtifactList
} from "@/components/blog/article";
import { useBlogPost, useRelatedPosts } from "@/hooks/useBlog";

// Conteúdo de exemplo para demonstração (será substituído por CMS/API)
function getArticleContent(slug: string) {
  // Template estilo Forensafe para artigos técnicos
  const articleTemplates: Record<string, {
    toc: Array<{ id: string; text: string; level: number }>;
    content: React.ReactNode;
  }> = {
    "recuperar-evidencias-smartphones-android": {
      toc: [
        { id: "introducao", text: "Introdução", level: 2 },
        { id: "valor-forense", text: "Valor Forense Digital", level: 2 },
        { id: "localizacao-artefatos", text: "Localização dos Artefatos", level: 2 },
        { id: "estrutura-dados", text: "Estrutura de Dados", level: 3 },
        { id: "metodos-extracao", text: "Métodos de Extração", level: 2 },
        { id: "extracao-logica", text: "Extração Lógica", level: 3 },
        { id: "extracao-fisica", text: "Extração Física", level: 3 },
        { id: "analise-pratica", text: "Análise Prática", level: 2 },
        { id: "conclusao", text: "Conclusão", level: 2 }
      ],
      content: (
        <>
          <section id="introducao">
            <h2>Introdução</h2>
            <p>
              Os smartphones Android dominam o mercado brasileiro, representando mais de 85% dos dispositivos móveis em uso no país. Para investigadores e peritos forenses, esses dispositivos são verdadeiros repositórios de evidências digitais, armazenando desde conversas em aplicativos de mensagens até dados de localização GPS detalhados.
            </p>
            <p>
              Este guia técnico apresenta uma metodologia estruturada para a recuperação de evidências digitais em dispositivos Android, cobrindo desde os fundamentos teóricos até a aplicação prática das técnicas mais avançadas utilizadas por peritos forenses.
            </p>
            <Callout type="info" title="Pré-requisitos">
              Este artigo assume conhecimento básico em sistemas Linux/Android e familiaridade com ferramentas de linha de comando. Recomendamos a leitura do nosso guia &quot;Fundamentos de Forense Digital&quot; antes de prosseguir.
            </Callout>
          </section>

          <section id="valor-forense">
            <h2>Valor Forense Digital</h2>
            <p>
              Os dados armazenados em dispositivos Android podem fornecer evidências cruciais em diversos tipos de investigações. A análise forense adequada pode revelar:
            </p>
            <ul>
              <li><strong>Histórico de comunicações:</strong> Mensagens SMS, WhatsApp, Telegram e outros aplicativos de mensagens instantâneas</li>
              <li><strong>Dados de localização:</strong> Histórico GPS, check-ins, fotos geotaggeadas e dados de Wi-Fi</li>
              <li><strong>Atividade online:</strong> Histórico de navegação, downloads, contas vinculadas e sessões de aplicativos</li>
              <li><strong>Mídia digital:</strong> Fotos, vídeos, áudios e documentos, incluindo arquivos deletados</li>
              <li><strong>Dados financeiros:</strong> Transações via aplicativos bancários, carteiras digitais e PIX</li>
            </ul>

            <KeyStat
              value="92%"
              description="dos casos de fraude corporativa no Brasil envolvem evidências extraídas de dispositivos móveis como elemento probatório principal."
              source="Relatório APCF 2024"
            />
          </section>

          <section id="localizacao-artefatos">
            <h2>Localização dos Artefatos</h2>
            <p>
              Os dados em dispositivos Android são organizados em estruturas específicas do sistema de arquivos. O conhecimento dessas localizações é fundamental para uma extração eficiente.
            </p>

            <h3 id="estrutura-dados">Estrutura de Dados</h3>
            <p>
              O sistema Android utiliza partições distintas para armazenamento de diferentes tipos de dados:
            </p>

            <ArtifactList
              title="Partições Principais do Android"
              items={[
                {
                  name: "userdata",
                  description: "Dados do usuário, aplicativos instalados e configurações",
                  path: "/data"
                },
                {
                  name: "cache",
                  description: "Dados temporários de aplicativos e sistema",
                  path: "/cache"
                },
                {
                  name: "sdcard",
                  description: "Armazenamento acessível ao usuário (fotos, downloads)",
                  path: "/sdcard ou /storage/emulated/0"
                },
                {
                  name: "system",
                  description: "Arquivos do sistema operacional Android",
                  path: "/system"
                }
              ]}
            />

            <p>
              Para aplicativos específicos, os dados geralmente residem em:
            </p>

            <CodeBlock language="bash" filename="Caminhos de aplicativos">
{`# WhatsApp
/data/data/com.whatsapp/databases/msgstore.db
/data/data/com.whatsapp/databases/wa.db

# Telegram
/data/data/org.telegram.messenger/files/

# Google Chrome
/data/data/com.android.chrome/app_chrome/Default/

# Fotos da câmera
/sdcard/DCIM/Camera/`}
            </CodeBlock>
          </section>

          <section id="metodos-extracao">
            <h2>Métodos de Extração</h2>
            <p>
              Existem diferentes métodos de extração, cada um com suas vantagens e limitações. A escolha do método depende do estado do dispositivo, nível de acesso disponível e requisitos do caso.
            </p>

            <h3 id="extracao-logica">Extração Lógica</h3>
            <p>
              A extração lógica utiliza APIs do sistema para acessar dados disponíveis através do sistema operacional. É o método menos invasivo e geralmente não requer root.
            </p>
            <Callout type="tip" title="Quando usar">
              Ideal para casos onde a integridade do dispositivo deve ser preservada ao máximo, ou quando não há necessidade de recuperar dados deletados.
            </Callout>

            <h3 id="extracao-fisica">Extração Física</h3>
            <p>
              A extração física cria uma imagem bit-a-bit da memória do dispositivo, permitindo análise profunda incluindo dados deletados e fragmentos de arquivos.
            </p>
            <Callout type="warning" title="Atenção">
              A extração física pode requerer root do dispositivo, o que pode invalidar garantias e, em alguns casos, alterar dados. Documente todas as ações realizadas para manter a cadeia de custódia.
            </Callout>

            <CodeBlock language="bash" filename="Exemplo com ADB">
{`# Verificar dispositivo conectado
adb devices

# Criar backup lógico
adb backup -apk -shared -all -f backup.ab

# Para extração física (requer root)
adb shell
su
dd if=/dev/block/mmcblk0 of=/sdcard/image.raw bs=4096`}
            </CodeBlock>
          </section>

          <section id="analise-pratica">
            <h2>Análise Prática</h2>
            <p>
              Após a extração, a análise dos dados requer ferramentas especializadas. Recomendamos o uso combinado de ferramentas comerciais e open source para validação cruzada dos resultados.
            </p>

            <ArtifactList
              title="Ferramentas Recomendadas"
              items={[
                {
                  name: "Cellebrite UFED",
                  description: "Suite comercial completa para extração e análise"
                },
                {
                  name: "Autopsy",
                  description: "Plataforma open source para análise forense digital"
                },
                {
                  name: "ALEAPP",
                  description: "Android Logs Events And Protobuf Parser"
                },
                {
                  name: "SQLite Browser",
                  description: "Análise de bancos de dados SQLite de aplicativos"
                }
              ]}
            />

            <KeyStat
              value="78%"
              description="de redução no tempo de análise ao utilizar parsers automatizados como ALEAPP em conjunto com ferramentas comerciais."
              source="Benchmark interno Investigaree"
            />
          </section>

          <section id="conclusao">
            <h2>Conclusão</h2>
            <p>
              A recuperação de evidências em dispositivos Android é uma competência essencial para qualquer profissional de forense digital. O domínio das técnicas apresentadas neste guia, aliado ao uso adequado das ferramentas disponíveis, permite conduzir investigações mais eficientes e produzir laudos tecnicamente robustos.
            </p>
            <p>
              Lembre-se sempre de documentar cada etapa do processo, manter a cadeia de custódia e validar os resultados utilizando múltiplas ferramentas quando possível.
            </p>
            <Callout type="success" title="Próximos passos">
              Continue sua jornada de aprendizado com nossos tutoriais avançados sobre análise de aplicativos específicos como WhatsApp, Telegram e Signal.
            </Callout>
          </section>
        </>
      )
    }
  };

  // Retorna template genérico se não houver conteúdo específico
  return articleTemplates[slug] || {
    toc: [
      { id: "introducao", text: "Introdução", level: 2 },
      { id: "conteudo", text: "Conteúdo Principal", level: 2 },
      { id: "conclusao", text: "Conclusão", level: 2 }
    ],
    content: (
      <>
        <section id="introducao">
          <h2>Introdução</h2>
          <p>
            Este artigo está em desenvolvimento. Em breve, você terá acesso ao conteúdo completo com análises técnicas detalhadas, exemplos práticos e recursos adicionais.
          </p>
          <Callout type="info" title="Em construção">
            Nossos especialistas estão trabalhando neste conteúdo. Assine nossa newsletter para ser notificado quando estiver disponível.
          </Callout>
        </section>

        <section id="conteudo">
          <h2>Conteúdo Principal</h2>
          <p>
            O conteúdo detalhado deste artigo será publicado em breve. Enquanto isso, explore outros artigos da nossa biblioteca DFIR.
          </p>
        </section>

        <section id="conclusao">
          <h2>Conclusão</h2>
          <p>
            Agradecemos seu interesse neste tema. Continue explorando nossa plataforma para encontrar outros conteúdos relevantes sobre forense digital e investigações.
          </p>
        </section>
      </>
    )
  };
}

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const { post, loading, error } = useBlogPost(slug);
  const relatedPosts = useRelatedPosts(post);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 dark:bg-navy-950 pt-24">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-slate-100 dark:bg-navy-800 rounded mb-4" />
              <div className="h-12 w-3/4 bg-slate-100 dark:bg-navy-800 rounded mb-4" />
              <div className="h-6 w-1/2 bg-slate-100 dark:bg-navy-800 rounded mb-8" />
              <div className="aspect-[21/9] max-w-5xl bg-slate-100 dark:bg-navy-800 rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    notFound();
  }

  const articleContent = getArticleContent(slug);

  return (
    <>
      <Header />
      <ReadingProgress />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950">
        {/* Header do artigo */}
        <ArticleHeader post={post} />

        {/* Conteúdo principal */}
        <div className="container mx-auto px-4 sm:px-8 lg:px-12 pb-16">
          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* Sidebar com TOC (sticky no desktop) */}
            <aside className="w-full lg:w-72 flex-shrink-0 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                <TableOfContents items={articleContent.toc} />

                {/* Tags */}
                <div className="bg-white dark:bg-white/30 dark:bg-navy-900/30 border border-green-500/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/10">
                    <div className="p-1.5 rounded-lg bg-green-500/10">
                      <Hash className="w-4 h-4 text-green-500" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className="px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-navy-800/50 text-slate-500 dark:text-navy-400 hover:bg-slate-100 dark:bg-navy-800 hover:text-slate-900 dark:text-white transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Conteúdo do artigo */}
            <div className="flex-1 min-w-0 order-1 lg:order-2">
              <ArticleContent>
                {articleContent.content}
              </ArticleContent>

              {/* Card do autor */}
              <div className="mt-12 pt-8 border-t border-green-500/10">
                <AuthorCard author={post.author} />
              </div>
            </div>
          </div>
        </div>

        {/* Posts relacionados */}
        <RelatedPosts posts={relatedPosts} currentPostId={post.id} />

        <Footer />
      </main>
    </>
  );
}

