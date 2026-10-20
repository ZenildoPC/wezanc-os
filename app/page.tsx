"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Search, ShieldCheck, Phone, Trash2, Zap, LayoutDashboard,
  Users, BarChart3, ExternalLink, Bot, Edit3, FileText, 
  CreditCard, MessageCircle, AlertTriangle, Printer, Share2, CheckCircle2, Clock, Send, Filter, X, UserX, RefreshCw, Download, Upload, Shield, FileDown, User, NotebookPen, DollarSign, Repeat, CheckSquare, Square, Target, TrendingUp, TrendingDown, ArrowUpRight, Printer as PrinterIcon, Menu, ChevronLeft, ChevronRight
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

interface ProspectLead {
  id: string;
  nome: string;
  empresa: string;
  whatsapp: string;
  notas: string;
  dataAdicao: string;
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
  tipo: "Receita" | "Despesa" | "Manutenção MRR";
  pacoteAssociado?: string;
  valor: number;
  data: string;
}

const COLUNAS_OUTBOUND: { id: StatusPipelineOutbound; titulo: string; agente: string; tagCor: string }[] = [
  { id: "01_raio_x", titulo: "01. Raio-X", agente: "Funcionário 4", tagCor: "border-sky-500/30 text-sky-400 bg-sky-500/10" },
  { id: "02_prototipagem", titulo: "02. Prototipagem", agente: "Equipe Wezanc", tagCor: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10" },
  { id: "03_abordagem", titulo: "03. Abordagem", agente: "Funcionário 3", tagCor: "border-purple-500/30 text-purple-400 bg-purple-500/10" },
  { id: "04_fechamento", titulo: "04. Fechamento", agente: "Comercial", tagCor: "border-amber-500/30 text-amber-400 bg-amber-500/10" },
  { id: "05_em_garantia", titulo: "05. Garantia (30d)", agente: "Pós-Venda", tagCor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" },
];

const COLUNAS_INBOUND: { id: StatusPipelineInbound; titulo: string; agente: string; tagCor: string }[] = [
  { id: "01_briefing", titulo: "01. Briefing", agente: "Triagem", tagCor: "border-pink-500/30 text-pink-400 bg-pink-500/10" },
  { id: "02_branding", titulo: "02. Branding", agente: "Design Head", tagCor: "border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-500/10" },
  { id: "03_desenvolvimento", titulo: "03. Desenvolvimento", agente: "Equipe Wezanc", tagCor: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10" },
  { id: "04_validacao", titulo: "04. Validação & Ajustes", agente: "QA / Cliente", tagCor: "border-amber-500/30 text-amber-400 bg-amber-500/10" },
  { id: "05_fechamento", titulo: "05. Fechamento", agente: "Comercial", tagCor: "border-purple-500/30 text-purple-400 bg-purple-500/10" },
  { id: "06_em_garantia", titulo: "06. Garantia (30d)", agente: "Pós-Venda", tagCor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" },
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
    cor: "from-pink-500/20 to-transparent border-pink-500/30 text-pink-400"
  },
  {
    nome: "Análise Visual & Raio-X",
    cargo: "Head de Design & Branding",
    descricao: "Avaliação estética de marcas, prospecção e estruturação de identidade visual de leads.",
    link: "https://share.gemini.google/cXSqXLDC9Uxa",
    cor: "from-sky-500/20 to-transparent border-sky-500/30 text-sky-400"
  },
  {
    nome: "Comercial & Vendas",
    cargo: "VP de Vendas",
    descricao: "Criação de scripts de abordagem, envio de protótipos e contorno de objeções.",
    link: "https://share.gemini.google/uzrvFrp6sN8j",
    cor: "from-purple-500/20 to-transparent border-purple-500/30 text-purple-400"
  },
  {
    nome: "Negócios & Tomada de Decisão",
    cargo: "COO / Gestão de Contratos",
    descricao: "Estruturação de termos contratuais, MRR e regras de negócio da Wezanc.",
    link: "https://share.gemini.google/9JbQ5lzgLBDL",
    cor: "from-amber-500/20 to-transparent border-amber-500/30 text-amber-400"
  },
  {
    nome: "Marketing & Tráfego Pago",
    cargo: "CMO (Google Ads & Campanhas)",
    descricao: "Planejamento de tráfego pago, captação de clientes e campanhas de conversão.",
    link: "https://share.gemini.google/wkoXVFp3qTvu",
    cor: "from-emerald-500/20 to-transparent border-emerald-500/30 text-emerald-400"
  }
];

export default function WezancOS() {
  const [menuAtivo, setMenuAtivo] = useState<"kanban" | "inbound" | "tarefas" | "manutencao" | "naofechados" | "agentes" | "clientes" | "financeiro" | "prospects">("prospects");
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [sidebarRetraida, setSidebarRetraida] = useState(false);
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [transacoes, setTransacoes] = useState<TransacaoFinanceira[]>([]);
  const [prospects, setProspects] = useState<ProspectLead[]>([]);

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
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [filtroTipoTransacao, setFiltroTipoTransacao] = useState("TODOS");

  const [filtroManutencaoTexto, setFiltroManutencaoTexto] = useState("");
  const [filtroManutencaoVencimento, setFiltroManutencaoVencimento] = useState("");

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
  const [tipoTrans, setTipoTrans] = useState<"Receita" | "Despesa" | "Manutenção MRR">("Receita");
  const [pacoteTrans, setPacoteTrans] = useState<string>("Site Institucional");
  const [valTrans, setValTrans] = useState<number | "">(100);

  useEffect(() => {
    document.title = "Wezanc • OS Executive iPad Edition";
  }, []);

  useEffect(() => {
    const cSalvos = localStorage.getItem("@wezanc_os_clientes_v44") || localStorage.getItem("@wezanc_os_clientes_v43");
    const transSalvas = localStorage.getItem("@wezanc_os_transacoes_v44") || localStorage.getItem("@wezanc_os_transacoes_v43");
    const prospectsSalvos = localStorage.getItem("@wezanc_os_prospects_v44") || localStorage.getItem("@wezanc_os_prospects_v43");

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
    if (prospectsSalvos) setProspects(JSON.parse(prospectsSalvos));
  }, []);

  const salvarClientes = (lista: Cliente[]) => {
    setClientes(lista);
    localStorage.setItem("@wezanc_os_clientes_v44", JSON.stringify(lista));
  };

  const salvarTransacoes = (lista: TransacaoFinanceira[]) => {
    setTransacoes(lista);
    localStorage.setItem("@wezanc_os_transacoes_v44", JSON.stringify(lista));
  };

  const salvarProspects = (lista: ProspectLead[]) => {
    setProspects(lista);
    localStorage.setItem("@wezanc_os_prospects_v44", JSON.stringify(lista));
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

  const promoverParaOutbound = (prospect: ProspectLead) => {
    const novoClienteOficial: Cliente = {
      id: Date.now().toString(),
      nome: prospect.nome,
      empresa: prospect.empresa || "Empresa Prospectada",
      whatsapp: prospect.whatsapp || "",
      documento: "",
      pacote: "Site Institucional",
      formaPagamento: "Pix à vista",
      origem: "Outbound (Prospecção Ativa)",
      valorTabela: 1500,
      valorPago: 1500,
      teveDesconto: false,
      valorDesconto: 0,
      statusOutbound: "01_raio_x",
      statusInbound: "01_briefing",
      dataFechamento: new Date().toISOString().slice(0, 10),
      agenteResponsavel: "Wezanc Technology",
      notasAnotacoes: prospect.notas || "Lead importado do Banco de Leads.",
      tarefasTecnicas: TAREFAS_PADRAO_TECNICA.map((t, idx) => ({ id: `${idx}`, titulo: t, concluida: false }))
    };

    salvarClientes([...clientes, novoClienteOficial]);
    salvarProspects(prospects.filter(p => p.id !== prospect.id));
    setMenuAtivo("kanban");
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

  const excluirCliente = (id: string) => {
    if (confirm("Tem certeza que deseja excluir permanentemente este cliente da base?")) {
      salvarClientes(clientes.filter(c => c.id !== id));
    }
  };

  const exportarBackupJSON = () => {
    const dados = {
      clientes,
      transacoes,
      prospects,
      exportadoEm: new Date().toISOString(),
      versao: "Wezanc - OS iPad Edition v44.0"
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
          if (conteudo.prospects) salvarProspects(conteudo.prospects);
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
    
    const texto = `Prezado(a) ${cliente.nome},\n\nEntramos em contato para o envio da cobrança mensal referente ao Plano de Manutenção e Suporte Técnico Preventivo da Wezanc Technology para a empresa ${cliente.empresa}.\n\nDetalhes da Mensalidade:\n- Servico: Suporte Tecnico, Backups e Atualizacoes\n- Valor: R$ ${Number(valor).toLocaleString("pt-BR")}\n- Vencimento: Dia ${diaVenc}\n- Chave Pix (CPF): 15353324684 (Zenildo Pereira Cruz Neto)\n\nFicamos à disposição para quaisquer esclarecimentos.\n\nAtenciosamente,\nWezanc Technology`;

    if (telefoneLimpo) {
      window.open(`https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(texto)}`, "_blank");
    }
  };

  const baixarContratoPDF = () => {
    const conteudoContrato = contratoRef.current?.innerHTML;
    if (!conteudoContrato) return;

    const janelaPrint = window.open("", "_blank", "width=900,height=1100");
    if (!janelaPrint) return;

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

  const baixarRelatorioFinanceiroPDF = () => {
    const conteudoRelatorio = relatorioFinanceiroRef.current?.innerHTML;
    if (!conteudoRelatorio) return;

    const janelaPrint = window.open("", "_blank", "width=900,height=1100");
    if (!janelaPrint) return;

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

  const enviarWhatsAppContrato = (cliente: Cliente) => {
    const telefoneLimpo = cliente.whatsapp.replace(/\D/g, "");
    let texto = `Prezado(a) ${cliente.nome},\n\nSegue o resumo do Contrato Oficial de Prestação de Serviços da Wezanc Technology para o projeto ${cliente.pacote} da empresa ${cliente.empresa}.\n\nResumo Comercial:\n- Investimento: R$ ${cliente.valorPago.toLocaleString("pt-BR")}\n- Condicao de Pagamento: ${cliente.formaPagamento}\n- Garantia Tecnica: 30 dias integrais`;

    if (cliente.temPlanoManutencao) {
      texto += `\n- Plano de Manutencao: R$ ${cliente.valorPlanoManutencao}/mes (Vencimento todo dia ${cliente.diaVencimentoManutencao})`;
    }

    texto += `\n\nO documento formal em PDF foi gerado em nosso sistema e está sendo encaminhado.\n\nAtenciosamente,\nWezanc Technology`;

    if (telefoneLimpo) {
      window.open(`https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(texto)}`, "_blank");
    }
  };

  const enviarWhatsAppMensagemAviso = (cliente: Cliente, novafase: string) => {
    const telefoneLimpo = cliente.whatsapp.replace(/\D/g, "");
    let texto = "";

    switch (novafase) {
      case "03_abordagem_outbound":
        texto = `Olá, ${cliente.nome}, tudo bem?\n\nA Wezanc Technology realizou uma análise preliminar do posicionamento digital da ${cliente.empresa} e desenvolveu um protótipo estrutural inicial voltado à otimização da sua presença online.\n\nSeguirá em anexo a demonstração em vídeo. Ficamos à disposição para agendarmos um alinhamento.\n\nAtenciosamente,\nEquipe Wezanc Technology`;
        break;
      case "04_fechamento_outbound":
        texto = `Prezado(a) ${cliente.nome},\n\nInformamos que o seu projeto entrou oficialmente na etapa de fechamento em nosso sistema.\n\nO contrato de prestação de serviços foi gerado com sucesso na aba de operações e será enviado em formato PDF para sua validação e assinatura.\n\nAgradecemos pela parceria.\n\nAtenciosamente,\nEquipe Wezanc Technology`;
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
        return { ...c, statusInbound: novoStatus, dataInicioGarantia };
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
        } else if (novoStatus === "04_fechamento") {
          enviarWhatsAppMensagemAviso(clienteAtualizado, "04_fechamento_outbound");
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
    const motivo = prompt("Informe o motivo do não fechamento:") || "Não informado";
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

  const deveMostrarBotaoContrato = (c: Cliente) => {
    if (c.origem === "Inbound (Instagram / Leads)") {
      return true;
    } else {
      return c.statusOutbound === "04_fechamento";
    }
  };

  const getEtapaFormatada = (c: Cliente) => {
    if (eClienteNaoFechou(c)) return "Não Fechou";
    if (c.origem === "Inbound (Instagram / Leads)") {
      if (c.statusInbound === "08_concluido" || eGarantiaExpirada(c)) return "Concluído";
      const col = COLUNAS_INBOUND.find(item => item.id === c.statusInbound);
      return col ? col.titulo : "Inbound";
    } else {
      if (c.statusOutbound === "07_concluido" || eGarantiaExpirada(c)) return "Concluído";
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
        pacoteAssociado: pacote,
        valor: valPago,
        data: new Date().toISOString().slice(0, 10)
      };

      salvarClientes([...clientes, novo]);
      salvarTransacoes([...transacoes, novaTransacao]);
    }

    setModalCliente(false);
    setClienteEmEdicao(null);
  };

  const handleSalvarTransacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descTrans || !valTrans) return;

    const nova: TransacaoFinanceira = {
      id: Date.now().toString(),
      descricao: descTrans,
      tipo: tipoTrans,
      pacoteAssociado: tipoTrans === "Despesa" ? undefined : pacoteTrans,
      valor: Number(valTrans),
      data: new Date().toISOString().slice(0, 10)
    };

    salvarTransacoes([nova, ...transacoes]);
    setDescTrans(""); setValTrans(100);
    setModalTransacao(false);
  };

  const clientesNaoFechados = clientes.filter(c => eClienteNaoFechou(c));
  const clientesManutencao = clientes.filter(c => {
    const matchTexto = c.nome.toLowerCase().includes(filtroManutencaoTexto.toLowerCase()) || c.empresa.toLowerCase().includes(filtroManutencaoTexto.toLowerCase());
    const matchVencimento = !filtroManutencaoVencimento || String(c.diaVencimentoManutencao) === filtroManutencaoVencimento;
    return c.temPlanoManutencao && matchTexto && matchVencimento;
  });

  const totalMRR = clientes.filter(c => c.temPlanoManutencao).reduce((acc, c) => acc + (Number(c.valorPlanoManutencao) || 0), 0);
  const clientesAtivosEmProducao = clientes.filter(c => !eClienteNaoFechou(c) && !estaEmGarantiaOuConcluido(c));

  const totalReceitasProjetos = clientes.reduce((acc, c) => acc + c.valorPago, 0);
  const totalReceitasTransacoes = transacoes.filter(t => t.tipo === "Receita" || t.tipo === "Manutenção MRR").reduce((acc, t) => acc + t.valor, 0);
  const totalReceitas = totalReceitasProjetos + totalReceitasTransacoes;

  const totalDespesas = transacoes.filter(t => t.tipo === "Despesa").reduce((acc, t) => acc + t.valor, 0);
  const lucroLiquido = totalReceitas - totalDespesas;

  const receitaLandingPage = clientes.filter(c => c.pacote === "Landing Page Express").reduce((acc, c) => acc + c.valorPago, 0) + transacoes.filter(t => t.pacoteAssociado === "Landing Page Express" && t.tipo === "Receita").reduce((acc, t) => acc + t.valor, 0);
  const receitaInstitucional = clientes.filter(c => c.pacote === "Site Institucional").reduce((acc, c) => acc + c.valorPago, 0) + transacoes.filter(t => t.pacoteAssociado === "Site Institucional" && t.tipo === "Receita").reduce((acc, t) => acc + t.valor, 0);
  const receitaEcommerce = clientes.filter(c => c.pacote === "E-commerce").reduce((acc, c) => acc + c.valorPago, 0) + transacoes.filter(t => t.pacoteAssociado === "E-commerce" && t.tipo === "Receita").reduce((acc, t) => acc + t.valor, 0);
  const receitaManutencaoMRR = transacoes.filter(t => t.tipo === "Manutenção MRR").reduce((acc, t) => acc + t.valor, 0) + (totalMRR * 1);

  const transacoesFiltradas = transacoes.filter(t => {
    const tipoMatch = filtroTipoTransacao === "TODOS" || t.tipo === filtroTipoTransacao;
    const inicioMatch = !filtroDataInicio || t.data >= filtroDataInicio;
    const fimMatch = !filtroDataFim || t.data <= filtroDataFim;
    return tipoMatch && inicioMatch && fimMatch;
  });

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

  return (
    <div className="w-full min-h-screen bg-[#040612] text-slate-100 font-sans antialiased flex flex-col md:flex-row selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">

      {/* HEADER MOBILE / IPAD RETRATO */}
      <div className="md:hidden bg-[#02040a] border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 p-[1.5px]">
            <div className="w-full h-full bg-[#02040a] rounded-[10px] flex items-center justify-center">
              <span className="text-cyan-400 font-black font-mono text-base">W</span>
            </div>
          </div>
          <span className="font-mono font-black text-sm text-white">WEZANC<span className="text-cyan-400">.OS</span></span>
        </div>
        <button onClick={() => setMenuMobileAberto(!menuMobileAberto)} className="bg-slate-800 text-cyan-400 p-2.5 rounded-xl cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* MENU MOBILE / OVERLAY */}
      {menuMobileAberto && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#040612]/95 backdrop-blur-2xl p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest">Navegação Wezanc OS</span>
              <button onClick={() => setMenuMobileAberto(false)} className="text-slate-400 p-2 bg-slate-800 rounded-xl cursor-pointer">✕</button>
            </div>
            <nav className="space-y-2">
              <button onClick={() => { setMenuAtivo("prospects"); setMenuMobileAberto(false); }} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800/50 text-white font-bold text-sm cursor-pointer">🎯 Banco de Leads</button>
              <button onClick={() => { setMenuAtivo("inbound"); setMenuMobileAberto(false); }} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800/50 text-white font-bold text-sm cursor-pointer">📱 Inbound (Instagram)</button>
              <button onClick={() => { setMenuAtivo("kanban"); setMenuMobileAberto(false); }} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800/50 text-white font-bold text-sm cursor-pointer">📊 Outbound Ativo</button>
              <button onClick={() => { setMenuAtivo("naofechados"); setMenuMobileAberto(false); }} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800/50 text-white font-bold text-sm cursor-pointer">❌ Não Fechados</button>
              <button onClick={() => { setMenuAtivo("tarefas"); setMenuMobileAberto(false); }} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800/50 text-white font-bold text-sm cursor-pointer">✅ Sprints & Tarefas</button>
              <button onClick={() => { setMenuAtivo("manutencao"); setMenuMobileAberto(false); }} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800/50 text-white font-bold text-sm cursor-pointer">🔄 Manutenção MRR</button>
              <button onClick={() => { setMenuAtivo("clientes"); setMenuMobileAberto(false); }} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800/50 text-white font-bold text-sm cursor-pointer">👥 Base 360° Clientes</button>
              <button onClick={() => { setMenuAtivo("financeiro"); setMenuMobileAberto(false); }} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800/50 text-white font-bold text-sm cursor-pointer">💰 Financeiro & PDF</button>
              <button onClick={() => { setMenuAtivo("agentes"); setMenuMobileAberto(false); }} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800/50 text-white font-bold text-sm cursor-pointer">🤖 Agentes de IA</button>
            </nav>
          </div>
        </div>
      )}

      {/* SIDEBAR DESKTOP & IPAD (RETRÁTIL LIMPA E HARMONIOSA) */}
      <aside className={`bg-[#02040a] border-r border-slate-800/80 hidden md:flex flex-col justify-between sticky top-0 h-screen z-45 shrink-0 shadow-2xl transition-all duration-300 ${sidebarRetraida ? "w-20" : "w-72"}`}>
        <div>
          {/* TOPO SIDEBAR CORRIGIDO C/ FLEXBOX SEGURO */}
          <div className={`p-4 border-b border-slate-800/80 flex items-center ${sidebarRetraida ? "flex-col gap-3 justify-center py-5 px-2" : "justify-between"}`}>
            <div className={`flex items-center gap-3 overflow-hidden ${sidebarRetraida ? "justify-center w-full" : ""}`}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1.5px] shadow-xl shadow-cyan-500/30 shrink-0">
                <div className="w-full h-full bg-[#02040a] rounded-[14px] flex items-center justify-center">
                  <span className="text-cyan-400 font-black font-mono text-lg tracking-tighter">W</span>
                </div>
              </div>
              {!sidebarRetraida && (
                <div className="truncate">
                  <h1 className="text-xs font-black tracking-wider text-white font-mono truncate">
                    WEZANC<span className="text-cyan-400">.OS</span>
                  </h1>
                  <span className="text-[9px] text-cyan-400/90 block font-mono font-bold tracking-widest uppercase truncate">iPad Edition v44</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setSidebarRetraida(!sidebarRetraida)} 
              className={`bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-xl transition cursor-pointer shrink-0 flex items-center justify-center shadow-md ${sidebarRetraida ? "w-full" : "ml-1"}`}
              title={sidebarRetraida ? "Expandir Menu" : "Recolher Menu"}
            >
              {sidebarRetraida ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div>
              {!sidebarRetraida && <span className="px-3 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-2 whitespace-nowrap">Prospecção & Leads</span>}
              <div className="space-y-1">
                <button onClick={() => setMenuAtivo("prospects")} title="Banco de Leads" className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${sidebarRetraida ? "justify-center px-2" : ""} ${menuAtivo === "prospects" ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <Target className="w-4 h-4 text-amber-400 shrink-0" />
                  {!sidebarRetraida && <span className="whitespace-nowrap truncate">Banco de Leads ({prospects.length})</span>}
                </button>
                <button onClick={() => setMenuAtivo("inbound")} title="Inbound (Instagram)" className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${sidebarRetraida ? "justify-center px-2" : ""} ${menuAtivo === "inbound" ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <Share2 className="w-4 h-4 text-pink-400 shrink-0" />
                  {!sidebarRetraida && <span className="whitespace-nowrap truncate">Inbound (Instagram)</span>}
                </button>
                <button onClick={() => setMenuAtivo("kanban")} title="Outbound Ativo" className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${sidebarRetraida ? "justify-center px-2" : ""} ${menuAtivo === "kanban" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <LayoutDashboard className="w-4 h-4 text-cyan-400 shrink-0" />
                  {!sidebarRetraida && <span className="whitespace-nowrap truncate">Outbound Ativo</span>}
                </button>
                <button onClick={() => setMenuAtivo("naofechados")} title="Não Fechados" className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${sidebarRetraida ? "justify-center px-2" : ""} ${menuAtivo === "naofechados" ? "bg-gradient-to-r from-rose-500 to-orange-600 text-white shadow-lg shadow-rose-500/25 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <UserX className="w-4 h-4 text-rose-400 shrink-0" />
                  {!sidebarRetraida && <span className="whitespace-nowrap truncate">Não Fechados ({clientesNaoFechados.length})</span>}
                </button>
              </div>
            </div>

            <div>
              {!sidebarRetraida && <span className="px-3 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-2 whitespace-nowrap">Operações & Gestão</span>}
              <div className="space-y-1">
                <button onClick={() => setMenuAtivo("tarefas")} title="Sprints & Tarefas" className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${sidebarRetraida ? "justify-center px-2" : ""} ${menuAtivo === "tarefas" ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                  {!sidebarRetraida && <span className="whitespace-nowrap truncate">Sprints & Tarefas</span>}
                </button>
                <button onClick={() => setMenuAtivo("manutencao")} title="Manutenção MRR" className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${sidebarRetraida ? "justify-center px-2" : ""} ${menuAtivo === "manutencao" ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/25 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <Repeat className="w-4 h-4 text-emerald-400 shrink-0" />
                  {!sidebarRetraida && <span className="whitespace-nowrap truncate">Manutenção MRR</span>}
                </button>
                <button onClick={() => setMenuAtivo("clientes")} title="Base 360° Clientes" className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${sidebarRetraida ? "justify-center px-2" : ""} ${menuAtivo === "clientes" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                  {!sidebarRetraida && <span className="whitespace-nowrap truncate">Base 360° Clientes</span>}
                </button>
                <button onClick={() => setMenuAtivo("financeiro")} title="Financeiro & MRR" className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${sidebarRetraida ? "justify-center px-2" : ""} ${menuAtivo === "financeiro" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <BarChart3 className="w-4 h-4 text-amber-400 shrink-0" />
                  {!sidebarRetraida && <span className="whitespace-nowrap truncate">Financeiro & MRR</span>}
                </button>
              </div>
            </div>

            <div>
              {!sidebarRetraida && <span className="px-3 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-2 whitespace-nowrap">IA & Automação</span>}
              <div className="space-y-1">
                <button onClick={() => setMenuAtivo("agentes")} title="Agentes de IA" className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${sidebarRetraida ? "justify-center px-2" : ""} ${menuAtivo === "agentes" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25 font-black" : "text-slate-400 hover:text-white hover:bg-slate-800/40"}`}>
                  <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
                  {!sidebarRetraida && <span className="whitespace-nowrap truncate">Agentes de IA</span>}
                </button>
              </div>
            </div>
          </nav>
        </div>

        <div className={`p-3 border-t border-slate-800/80 m-3 bg-[#040612] rounded-2xl border border-cyan-500/20 space-y-2 shadow-inner ${sidebarRetraida ? "flex flex-col items-center justify-center p-2" : ""}`}>
          <div className="flex items-center justify-between w-full">
            {!sidebarRetraida && <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> iPad Ativo</span>}
            <div className={`flex gap-1.5 ${sidebarRetraida ? "flex-col w-full items-center" : ""}`}>
              <button onClick={exportarBackupJSON} title="Exportar Backup JSON" className="bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[10px] font-mono px-2.5 py-1.5 rounded-lg cursor-pointer transition">Exp</button>
              <label title="Importar Backup JSON" className="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-mono px-2.5 py-1.5 rounded-lg cursor-pointer transition text-center">Imp
                <input type="file" accept=".json" onChange={importarBackupJSON} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 w-full min-w-0 bg-[#040612] relative z-10 flex flex-col p-4 sm:p-6 lg:p-8">
        <header className="bg-[#040612]/90 backdrop-blur-xl border-b border-slate-800/80 pb-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
              Wezanc Technology OS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white capitalize mt-1.5 tracking-tight flex items-center gap-2 whitespace-nowrap truncate">
              {menuAtivo === "prospects" && "Banco de Leads & Pré-Prospecção"}
              {menuAtivo === "inbound" && "Pipeline Inbound (Instagram)"}
              {menuAtivo === "kanban" && "Pipeline Outbound (Ativo)"}
              {menuAtivo === "tarefas" && "Sprints & Tarefas Técnicas"}
              {menuAtivo === "manutencao" && "Manutenção Recorrente (MRR)"}
              {menuAtivo === "naofechados" && "Leads Não Fechados"}
              {menuAtivo === "agentes" && "Central de Agentes de IA"}
              {menuAtivo === "clientes" && "Base Completa 360° & Contratos"}
              {menuAtivo === "financeiro" && "Painel Financeiro Executivo"}
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button 
              onClick={() => abrirModalNovo(menuAtivo === "inbound" ? "Inbound (Instagram / Leads)" : "Outbound (Prospecção Ativa)")} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-slate-950 font-black px-5 py-3.5 rounded-2xl text-xs shadow-xl shadow-cyan-500/25 cursor-pointer active:scale-95 transition-all hover:brightness-110 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3]" /> Novo Cliente
            </button>
          </div>
        </header>

        <div className="space-y-6">

          {/* ABA 0: BANCO DE LEADS */}
          {menuAtivo === "prospects" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400 shrink-0" /> Banco de Leads & Pré-Prospecção ({prospects.length})
                </h3>
                <p className="text-xs text-slate-300 mt-1">Garimpe leads e envie para o Outbound com 1 clique.</p>
              </div>

              <div className="bg-[#070b19] border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const nome = (form.elements.namedItem('pNome') as HTMLInputElement).value;
                  const empresa = (form.elements.namedItem('pEmpresa') as HTMLInputElement).value;
                  const whatsappInput = (form.elements.namedItem('pWhats') as HTMLInputElement).value;
                  const notas = (form.elements.namedItem('pNotas') as HTMLInputElement).value;

                  if (!nome) return;
                  const numeroLimpo = whatsappInput.replace(/\D/g, "");
                  if (numeroLimpo.length < 10) {
                    alert("Digite um número de WhatsApp válido com DDD.");
                    return;
                  }
                  const whatsappFormatado = aplicarMascaraWhatsapp(numeroLimpo);

                  const novoProspect: ProspectLead = {
                    id: Date.now().toString(),
                    nome,
                    empresa,
                    whatsapp: whatsappFormatado,
                    notas,
                    dataAdicao: new Date().toLocaleDateString('pt-BR')
                  };

                  salvarProspects([novoProspect, ...prospects]);
                  form.reset();
                }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  <input name="pNome" type="text" placeholder="Nome do Responsável *" required className="bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none focus:border-amber-500 transition" />
                  <input name="pEmpresa" type="text" placeholder="Empresa / Nicho" className="bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none focus:border-amber-500 transition" />
                  <input name="pWhats" type="text" placeholder="WhatsApp (DDD + Número) *" required className="bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none font-mono focus:border-amber-500 transition" />
                  <input name="pNotas" type="text" placeholder="Observações (Instagram, etc)" className="bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none focus:border-amber-500 transition" />
                  <button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs rounded-xl p-3.5 transition shadow-lg shadow-amber-500/25 cursor-pointer active:scale-95 hover:brightness-110 whitespace-nowrap">
                    + Salvar no Banco
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {prospects.map((p) => (
                  <div key={p.id} className="bg-[#070b19] border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between shadow-2xl hover:border-slate-700 transition">
                    <div>
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <span className="text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-md uppercase whitespace-nowrap">
                          Pré-Outbound
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{p.dataAdicao}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white truncate">{p.nome}</h4>
                      <p className="text-xs text-slate-300 font-medium truncate">{p.empresa || "Sem empresa informada"}</p>
                      {p.whatsapp && <p className="text-xs text-cyan-400 font-mono font-bold mt-2 whitespace-nowrap">📞 {p.whatsapp}</p>}
                      {p.notas && <p className="text-xs text-slate-300 mt-3 bg-[#040612] p-3 rounded-2xl border border-slate-800/60 italic line-clamp-3">{p.notas}</p>}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      <button
                        onClick={() => promoverParaOutbound(p)}
                        className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-95 transition hover:brightness-110 whitespace-nowrap"
                      >
                        🚀 Subir p/ Outbound
                      </button>
                      <button
                        onClick={() => { if(confirm("Excluir este prospect?")) salvarProspects(prospects.filter(item => item.id !== p.id)); }}
                        className="bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 p-3 rounded-xl text-xs transition cursor-pointer shrink-0"
                        title="Excluir Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {prospects.length === 0 && (
                  <div className="col-span-full py-16 text-center text-slate-400 font-mono text-xs bg-[#070b19] border border-slate-800 rounded-3xl">
                    Nenhum lead no banco de prospecção no momento.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ABA 1: INBOUND */}
          {menuAtivo === "inbound" && (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-[1200px] xl:min-w-0 xl:grid xl:grid-cols-6">
                {COLUNAS_INBOUND.map((coluna) => {
                  const clientesInboundColuna = clientes.filter(
                    (c) => c.origem === "Inbound (Instagram / Leads)" && 
                    c.statusInbound === coluna.id && 
                    !eGarantiaExpirada(c) &&
                    !eClienteNaoFechou(c)
                  );

                  return (
                    <div key={coluna.id} className="flex flex-col bg-[#070b19] border border-slate-800 rounded-3xl p-4 shadow-2xl w-72 xl:w-auto shrink-0 backdrop-blur-md">
                      <div className={`p-3 rounded-2xl border ${coluna.tagCor} mb-4 flex items-center justify-between`}>
                        <h3 className="font-black text-[11px] uppercase tracking-wider truncate">{coluna.titulo}</h3>
                        <span className="bg-[#040612] px-2.5 py-1 rounded-xl text-[10px] font-mono font-black text-white border border-slate-700 ml-2 shrink-0">
                          {clientesInboundColuna.length}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 flex-1">
                        {clientesInboundColuna.map((cliente) => (
                          <div key={cliente.id} className="bg-[#0b1021] border border-slate-800 p-4 rounded-2xl shadow-xl relative group hover:border-slate-700 transition">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-pink-500/15 text-pink-400 border border-pink-500/30 uppercase font-mono truncate">
                                {cliente.pacote}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => abrirModalPerfil(cliente)} className="text-slate-400 hover:text-cyan-400 p-1 cursor-pointer"><User className="w-3.5 h-3.5" /></button>
                                <button onClick={() => abrirModalEditar(cliente)} className="text-slate-400 hover:text-cyan-400 p-1 cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => marcarComoNaoFechou(cliente.id)} className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"><UserX className="w-3.5 h-3.5" /></button>
                                <button onClick={() => excluirCliente(cliente.id)} className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>

                            <h4 className="font-extrabold text-xs text-slate-100 truncate">{cliente.nome}</h4>
                            <p className="text-[10px] text-slate-300 font-medium truncate">{cliente.empresa}</p>

                            <div className="mt-3 bg-[#040612] border border-slate-800 p-2.5 rounded-xl flex items-center justify-between font-mono gap-2">
                              <strong className="text-emerald-400 text-xs font-black whitespace-nowrap">R$ {cliente.valorPago}</strong>
                              <span className="text-[9px] text-amber-400 font-bold truncate">{cliente.formaPagamento}</span>
                            </div>

                            {deveMostrarBotaoContrato(cliente) && (
                              <button onClick={() => setModalContrato(cliente)} className="mt-3 w-full bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 py-2 px-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition whitespace-nowrap">
                                <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Gerar Contrato PDF
                              </button>
                            )}

                            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                              <span className="text-[9px] text-slate-400 uppercase font-mono font-bold whitespace-nowrap">Mover:</span>
                              <div className="flex items-center gap-1.5">
                                {COLUNAS_INBOUND.map((col) => (
                                  <button key={col.id} onClick={() => moverStatusInbound(cliente.id, col.id)} title={col.titulo} className={`w-3.5 h-3.5 rounded-full cursor-pointer transition ${cliente.statusInbound === col.id ? "bg-pink-400 ring-2 ring-pink-400/30 scale-110" : "bg-slate-700 hover:bg-slate-500"}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 2: OUTBOUND */}
          {menuAtivo === "kanban" && (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-[1000px] xl:min-w-0 xl:grid xl:grid-cols-5">
                {COLUNAS_OUTBOUND.map((coluna) => {
                  const clientesColuna = clientes.filter(
                    (c) => c.origem !== "Inbound (Instagram / Leads)" && 
                    c.statusOutbound === coluna.id && 
                    !eGarantiaExpirada(c) &&
                    !eClienteNaoFechou(c)
                  );

                  return (
                    <div key={coluna.id} className="flex flex-col bg-[#070b19] border border-slate-800 rounded-3xl p-4 shadow-2xl w-72 xl:w-auto shrink-0 backdrop-blur-md">
                      <div className={`p-3 rounded-2xl border ${coluna.tagCor} mb-4 flex items-center justify-between`}>
                        <h3 className="font-black text-[11px] uppercase tracking-wider truncate">{coluna.titulo}</h3>
                        <span className="bg-[#040612] px-2.5 py-1 rounded-xl text-[10px] font-mono font-black text-white border border-slate-700 ml-2 shrink-0">
                          {clientesColuna.length}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 flex-1">
                        {clientesColuna.map((cliente) => (
                          <div key={cliente.id} className="bg-[#0b1021] border border-slate-800 p-4 rounded-2xl shadow-xl relative group hover:border-slate-700 transition">
                            <div className="flex items-center justify-between mb-2 gap-2">
                              <h4 className="font-extrabold text-xs text-slate-100 truncate">{cliente.nome}</h4>
                              <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => abrirModalPerfil(cliente)} className="text-slate-400 hover:text-cyan-400 p-1 cursor-pointer"><User className="w-3.5 h-3.5" /></button>
                                <button onClick={() => abrirModalEditar(cliente)} className="text-slate-400 hover:text-cyan-400 p-1 cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => marcarComoNaoFechou(cliente.id)} className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"><UserX className="w-3.5 h-3.5" /></button>
                                <button onClick={() => excluirCliente(cliente.id)} className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-300 font-medium truncate">{cliente.empresa}</p>

                            <div className="mt-3 bg-[#040612] border border-slate-800 p-2.5 rounded-xl flex items-center justify-between font-mono gap-2">
                              <strong className="text-emerald-400 text-xs font-black whitespace-nowrap">R$ {cliente.valorPago}</strong>
                              <span className="text-[9px] text-cyan-400 font-bold truncate">{cliente.formaPagamento}</span>
                            </div>

                            {cliente.statusOutbound === "03_abordagem" && (
                              <button onClick={() => enviarWhatsAppMensagemAviso(cliente, "03_abordagem_outbound")} className="mt-3 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black p-2.5 rounded-xl text-[10px] flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:brightness-110 transition whitespace-nowrap">
                                <Send className="w-3.5 h-3.5 shrink-0" /> Enviar Abordagem c/ Vídeo
                              </button>
                            )}

                            {cliente.statusOutbound === "04_fechamento" && (
                              <button onClick={() => enviarWhatsAppMensagemAviso(cliente, "04_fechamento_outbound")} className="mt-3 w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black p-2.5 rounded-xl text-[10px] flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:brightness-110 transition whitespace-nowrap">
                                <Send className="w-3.5 h-3.5 shrink-0" /> Enviar Aviso de Fechamento
                              </button>
                            )}

                            {deveMostrarBotaoContrato(cliente) && (
                              <button onClick={() => setModalContrato(cliente)} className="mt-3 w-full bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 py-2 px-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md animate-pulse whitespace-nowrap">
                                <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Gerar Contrato PDF
                              </button>
                            )}

                            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                              <span className="text-[9px] text-slate-400 uppercase font-mono font-bold whitespace-nowrap">Mover:</span>
                              <div className="flex items-center gap-1.5">
                                {COLUNAS_OUTBOUND.map((col) => (
                                  <button key={col.id} onClick={() => moverStatusOutbound(cliente.id, col.id)} title={col.titulo} className={`w-3.5 h-3.5 rounded-full cursor-pointer transition ${cliente.statusOutbound === col.id ? "bg-cyan-400 ring-2 ring-cyan-400/30 scale-110" : "bg-slate-700 hover:bg-slate-500"}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 3: TAREFAS */}
          {menuAtivo === "tarefas" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-indigo-500/20 via-blue-500/10 to-transparent border border-indigo-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-indigo-400 shrink-0" /> Sprints Ativos em Desenvolvimento ({clientesAtivosEmProducao.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {clientesAtivosEmProducao.map((cliente) => {
                  const tarefas = cliente.tarefasTecnicas || [];
                  const concluidas = tarefas.filter(t => t.concluida).length;
                  const progresso = tarefas.length > 0 ? Math.round((concluidas / tarefas.length) * 100) : 0;

                  return (
                    <div key={cliente.id} className="bg-[#070b19] border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between backdrop-blur-md">
                      <div>
                        <div className="flex items-center justify-between mb-3 gap-2">
                          <span className="text-[9px] font-mono uppercase font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 truncate">
                            {cliente.pacote}
                          </span>
                          <span className="text-xs font-mono font-black text-cyan-400 whitespace-nowrap">{progresso}% Concluído</span>
                        </div>

                        <h4 className="font-extrabold text-sm text-white truncate">{cliente.nome}</h4>
                        <p className="text-xs text-slate-300 mb-4 truncate">{cliente.empresa}</p>

                        <div className="w-full bg-[#040612] rounded-full h-2.5 mb-5 border border-slate-800 overflow-hidden">
                          <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-500" style={{ width: `${progresso}%` }} />
                        </div>

                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {tarefas.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => alternarTarefaCliente(cliente.id, t.id)}
                              className={`w-full text-left p-3 rounded-xl text-xs flex items-center gap-3 transition-all cursor-pointer border ${t.concluida ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300 line-through opacity-80" : "bg-[#040612] border-slate-800 text-slate-300 hover:border-slate-700"}`}
                            >
                              {t.concluida ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-500 shrink-0" />}
                              <span className="leading-tight">{t.titulo}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono whitespace-nowrap">{concluidas} de {tarefas.length} tarefas</span>
                        <div className="space-x-3 whitespace-nowrap">
                          <button onClick={() => abrirModalPerfil(cliente)} className="text-cyan-400 hover:underline font-bold cursor-pointer">Perfil</button>
                          <button onClick={() => abrirModalEditar(cliente)} className="text-slate-300 hover:underline font-bold cursor-pointer">Editar</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA 4: MANUTENÇÃO MRR */}
          {menuAtivo === "manutencao" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-[#070b19] border border-emerald-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                  <span className="text-xs text-slate-400 uppercase font-mono font-bold whitespace-nowrap">MRR Mensal</span>
                  <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1 whitespace-nowrap">R$ {totalMRR.toLocaleString("pt-BR")}/mês</h3>
                </div>
                <div className="bg-[#070b19] border border-cyan-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                  <span className="text-xs text-slate-400 uppercase font-mono font-bold whitespace-nowrap">Assinantes Ativos</span>
                  <h3 className="text-2xl font-black text-cyan-400 font-mono mt-1 whitespace-nowrap">{clientesManutencao.length} Clientes</h3>
                </div>
              </div>

              <div className="bg-[#070b19] border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <h3 className="text-sm font-black text-white whitespace-nowrap">Contratos de Manutenção Mensal Vigentes</h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <input 
                      type="text" 
                      placeholder="Filtrar por nome ou empresa..." 
                      value={filtroManutencaoTexto} 
                      onChange={e => setFiltroManutencaoTexto(e.target.value)} 
                      className="bg-[#040612] border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white outline-none focus:border-emerald-500 transition w-full sm:w-60" 
                    />
                    <input 
                      type="number" 
                      min="1" 
                      max="31" 
                      placeholder="Dia Venc." 
                      value={filtroManutencaoVencimento} 
                      onChange={e => setFiltroManutencaoVencimento(e.target.value)} 
                      className="bg-[#040612] border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-white outline-none focus:border-emerald-500 transition w-28 font-mono" 
                    />
                  </div>
                </div>

                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="pb-3 whitespace-nowrap">Cliente / Empresa</th>
                      <th className="pb-3 whitespace-nowrap">WhatsApp</th>
                      <th className="pb-3 whitespace-nowrap">Vencimento</th>
                      <th className="pb-3 whitespace-nowrap">Mensalidade</th>
                      <th className="pb-3 text-right whitespace-nowrap">Ações & Cobrança</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {clientesManutencao.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/30">
                        <td className="py-4">
                          <strong className="text-white block font-bold text-xs truncate max-w-[180px]">{c.nome}</strong>
                          <span className="text-slate-400 text-[10px] font-mono truncate block max-w-[180px]">{c.empresa}</span>
                        </td>
                        <td className="py-4 font-mono text-cyan-400 font-bold whitespace-nowrap">{c.whatsapp}</td>
                        <td className="py-4 font-mono text-amber-400 whitespace-nowrap">Todo dia {c.diaVencimentoManutencao}</td>
                        <td className="py-4 font-mono text-emerald-400 font-black text-sm whitespace-nowrap">R$ {c.valorPlanoManutencao}/mês</td>
                        <td className="py-4 text-right space-x-2 whitespace-nowrap">
                          <button onClick={() => abrirModalPerfil(c)} className="text-cyan-400 hover:underline font-bold cursor-pointer">Perfil</button>
                          <button onClick={() => abrirModalEditar(c)} className="text-slate-300 hover:underline font-bold cursor-pointer">Editar</button>
                          <button onClick={() => enviarCobrancaManutencaoWhatsApp(c)} className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 px-3.5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md transition whitespace-nowrap">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Cobrar no WhatsApp
                          </button>
                        </td>
                      </tr>
                    ))}
                    {clientesManutencao.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-mono">Nenhum cliente correspondente aos filtros de manutenção.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA 5: NÃO FECHADOS */}
          {menuAtivo === "naofechados" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="bg-[#070b19] border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md overflow-x-auto">
                <h3 className="text-sm font-black text-white mb-4 whitespace-nowrap">Leads Não Fechados ({clientesNaoFechados.length})</h3>
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="pb-3 whitespace-nowrap">Cliente / Empresa</th>
                      <th className="pb-3 whitespace-nowrap">WhatsApp</th>
                      <th className="pb-3 whitespace-nowrap">Motivo Informado</th>
                      <th className="pb-3 text-right whitespace-nowrap">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {clientesNaoFechados.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/30">
                        <td className="py-4">
                          <strong className="text-white block font-bold text-xs truncate max-w-[180px]">{c.nome}</strong>
                          <span className="text-slate-400 text-[10px] font-mono truncate block max-w-[180px]">{c.empresa}</span>
                        </td>
                        <td className="py-4 font-mono text-cyan-400 font-bold whitespace-nowrap">{c.whatsapp}</td>
                        <td className="py-4 text-slate-300 italic max-w-xs truncate">{c.motivoNaoFechou || "Não informado"}</td>
                        <td className="py-4 text-right space-x-2 whitespace-nowrap">
                          <button onClick={() => abrirModalPerfil(c)} className="text-cyan-400 hover:underline font-bold cursor-pointer">Perfil</button>
                          <button onClick={() => abrirModalEditar(c)} className="text-slate-300 hover:underline font-bold cursor-pointer">Editar</button>
                          <button onClick={() => reativarLead(c.id)} className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap">
                            <RefreshCw className="w-3 h-3 shrink-0" /> Reativar
                          </button>
                          <button onClick={() => excluirCliente(c.id)} className="bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap">
                            <Trash2 className="w-3 h-3 shrink-0" /> Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                    {clientesNaoFechados.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 font-mono">Nenhum lead na lista de não fechados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA 6: AGENTES */}
          {menuAtivo === "agentes" && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {AGENTES_IA.map((agente, idx) => (
                  <div key={idx} className="bg-[#070b19] border border-slate-800 p-6 rounded-3xl flex flex-col justify-between shadow-2xl backdrop-blur-md hover:border-slate-700 transition">
                    <div>
                      <span className={`text-[9px] uppercase font-black px-3 py-1 rounded-md border ${agente.cor} font-mono inline-block mb-3 shadow-sm whitespace-nowrap`}>
                        {agente.cargo}
                      </span>
                      <h4 className="font-black text-base text-white mb-2 truncate">{agente.nome}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{agente.descricao}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <a href={agente.link} target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:brightness-110 transition whitespace-nowrap">
                        Abrir Chat do Agente <ExternalLink className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA 7: CLIENTES 360° */}
          {menuAtivo === "clientes" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="bg-[#070b19] border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-4 overflow-x-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input 
                    type="text" 
                    placeholder="Pesquisar por nome ou empresa..." 
                    value={filtroTexto} 
                    onChange={e => setFiltroTexto(e.target.value)} 
                    className="bg-[#040612] border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-cyan-500 transition" 
                  />
                  <select 
                    value={filtroPacote} 
                    onChange={e => setFiltroPacote(e.target.value)} 
                    className="bg-[#040612] border border-slate-800 rounded-2xl p-3.5 text-xs text-white outline-none focus:border-cyan-500 transition"
                  >
                    <option value="TODOS">Todos os Pacotes</option>
                    <option value="Landing Page Express">Landing Page Express</option>
                    <option value="Site Institucional">Site Institucional</option>
                    <option value="E-commerce">E-commerce</option>
                  </select>
                  <button onClick={() => abrirModalNovo()} className="bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black px-5 py-3.5 rounded-2xl text-xs cursor-pointer shadow-lg hover:brightness-110 transition whitespace-nowrap">
                    + Adicionar Novo Cliente
                  </button>
                </div>

                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="pb-3 whitespace-nowrap">Cliente / Empresa</th>
                      <th className="pb-3 whitespace-nowrap">Etapa</th>
                      <th className="pb-3 whitespace-nowrap">Pacote</th>
                      <th className="pb-3 whitespace-nowrap">Valor</th>
                      <th className="pb-3 text-right whitespace-nowrap">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {clientesFiltradosBase.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/30">
                        <td className="py-4">
                          <strong className="text-white block font-bold text-xs truncate max-w-[200px]">{c.nome}</strong>
                          <span className="text-slate-400 text-[10px] font-mono truncate block max-w-[200px]">{c.empresa}</span>
                        </td>
                        <td className="py-4 text-slate-300 font-mono whitespace-nowrap">{getEtapaFormatada(c)}</td>
                        <td className="py-4 text-pink-400 font-bold whitespace-nowrap">{c.pacote}</td>
                        <td className="py-4 font-mono text-emerald-400 font-black whitespace-nowrap">R$ {c.valorPago}</td>
                        <td className="py-4 text-right space-x-2 whitespace-nowrap">
                          <button onClick={() => abrirModalPerfil(c)} className="text-cyan-400 hover:underline font-bold cursor-pointer">Perfil</button>
                          <button onClick={() => abrirModalEditar(c)} className="text-slate-300 hover:underline font-bold cursor-pointer">Editar</button>
                          <button onClick={() => excluirCliente(c.id)} className="text-rose-400 hover:underline font-bold cursor-pointer">Excluir</button>
                        </td>
                      </tr>
                    ))}
                    {clientesFiltradosBase.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 font-mono">Nenhum cliente encontrado com esses filtros.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ABA 8: FINANCEIRO */}
          {menuAtivo === "financeiro" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#070b19] border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                <div>
                  <h3 className="text-base font-black text-white whitespace-nowrap">Relatório Financeiro & Gerador PDF</h3>
                  <p className="text-xs text-slate-400 mt-1">Gere o relatório executivo detalhado com receitas por pacote, MRR e despesas.</p>
                </div>
                <button onClick={baixarRelatorioFinanceiroPDF} className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-teal-600 text-slate-950 font-black px-5 py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer hover:brightness-110 transition whitespace-nowrap">
                  <PrinterIcon className="w-4 h-4 stroke-[3] shrink-0" /> Gerar PDF do Financeiro
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-[#070b19] border border-emerald-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                  <span className="text-xs text-slate-400 uppercase font-mono font-bold flex items-center gap-1.5 whitespace-nowrap"><TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" /> Receita Total</span>
                  <h3 className="text-2xl font-black text-emerald-400 font-mono mt-1 whitespace-nowrap">R$ {totalReceitas.toLocaleString("pt-BR")}</h3>
                </div>
                <div className="bg-[#070b19] border border-rose-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                  <span className="text-xs text-slate-400 uppercase font-mono font-bold flex items-center gap-1.5 whitespace-nowrap"><TrendingDown className="w-4 h-4 text-rose-400 shrink-0" /> Despesas Totais</span>
                  <h3 className="text-2xl font-black text-rose-400 font-mono mt-1 whitespace-nowrap">R$ {totalDespesas.toLocaleString("pt-BR")}</h3>
                </div>
                <div className="bg-[#070b19] border border-cyan-500/30 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                  <span className="text-xs text-slate-400 uppercase font-mono font-bold flex items-center gap-1.5 whitespace-nowrap"><ArrowUpRight className="w-4 h-4 text-cyan-400 shrink-0" /> Lucro Líquido</span>
                  <h3 className="text-2xl font-black text-cyan-400 font-mono mt-1 whitespace-nowrap">R$ {lucroLiquido.toLocaleString("pt-BR")}</h3>
                </div>
              </div>

              <div className="bg-[#070b19] border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md space-y-5 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="text-sm font-black text-white whitespace-nowrap">Transações & Lançamentos Financeiros</h3>
                  <button onClick={() => setModalTransacao(true)} className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black px-4.5 py-3 rounded-xl text-xs cursor-pointer shadow-md whitespace-nowrap">
                    + Novo Lançamento
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select value={filtroTipoTransacao} onChange={e => setFiltroTipoTransacao(e.target.value)} className="bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none">
                    <option value="TODOS">Todos os Tipos</option>
                    <option value="Receita">Receita</option>
                    <option value="Manutenção MRR">Manutenção MRR</option>
                    <option value="Despesa">Despesa</option>
                  </select>
                  <input type="date" value={filtroDataInicio} onChange={e => setFiltroDataInicio(e.target.value)} className="bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none" />
                  <input type="date" value={filtroDataFim} onChange={e => setFiltroDataFim(e.target.value)} className="bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none" />
                </div>

                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="pb-3 whitespace-nowrap">Data</th>
                      <th className="pb-3 whitespace-nowrap">Descrição</th>
                      <th className="pb-3 whitespace-nowrap">Tipo / Categoria</th>
                      <th className="pb-3 text-right whitespace-nowrap">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {transacoesFiltradas.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/30">
                        <td className="py-4 font-mono text-slate-400 whitespace-nowrap">{t.data}</td>
                        <td className="py-4 text-white font-bold truncate max-w-[250px]">{t.descricao}</td>
                        <td className="py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase ${t.tipo === "Receita" || t.tipo === "Manutenção MRR" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/15 text-rose-400 border border-rose-500/30"}`}>
                            {t.tipo} {t.pacoteAssociado ? `• ${t.pacoteAssociado}` : ""}
                          </span>
                        </td>
                        <td className={`py-4 text-right font-mono font-black whitespace-nowrap ${t.tipo === "Receita" || t.tipo === "Manutenção MRR" ? "text-emerald-400" : "text-rose-400"}`}>
                          {t.tipo === "Receita" || t.tipo === "Manutenção MRR" ? `+ R$ ${t.valor.toLocaleString("pt-BR")}` : `- R$ ${t.valor.toLocaleString("pt-BR")}`}
                        </td>
                      </tr>
                    ))}
                    {transacoesFiltradas.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 font-mono">Nenhuma transação encontrada no período.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAIS (MANTIDOS E COMPATÍVEIS) */}
      {modalCliente && (
        <div className="fixed inset-0 bg-[#040612]/90 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-[#070b19] border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative z-50 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-white mb-5">{clienteEmEdicao ? "Editar Cliente" : "Cadastrar Novo Cliente"}</h3>
            <form onSubmit={handleSalvarCliente} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select value={origem} onChange={e => setOrigem(e.target.value as any)} className="bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none">
                  <option value="Inbound (Instagram / Leads)">Inbound (Instagram)</option>
                  <option value="Outbound (Prospecção Ativa)">Outbound (Prospecção Ativa)</option>
                </select>
                <select value={pacote} onChange={e => { const p = e.target.value as any; setPacote(p); setValorPago(getValorTabela(p)); }} className="bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none">
                  <option value="Landing Page Express">Landing Page Express (R$ 750)</option>
                  <option value="Site Institucional">Site Institucional (R$ 1.500)</option>
                  <option value="E-commerce">E-commerce (R$ 2.400)</option>
                </select>
              </div>

              <input type="text" placeholder="Nome do Cliente / Responsável *" required value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none" />
              <input type="text" placeholder="Empresa / Nicho *" required value={empresa} onChange={e => setEmpresa(e.target.value)} className="w-full bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="CPF ou CNPJ" value={documento} onChange={e => setDocumento(aplicarMascaraDocumento(e.target.value))} className="w-full bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none font-mono" />
                <input type="text" placeholder="WhatsApp *" required value={whatsapp} onChange={e => setWhatsapp(aplicarMascaraWhatsapp(e.target.value))} className="w-full bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none font-mono" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Forma de Pagamento" value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)} className="w-full bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none" />
                <input type="number" placeholder="Valor do Projeto (R$)" required value={valorPago} onChange={e => setValorPago(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none font-mono" />
              </div>

              <div className="bg-[#040612] p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-cyan-400 shrink-0" /> Contratou Plano Mensal de Manutenção?
                  </label>
                  <input type="checkbox" checked={temPlanoManutencao} onChange={e => setTemPlanoManutencao(e.target.checked)} className="w-4 h-4 accent-cyan-500 cursor-pointer" />
                </div>

                {temPlanoManutencao && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <input type="number" placeholder="Valor Mensal (R$)" value={valorPlanoManutencao} onChange={e => setValorPlanoManutencao(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-[#070b19] border border-slate-800 rounded-xl p-3 text-xs text-white font-mono outline-none" />
                    <input type="number" min="1" max="31" placeholder="Dia do Vencimento" value={diaVencimentoManutencao} onChange={e => setDiaVencimentoManutencao(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-[#070b19] border border-slate-800 rounded-xl p-3 text-xs text-white font-mono outline-none" />
                  </div>
                )}
              </div>

              <textarea rows={2} placeholder="Anotações..." value={notasAnotacoes} onChange={e => setNotasAnotacoes(e.target.value)} className="w-full bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none" />

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setModalCliente(false)} className="w-1/2 bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl text-xs font-bold cursor-pointer transition">Cancelar</button>
                <button type="submit" className="w-1/2 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 py-3.5 rounded-xl text-xs font-black cursor-pointer shadow-lg hover:brightness-110 transition">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalTransacao && (
        <div className="fixed inset-0 bg-[#040612]/90 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-[#070b19] border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative z-50">
            <h3 className="text-base font-black text-white mb-5">Novo Lançamento Financeiro</h3>
            <form onSubmit={handleSalvarTransacao} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select value={tipoTrans} onChange={e => setTipoTrans(e.target.value as any)} className="bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none">
                  <option value="Receita">Receita</option>
                  <option value="Manutenção MRR">Manutenção MRR</option>
                  <option value="Despesa">Despesa</option>
                </select>

                {tipoTrans === "Despesa" ? (
                  <input type="text" placeholder="Nome da Despesa *" required value={descTrans} onChange={e => setDescTrans(e.target.value)} className="w-full bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none" />
                ) : (
                  <select value={pacoteTrans} onChange={e => setPacoteTrans(e.target.value)} className="bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none">
                    <option value="Landing Page Express">Landing Page Express</option>
                    <option value="Site Institucional">Site Institucional</option>
                    <option value="E-commerce">E-commerce</option>
                  </select>
                )}
              </div>

              {tipoTrans !== "Despesa" && (
                <input type="text" placeholder="Descrição da Transação *" required value={descTrans} onChange={e => setDescTrans(e.target.value)} className="w-full bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white outline-none" />
              )}

              <input type="number" placeholder="Valor (R$) *" required value={valTrans} onChange={e => setValTrans(e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-[#040612] border border-slate-800 rounded-xl p-3.5 text-xs text-white font-mono outline-none" />

              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setModalTransacao(false)} className="w-1/2 bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl text-xs font-bold cursor-pointer transition">Cancelar</button>
                <button type="submit" className="w-1/2 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 py-3.5 rounded-xl text-xs font-black cursor-pointer shadow-lg hover:brightness-110 transition">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalPerfilCliente && (
        <div className="fixed inset-0 bg-[#040612]/90 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-[#070b19] border border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative z-50 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-base font-black text-white">{modalPerfilCliente.nome}</h3>
              <button onClick={() => setModalPerfilCliente(null)} className="text-slate-400 hover:text-white cursor-pointer p-1.5 rounded-lg bg-slate-800">✕</button>
            </div>
            <div className="space-y-4 text-xs">
              <p className="text-slate-400">Empresa: <strong className="text-white">{modalPerfilCliente.empresa}</strong></p>
              <p className="text-slate-400">WhatsApp: <strong className="text-cyan-400 font-mono">{modalPerfilCliente.whatsapp}</strong></p>
              <p className="text-slate-400">Garantia: <strong className="text-emerald-400 font-mono">{calcularTempoRestanteGarantia(modalPerfilCliente.dataInicioGarantia).texto}</strong></p>
              <div className="bg-[#040612] p-4 rounded-2xl border border-slate-800">
                <p className="text-slate-300 italic">{modalPerfilCliente.notasAnotacoes || "Sem anotações."}</p>
              </div>
            </div>
            <div className="pt-5 flex gap-3">
              <button onClick={() => setModalPerfilCliente(null)} className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl text-xs font-bold cursor-pointer transition">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* RELATORIO FINANCEIRO IMPRESSAO */}
      <div className="hidden">
        <div ref={relatorioFinanceiroRef} style={{ fontFamily: 'Inter, sans-serif', color: '#0f172a', background: '#ffffff', padding: '10mm' }}>
          <h1 style={{ fontSize: '16pt', fontWeight: 800, textAlign: 'center', marginBottom: '4px', textTransform: 'uppercase', color: '#0f172a' }}>WEZANC TECHNOLOGY</h1>
          <p style={{ fontSize: '10pt', textAlign: 'center', fontWeight: 600, color: '#334155', marginBottom: '20px' }}>Relatório Financeiro Executivo Consolidado</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
            <tbody>
              <tr>
                <td style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: '8pt', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Receita Total</span>
                  <strong style={{ fontSize: '14pt', color: '#047857' }}>R$ {totalReceitas.toLocaleString("pt-BR")}</strong>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', borderRight: '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: '8pt', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Despesas Totais</span>
                  <strong style={{ fontSize: '14pt', color: '#b91c1c' }}>R$ {totalDespesas.toLocaleString("pt-BR")}</strong>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '8pt', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Lucro Líquido</span>
                  <strong style={{ fontSize: '14pt', color: '#0369a1' }}>R$ {lucroLiquido.toLocaleString("pt-BR")}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '11pt', fontWeight: 700, borderBottom: '2px solid #0f172a', paddingBottom: '4px', marginBottom: '10px' }}>Detalhamento de Receitas por Pacotes & MRR</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '9.5pt' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Categoria / Produto</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Valor Arrecadado</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px' }}>Landing Page Express</td>
                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {receitaLandingPage.toLocaleString("pt-BR")}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px' }}>Site Institucional</td>
                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {receitaInstitucional.toLocaleString("pt-BR")}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px' }}>E-commerce</td>
                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {receitaEcommerce.toLocaleString("pt-BR")}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '8px' }}>Manutenção Recorrente (MRR)</td>
                <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#047857' }}>R$ {receitaManutencaoMRR.toLocaleString("pt-BR")}</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ fontSize: '11pt', fontWeight: 700, borderBottom: '2px solid #0f172a', paddingBottom: '4px', marginBottom: '10px' }}>Lançamentos de Despesas</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5pt' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Data</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Descrição da Despesa</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.filter(t => t.tipo === "Despesa").map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px' }}>{t.data}</td>
                  <td style={{ padding: '8px' }}>{t.descricao}</td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#b91c1c' }}>- R$ {t.valor.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CONTRATO PDF */}
      {modalContrato && (
        <div className="fixed inset-0 bg-[#040612]/90 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-[#070b19] border border-slate-800 rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl relative z-50 max-h-[90vh] overflow-y-auto text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="text-sm font-black text-white font-mono">CONTRATO OFICIAL DE PRESTAÇÃO DE SERVIÇOS • WEZANC</h3>
              <button onClick={() => setModalContrato(null)} className="text-slate-400 hover:text-white cursor-pointer p-1.5 rounded-lg bg-slate-800">✕</button>
            </div>

            <div ref={contratoRef} className="space-y-4 text-[10pt] leading-relaxed bg-white p-8 rounded-2xl border border-slate-300 font-sans text-slate-900 shadow-inner">
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
                      <span style={{ fontSize: '9.5pt', color: '#1e293b', display: 'block' }}>Empresa / Nicho: <strong>{modalContrato.empresa}</strong></span>
                      <span style={{ fontSize: '9.5pt', color: '#334155', display: 'block' }}>CPF/CNPJ: <strong>{modalContrato.documento || "Não informado"}</strong></span>
                      <span style={{ fontSize: '9.5pt', color: '#334155', display: 'block' }}>WhatsApp: <strong>{modalContrato.whatsapp}</strong></span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ backgroundColor: '#f1f5f9', borderLeft: '4px solid #0284c7', padding: '12px 14px', borderRadius: '0 6px 6px 0', marginBottom: '16px' }}>
                <strong style={{ color: '#0369a1', fontSize: '8.5pt', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>RESUMO EXECUTIVO DO PROJETO</strong>
                <p style={{ margin: '3px 0', color: '#0f172a' }}><strong>Pacote Contratado:</strong> <span style={{ color: '#1e3a8a', fontWeight: 700 }}>{modalContrato.pacote}</span></p>
                <p style={{ margin: '3px 0', color: '#0f172a' }}><strong>Valor do Investimento:</strong> <span style={{ color: '#047857', fontFamily: 'monospace', fontWeight: 700 }}>R$ {modalContrato.valorPago.toLocaleString("pt-BR")}</span></p>
                <p style={{ margin: '3px 0', color: '#0f172a' }}><strong>Forma de Pagamento:</strong> <span style={{ color: '#b45309', fontWeight: 700 }}>{modalContrato.formaPagamento}</span></p>
                <p style={{ margin: '3px 0', color: '#0f172a' }}><strong>Garantia Técnica de Código:</strong> <span style={{ color: '#047857', fontWeight: 700 }}>30 dias corridos pós-publicação</span></p>
                {modalContrato.temPlanoManutencao && (
                  <p style={{ margin: '6px 0 0 0', color: '#047857', fontWeight: 700, borderTop: '1px dashed #cbd5e1', paddingTop: '6px' }}>Plano de Manutenção Mensal Ativo: R$ {modalContrato.valorPlanoManutencao}/mês (Vencimento todo dia {modalContrato.diaVencimentoManutencao})</p>
                )}
              </div>

              <p style={{ margin: '8px 0', textAlign: 'justify' }}><strong>CLÁUSULA PRIMEIRA - DO OBJETO E ESCOPO:</strong> O presente contrato tem por objeto a prestação de serviços técnicos de desenvolvimento web e software pela CONTRATADA para a criação do projeto referente ao pacote <strong>{modalContrato.pacote}</strong> da empresa CONTRATANTE.</p>
              
              <p style={{ margin: '8px 0', textAlign: 'justify' }}><strong>CLÁUSULA SEGUNDA - DOS PRAZOS E FORNECIMENTO DE MATERIAL:</strong> O prazo de desenvolvimento iniciará após a entrega total de logotipos, imagens e textos pelo CONTRATANTE.</p>
              
              <p style={{ margin: '8px 0', textAlign: 'justify' }}><strong>CLÁUSULA TERCEIRA - DO VALOR E FORMA DE PAGAMENTO:</strong> Pelos serviços acordados, o CONTRATANTE pagará o valor fixo de <strong>R$ {modalContrato.valorPago.toLocaleString("pt-BR")}</strong> via <strong>{modalContrato.formaPagamento}</strong>.</p>
              
              <p style={{ margin: '8px 0', textAlign: 'justify' }}><strong>CLÁUSULA QUARTA - DA GARANTIA TÉCNICA (30 DIAS):</strong> A CONTRATADA concede 30 (trinta) dias de garantia técnica integral, contados a partir da data de publicação do projeto.</p>
              
              <p style={{ margin: '8px 0', textAlign: 'justify' }}><strong>CLÁUSULA QUINTA - DE PERSONALIZAÇÕES FUTURAS:</strong> Qualquer pedido de alteração de layout ou inclusão de novas páginas solicitadas APÓS a aprovação final do projeto NÃO INTEGRAM este contrato.</p>
              
              <p style={{ margin: '8px 0', textAlign: 'justify' }}><strong>CLÁUSULA SEXTA - DA MANUTENÇÃO PREVENTIVA:</strong> Serviços de manutenção contínua e backups dependem da contratação de um Plano de Manutenção Mensal.</p>

              {modalContrato.temPlanoManutencao && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '6px', margin: '10px 0' }}>
                  <strong style={{ color: '#166534', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '8.5pt' }}>CLÁUSULA SÉTIMA (PARTE) - DO PLANO DE MANUTENÇÃO MENSAL (MRR):</strong>
                  <p style={{ margin: '3px 0', textAlign: 'justify', color: '#14532d' }}>Adicionalmente ao escopo de desenvolvimento, o CONTRATANTE contrata o Plano Mensal no valor de <strong>R$ {modalContrato.valorPlanoManutencao} por mês</strong>, com vencimento todo dia <strong>{modalContrato.diaVencimentoManutencao}</strong>.</p>
                </div>
              )}

              <p style={{ margin: '8px 0', textAlign: 'justify' }}><strong>CLÁUSULA OITAVA - PROPRIEDADE INTELECTUAL:</strong> Com a quitação integral do valor acordado, os direitos de uso do projeto final pertencem ao CONTRATANTE.</p>
              
              <p style={{ margin: '8px 0', textAlign: 'justify' }}><strong>CLÁUSULA NONA - DO FORO:</strong> As partes elegem o Foro da Comarca de Pouso Alegre - MG.</p>

              <table style={{ width: '100%', marginTop: '35px', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', padding: '0 20px' }}>
                      <div style={{ borderTop: '1px solid #475569', paddingTop: '8px', fontSize: '9.5pt', fontWeight: 600, color: '#1e293b' }}>
                        WEZANC TECHNOLOGY<br /><span style={{ fontWeight: 400, fontSize: '8.5pt', color: '#64748b' }}>Zenildo Pereira Cruz Neto (Contratada)</span>
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

            <div className="flex flex-wrap gap-3 pt-6">
              <button onClick={() => setModalContrato(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3.5 rounded-xl text-xs font-bold cursor-pointer transition">Fechar</button>
              <button onClick={() => enviarWhatsAppContrato(modalContrato)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition whitespace-nowrap">
                <Send className="w-4 h-4 shrink-0" /> Enviar no WhatsApp
              </button>
              <button onClick={baixarContratoPDF} className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md hover:brightness-110 transition whitespace-nowrap">
                <FileDown className="w-4 h-4 stroke-[3] shrink-0" /> Salvar em PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}