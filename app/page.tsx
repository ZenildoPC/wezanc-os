"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Search, ShieldCheck, Phone, Trash2, Zap, LayoutDashboard,
  Users, BarChart3, ExternalLink, Bot, Edit3, FileText, 
  CreditCard, MessageCircle, AlertTriangle, Printer, Share2, CheckCircle2, Clock, Send, Filter, X, UserX, RefreshCw, Download, Upload, Shield, FileDown, User, NotebookPen, DollarSign, Repeat, CheckSquare, Square
} from "lucide-react";

type StatusPipelineOutbound = 
  | "01_raio_x" 
  | "02_prototipagem" 
  | "03_abordagem" 
  | "04_fechamento" 
  | "05_em_garantia"
  | "06_nao_fechou"
  | "07_concluido";

type StatusPipelineInbound = 
  | "01_briefing" 
  | "02_branding" 
  | "03_desenvolvimento" 
  | "04_validacao" 
  | "05_fechamento"
  | "06_em_garantia"
  | "07_nao_fechou"
  | "08_concluido";

interface TarefaTecnica {
  id: string;
  titulo: string;
  concluida: boolean;
}

interface Cliente {
  id: string;
  nome: string;
  empresa: string;
  whatsapp: string;
  documento: string;
  pacote: "Landing Page Express" | "Site Institucional" | "E-commerce";
  formaPagamento: string;
  valorTabela: number;
  valorPago: number;
  teveDesconto: boolean;
  valorDesconto: number;
  statusOutbound: StatusPipelineOutbound;
  statusInbound: StatusPipelineInbound;
  origem: "Outbound (Prospecção Ativa)" | "Inbound (Instagram / Leads)";
  dataFechamento: string;
  dataInicioGarantia?: string;
  agenteResponsavel: string;
  motivoNaoFechou?: string;
  
  notasAnotacoes?: string;
  temPlanoManutencao?: boolean;
  valorPlanoManutencao?: number | "";
  diaVencimentoManutencao?: number | "";
  dataUltimaCobrancaManutencao?: string;
  tarefasTecnicas?: TarefaTecnica[];
}

interface TransacaoFinanceira {
  id: string;
  descricao: string;
  tipo: "Receita" | "Despesa / IA";
  valor: number;
  data: string;
}

const COLUNAS_OUTBOUND: { id: StatusPipelineOutbound; titulo: string; agente: string; tagCor: string }[] = [
  { id: "01_raio_x", titulo: "01. Raio-X", agente: "Funcionário 4", tagCor: "border-blue-500/35 text-blue-400 bg-blue-500/10" },
  { id: "02_prototipagem", titulo: "02. Prototipagem", agente: "Equipe Wezanc", tagCor: "border-indigo-500/35 text-indigo-400 bg-indigo-500/10" },
  { id: "03_abordagem", titulo: "03. Abordagem", agente: "Funcionário 3", tagCor: "border-purple-500/35 text-purple-400 bg-purple-500/10" },
  { id: "04_fechamento", titulo: "04. Fechamento", agente: "Funcionário 2", tagCor: "border-amber-500/35 text-amber-400 bg-amber-500/10" },
  { id: "05_em_garantia", titulo: "05. Garantia (30d)", agente: "Pós-Venda", tagCor: "border-emerald-500/35 text-emerald-400 bg-emerald-500/10" },
];

const COLUNAS_INBOUND: { id: StatusPipelineInbound; titulo: string; agente: string; tagCor: string }[] = [
  { id: "01_briefing", titulo: "01. Briefing", agente: "Triagem", tagCor: "border-pink-500/35 text-pink-400 bg-pink-500/10" },
  { id: "02_branding", titulo: "02. Branding", agente: "Design Head", tagCor: "border-fuchsia-500/35 text-fuchsia-400 bg-fuchsia-500/10" },
  { id: "03_desenvolvimento", titulo: "03. Desenvolvimento", agente: "Equipe Wezanc", tagCor: "border-cyan-500/35 text-cyan-400 bg-cyan-500/10" },
  { id: "04_validacao", titulo: "04. Validação & Ajustes", agente: "QA / Cliente", tagCor: "border-amber-500/35 text-amber-400 bg-amber-500/10" },
  { id: "05_fechamento", titulo: "05. Fechamento", agente: "Comercial", tagCor: "border-purple-500/35 text-purple-400 bg-purple-500/10" },
  { id: "06_em_garantia", titulo: "06. Garantia (30d)", agente: "Pós-Venda", tagCor: "border-emerald-500/35 text-emerald-400 bg-emerald-500/10" },
];

const TAREFAS_PADRAO_TECNICA: string[] = [
  "Briefing & Coleta de Logotipo/Imagens",
  "Registro de Domínio & Configuração de DNS",
  "Provisionamento de Hospedagem / Servidor",
  "Desenvolvimento de Estrutura & Layout Web",
  "Integração com WhatsApp & Links Oficiais",
  "Validação de Responsividade (Mobile / Desktop)",
  "Homologação & Ajustes com o Cliente",
  "Publicação Oficial & Início da Garantia (30d)"
];

const AGENTES_IA = [
  {
    nome: "Social Media & Conteúdo",
    cargo: "Funcionário de Mídias Sociais",
    descricao: "Gestão de postagens, Instagram, Reels e estratégias de engajamento orgânico.",
    link: "https://share.gemini.google/ZUJBFnOavEot",
    cor: "from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400"
  },
  {
    nome: "Análise Visual & Raio-X",
    cargo: "Head de Design & Branding",
    descricao: "Avaliação estética de marcas, prospecção e estruturação de identidade visual de leads.",
    link: "https://share.gemini.google/cXSqXLDC9Uxa",
    cor: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400"
  },
  {
    nome: "Comercial & Vendas",
    cargo: "VP de Vendas",
    descricao: "Criação de scripts de abordagem, envio de protótipos e contorno de objeções.",
    link: "https://share.gemini.google/uzrvFrp6sN8j",
    cor: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400"
  },
  {
    nome: "Negócios & Tomada de Decisão",
    cargo: "COO / Gestão de Contratos",
    descricao: "Estruturação de termos contratuais, MRR e regras de negócio da Wezanc.",
    link: "https://share.gemini.google/9JbQ5lzgLBDL",
    cor: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400"
  },
  {
    nome: "Marketing & Tráfego Pago",
    cargo: "CMO (Google Ads & Campanhas)",
    descricao: "Planejamento de tráfego pago, captação de clientes e campanhas de conversão.",
    link: "https://share.gemini.google/wkoXVFp3qTvu",
    cor: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400"
  }
];

export default function WezancOS() {
  const [menuAtivo, setMenuAtivo] = useState<"kanban" | "inbound" | "tarefas" | "manutencao" | "naofechados" | "agentes" | "clientes" | "financeiro">("financeiro");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>([]);

  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [filtroTipoServico, setFiltroTipoServico] = useState("TODOS");

  const [modalCliente, setModalCliente] = useState(false);
  const [modalPerfilCliente, setModalPerfilCliente] = useState<Cliente | null>(null);
  const [modalTransacao, setModalTransacao] = useState(false);
  const [modalContrato, setModalContrato] = useState<Cliente | null>(null);

  const contratoRef = useRef<HTMLDivElement>(null);
  const relatorioFinanceiroRef = useRef<HTMLDivElement>(null);

  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroEtapa, setFiltroEtapa] = useState("TODOS");
  const [filtroGarantia, setFiltroGarantia] = useState("TODOS");
  const [filtroPacote, setFiltroPacote] = useState("TODOS");

  const [clienteEmEdicao, setClienteEmEdicao] = useState<Cliente | null>(null);

  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [documento, setDocumento] = useState("");
  const [pacote, setPacote] = useState<"Landing Page Express" | "Site Institucional" | "E-commerce">("Site Institucional");
  const [formaPagamento, setFormaPagamento] = useState("Pix à vista");
  const [origem, setOrigem] = useState<"Outbound (Prospecção Ativa)" | "Inbound (Instagram / Leads)">("Inbound (Instagram / Leads)");
  const [valorPago, setValorPago] = useState<number | "">(1500);
  const [motivoNaoFechou, setMotivoNaoFechou] = useState("");
  const [notasAnotacoes, setNotasAnotacoes] = useState("");
  const [temPlanoManutencao, setTemPlanoManutencao] = useState(false);
  const [valorPlanoManutencao, setValorPlanoManutencao] = useState<number | "">(150);
  const [diaVencimentoManutencao, setDiaVencimentoManutencao] = useState<number | "">(10);

  const [descTrans, setDescTrans] = useState("");
  const [tipoTrans, setTipoTrans] = useState<"Receita" | "Despesa / IA">("Despesa / IA");
  const [valTrans, setValTrans] = useState<number | "">(100);

  // Atualiza o título da aba dinamicamente
  useEffect(() => {
    document.title = "Wezanc - OS | Painel de Gestão";
  }, []);

  useEffect(() => {
    const cSalvos = localStorage.getItem("@wezanc_os_clientes_v34") || localStorage.getItem("@wezanc_os_clientes_v32");
    const transSalvas = localStorage.getItem("@wezanc_os_transacoes_v34") || localStorage.getItem("@wezanc_os_transacoes_v32");

    if (cSalvos) {
      const parsed: Cliente[] = JSON.parse(cSalvos);
      const atualizados = parsed.map(c => ({
        ...c,
        origem: c.origem || "Inbound (Instagram / Leads)",
        statusOutbound: c.statusOutbound || "01_raio_x",
        statusInbound: c.statusInbound || "01_briefing",
        temPlanoManutencao: c.temPlanoManutencao || false,
        valorPlanoManutencao: c.valorPlanoManutencao !== undefined ? c.valorPlanoManutencao : 150,
        diaVencimentoManutencao: c.diaVencimentoManutencao !== undefined ? c.diaVencimentoManutencao : 10,
        notasAnotacoes: c.notasAnotacoes || "",
        tarefasTecnicas: c.tarefasTecnicas || TAREFAS_PADRAO_TECNICA.map((t, idx) => ({ id: `${idx}`, titulo: t, concluida: false }))
      }));
      setClientes(atualizados);
    }
    if (transSalvas) setTransacoes(JSON.parse(transSalvas));
  }, []);

  const salvarClientes = (lista: Cliente[]) => {
    setClientes(lista);
    localStorage.setItem("@wezanc_os_clientes_v34", JSON.stringify(lista));
  };

  const salvarTransacoes = (lista: TransacaoFinanceira[]) => {
    setTransacoes(lista);
    localStorage.setItem("@wezanc_os_transacoes_v34", JSON.stringify(lista));
  };

  const alternarTarefaCliente = (clienteId: string, tarefaId: string) => {
    const atualizados = clientes.map(c => {
      if (c.id === clienteId) {
        const novasTarefas = (c.tarefasTecnicas || []).map(t => {
          if (t.id === tarefaId) {
            return { ...t, concluida: !t.concluida };
          }
          return t;
        });
        return { ...c, tarefasTecnicas: novasTarefas };
      }
      return c;
    });
    salvarClientes(atualizados);
  };

  const aplicarMascaraWhatsapp = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);
    if (apenasNumeros.length <= 2) return apenasNumeros;
    if (apenasNumeros.length <= 7) return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
  };

  const aplicarMascaraDocumento = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 14);
    if (apenasNumeros.length <= 11) {
      if (apenasNumeros.length <= 3) return apenasNumeros;
      if (apenasNumeros.length <= 6) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
      if (apenasNumeros.length <= 9) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
      return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9)}`;
    } else {
      return `${apenasNumeros.slice(0, 2)}.${apenasNumeros.slice(2, 5)}.${apenasNumeros.slice(5, 8)}/${apenasNumeros.slice(8, 12)}-${apenasNumeros.slice(12)}`;
    }
  };

  const exportarBackupJSON = () => {
    const dados = {
      clientes,
      transacoes,
      exportadoEm: new Date().toISOString(),
      versao: "Wezanc - OS v34.0"
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_wezanc_os_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importarBackupJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const conteudo = JSON.parse(event.target?.result as string);
        if (conteudo.clientes && Array.isArray(conteudo.clientes)) {
          salvarClientes(conteudo.clientes);
          if (conteudo.transacoes) salvarTransacoes(conteudo.transacoes);
          alert("Backup restaurado com sucesso!");
        } else {
          alert("Arquivo de backup inválido.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo de backup.");
      }
    };
    reader.readAsText(file);
  };

  const getValorTabela = (p: string) => {
    if (p === "Landing Page Express") return 750;
    if (p === "Site Institucional") return 1500;
    return 2400;
  };

  const calcularTempoRestanteGarantia = (dataInicioGarantia?: string) => {
    if (!dataInicioGarantia) return { dias: 30, horas: 0, expirado: false, texto: "30 dias restantes" };
    
    const inicio = new Date(dataInicioGarantia).getTime();
    const fimGarantia = inicio + (30 * 24 * 60 * 60 * 1000);
    const agora = new Date().getTime();
    const diferenca = fimGarantia - agora;

    if (diferenca <= 0) {
      return { dias: 0, horas: 0, expirado: true, texto: "Garantia Finalizada" };
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return { 
      dias, 
      horas, 
      expirado: false, 
      texto: `${dias}d e ${horas}h restantes` 
    };
  };

  const enviarCobrancaManutencaoWhatsApp = (cliente: Cliente) => {
    const telefoneLimpo = cliente.whatsapp.replace(/\D/g, "");
    const valor = cliente.valorPlanoManutencao || 150;
    const diaVenc = cliente.diaVencimentoManutencao || 10;
    
    const texto = `Olá ${cliente.nome}!\n\nEspero que esteja tudo ótimo por aí!\n\nPassando para enviar a lembrança mensal do *Plano de Manutenção e Suporte Preventivo Wezanc* referente à empresa *${cliente.empresa}*.\n\n📊 *Resumo da Mensalidade:*\n• Serviço: Suporte Técnico, Backups & Atualizações\n• Valor: R$ ${Number(valor).toLocaleString("pt-BR")}\n• Vencimento: Dia ${diaVenc}\n• Chave Pix: (35) 98407-1964 (Zenildo Pereira Cruz Neto)\n\nQualquer dúvida ou ajuste necessário no site, fico totalmente à disposição!\n\nAtenciosamente,\n*Wezanc Technology*`;

    if (telefoneLimpo) {
      window.open(`https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(texto)}`, "_blank");
    }
  };

  const baixarRelatorioFinanceiroPDF = () => {
    const conteudoRelatorio = relatorioFinanceiroRef.current?.innerHTML;
    if (!conteudoRelatorio) return;

    const janelaPrint = window.open("", "_blank", "width=900,height=1100");
    if (!janelaPrint) {
      alert("Permita os pop-ups no navegador para gerar o PDF.");
      return;
    }

    janelaPrint.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Relatório Financeiro Executivo - Wezanc Technology</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; color: #0f172a; background: #ffffff; margin: 0; padding: 0; font-size: 10pt; line-height: 1.5; }
            .relatorio-container { max-width: 750px; margin: 0 auto; padding: 10mm; }
            p, div, table, tr, td { page-break-inside: avoid !important; break-inside: avoid !important; }
            @page { size: A4 portrait; margin: 10mm 12mm; }
          </style>
        </head>
        <body>
          <div class="relatorio-container">${conteudoRelatorio}</div>
        </body>
      </html>
    `);

    janelaPrint.document.close();
    janelaPrint.focus();
    setTimeout(() => {
      janelaPrint.print();
      janelaPrint.close();
    }, 500);
  };

  const baixarContratoPDF = () => {
    const conteudoContrato = contratoRef.current?.innerHTML;
    if (!conteudoContrato) return;

    const janelaPrint = window.open("", "_blank", "width=900,height=1100");
    if (!janelaPrint) {
      alert("Permita os pop-ups no navegador para gerar o PDF.");
      return;
    }

    janelaPrint.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Contrato Oficial de Prestação de Serviços - Wezanc Technology</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; color: #0f172a; background: #ffffff; margin: 0; padding: 0; font-size: 10pt; line-height: 1.5; }
            .contrato-container { max-width: 750px; margin: 0 auto; padding: 10mm; }
            p, div, table, tr, td { page-break-inside: avoid !important; break-inside: avoid !important; }
            @page { size: A4 portrait; margin: 10mm 12mm; }
          </style>
        </head>
        <body>
          <div class="contrato-container">${conteudoContrato}</div>
        </body>
      </html>
    `);

    janelaPrint.document.close();
    janelaPrint.focus();
    setTimeout(() => {
      janelaPrint.print();
      janelaPrint.close();
    }, 500);
  };

  const enviarWhatsAppContrato = (cliente: Cliente) => {
    const telefoneLimpo = cliente.whatsapp.replace(/\D/g, "");
    const texto = `Olá ${cliente.nome}!\n\nSegue o resumo do nosso Contrato Oficial de Prestação de Serviços da *Wezanc Technology* referente ao projeto *${cliente.pacote}* da empresa *${cliente.empresa}*.\n\n📄 *Resumo dos Termos Contratuais:*\n• Contratada: Wezanc Technology (Resp: Zenildo Pereira Cruz Neto)\n• Valor do Projeto: R$ ${cliente.valorPago.toLocaleString("pt-BR")}\n• Forma de Pagamento: ${cliente.formaPagamento}\n• Garantia Técnica de Código: 30 dias integrais pós-entrega\n\nPermanecemos à disposição!\n*Wezanc Technology*`;

    if (telefoneLimpo) {
      window.open(`https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(texto)}`, "_blank");
    }
  };

  const enviarWhatsAppMensagemAviso = (cliente: Cliente, novafase: string) => {
    const telefoneLimpo = cliente.whatsapp.replace(/\D/g, "");
    let texto = "";

    switch (novafase) {
      case "03_abordagem_outbound":
        texto = `Olá ${cliente.nome}, tudo bem?\n\nSomos da Wezanc Technology.\n\Analisamos o posicionamento digital da ${cliente.empresa} e identificamos algumas oportunidades para otimizar sua presença online.\n\nPara apresentar nosso trabalho de forma prática, desenvolvemos um protótipo inicial do projeto para a sua empresa. Estamos enviando em anexo um vídeo curto de demonstração exibindo como ficou a estrutura.\n\nCaso faça sentido para você, fico à disposição para alinharmos os detalhes de uma possível parceria.\n\nAtenciosamente,\nEquipe Wezanc Technology`;
        break;
      case "02_branding":
        texto = `Olá ${cliente.nome}. O projeto (${cliente.pacote} - ${cliente.empresa}) avançou para a fase de Branding e Identidade Visual. Estamos estruturando a comunicação da sua marca.`;
        break;
      case "03_desenvolvimento":
        texto = `Olá ${cliente.nome}. O projeto entrou na fase de Desenvolvimento de Código. Estamos construindo a estrutura do sistema.`;
        break;
      case "04_validacao":
        texto = `Olá ${cliente.nome}. O projeto avançou para a fase de Validação e Ajustes. Em breve enviaremos a prévia para sua análise.`;
        break;
      case "05_fechamento":
        texto = `Olá ${cliente.nome}. Projeto aprovado! Avançamos para a entrega oficial e publicação do sistema.`;
        break;
      case "06_em_garantia":
        texto = `Olá ${cliente.nome}. O projeto entrou oficialmente no período de 30 dias de garantia técnica contra bugs. Conte conosco para suporte!`;
        break;
      case "reoferta":
        texto = `Olá ${cliente.nome}, tudo bem?\n\nPassando para reativar nosso contato referente ao projeto da ${cliente.empresa}. Atualizamos nossas condições de desenvolvimento para o pacote ${cliente.pacote}. Podemos conversar a respeito?`;
        break;
      default:
        return;
    }

    if (texto && telefoneLimpo) {
      window.open(`https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(texto)}`, "_blank");
    }
  };

  const moverStatusInbound = (id: string, novoStatus: StatusPipelineInbound) => {
    const atualizados = clientes.map((c) => {
      if (c.id === id) {
        const dataInicioGarantia = novoStatus === "06_em_garantia" ? new Date().toISOString() : c.dataInicioGarantia;
        const clienteAtualizado = { ...c, statusInbound: novoStatus, dataInicioGarantia };
        enviarWhatsAppMensagemAviso(clienteAtualizado, novoStatus);
        return clienteAtualizado;
      }
      return c;
    });
    salvarClientes(atualizados);
  };

  const moverStatusOutbound = (id: string, novoStatus: StatusPipelineOutbound) => {
    const atualizados = clientes.map((c) => {
      if (c.id === id) {
        const dataInicioGarantia = novoStatus === "05_em_garantia" ? new Date().toISOString() : c.dataInicioGarantia;
        const clienteAtualizado = { ...c, statusOutbound: novoStatus, dataInicioGarantia };
        if (novoStatus === "03_abordagem") {
          enviarWhatsAppMensagemAviso(clienteAtualizado, "03_abordagem_outbound");
        }
        return clienteAtualizado;
      }
      return c;
    });
    salvarClientes(atualizados);
  };

  const reativarLead = (id: string) => {
    const atualizados = clientes.map((c) => {
      if (c.id === id) {
        return { ...c, statusInbound: "01_briefing" as StatusPipelineInbound, statusOutbound: "01_raio_x" as StatusPipelineOutbound };
      }
      return c;
    });
    salvarClientes(atualizados);
  };

  const marcarComoNaoFechou = (id: string) => {
    const motivo = prompt("Motivo aproximado de não ter fechado?") || "Não informado";
    const atualizados = clientes.map((c) => {
      if (c.id === id) {
        return { 
          ...c, 
          statusInbound: "07_nao_fechou" as StatusPipelineInbound, 
          statusOutbound: "06_nao_fechou" as StatusPipelineOutbound,
          motivoNaoFechou: motivo 
        };
      }
      return c;
    });
    salvarClientes(atualizados);
  };

  const eGarantiaExpirada = (c: Cliente) => {
    if (!c.dataInicioGarantia) return false;
    return calcularTempoRestanteGarantia(c.dataInicioGarantia).expirado;
  };

  const eClienteNaoFechou = (c: Cliente) => {
    return c.statusInbound === "07_nao_fechou" || c.statusOutbound === "06_nao_fechou";
  };

  const estaEmGarantiaOuConcluido = (c: Cliente) => {
    if (eGarantiaExpirada(c)) return true;
    if (c.origem === "Inbound (Instagram / Leads)") {
      return c.statusInbound === "06_em_garantia" || c.statusInbound === "08_concluido";
    } else {
      return c.statusOutbound === "05_em_garantia" || c.statusOutbound === "07_concluido";
    }
  };

  const getEtapaFormatada = (c: Cliente) => {
    if (eClienteNaoFechou(c)) return "Não Fechou (Lista Futura)";
    if (c.origem === "Inbound (Instagram / Leads)") {
      if (c.statusInbound === "08_concluido" || eGarantiaExpirada(c)) return "Concluído (Base Fixa)";
      const col = COLUNAS_INBOUND.find(item => item.id === c.statusInbound);
      return col ? col.titulo : "Inbound";
    } else {
      if (c.statusOutbound === "07_concluido" || eGarantiaExpirada(c)) return "Concluído (Base Fixa)";
      const col = COLUNAS_OUTBOUND.find(item => item.id === c.statusOutbound);
      return col ? col.titulo : "Outbound";
    }
  };

  const abrirModalNovo = (defaultOrigem?: "Outbound (Prospecção Ativa)" | "Inbound (Instagram / Leads)") => {
    setClienteEmEdicao(null);
    setNome(""); setEmpresa(""); setWhatsapp(""); setDocumento("");
    setPacote("Site Institucional"); setFormaPagamento("Pix à vista"); setValorPago(1500); setMotivoNaoFechou("");
    setNotasAnotacoes(""); setTemPlanoManutencao(false); setValorPlanoManutencao(150); setDiaVencimentoManutencao(10);
    setOrigem(defaultOrigem || "Inbound (Instagram / Leads)");
    setModalCliente(true);
  };

  const abrirModalEditar = (c: Cliente) => {
    setClienteEmEdicao(c);
    setNome(c.nome);
    setEmpresa(c.empresa);
    setWhatsapp(c.whatsapp);
    setDocumento(c.documento || "");
    setPacote(c.pacote);
    setFormaPagamento(c.formaPagamento || "Pix à vista");
    setOrigem(c.origem || "Inbound (Instagram / Leads)");
    setValorPago(c.valorPago);
    setMotivoNaoFechou(c.motivoNaoFechou || "");
    setNotasAnotacoes(c.notasAnotacoes || "");
    setTemPlanoManutencao(c.temPlanoManutencao || false);
    setValorPlanoManutencao(c.valorPlanoManutencao !== undefined ? c.valorPlanoManutencao : 150);
    setDiaVencimentoManutencao(c.diaVencimentoManutencao !== undefined ? c.diaVencimentoManutencao : 10);
    setModalCliente(true);
  };

  const abrirModalPerfil = (c: Cliente) => {
    setModalPerfilCliente(c);
  };

  const handleSalvarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    const numerosWhats = whatsapp.replace(/\D/g, "");
    if (numerosWhats.length < 10) {
      alert("Por favor, digite um número de WhatsApp válido com DDD.");
      return;
    }

    const valTabela = getValorTabela(pacote);
    const valPago = Number(valorPago) || 0;
    const desconto = valTabela > valPago ? valTabela - valPago : 0;

    if (clienteEmEdicao) {
      const atualizados = clientes.map(c => {
        if (c.id === clienteEmEdicao.id) {
          return {
            ...c,
            nome, empresa, whatsapp, documento, pacote, formaPagamento, origem, motivoNaoFechou,
            notasAnotacoes, temPlanoManutencao, 
            valorPlanoManutencao: temPlanoManutencao ? Number(valorPlanoManutencao) || 0 : 0, 
            diaVencimentoManutencao: temPlanoManutencao ? Number(diaVencimentoManutencao) || 10 : 10,
            valorTabela: valTabela,
            valorPago: valPago,
            teveDesconto: desconto > 0,
            valorDesconto: desconto
          };
        }
        return c;
      });
      salvarClientes(atualizados);
    } else {
      const tarefasIniciais: TarefaTecnica[] = TAREFAS_PADRAO_TECNICA.map((t, idx) => ({
        id: `${Date.now()}_${idx}`,
        titulo: t,
        concluida: false
      }));

      const novo: Cliente = {
        id: Date.now().toString(),
        nome, empresa, whatsapp, documento, pacote, formaPagamento, origem, motivoNaoFechou,
        notasAnotacoes, temPlanoManutencao, 
        valorPlanoManutencao: temPlanoManutencao ? Number(valorPlanoManutencao) || 0 : 0, 
        diaVencimentoManutencao: temPlanoManutencao ? Number(diaVencimentoManutencao) || 10 : 10,
        valorTabela: valTabela,
        valorPago: valPago,
        teveDesconto: desconto > 0,
        valorDesconto: desconto,
        statusOutbound: "01_raio_x",
        statusInbound: "01_briefing",
        dataFechamento: new Date().toISOString().slice(0, 10),
        agenteResponsavel: "Wezanc Technology",
        tarefasTecnicas: tarefasIniciais
      };

      const novaTransacao: TransacaoFinanceira = {
        id: Date.now().toString() + "_t",
        descricao: `Projeto: ${nome} (${pacote})`,
        tipo: "Receita",
        valor: valPago,
        data: new Date().toISOString().slice(0, 10)
      };

      salvarClientes([...clientes, novo]);
      salvarTransacoes([...transacoes, novaTransacao]);
    }

    setModalCliente(false);
    setClienteEmEdicao(null);
  };

  const handleAddTransacao = (e: React.FormEvent) => {
    e.preventDefault();
    const nova: TransacaoFinanceira = {
      id: Date.now().toString(),
      descricao: descTrans,
      tipo: tipoTrans,
      valor: Number(valTrans) || 0,
      data: new Date().toISOString().slice(0, 10)
    };
    salvarTransacoes([...transacoes, nova]);
    setModalTransacao(false);
    setDescTrans(""); setValTrans("");
  };

  const clientesNaoFechados = clientes.filter(c => eClienteNaoFechou(c));
  const clientesManutencao = clientes.filter(c => c.temPlanoManutencao);
  const totalMRR = clientesManutencao.reduce((acc, c) => acc + (Number(c.valorPlanoManutencao) || 0), 0);
  const clientesAtivosEmProducao = clientes.filter(c => !eClienteNaoFechou(c) && !estaEmGarantiaOuConcluido(c));

  const clientesFiltradosBase = clientes.filter((c) => {
    const textoMatch = 
      c.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      c.empresa.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      (c.documento && c.documento.toLowerCase().includes(filtroTexto.toLowerCase()));

    const etapaAtual = getEtapaFormatada(c);
    const etapaMatch = filtroEtapa === "TODOS" || etapaAtual.includes(filtroEtapa);
    const expirada = eGarantiaExpirada(c);
    const garantiaMatch = filtroGarantia === "TODOS" || (filtroGarantia === "ATIVA" && !expirada && c.dataInicioGarantia) || (filtroGarantia === "CONCLUIDA" && expirada);
    const pacoteMatch = filtroPacote === "TODOS" || c.pacote === filtroPacote;

    return textoMatch && etapaMatch && garantiaMatch && pacoteMatch;
  });

  const limparFiltros = () => {
    setFiltroTexto(""); setFiltroEtapa("TODOS"); setFiltroGarantia("TODOS"); setFiltroPacote("TODOS");
  };

  const clientesEmGarantiaAlerta = clientes.filter(c => 
    (c.statusOutbound === "05_em_garantia" || c.statusInbound === "06_em_garantia") && 
    calcularTempoRestanteGarantia(c.dataInicioGarantia).dias <= 5 && !eGarantiaExpirada(c)
  );

  const filtrarPorData = (dataStr: string) => {
    if (!dataStr) return true;
    const dataObj = dataStr.includes("/") ? dataStr.split("/").reverse().join("-") : dataStr.slice(0, 10);
    if (filtroDataInicio && dataObj < filtroDataInicio) return false;
    if (filtroDataFim && dataObj > filtroDataFim) return false;
    return true;
  };

  const clientesFinanceiroFiltrados = clientes.filter(c => {
    if (eClienteNaoFechou(c)) return false;
    const dataCliente = c.dataFechamento ? c.dataFechamento.slice(0, 10) : "";
    if (!filtrarPorData(dataCliente)) return false;
    if (filtroTipoServico === "MANUTENCAO_MRR") return false;
    if (filtroTipoServico === "INBOUND" && c.origem !== "Inbound (Instagram / Leads)") return false;
    if (filtroTipoServico === "OUTBOUND" && c.origem !== "Outbound (Prospecção Ativa)") return false;
    if (filtroTipoServico === "Landing Page Express" && c.pacote !== "Landing Page Express") return false;
    if (filtroTipoServico === "Site Institucional" && c.pacote !== "Site Institucional") return false;
    if (filtroTipoServico === "E-commerce" && c.pacote !== "E-commerce") return false;
    return true;
  });

  const totalReceitasProjetosFiltradas = clientesFinanceiroFiltrados.reduce((acc, c) => acc + c.valorPago, 0);
  const totalMRRFiltrado = (filtroTipoServico === "TODOS" || filtroTipoServico === "MANUTENCAO_MRR") ? totalMRR : 0;
  const totalReceitasBrutasFiltradas = (filtroTipoServico === "MANUTENCAO_MRR" ? 0 : totalReceitasProjetosFiltradas) + totalMRRFiltrado;

  const transacoesFiltradas = transacoes.filter(t => {
    if (filtroTipoServico === "MANUTENCAO_MRR") return false;
    return filtrarPorData(t.data);
  });

  const totalDespesasFiltradas = transacoesFiltradas.filter(t => t.tipo === "Despesa / IA").reduce((acc, t) => acc + t.valor, 0);
  const lucroLiquidoFiltrado = totalReceitasBrutasFiltradas - totalDespesasFiltradas;
  const margemLucroFiltrada = totalReceitasBrutasFiltradas > 0 ? Math.round((lucroLiquidoFiltrado / totalReceitasBrutasFiltradas) * 100) : 0;

  const maxGrafico = Math.max(totalReceitasBrutasFiltradas, totalDespesasFiltradas, 1);
  const larguraReceita = Math.round((totalReceitasBrutasFiltradas / maxGrafico) * 100);
  const larguraDespesa = Math.round((totalDespesasFiltradas / maxGrafico) * 100);

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 font-sans antialiased flex selection:bg-cyan-500 selection:text-slate-950 touch-manipulation">

      {/* SIDEBAR */}
      <aside className="w-64 lg:w-72 bg-[#060913] border-r border-slate-800/80 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-40 shrink-0 pointer-events-auto shadow-2xl">
        <div>
          <div className="p-5 border-b border-slate-800/60 flex items-center gap-3 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent">
            {/* LOGO W */}
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center">
                <span className="text-cyan-400 font-black font-mono text-lg tracking-tighter">W</span>
              </div>
            </div>
            <div>
              <h1 className="text-base font-black tracking-wider text-white font-mono flex items-center gap-1">
                WEZANC<span className="text-cyan-400">-OS</span>
              </h1>
              <span className="text-[9px] text-cyan-400/80 block font-mono font-bold tracking-widest uppercase">v34.0 iPad App Ready</span>
            </div>
          </div>

          <nav className="p-3.5 space-y-4 pointer-events-auto">
            <div>
              <span className="px-3 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-300 block mb-1.5">Comercial & Pipelines</span>
              <div className="space-y-1">
                <button onClick={() => setMenuAtivo("inbound")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${menuAtivo === "inbound" ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <Share2 className="w-4 h-4 text-pink-400" /> Inbound (Instagram)
                </button>
                <button onClick={() => setMenuAtivo("kanban")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${menuAtivo === "kanban" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" /> Outbound (Ativo)
                </button>
                <button onClick={() => setMenuAtivo("naofechados")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${menuAtivo === "naofechados" ? "bg-gradient-to-r from-rose-500 to-orange-600 text-white shadow-md shadow-rose-500/20 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <UserX className="w-4 h-4 text-rose-400" /> Não Fechados ({clientesNaoFechados.length})
                </button>
              </div>
            </div>

            <div>
              <span className="px-3 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-300 block mb-1.5">Operações & Gestão</span>
              <div className="space-y-1">
                <button onClick={() => setMenuAtivo("tarefas")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${menuAtivo === "tarefas" ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <CheckSquare className="w-4 h-4 text-indigo-400" /> Sprints & Tarefas ({clientesAtivosEmProducao.length})
                </button>
                <button onClick={() => setMenuAtivo("manutencao")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${menuAtivo === "manutencao" ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <Repeat className="w-4 h-4 text-emerald-400" /> Manutenção MRR ({clientesManutencao.length})
                </button>
                <button onClick={() => setMenuAtivo("clientes")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${menuAtivo === "clientes" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <Users className="w-4 h-4 text-emerald-400" /> Base 360° Clientes
                </button>
                <button onClick={() => setMenuAtivo("financeiro")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${menuAtivo === "financeiro" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <BarChart3 className="w-4 h-4 text-amber-400" /> Financeiro & MRR
                </button>
              </div>
            </div>

            <div>
              <span className="px-3 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-300 block mb-1.5">Inteligência Artificial</span>
              <div className="space-y-1">
                <button onClick={() => setMenuAtivo("agentes")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${menuAtivo === "agentes" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <Bot className="w-4 h-4 text-indigo-400" /> Agentes de IA
                </button>
              </div>
            </div>
          </nav>
        </div>

        <div className="p-3.5 border-t border-slate-800/80 m-3 bg-[#04070F] rounded-2xl border border-cyan-500/15 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono tracking-wider">iPadOS App Pronto</span>
          </div>
          <div className="flex gap-1.5 pt-1">
            <button onClick={exportarBackupJSON} title="Baixar Backup" className="w-1/2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-mono py-1.5 rounded-lg flex items-center justify-center gap-1 border border-slate-700 cursor-pointer">
              <Download className="w-3 h-3" /> Exportar
            </button>
            <label title="Restaurar Backup" className="w-1/2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-mono py-1.5 rounded-lg flex items-center justify-center gap-1 border border-slate-700 cursor-pointer">
              <Upload className="w-3 h-3" /> Importar
              <input type="file" accept=".json" onChange={importarBackupJSON} className="hidden" />
            </label>
          </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 w-full min-w-0 bg-[#030712] relative z-10 flex flex-col pointer-events-auto">
        <header className="sticky top-0 z-30 bg-[#030712] border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg pointer-events-auto">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono font-bold uppercase">
              {menuAtivo === "financeiro" ? "Painel Financeiro & MRR" : "Wezanc Operations"}
            </span>
            <h2 className="text-lg font-black text-white capitalize mt-0.5 tracking-tight">
              {menuAtivo === "inbound" && "Pipeline Inbound (Instagram / Leads)"}
              {menuAtivo === "kanban" && "Pipeline Outbound (Prospecção Ativa)"}
              {menuAtivo === "tarefas" && "Check-list de Produção & Tarefas Técnicas"}
              {menuAtivo === "manutencao" && "Gestão de Planos de Manutenção Mensal (MRR)"}
              {menuAtivo === "naofechados" && "Leads Não Fechados (Futuros Recontatos)"}
              {menuAtivo === "agentes" && "Central de Agentes de IA"}
              {menuAtivo === "clientes" && "Base Completa 360° & Contratos"}
              {menuAtivo === "financeiro" && "Painel Financeiro, MRR & Relatório Executivo"}
            </h2>
          </div>

          <div className="flex md:hidden overflow-x-auto w-full gap-2 pb-2 pointer-events-auto">
            <button onClick={() => setMenuAtivo("inbound")} className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${menuAtivo === "inbound" ? "bg-pink-500 text-white" : "bg-slate-800 text-slate-300"}`}>Inbound</button>
            <button onClick={() => setMenuAtivo("kanban")} className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${menuAtivo === "kanban" ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}>Outbound</button>
            <button onClick={() => setMenuAtivo("tarefas")} className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${menuAtivo === "tarefas" ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-300"}`}>Tarefas</button>
            <button onClick={() => setMenuAtivo("manutencao")} className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${menuAtivo === "manutencao" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}>Manutenção</button>
            <button onClick={() => setMenuAtivo("naofechados")} className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${menuAtivo === "naofechados" ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-300"}`}>Não Fechados</button>
            <button onClick={() => setMenuAtivo("agentes")} className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${menuAtivo === "agentes" ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-300"}`}>Agentes</button>
            <button onClick={() => setMenuAtivo("clientes")} className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${menuAtivo === "clientes" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}>Base 360°</button>
            <button onClick={() => setMenuAtivo("financeiro")} className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${menuAtivo === "financeiro" ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}>Financeiro</button>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            <button 
              onClick={() => abrirModalNovo(menuAtivo === "inbound" ? "Inbound (Instagram / Leads)" : "Outbound (Prospecção Ativa)")} 
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Novo Cliente
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6 pointer-events-auto">
          
          {clientesEmGarantiaAlerta.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-xs text-slate-300">
                  Garantia vencendo para: <strong className="text-white">{clientesEmGarantiaAlerta.map(c => c.nome).join(", ")}</strong>
                </p>
              </div>
            </div>
          )}

          {/* ABA 1: INBOUND */}
          {menuAtivo === "inbound" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-pink-400" /> Pipeline Inbound (Instagram)
                  </h3>
                  <p className="text-[11px] text-slate-400">Notificações corporativas Wezanc ativas ao mover cada fase</p>
                </div>
                <button onClick={() => abrirModalNovo("Inbound (Instagram / Leads)")} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black px-4 py-2 rounded-xl text-xs cursor-pointer active:scale-95 shadow-md shadow-pink-500/20">
                  + Novo Lead Instagram
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {COLUNAS_INBOUND.map((coluna) => {
                  const clientesInboundColuna = clientes.filter(
                    (c) => c.origem === "Inbound (Instagram / Leads)" && 
                    c.statusInbound === coluna.id && 
                    !eGarantiaExpirada(c) &&
                    !eClienteNaoFechou(c) &&
                    (c.nome.toLowerCase().includes(filtroTexto.toLowerCase()) || c.empresa.toLowerCase().includes(filtroTexto.toLowerCase()))
                  );

                  return (
                    <div key={coluna.id} className="flex flex-col bg-[#080C19] border border-slate-800 rounded-2xl p-3 shadow-xl min-w-0">
                      <div className={`p-2.5 rounded-xl border ${coluna.tagCor} mb-3 flex items-center justify-between shadow-sm`}>
                        <h3 className="font-black text-[11px] uppercase tracking-wider truncate">{coluna.titulo}</h3>
                        <span className="bg-[#030712] px-2 py-0.5 rounded-lg text-[10px] font-mono font-black text-white border border-slate-700">
                          {clientesInboundColuna.length}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2.5 flex-1">
                        {clientesInboundColuna.map((cliente) => {
                          const infoGarantia = calcularTempoRestanteGarantia(cliente.dataInicioGarantia);

                          return (
                            <div key={cliente.id} className="bg-[#0D1326] border border-slate-800 p-3 rounded-xl shadow-md relative group hover:border-slate-700 transition-all pointer-events-auto">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-pink-500/15 text-pink-400 border border-pink-500/30 uppercase font-mono truncate">
                                  {cliente.pacote}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button onClick={() => abrirModalPerfil(cliente)} title="Ver Perfil" className="text-slate-400 hover:text-cyan-400 p-1 cursor-pointer"><User className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => abrirModalEditar(cliente)} className="text-slate-400 hover:text-cyan-400 p-1 cursor-pointer"><Edit3 className="w-3 h-3" /></button>
                                  <button onClick={() => marcarComoNaoFechou(cliente.id)} title="Não Fechou" className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"><UserX className="w-3 h-3" /></button>
                                  <button onClick={() => { if(confirm("Excluir lead?")) salvarClientes(clientes.filter(c => c.id !== cliente.id)); }} className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              </div>

                              <h4 className="font-extrabold text-xs text-slate-100 truncate">{cliente.nome}</h4>
                              <p className="text-[10px] text-slate-400 font-medium truncate">{cliente.empresa}</p>

                              <div className="mt-2 bg-[#040711] border border-slate-800 p-2 rounded-lg flex items-center justify-between font-mono">
                                <strong className="text-emerald-400 text-xs font-black">R$ {cliente.valorPago}</strong>
                                <span className="text-[9px] text-amber-400 font-bold">{cliente.formaPagamento}</span>
                              </div>

                              {cliente.statusInbound === "06_em_garantia" && (
                                <div className="mt-2 bg-gradient-to-r from-emerald-500/15 to-emerald-950/30 border border-emerald-500/40 p-2 rounded-lg space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-emerald-400" /> Garantia Ativa
                                    </span>
                                    <span className="text-[10px] font-mono font-black text-white bg-emerald-500/30 px-1.5 py-0.5 rounded border border-emerald-500/50">
                                      {infoGarantia.texto}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {cliente.temPlanoManutencao && (
                                <div className="mt-2 bg-gradient-to-r from-cyan-950/40 to-blue-950/30 border border-cyan-500/30 p-2 rounded-lg flex items-center justify-between">
                                  <div>
                                    <span className="text-[9px] font-mono text-cyan-400 font-bold block">Plano Mensal (Dia {cliente.diaVencimentoManutencao})</span>
                                    <strong className="text-[10px] font-mono text-white">R$ {cliente.valorPlanoManutencao}/mês</strong>
                                  </div>
                                  <button onClick={() => enviarCobrancaManutencaoWhatsApp(cliente)} className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 p-1.5 rounded-lg flex items-center gap-1 text-[9px] font-bold cursor-pointer">
                                    <DollarSign className="w-3 h-3 text-emerald-400" /> Cobrar
                                  </button>
                                </div>
                              )}

                              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-center gap-3">
                                <button onClick={() => abrirModalPerfil(cliente)} className="text-[10px] text-slate-300 hover:text-white font-bold cursor-pointer flex items-center gap-1">
                                  <NotebookPen className="w-3 h-3 text-cyan-400" /> Perfil / Notas
                                </button>
                                <button onClick={() => setModalContrato(cliente)} className="text-[10px] text-cyan-400 hover:underline font-bold cursor-pointer flex items-center gap-1">
                                  <FileText className="w-3 h-3" /> Contrato PDF
                                </button>
                              </div>

                              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                                <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">Avançar:</span>
                                <div className="flex items-center gap-1">
                                  {COLUNAS_INBOUND.map((col) => (
                                    <button key={col.id} onClick={() => moverStatusInbound(cliente.id, col.id)} title={col.titulo} className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all ${cliente.statusInbound === col.id ? "bg-pink-400 ring-2 ring-pink-400/30 scale-110" : "bg-slate-700 hover:bg-slate-500"}`} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 2: OUTBOUND */}
          {menuAtivo === "kanban" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-cyan-400" /> Pipeline Outbound (Prospecção Ativa)
                  </h3>
                  <p className="text-[11px] text-slate-400">Mensagens corporativas configuradas para envio de protótipo</p>
                </div>
                <button onClick={() => abrirModalNovo("Outbound (Prospecção Ativa)")} className="bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs cursor-pointer active:scale-95 shadow-md shadow-cyan-500/20">
                  + Novo Lead Outbound
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {COLUNAS_OUTBOUND.map((coluna) => {
                  const clientesColuna = clientes.filter(
                    (c) => c.origem !== "Inbound (Instagram / Leads)" && 
                    c.statusOutbound === coluna.id && 
                    !eGarantiaExpirada(c) &&
                    !eClienteNaoFechou(c) &&
                    (c.nome.toLowerCase().includes(filtroTexto.toLowerCase()) || c.empresa.toLowerCase().includes(filtroTexto.toLowerCase()))
                  );

                  return (
                    <div key={coluna.id} className="flex flex-col bg-[#080C19] border border-slate-800 rounded-2xl p-3 shadow-xl min-w-0">
                      <div className={`p-2.5 rounded-xl border ${coluna.tagCor} mb-3 flex items-center justify-between shadow-sm`}>
                        <h3 className="font-black text-[11px] uppercase tracking-wider truncate">{coluna.titulo}</h3>
                        <span className="bg-[#030712] px-2 py-0.5 rounded-lg text-[10px] font-mono font-black text-white border border-slate-700">
                          {clientesColuna.length}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2.5 flex-1">
                        {clientesColuna.map((cliente) => {
                          const infoGarantia = calcularTempoRestanteGarantia(cliente.dataInicioGarantia);

                          return (
                            <div key={cliente.id} className="bg-[#0D1326] border border-slate-800 p-3 rounded-xl shadow-md relative group hover:border-slate-700 transition-all pointer-events-auto">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-extrabold text-xs text-slate-100 truncate">{cliente.nome}</h4>
                                <div className="flex items-center gap-1">
                                  <button onClick={() => abrirModalPerfil(cliente)} title="Ver Perfil" className="text-slate-400 hover:text-cyan-400 p-1 cursor-pointer"><User className="w-3.5 h-3.5" /></button>
                                  <button onClick={() => abrirModalEditar(cliente)} className="text-slate-400 hover:text-cyan-400 p-1 cursor-pointer"><Edit3 className="w-3 h-3" /></button>
                                  <button onClick={() => marcarComoNaoFechou(cliente.id)} title="Não Fechou" className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"><UserX className="w-3 h-3" /></button>
                                  <button onClick={() => { if(confirm("Excluir?")) salvarClientes(clientes.filter(c => c.id !== cliente.id)); }} className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium truncate">{cliente.empresa}</p>

                              <div className="mt-2 bg-[#040711] border border-slate-800 p-2 rounded-lg flex items-center justify-between font-mono">
                                <strong className="text-emerald-400 text-xs font-black">R$ {cliente.valorPago}</strong>
                                <span className="text-[9px] text-cyan-400 font-bold">{cliente.formaPagamento}</span>
                              </div>

                              {cliente.statusOutbound === "03_abordagem" && (
                                <button onClick={() => enviarWhatsAppMensagemAviso(cliente, "03_abordagem_outbound")} className="mt-2 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black p-2 rounded-lg text-[10px] flex items-center justify-center gap-1.5 shadow-md hover:from-purple-400 cursor-pointer active:scale-95">
                                  <Send className="w-3 h-3" /> Enviar Abordagem com Vídeo
                                </button>
                              )}

                              {cliente.statusOutbound === "05_em_garantia" && (
                                <div className="mt-2 bg-gradient-to-r from-emerald-500/15 to-emerald-950/30 border border-emerald-500/40 p-2 rounded-lg space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-emerald-400" /> Garantia Ativa
                                    </span>
                                    <span className="text-[10px] font-mono font-black text-white bg-emerald-500/30 px-1.5 py-0.5 rounded border border-emerald-500/50">
                                      {infoGarantia.texto}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {cliente.temPlanoManutencao && (
                                <div className="mt-2 bg-gradient-to-r from-cyan-950/40 to-blue-950/30 border border-cyan-500/30 p-2 rounded-lg flex items-center justify-between">
                                  <div>
                                    <span className="text-[9px] font-mono text-cyan-400 font-bold block">Plano Mensal (Dia {cliente.diaVencimentoManutencao})</span>
                                    <strong className="text-[10px] font-mono text-white">R$ {cliente.valorPlanoManutencao}/mês</strong>
                                  </div>
                                  <button onClick={() => enviarCobrancaManutencaoWhatsApp(cliente)} className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 p-1.5 rounded-lg flex items-center gap-1 text-[9px] font-bold cursor-pointer">
                                    <DollarSign className="w-3 h-3 text-emerald-400" /> Cobrar
                                  </button>
                                </div>
                              )}

                              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-center gap-3">
                                <button onClick={() => abrirModalPerfil(cliente)} className="text-[10px] text-slate-300 hover:text-white font-bold cursor-pointer flex items-center gap-1">
                                  <NotebookPen className="w-3 h-3 text-cyan-400" /> Perfil / Notas
                                </button>
                                <button onClick={() => setModalContrato(cliente)} className="text-[10px] text-cyan-400 hover:underline font-bold cursor-pointer flex items-center gap-1">
                                  <FileText className="w-3 h-3" /> Contrato PDF
                                </button>
                              </div>

                              <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                                <span className="text-[9px] text-slate-500 uppercase font-mono font-bold">Mover:</span>
                                <div className="flex items-center gap-1">
                                  {COLUNAS_OUTBOUND.map((col) => (
                                    <button key={col.id} onClick={() => moverStatusOutbound(cliente.id, col.id)} title={col.titulo} className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all ${cliente.statusOutbound === col.id ? "bg-cyan-400 ring-2 ring-cyan-400/30 scale-110" : "bg-slate-700 hover:bg-slate-500"}`} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 3: TAREFAS */}
          {menuAtivo === "tarefas" && (
            <div className="max-w-7xl mx-auto space-y-6 pointer-events-auto">
              <div className="bg-gradient-to-r from-indigo-500/15 via-blue-500/5 to-transparent border border-indigo-500/30 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-indigo-400" /> Sprints Ativos em Desenvolvimento ({clientesAtivosEmProducao.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Projetos em garantia ou concluídos saem automaticamente desta lista.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {clientesAtivosEmProducao.map((cliente) => {
                  const tarefas = cliente.tarefasTecnicas || [];
                  const concluidas = tarefas.filter(t => t.concluida).length;
                  const progresso = tarefas.length > 0 ? Math.round((concluidas / tarefas.length) * 100) : 0;

                  return (
                    <div key={cliente.id} className="bg-[#080C19] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            {cliente.pacote}
                          </span>
                          <span className="text-[11px] font-mono font-black text-cyan-400">{progresso}% Concluído</span>
                        </div>

                        <h4 className="font-extrabold text-sm text-white">{cliente.nome}</h4>
                        <p className="text-xs text-slate-400 mb-3">{cliente.empresa}</p>

                        <div className="w-full bg-[#030712] rounded-full h-2 mb-4 border border-slate-800 overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-500" style={{ width: `${progresso}%` }} />
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {tarefas.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => alternarTarefaCliente(cliente.id, t.id)}
                              className={`w-full text-left p-2 rounded-xl text-xs flex items-center gap-2.5 transition-all cursor-pointer border ${t.concluida ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300 line-through opacity-80" : "bg-[#030712] border-slate-800/80 text-slate-300 hover:border-slate-700"}`}
                            >
                              {t.concluida ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-500 shrink-0" />}
                              <span className="leading-tight">{t.titulo}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-mono">{concluidas} de {tarefas.length} tarefas</span>
                        <button onClick={() => abrirModalPerfil(cliente)} className="text-cyan-400 hover:underline font-bold cursor-pointer">Ver Perfil →</button>
                      </div>
                    </div>
                  );
                })}
                {clientesAtivosEmProducao.length === 0 && (
                  <div className="col-span-full py-16 text-center text-slate-500 font-mono text-xs bg-[#080C19] border border-slate-800 rounded-2xl">
                    Nenhum projeto em desenvolvimento ativo no momento.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ABA 4: MANUTENÇÃO MRR */}
          {menuAtivo === "manutencao" && (
            <div className="max-w-7xl mx-auto space-y-6 pointer-events-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[#080C19] border border-emerald-500/30 p-5 rounded-2xl shadow-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Faturamento Recorrente Mensal (MRR)</span>
                  <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1">R$ {totalMRR.toLocaleString("pt-BR")}/mês</h3>
                </div>
                <div className="bg-[#080C19] border border-cyan-500/30 p-5 rounded-2xl shadow-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total de Assinantes Ativos</span>
                  <h3 className="text-2xl font-black text-cyan-400 font-mono mt-1">{clientesManutencao.length} Clientes</h3>
                </div>
                <div className="bg-[#080C19] border border-amber-500/30 p-5 rounded-2xl shadow-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Ticket Médio Recorrente</span>
                  <h3 className="text-2xl font-black text-amber-400 font-mono mt-1">
                    R$ {clientesManutencao.length > 0 ? Math.round(totalMRR / clientesManutencao.length) : 0}/mês
                  </h3>
                </div>
              </div>

              <div className="bg-[#080C19] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Repeat className="w-5 h-5 text-emerald-400" /> Clientes do Plano de Manutenção Preventiva
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Envie a cobrança mensal via WhatsApp com 1 clique</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="pb-3">Cliente / Empresa</th>
                        <th className="pb-3">Contato WhatsApp</th>
                        <th className="pb-3">Dia de Vencimento</th>
                        <th className="pb-3">Mensalidade</th>
                        <th className="pb-3 text-right">Ação de Cobrança</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {clientesManutencao.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-800/30">
                          <td className="py-3">
                            <strong className="text-white block font-bold text-xs">{c.nome}</strong>
                            <span className="text-slate-400 text-[10px] font-mono">{c.empresa} • {c.pacote}</span>
                          </td>
                          <td className="py-3 font-mono text-cyan-400 font-bold">{c.whatsapp}</td>
                          <td className="py-3">
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-1 rounded font-mono font-bold text-[10px]">
                              Todo dia {c.diaVencimentoManutencao}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-emerald-400 font-black text-sm">
                            R$ {c.valorPlanoManutencao}/mês
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => abrirModalPerfil(c)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer">Perfil</button>
                            <button onClick={() => enviarCobrancaManutencaoWhatsApp(c)} className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-[10px] font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Cobrar no WhatsApp
                            </button>
                          </td>
                        </tr>
                      ))}
                      {clientesManutencao.length === 0 && (
                        <tr><td colSpan={5} className="py-12 text-center text-slate-500 font-mono">Nenhum cliente com plano de manutenção ativo.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ABA 5: NÃO FECHADOS */}
          {menuAtivo === "naofechados" && (
            <div className="max-w-7xl mx-auto space-y-5 pointer-events-auto">
              <div className="bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-500/30 p-6 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <UserX className="w-5 h-5 text-rose-400" /> Lista de Leads Não Fechados ({clientesNaoFechados.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Mantenha contato para reativar estas vendas no futuro.</p>
                </div>
              </div>

              <div className="bg-[#080C19] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="pb-3">Cliente / Empresa</th>
                      <th className="pb-3">Contato WhatsApp</th>
                      <th className="pb-3">Serviço Pretendido</th>
                      <th className="pb-3">Motivo Registrado</th>
                      <th className="pb-3">Valor Cotado</th>
                      <th className="pb-3 text-right">Reativação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {clientesNaoFechados.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/30">
                        <td className="py-3">
                          <strong className="text-white block font-bold text-xs">{c.nome}</strong>
                          <span className="text-slate-400 text-[10px] font-mono">{c.empresa}</span>
                        </td>
                        <td className="py-3 font-mono text-cyan-400 font-bold">{c.whatsapp}</td>
                        <td className="py-3 text-pink-400 font-bold">{c.pacote}</td>
                        <td className="py-3 text-slate-300 italic">{c.motivoNaoFechou || "Não informado"}</td>
                        <td className="py-3 font-mono text-emerald-400 font-black">R$ {c.valorPago}</td>
                        <td className="py-3 text-right space-x-2">
                          <button onClick={() => enviarWhatsAppMensagemAviso(c, "reoferta")} className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 hover:bg-emerald-500/30 cursor-pointer">
                            <Send className="w-3 h-3" /> Reoferta
                          </button>
                          <button onClick={() => reativarLead(c.id)} className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 hover:bg-cyan-500/30 cursor-pointer">
                            <RefreshCw className="w-3 h-3" /> Reativar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {clientesNaoFechados.length === 0 && (
                      <tr><td colSpan={6} className="py-12 text-center text-slate-500 font-mono">Nenhum lead não fechado registrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA 6: AGENTES */}
          {menuAtivo === "agentes" && (
            <div className="max-w-6xl mx-auto space-y-5 pointer-events-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">Equipe & Agentes de IA Wezanc</h3>
                  <p className="text-xs text-slate-400">Toque em qualquer agente para iniciar atendimento</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {AGENTES_IA.map((agente, idx) => (
                  <div key={idx} className="bg-[#080C19] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xl hover:border-cyan-500/40 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[9px] uppercase font-black px-2.5 py-1 rounded-md border ${agente.cor} font-mono`}>
                          {agente.cargo}
                        </span>
                        <Bot className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h4 className="font-black text-base text-white mb-1.5">{agente.nome}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{agente.descricao}</p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-slate-800">
                      <a href={agente.link} target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-transform">
                        Abrir Chat do Agente <ExternalLink className="w-3.5 h-3.5 stroke-[3]" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 7: CLIENTES 360° */}
          {menuAtivo === "clientes" && (
            <div className="max-w-7xl mx-auto space-y-5 pointer-events-auto">
              <div className="bg-[#080C19] border border-slate-800 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">
                    <Filter className="w-4 h-4" /> Filtros Avançados
                  </div>
                  {(filtroTexto || filtroEtapa !== "TODOS" || filtroGarantia !== "TODOS" || filtroPacote !== "TODOS") && (
                    <button onClick={limparFiltros} className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-bold cursor-pointer">
                      <X className="w-3.5 h-3.5" /> Limpar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Nome ou CPF/CNPJ</label>
                    <input type="text" placeholder="Buscar..." value={filtroTexto} onChange={e => setFiltroTexto(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Etapa Atual</label>
                    <select value={filtroEtapa} onChange={e => setFiltroEtapa(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-cyan-500">
                      <option value="TODOS">Todas as Etapas</option>
                      <option value="Briefing">01. Briefing</option>
                      <option value="Branding">02. Branding</option>
                      <option value="Desenvolvimento">03. Desenvolvimento</option>
                      <option value="Validação">04. Validação & Ajustes</option>
                      <option value="Fechamento">05. Fechamento</option>
                      <option value="Garantia">06. Garantia (30d)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Garantia</label>
                    <select value={filtroGarantia} onChange={e => setFiltroGarantia(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-cyan-500">
                      <option value="TODOS">Todos os Status</option>
                      <option value="ATIVA">Garantia Ativa</option>
                      <option value="CONCLUIDA">Garantia Concluída</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Pacote</label>
                    <select value={filtroPacote} onChange={e => setFiltroPacote(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-cyan-500">
                      <option value="TODOS">Todos os Pacotes</option>
                      <option value="Landing Page Express">Landing Page Express</option>
                      <option value="Site Institucional">Site Institucional</option>
                      <option value="E-commerce">E-commerce</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#080C19] border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="pb-3">Cliente / Empresa</th>
                      <th className="pb-3">Etapa Atual</th>
                      <th className="pb-3">Garantia</th>
                      <th className="pb-3">Plano Mensal</th>
                      <th className="pb-3">Pacote</th>
                      <th className="pb-3">Contrato</th>
                      <th className="pb-3">Valor</th>
                      <th className="pb-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {clientesFiltradosBase.map((c) => {
                      const infoGarantia = calcularTempoRestanteGarantia(c.dataInicioGarantia);
                      return (
                        <tr key={c.id} className="hover:bg-slate-800/30">
                          <td className="py-3">
                            <strong className="text-white block font-bold text-xs">{c.nome}</strong>
                            <span className="text-slate-400 text-[10px] font-mono">{c.empresa} • Doc: <strong className="text-cyan-400">{c.documento || "Sem doc"}</strong></span>
                          </td>
                          <td className="py-3 font-mono text-[11px] text-slate-300">{getEtapaFormatada(c)}</td>
                          <td className="py-3">
                            {infoGarantia.expirado ? <span className="text-slate-500 text-[10px] font-mono">Concluída</span> : <span className="text-emerald-400 font-bold font-mono text-[10px]">{infoGarantia.texto}</span>}
                          </td>
                          <td className="py-3 font-mono text-[10px]">
                            {c.temPlanoManutencao ? <span className="text-cyan-400 font-bold">R$ {c.valorPlanoManutencao}/mês (Dia {c.diaVencimentoManutencao})</span> : <span className="text-slate-500">Sem plano</span>}
                          </td>
                          <td className="py-3 text-pink-400 font-bold">{c.pacote}</td>
                          <td className="py-3">
                            <button onClick={() => setModalContrato(c)} className="text-cyan-400 hover:underline font-bold cursor-pointer flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> Ver Contrato</button>
                          </td>
                          <td className="py-3 font-mono text-emerald-400 font-black">R$ {c.valorPago}</td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => abrirModalPerfil(c)} className="text-cyan-400 hover:underline font-bold cursor-pointer">Perfil</button>
                            <button onClick={() => abrirModalEditar(c)} className="text-slate-300 hover:underline font-bold cursor-pointer">Editar</button>
                            <button onClick={() => { if(confirm("Excluir?")) salvarClientes(clientes.filter(item => item.id !== c.id)); }} className="text-slate-400 hover:text-red-400 font-bold cursor-pointer">Excluir</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA 8: FINANCEIRO */}
          {menuAtivo === "financeiro" && (
            <div className="max-w-6xl mx-auto space-y-6 pointer-events-auto">
              <div className="bg-[#080C19] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filtros Avançados do Painel Financeiro
                  </h3>
                  {(filtroDataInicio || filtroDataFim || filtroTipoServico !== "TODOS") && (
                    <button onClick={() => { setFiltroDataInicio(""); setFiltroDataFim(""); setFiltroTipoServico("TODOS"); }} className="text-xs text-rose-400 hover:underline font-bold cursor-pointer">
                      Limpar Filtros
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Data Início</label>
                    <input type="date" value={filtroDataInicio} onChange={e => setFiltroDataInicio(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500 font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Data Fim</label>
                    <input type="date" value={filtroDataFim} onChange={e => setFiltroDataFim(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500 font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Filtrar por Tipo de Serviço / Canal</label>
                    <select value={filtroTipoServico} onChange={e => setFiltroTipoServico(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-cyan-500">
                      <option value="TODOS">Todos os Serviços & Canais</option>
                      <option value="MANUTENCAO_MRR">Manutenção Recorrente (MRR)</option>
                      <option value="INBOUND">Inbound (Instagram)</option>
                      <option value="OUTBOUND">Outbound (Prospecção Ativa)</option>
                      <option value="Landing Page Express">Landing Page Express</option>
                      <option value="Site Institucional">Site Institucional</option>
                      <option value="E-commerce">E-commerce</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-[#080C19] border border-emerald-500/30 p-5 rounded-2xl shadow-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Faturamento Recorrente (MRR)</span>
                  <h3 className="text-2xl font-black text-emerald-400 font-mono">R$ {totalMRRFiltrado.toLocaleString("pt-BR")}</h3>
                  <span className="text-[10px] text-emerald-400/80 font-mono mt-1 block">{clientesManutencao.length} Assinantes Ativos</span>
                </div>
                <div className="bg-[#080C19] border border-cyan-500/30 p-5 rounded-2xl shadow-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Receita de Projetos</span>
                  <h3 className="text-2xl font-black text-cyan-400 font-mono">R$ {totalReceitasProjetosFiltradas.toLocaleString("pt-BR")}</h3>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">Conforme filtro aplicado</span>
                </div>
                <div className="bg-[#080C19] border border-indigo-500/30 p-5 rounded-2xl shadow-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Receita Bruta Total</span>
                  <h3 className="text-2xl font-black text-indigo-400 font-mono">R$ {totalReceitasBrutasFiltradas.toLocaleString("pt-BR")}</h3>
                  <span className="text-[10px] text-indigo-400/80 font-mono mt-1 block">Projetos + MRR</span>
                </div>
                <div className="bg-[#080C19] border border-rose-500/30 p-5 rounded-2xl shadow-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Despesas & IAs</span>
                  <h3 className="text-2xl font-black text-rose-400 font-mono">R$ {totalDespesasFiltradas.toLocaleString("pt-BR")}</h3>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">Ferramentas e custos</span>
                </div>
                <div className="bg-[#080C19] border border-amber-500/30 p-5 rounded-2xl shadow-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Lucro & Margem</span>
                  <h3 className="text-2xl font-black text-amber-400 font-mono">R$ {lucroLiquidoFiltrado.toLocaleString("pt-BR")}</h3>
                  <span className="text-[10px] text-amber-400/80 font-mono mt-1 block">Margem de {margemLucroFiltrada}%</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-500/15 via-blue-500/5 to-transparent border border-cyan-500/30 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <FileDown className="w-5 h-5 text-cyan-400" /> Relatório Financeiro Executivo PDF
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Gere e baixe um relatório gerencial completo com o demonstrativo de MRR e entradas filtradas.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => setModalTransacao(true)} className="flex-1 sm:flex-none bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer border border-slate-700">+ Despesa / IA</button>
                  <button onClick={baixarRelatorioFinanceiroPDF} className="flex-1 sm:flex-none bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg shadow-cyan-500/20">
                    <FileDown className="w-4 h-4 stroke-[3]" /> Baixar Relatório PDF
                  </button>
                </div>
              </div>

              <div className="bg-[#080C19] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" /> Comparativo de Fluxo de Caixa (Filtrado)
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono font-bold">
                      <span className="text-slate-400">Receitas Brutas</span>
                      <span className="text-emerald-400">R$ {totalReceitasBrutasFiltradas.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="w-full bg-[#030712] rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700" style={{ width: `${larguraReceita}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-mono font-bold">
                      <span className="text-slate-400">Despesas & IAs</span>
                      <span className="text-rose-400">R$ {totalDespesasFiltradas.toLocaleString("pt-BR")}</span>
                    </div>
                    <div className="w-full bg-[#030712] rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
                      <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full transition-all duration-700" style={{ width: `${larguraDespesa}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden">
                <div ref={relatorioFinanceiroRef} style={{ padding: '20px', fontFamily: 'Inter, sans-serif', color: '#0f172a', background: '#ffffff' }}>
                  <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '15px', marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '16pt', fontWeight: 800, margin: '0 0 4px 0', textTransform: 'uppercase' }}>WEZANC TECHNOLOGY</h1>
                    <p style={{ fontSize: '10pt', fontWeight: 600, color: '#334155', margin: '0' }}>Relatório Financeiro Executivo & Faturamento Recorrente (MRR)</p>
                    <p style={{ fontSize: '8.5pt', color: '#64748b', margin: '4px 0 0 0' }}>Período: {filtroDataInicio || "Início"} até {filtroDataFim || "Hoje"} • Filtro: {filtroTipoServico}</p>
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '25%', padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                          <span style={{ fontSize: '8pt', color: '#64748b', display: 'block' }}>MRR MENSAL</span>
                          <strong style={{ fontSize: '12pt', color: '#047857' }}>R$ {totalMRRFiltrado}</strong>
                        </td>
                        <td style={{ width: '25%', padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                          <span style={{ fontSize: '8pt', color: '#64748b', display: 'block' }}>RECEITA PROJETOS</span>
                          <strong style={{ fontSize: '12pt', color: '#0284c7' }}>R$ {totalReceitasProjetosFiltradas}</strong>
                        </td>
                        <td style={{ width: '25%', padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                          <span style={{ fontSize: '8pt', color: '#64748b', display: 'block' }}>TOTAL BRUTO</span>
                          <strong style={{ fontSize: '12pt', color: '#4f46e5' }}>R$ {totalReceitasBrutasFiltradas}</strong>
                        </td>
                        <td style={{ width: '25%', padding: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', textAlign: 'center' }}>
                          <span style={{ fontSize: '8pt', color: '#64748b', display: 'block' }}>LUCRO LÍQUIDO</span>
                          <strong style={{ fontSize: '12pt', color: '#d97706' }}>R$ {lucroLiquidoFiltrado}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 style={{ fontSize: '11pt', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px', marginTop: '20px' }}>Detalhamento de Assinantes MRR</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '9pt' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Cliente / Empresa</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Contato</th>
                        <th style={{ padding: '8px', textAlign: 'center' }}>Vencimento</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Valor Mensal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesManutencao.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px' }}><strong>{c.nome}</strong> ({c.empresa})</td>
                          <td style={{ padding: '8px' }}>{c.whatsapp}</td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>Dia {c.diaVencimentoManutencao}</td>
                          <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {c.valorPlanoManutencao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL CLIENTE */}
      {modalCliente && (
        <div className="fixed inset-0 bg-[#030712]/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 pointer-events-auto">
          <div className="bg-[#080C19] border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative z-50 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-white mb-5">{clienteEmEdicao ? "Editar Cliente & Plano de Manutenção" : "Cadastrar Novo Cliente"}</h3>
            <form onSubmit={handleSalvarCliente} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Origem do Lead</label>
                  <select value={origem} onChange={e => setOrigem(e.target.value as any)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500">
                    <option value="Inbound (Instagram / Leads)">Inbound (Instagram)</option>
                    <option value="Outbound (Prospecção Ativa)">Outbound (Prospecção Ativa)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Pacote Contratado</label>
                  <select value={pacote} onChange={e => { const p = e.target.value as any; setPacote(p); setValorPago(getValorTabela(p)); }} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500">
                    <option value="Landing Page Express">Landing Page Express (R$ 750)</option>
                    <option value="Site Institucional">Site Institucional (R$ 1.500)</option>
                    <option value="E-commerce">E-commerce (R$ 2.400)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-bold">Nome do Cliente / Responsável</label>
                <input type="text" placeholder="Ex: Roberto Silva" required value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500" />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-bold">Nome da Empresa / Nicho</label>
                <input type="text" placeholder="Ex: Clínica Odonto" required value={empresa} onChange={e => setEmpresa(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">CPF ou CNPJ</label>
                  <input type="text" placeholder="000.000.000-00 ou CNPJ" value={documento} onChange={e => setDocumento(aplicarMascaraDocumento(e.target.value))} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none font-mono focus:border-cyan-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">WhatsApp do Cliente</label>
                  <input type="text" placeholder="(35) 99999-9999" required value={whatsapp} onChange={e => setWhatsapp(aplicarMascaraWhatsapp(e.target.value))} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500 font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Forma de Pagamento</label>
                  <select value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500">
                    <option value="Pix à vista">Pix à vista</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão de Crédito (1x)">Cartão de Crédito (1x)</option>
                    <option value="Cartão de Crédito (3x)">Cartão de Crédito (3x)</option>
                    <option value="Cartão de Crédito (6x)">Cartão de Crédito (6x)</option>
                    <option value="Cartão de Crédito (10x)">Cartão de Crédito (10x)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1 font-bold">Valor do Projeto (R$)</label>
                  <input type="number" required value={valorPago} onChange={e => setValorPago(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none font-mono focus:border-cyan-500" />
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-400" /> Contratou Plano Mensal de Manutenção?
                  </label>
                  <input type="checkbox" checked={temPlanoManutencao} onChange={e => setTemPlanoManutencao(e.target.checked)} className="w-4 h-4 accent-cyan-500 cursor-pointer" />
                </div>

                {temPlanoManutencao && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-bold">Valor Mensal (R$)</label>
                      <input type="number" value={valorPlanoManutencao} onChange={e => setValorPlanoManutencao(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2 text-xs text-white font-mono outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1 font-bold">Dia do Vencimento</label>
                      <input type="number" min="1" max="31" value={diaVencimentoManutencao} onChange={e => setDiaVencimentoManutencao(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-2 text-xs text-white font-mono outline-none focus:border-cyan-500" />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-bold">Notas & Histórico</label>
                <textarea rows={3} placeholder="Anotações sobre pedidos do cliente..." value={notasAnotacoes} onChange={e => setNotasAnotacoes(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-500" />
              </div>

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setModalCliente(false)} className="w-1/2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl text-xs font-bold cursor-pointer">Cancelar</button>
                <button type="submit" className="w-1/2 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 py-3 rounded-xl text-xs font-black cursor-pointer shadow-lg">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PERFIL */}
      {modalPerfilCliente && (
        <div className="fixed inset-0 bg-[#030712]/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 pointer-events-auto">
          <div className="bg-[#080C19] border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative z-50 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">{modalPerfilCliente.nome}</h3>
              </div>
              <button onClick={() => setModalPerfilCliente(null)} className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-lg bg-slate-800">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 grid grid-cols-2 gap-3 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Empresa:</span>
                  <strong className="text-white block font-sans">{modalPerfilCliente.empresa}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CPF/CNPJ:</span>
                  <strong className="text-cyan-400 block">{modalPerfilCliente.documento || "Não cadastrado"}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pacote:</span>
                  <strong className="text-pink-400 block font-sans">{modalPerfilCliente.pacote}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Valor Pago:</span>
                  <strong className="text-emerald-400 block">R$ {modalPerfilCliente.valorPago}</strong>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 p-3.5 rounded-xl border border-emerald-500/30 flex items-center justify-between font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" /> Tempo Restante de Garantia:
                </span>
                <strong className="text-emerald-400 text-sm font-black">
                  {calcularTempoRestanteGarantia(modalPerfilCliente.dataInicioGarantia).texto}
                </strong>
              </div>

              {modalPerfilCliente.temPlanoManutencao ? (
                <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/30 p-4 rounded-xl border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-cyan-400 font-bold block text-xs">Plano Mensal de Manutenção Ativo</span>
                    <p className="text-slate-300 font-mono text-[11px] mt-0.5">R$ {modalPerfilCliente.valorPlanoManutencao}/mês • Vencimento todo Dia {modalPerfilCliente.diaVencimentoManutencao}</p>
                  </div>
                  <button onClick={() => enviarCobrancaManutencaoWhatsApp(modalPerfilCliente)} className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                    <DollarSign className="w-4 h-4 text-emerald-400" /> Cobrar no WhatsApp
                  </button>
                </div>
              ) : (
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-slate-400 text-center">Cliente sem plano mensal ativo.</div>
              )}

              <div className="bg-[#030712] p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <NotebookPen className="w-4 h-4 text-cyan-400" /> Histórico & Anotações Internas:
                </h4>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed italic text-[11px]">
                  {modalPerfilCliente.notasAnotacoes || "Nenhuma anotação registrada."}
                </p>
              </div>
            </div>

            <div className="pt-5 flex gap-2">
              <button onClick={() => setModalPerfilCliente(null)} className="w-1/2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer">Fechar</button>
              <button onClick={() => { setModalPerfilCliente(null); abrirModalEditar(modalPerfilCliente); }} className="w-1/2 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 py-2.5 rounded-xl text-xs font-black cursor-pointer">Editar Cadastro</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONTRATO */}
      {modalContrato && (
        <div className="fixed inset-0 bg-[#030712]/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 pointer-events-auto">
          <div className="bg-[#080C19] border border-slate-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative z-50 max-h-[90vh] overflow-y-auto text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white font-mono">CONTRATO DE PRESTAÇÃO DE SERVIÇOS TÉCNICOS • WEZANC</h3>
              </div>
              <button onClick={() => setModalContrato(null)} className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-lg bg-slate-800">✕</button>
            </div>

            <div id="contrato-imprimir" ref={contratoRef} className="space-y-4 text-[10pt] leading-relaxed bg-white p-8 rounded-xl border border-slate-300 font-sans text-slate-900 shadow-inner">
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', borderBottom: '2px solid #0f172a', paddingBottom: '12px' }}>
                <tbody>
                  <tr>
                    <td style={{ textAlign: 'center', paddingBottom: '12px' }}>
                      <h1 style={{ fontSize: '14pt', fontWeight: 800, letterSpacing: '2px', color: '#0f172a', margin: '0 0 4px 0', textTransform: 'uppercase' }}>WEZANC TECHNOLOGY</h1>
                      <p style={{ fontSize: '9.5pt', fontWeight: 600, color: '#334155', margin: '2px 0' }}>Contrato de Prestação de Serviços de Engenharia de Software e Desenvolvimento Web</p>
                      <p style={{ fontSize: '8.5pt', color: '#64748b', margin: '2px 0' }}>Pouso Alegre - MG • WhatsApp: (35) 98407-1964 • wezanc.com</p>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', marginBottom: '16px' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', verticalAlign: 'top', padding: '12px', borderRight: '1px solid #cbd5e1' }}>
                      <span style={{ fontSize: '8pt', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>CONTRATADA</span>
                      <strong style={{ fontSize: '10pt', color: '#0f172a', display: 'block' }}>WEZANC TECHNOLOGY</strong>
                      <span style={{ fontSize: '9.5pt', color: '#1e293b', display: 'block' }}>Fundador: <strong>Zenildo Pereira Cruz Neto</strong></span>
                      <span style={{ fontSize: '9.5pt', color: '#334155', display: 'block' }}>CPF: 153.533.246-84</span>
                    </td>
                    <td style={{ width: '50%', verticalAlign: 'top', padding: '12px' }}>
                      <span style={{ fontSize: '8pt', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>CONTRATANTE</span>
                      <strong style={{ fontSize: '10pt', color: '#0f172a', display: 'block' }}>{modalContrato.nome}</strong>
                      <span style={{ fontSize: '9.5pt', color: '#1e293b', display: 'block' }}>Empresa: <strong>{modalContrato.empresa}</strong></span>
                      <span style={{ fontSize: '9.5pt', color: '#334155', display: 'block' }}>CPF/CNPJ: <strong>{modalContrato.documento || "Não informado"}</strong></span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ backgroundColor: '#f1f5f9', borderLeft: '4px solid #0284c7', padding: '12px 14px', borderRadius: '0 6px 6px 0', marginBottom: '16px' }}>
                <strong style={{ color: '#0369a1', fontSize: '8.5pt', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>RESUMO EXECUTIVO DO PROJETO</strong>
                <p style={{ margin: '3px 0', color: '#0f172a' }}><strong>Pacote:</strong> <span style={{ color: '#1e3a8a', fontWeight: 700 }}>{modalContrato.pacote}</span></p>
                <p style={{ margin: '3px 0', color: '#0f172a' }}><strong>Investimento:</strong> <span style={{ color: '#047857', fontFamily: 'monospace', fontWeight: 700 }}>R$ {modalContrato.valorPago.toLocaleString("pt-BR")}</span></p>
                <p style={{ margin: '3px 0', color: '#0f172a' }}><strong>Pagamento:</strong> <span style={{ color: '#b45309', fontWeight: 700 }}>{modalContrato.formaPagamento}</span></p>
                <p style={{ margin: '3px 0', color: '#0f172a' }}><strong>Garantia Técnica:</strong> <span style={{ color: '#047857', fontWeight: 700 }}>30 dias corridos pós-publicação</span></p>
                {modalContrato.temPlanoManutencao && (
                  <p style={{ margin: '4px 0 0 0', color: '#1d4ed8', fontWeight: 700 }}>✨ Plano Mensal Ativo: R$ {modalContrato.valorPlanoManutencao}/mês (Vencimento dia {modalContrato.diaVencimentoManutencao})</p>
                )}
              </div>

              <p style={{ margin: '8px 0', textAlign: 'justify' }}><strong>CLÁUSULA PRIMEIRA – DO OBJETO:</strong> Prestação de serviços de engenharia de software e desenvolvimento web para a criação do projeto <strong>{modalContrato.pacote}</strong>.</p>
              <p style={{ margin: '8px 0', textAlign: 'justify' }}><strong>CLÁUSULA SEGUNDA – DOS VALORES:</strong> O valor fixo de <strong>R$ {modalContrato.valorPago.toLocaleString("pt-BR")}</strong> será pago via <strong>{modalContrato.formaPagamento}</strong>.</p>
              <p style={{ margin: '8px 0', textAlign: 'justify' }}><strong>CLÁUSULA TERCEIRA – DA GARANTIA TÉCNICA (30 DIAS):</strong> Garantia técnica integral de 30 dias para correção de falhas de código a partir da publicação.</p>

              {modalContrato.temPlanoManutencao && (
                <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '6px', margin: '10px 0', fontSize: '9.5pt' }}>
                  <strong style={{ color: '#1e40af', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '8.5pt' }}>CLÁUSULA NONA – DO PLANO DE MANUTENÇÃO MENSAL (MRR):</strong>
                  <p style={{ margin: '3px 0' }}>O CONTRATANTE contratou o Plano de Manutenção Preventiva e Suporte Continuado no valor mensal de <strong>R$ {modalContrato.valorPlanoManutencao}</strong>, com vencimento todo dia <strong>{modalContrato.diaVencimentoManutencao}</strong> de cada mês, cobrindo atualizações de segurança e suporte mensal.</p>
                </div>
              )}

              <table style={{ width: '100%', marginTop: '35px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', padding: '0 20px' }}>
                      <div style={{ borderTop: '1px solid #475569', paddingTop: '8px', fontSize: '9.5pt', fontWeight: 600, color: '#1e293b' }}>
                        WEZANC TECHNOLOGY<br /><span style={{ fontWeight: 400, fontSize: '8.5pt', color: '#64748b' }}>Zenildo Pereira Cruz Neto</span>
                      </div>
                    </td>
                    <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', padding: '0 20px' }}>
                      <div style={{ borderTop: '1px solid #475569', paddingTop: '8px', fontSize: '9.5pt', fontWeight: 600, color: '#1e293b' }}>
                        {modalContrato.nome.toUpperCase()}<br /><span style={{ fontWeight: 400, fontSize: '8.5pt', color: '#64748b' }}>Contratante</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-2 pt-5">
              <button onClick={() => setModalContrato(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl text-xs font-bold cursor-pointer">Fechar</button>
              <button onClick={() => enviarWhatsAppContrato(modalContrato)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                <Send className="w-3.5 h-3.5" /> Enviar WhatsApp
              </button>
              <button onClick={baixarContratoPDF} className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                <FileDown className="w-4 h-4 stroke-[3]" /> Salvar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TRANSAÇÃO */}
      {modalTransacao && (
        <div className="fixed inset-0 bg-[#030712]/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 pointer-events-auto">
          <div className="bg-[#080C19] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative z-50">
            <h3 className="text-sm font-black text-white mb-4">Registrar Despesa / Assinatura IA</h3>
            <form onSubmit={handleAddTransacao} className="space-y-3">
              <input type="text" placeholder="Descrição (ex: ChatGPT Plus)" required value={descTrans} onChange={e => setDescTrans(e.target.value)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-500" />
              <select value={tipoTrans} onChange={e => setTipoTrans(e.target.value as any)} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-500">
                <option value="Despesa / IA">Despesa / IA</option>
                <option value="Receita">Outra Receita</option>
              </select>
              <input type="number" placeholder="Valor (R$)" required value={valTrans} onChange={e => setValTrans(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-[#030712] border border-slate-800 rounded-xl p-3 text-xs text-white outline-none font-mono focus:border-cyan-500" />
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setModalTransacao(false)} className="w-1/2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl text-xs font-bold cursor-pointer">Cancelar</button>
                <button type="submit" className="w-1/2 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 py-3 rounded-xl text-xs font-black cursor-pointer shadow-md">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}