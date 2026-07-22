export type Locale = "en" | "pt-PT";

type SectionIntro = {
  eyebrow: string;
  title: string;
  description: string;
};

type CardItem = {
  title: string;
  description: string;
};

export type SiteConfig = {
  brand: {
    email: string;
    bookCallUrl: string;
    domain: string;
  };
  locales: Record<
    Locale,
    {
      navItems: { href: string; label: string }[];
      hero: {
        eyebrow: string;
        title: string;
        subtitle: string;
        primaryCta: string;
        secondaryCta: string;
        auditLabel: string;
        proofPoints: string[];
      };
      valueProp: {
        eyebrow: string;
        title: string;
        description: string;
        highlights: { metric: string; description: string }[];
        teamsLabel: string;
      };
      heroStats: {
        dashboardLabel: string;
        liveLabel: string;
        hoursSavedLabel: string;
        automationsLabel: string;
        pipelineHealthLabel: string;
        pipelineHealthNote: string;
        flowLabels: string[];
      };
      problemSection: SectionIntro;
      problems: string[];
      solutionSection: SectionIntro & { outcomes: CardItem[] };
      calculatorSection: SectionIntro & {
        employeesLabel: string;
        employeesHint: string;
        hoursLabel: string;
        hoursHint: string;
        hourlyCostLabel: string;
        hourlyCostHint: string;
        automationLabel: string;
        automationHint: string;
        resultsTitle: string;
        hoursSavedLabel: string;
        monthlySavingsLabel: string;
        yearlySavingsLabel: string;
        ctaTitle: string;
        ctaLabel: string;
        disclaimer: string;
      };
      servicesSection: SectionIntro;
      services: CardItem[];
      processSection: SectionIntro & { note: string };
      processSteps: { step: string; title: string; description: string }[];
      whySection: SectionIntro;
      differentiators: string[];
      resultsSection: SectionIntro;
      results: string[];
      useCasesSection: SectionIntro;
      useCases: CardItem[];
      aboutSection: { eyebrow: string; title: string; description: string; body: string };
      faqSection: SectionIntro;
      faqs: { question: string; answer: string }[];
      reviewsSection: SectionIntro;
      reviews: { name: string; role: string; company: string; quote: string }[];
      finalCtaSection: {
        eyebrow: string;
        title: string;
        description: string;
        cta: string;
      };
      contactSection: { eyebrow: string; title: string; description: string; cta: string; submit: string };
      footer: {
        description: string;
        quickLinksTitle: string;
        contactTitle: string;
        contactNote: string;
        responseNote: string;
        quickLinks: { label: string; href: string }[];
      };
    }
  >;
};

export const defaultSiteConfig: SiteConfig = {
  brand: {
    email: "vektrum.agency@gmail.com",
    bookCallUrl: "https://tally.so/r/Gxq2OQ",
    domain: "vecktrum-agency.com"
  },
  locales: {
    en: {
      navItems: [
        { href: "/setores?lang=en", label: "Sectors" },
        { href: "/?lang=en#services", label: "Capabilities" },
        { href: "/?lang=en#process", label: "Process" },
        { href: "/?lang=en#use-cases", label: "Use Cases" },
        { href: "/?lang=en#calculator", label: "Savings" },
        { href: "/?lang=en#contact", label: "Audit" }
      ],
      hero: {
        eyebrow: "Automation partner for modern teams",
        title: "Automate the work that slows your business down.",
        subtitle:
          "We design and build automation systems that save hours every week, reduce manual work, and help your team focus on what actually grows the business.",
        primaryCta: "Free AI audit",
        secondaryCta: "See the process",
        auditLabel: "Operational audit",
        proofPoints: ["Practical automation map", "Built around your current tools", "No hype, no generic AI demos"]
      },
      valueProp: {
        eyebrow: "Why Vektrum",
        title: "Automation designed around business reality.",
        description:
          "Vektrum helps teams find the repetitive work, slow handoffs, and scattered tools that quietly drain time, then builds systems that remove that friction.",
        highlights: [
          { metric: "Hours", description: "Reclaimed from admin, reporting, follow-ups, and data movement." },
          { metric: "Faster", description: "Lead handling, support triage, internal approvals, and routine execution." },
          { metric: "Practical", description: "Systems shaped around the tools and workflows your team already uses." }
        ],
        teamsLabel: "Built for operations-heavy teams"
      },
      heroStats: {
        dashboardLabel: "Automation audit snapshot",
        liveLabel: "Priority map",
        hoursSavedLabel: "Manual hours to review",
        automationsLabel: "Bottlenecks found",
        pipelineHealthLabel: "Operational drag",
        pipelineHealthNote: "The strongest opportunities usually sit where volume, repetition, and slow handoffs meet.",
        flowLabels: ["Lead captured", "CRM updated", "Follow-up queued"]
      },
      problemSection: {
        eyebrow: "The hidden cost",
        title: "Repetitive work compounds every week.",
        description:
          "A few manual steps may look harmless. Across sales, support, admin, reporting, and follow-ups, they become slower response times and expensive operational drag."
      },
      problems: [
        "Leads wait while teams copy details between tools",
        "Customer support loses time sorting routine requests",
        "Reports depend on manual spreadsheet updates",
        "CRM records are incomplete or updated too late",
        "Follow-ups rely on memory instead of reliable workflows"
      ],
      solutionSection: {
        eyebrow: "What Vektrum builds",
        title: "Practical automation systems, not AI theater.",
        description:
          "We start with the operational bottleneck, then design the right workflow, integration, assistant, or internal tool to make the process faster and easier to trust.",
        outcomes: [
          { title: "Less manual admin", description: "Reduce repetitive data entry, copy-paste work, scheduling, reminders, and routine back-office tasks." },
          { title: "Faster lead handling", description: "Capture, qualify, route, and follow up with opportunities before momentum disappears." },
          { title: "Cleaner internal workflows", description: "Connect CRMs, inboxes, spreadsheets, dashboards, and team tools into dependable operating flows." },
          { title: "Better team focus", description: "Move recurring work into reliable systems so people spend more time on work that grows the business." }
        ]
      },
      calculatorSection: {
        eyebrow: "Savings estimate",
        title: "Put a number on the manual work.",
        description:
          "Estimate how many hours repetitive work may be costing, then use the audit to identify which workflows are worth automating first.",
        employeesLabel: "Employees involved",
        employeesHint: "People doing repetitive or admin work",
        hoursLabel: "Hours per employee / week",
        hoursHint: "Average repetitive work per person",
        hourlyCostLabel: "Average hourly cost",
        hourlyCostHint: "Fully loaded internal cost estimate",
        automationLabel: "Automation potential",
        automationHint: "Conservative share of the process that could be automated",
        resultsTitle: "Estimated automation upside",
        hoursSavedLabel: "Hours saved / month",
        monthlySavingsLabel: "Estimated monthly savings",
        yearlySavingsLabel: "Estimated yearly savings",
        ctaTitle: "Want to know which workflows are actually worth automating?",
        ctaLabel: "Free AI audit",
        disclaimer:
          "Indicative estimate. Actual results depend on workflow volume, tool access, process quality, and team adoption."
      },
      servicesSection: {
        eyebrow: "Capabilities",
        title: "Automation for the operational work businesses repeat every day.",
        description:
          "Vektrum builds focused systems for the points where teams lose time, miss follow-ups, or move information by hand."
      },
      services: [
        { title: "Lead management automation", description: "Capture, enrich, qualify, route, and follow up with leads across forms, CRM, email, and calendars." },
        { title: "Customer support workflows", description: "Classify requests, prepare responses, escalate exceptions, and keep support data organized." },
        { title: "Reporting and dashboards", description: "Turn scattered operational data into scheduled reports and decision-ready internal views." },
        { title: "Admin workflow automation", description: "Automate recurring back-office tasks, document handling, reminders, updates, and handoffs." },
        { title: "CRM and tool integrations", description: "Keep CRM, inboxes, spreadsheets, databases, and internal tools in sync with fewer manual steps." },
        { title: "Internal AI assistants", description: "Build focused assistants for search, summarization, triage, drafting, and repeatable knowledge work." }
      ],
      processSection: {
        eyebrow: "Process",
        title: "From audit to a working automation system.",
        description:
          "The first step is a clear audit of where automation can create commercial value. If there is a fit, we map, build, test, deploy, and improve the system.",
        note: "The audit is free and focused on practical next steps."
      },
      processSteps: [
        { step: "01", title: "Audit", description: "We review the team, tools, repetitive tasks, missed handoffs, and places where work slows down." },
        { step: "02", title: "Automation map", description: "We prioritize the workflows with the strongest business case and define what should happen automatically." },
        { step: "03", title: "Build and integrate", description: "We create the workflow, agent, dashboard, or internal tool and connect it to your existing stack." },
        { step: "04", title: "Test and deploy", description: "We validate edge cases, document the process, launch with the team, and improve based on real usage." }
      ],
      whySection: {
        eyebrow: "Positioning",
        title: "A serious automation partner for real business operations.",
        description:
          "Vektrum is built for companies that want less operational friction, not novelty AI. The work starts with process clarity and ends with systems people can rely on."
      },
      differentiators: [
        "We diagnose operational bottlenecks before choosing tools",
        "We design around your current stack instead of forcing a new one",
        "We focus on adoption, reliability, and measurable time savings",
        "We explain what should not be automated as clearly as what should"
      ],
      resultsSection: {
        eyebrow: "Outcomes",
        title: "Where automation creates business leverage.",
        description:
          "The right systems reduce busywork, tighten response times, and make operations easier to run as volume increases."
      },
      results: [
        "Fewer hours lost to repetitive admin",
        "Faster lead and customer response times",
        "Cleaner CRM and operational data",
        "More consistent follow-ups and handoffs",
        "Reporting that updates without manual chasing"
      ],
      useCasesSection: {
        eyebrow: "Use cases",
        title: "High-impact workflows Vektrum can automate.",
        description:
          "These are practical starting points for businesses that want faster operations without adding extra headcount or complexity."
      },
      useCases: [
        { title: "Client onboarding", description: "Automate contract creation, project folder setup, and welcome emails when a deal is closed won in your CRM." },
        { title: "Support triage", description: "Automatically tag incoming tickets by urgency, draft initial responses based on knowledge bases, and alert the team." },
        { title: "Lead routing", description: "Route new inbound leads instantly based on industry or region, setting reminders for sales reps to follow up." },
        { title: "Weekly reporting", description: "Pull weekly sales and support KPIs automatically, compile them into a PDF, and email it to management." },
        { title: "Data synchronization", description: "Keep Stripe purchases, operational Google Sheets, and CRM databases in sync automatically in real-time." },
        { title: "Meeting follow-ups", description: "Transcribe Zoom calls, extract action items, log them in your CRM under the client profile, and email follow-ups." }
      ],
      aboutSection: {
        eyebrow: "About",
        title: "Vektrum is your practical automation partner.",
        description:
          "We help businesses save time and reduce operational drag with systems that fit the way their teams already work.",
        body: "No inflated promises or fake futuristic demos. Just clear strategy, careful implementation, and automation that supports real workflows."
      },
      faqSection: {
        eyebrow: "FAQ",
        title: "Straight answers before the audit.",
        description: "A few practical details before requesting the free AI audit."
      },
      faqs: [
        { question: "Is the AI audit really free?", answer: "Yes. The audit is free and designed to identify practical automation opportunities with no commitment." },
        { question: "Do we need to know what we want automated?", answer: "No. The audit exists to find and prioritize the workflows where automation makes business sense." },
        { question: "Can you work with our existing tools?", answer: "Yes. We usually build around current CRMs, inboxes, spreadsheets, calendars, databases, and team tools." },
        { question: "What happens after the audit?", answer: "You receive a clearer automation map. If there is a strong fit, Vektrum can design and build the system." }
      ],
      reviewsSection: {
        eyebrow: "Proof",
        title: "Proof points are shared only when verified.",
        description: "Vektrum does not publish invented testimonials, logos, or results."
      },
      reviews: [],
      finalCtaSection: {
        eyebrow: "Free AI audit",
        title: "Find the work your team should not be doing manually.",
        description:
          "Use the free audit to identify the repetitive workflows, slow handoffs, and missed follow-ups that automation can remove first.",
        cta: "Free AI audit"
      },
      contactSection: {
        eyebrow: "Request the audit",
        title: "Start with the work that is slowing the business down.",
        description:
          "The audit form asks a few focused questions so we can understand your workflows and identify the first automation opportunities worth reviewing.",
        cta: "Free AI audit",
        submit: "Free AI audit"
      },
      footer: {
        description:
          "Practical automation systems for businesses that want to save time, reduce manual work, and operate with more clarity.",
        quickLinksTitle: "Quick Links",
        contactTitle: "Contact",
        contactNote: "Free AI audit requests and business inquiries",
        responseNote: "Typical response time: within one business day.",
        quickLinks: [
          { label: "Sectors", href: "/setores?lang=en" },
          { label: "Capabilities", href: "/?lang=en#services" },
          { label: "Process", href: "/?lang=en#process" },
          { label: "Use Cases", href: "/?lang=en#use-cases" },
          { label: "Savings", href: "/?lang=en#calculator" },
          { label: "Audit", href: "/?lang=en#contact" }
        ]
      }
    },
    "pt-PT": {
      navItems: [
        { href: "/setores", label: "Setores" },
        { href: "/#services", label: "Capacidades" },
        { href: "/#process", label: "Processo" },
        { href: "/#use-cases", label: "Casos de Uso" },
        { href: "/#calculator", label: "Poupança" },
        { href: "/#contact", label: "Auditoria" }
      ],
      hero: {
        eyebrow: "Parceiro de automação para equipas modernas",
        title: "Automatize o trabalho que abranda o seu negócio.",
        subtitle:
          "Desenhamos e construímos sistemas de automação que poupam horas todas as semanas, reduzem trabalho manual e ajudam a equipa a focar-se no que realmente faz crescer o negócio.",
        primaryCta: "Auditoria gratuita de IA",
        secondaryCta: "Ver o processo",
        auditLabel: "Auditoria operacional",
        proofPoints: ["Mapa de automação prático", "Construído à volta das suas ferramentas", "Sem hype nem demos genéricas de IA"]
      },
      valueProp: {
        eyebrow: "Porquê a Vektrum",
        title: "Automação desenhada para a realidade do negócio.",
        description:
          "A Vektrum ajuda equipas a encontrar trabalho repetitivo, passagens lentas e ferramentas dispersas que consomem tempo, e depois constrói sistemas para remover essa fricção.",
        highlights: [
          { metric: "Horas", description: "Recuperadas em administração, reporting, follow-ups e movimentação de dados." },
          { metric: "Mais rápido", description: "Tratamento de leads, suporte, aprovações internas e execução de rotinas." },
          { metric: "Prático", description: "Sistemas moldados às ferramentas e processos que a equipa já usa." }
        ],
        teamsLabel: "Criado para equipas com operações exigentes"
      },
      heroStats: {
        dashboardLabel: "Resumo da auditoria de automação",
        liveLabel: "Mapa prioritário",
        hoursSavedLabel: "Horas manuais a rever",
        automationsLabel: "Bloqueios encontrados",
        pipelineHealthLabel: "Peso operacional",
        pipelineHealthNote: "As melhores oportunidades costumam surgir onde há volume, repetição e passagens lentas.",
        flowLabels: ["Lead captada", "CRM atualizado", "Follow-up preparado"]
      },
      problemSection: {
        eyebrow: "O custo escondido",
        title: "O trabalho repetitivo acumula todas as semanas.",
        description:
          "Alguns passos manuais parecem inofensivos. Em vendas, suporte, administração, reporting e follow-ups, tornam-se respostas lentas e fricção operacional cara."
      },
      problems: [
        "Leads ficam à espera enquanto a equipa copia dados entre ferramentas",
        "O suporte perde tempo a separar pedidos repetitivos",
        "Relatórios dependem de atualizações manuais em folhas de cálculo",
        "O CRM fica incompleto ou é atualizado tarde demais",
        "Follow-ups dependem da memória em vez de fluxos fiáveis"
      ],
      solutionSection: {
        eyebrow: "O que a Vektrum constrói",
        title: "Sistemas de automação práticos, não teatro de IA.",
        description:
          "Começamos pelo bloqueio operacional e depois desenhamos o fluxo, integração, assistente ou ferramenta interna certa para tornar o processo mais rápido e fiável.",
        outcomes: [
          { title: "Menos administração manual", description: "Reduza introdução de dados, copy-paste, marcações, lembretes e tarefas recorrentes de back-office." },
          { title: "Tratamento de leads mais rápido", description: "Capture, qualifique, encaminhe e acompanhe oportunidades antes de perderem força." },
          { title: "Fluxos internos mais limpos", description: "Ligue CRM, emails, folhas de cálculo, dashboards e ferramentas da equipa em processos fiáveis." },
          { title: "Mais foco para a equipa", description: "Passe trabalho recorrente para sistemas estáveis para a equipa se concentrar no que faz crescer o negócio." }
        ]
      },
      calculatorSection: {
        eyebrow: "Estimativa de poupança",
        title: "Dê um valor ao trabalho manual.",
        description:
          "Estime quantas horas o trabalho repetitivo pode estar a custar e use a auditoria para identificar os processos certos para automatizar primeiro.",
        employeesLabel: "Colaboradores envolvidos",
        employeesHint: "Pessoas envolvidas em tarefas repetitivas ou administrativas",
        hoursLabel: "Horas por colaborador / semana",
        hoursHint: "Média de trabalho repetitivo por pessoa",
        hourlyCostLabel: "Custo médio por hora",
        hourlyCostHint: "Estimativa de custo interno total",
        automationLabel: "Potencial de automação",
        automationHint: "Percentagem conservadora do processo que pode ser automatizada",
        resultsTitle: "Potencial estimado de automação",
        hoursSavedLabel: "Horas poupadas / mês",
        monthlySavingsLabel: "Poupança mensal estimada",
        yearlySavingsLabel: "Poupança anual estimada",
        ctaTitle: "Quer saber quais processos valem mesmo a pena automatizar?",
        ctaLabel: "Auditoria gratuita de IA",
        disclaimer:
          "Estimativa indicativa. Os resultados reais dependem do volume dos processos, acesso às ferramentas, qualidade operacional e adoção pela equipa."
      },
      servicesSection: {
        eyebrow: "Capacidades",
        title: "Automação para o trabalho operacional que as empresas repetem todos os dias.",
        description:
          "A Vektrum constrói sistemas focados nos pontos onde as equipas perdem tempo, falham follow-ups ou movem informação manualmente."
      },
      services: [
        { title: "Automação de gestão de leads", description: "Captura, enriquecimento, qualificação, encaminhamento e follow-ups entre formulários, CRM, email e calendários." },
        { title: "Fluxos de suporte ao cliente", description: "Classificação de pedidos, rascunhos de resposta, escalonamento de exceções e reporting de suporte." },
        { title: "Reporting e dashboards", description: "Dados operacionais dispersos transformados em relatórios programados e vistas internas úteis." },
        { title: "Automação administrativa", description: "Tarefas recorrentes de back-office, documentos, lembretes, atualizações e passagens de trabalho." },
        { title: "Integrações com CRM e ferramentas", description: "CRM, emails, folhas de cálculo, bases de dados e ferramentas internas sincronizadas com menos passos manuais." },
        { title: "Assistentes internos com IA", description: "Assistentes focados em pesquisa, resumo, triagem, escrita e trabalho de conhecimento repetitivo." }
      ],
      processSection: {
        eyebrow: "Processo",
        title: "Da auditoria a um sistema de automação em funcionamento.",
        description:
          "O primeiro passo é uma auditoria clara sobre onde a automação pode criar valor comercial. Se houver enquadramento, mapeamos, construímos, testamos, lançamos e melhoramos.",
        note: "A auditoria é gratuita e focada em próximos passos práticos."
      },
      processSteps: [
        { step: "01", title: "Auditoria", description: "Revemos equipa, ferramentas, tarefas repetitivas, passagens falhadas e pontos onde o trabalho abranda." },
        { step: "02", title: "Mapa de automação", description: "Priorizamos os fluxos com melhor caso de negócio e definimos o que deve acontecer automaticamente." },
        { step: "03", title: "Construção e integração", description: "Criamos o fluxo, agente, dashboard ou ferramenta interna e ligamos ao stack existente." },
        { step: "04", title: "Teste e lançamento", description: "Validamos exceções, documentamos o processo, lançamos com a equipa e melhoramos com uso real." }
      ],
      whySection: {
        eyebrow: "Posicionamento",
        title: "Um parceiro de automação sério para operações reais.",
        description:
          "A Vektrum é para empresas que querem menos fricção operacional, não novidade tecnológica. O trabalho começa com clareza de processo e termina com sistemas fiáveis."
      },
      differentiators: [
        "Diagnosticamos bloqueios operacionais antes de escolher ferramentas",
        "Desenhamos à volta do seu stack atual em vez de impor um novo",
        "Focamo-nos em adoção, fiabilidade e poupança de tempo mensurável",
        "Explicamos o que não deve ser automatizado com a mesma clareza"
      ],
      resultsSection: {
        eyebrow: "Resultados",
        title: "Onde a automação cria vantagem operacional.",
        description:
          "Os sistemas certos reduzem trabalho repetitivo, aceleram respostas e tornam a operação mais fácil de gerir à medida que o volume cresce."
      },
      results: [
        "Menos horas perdidas em administração repetitiva",
        "Respostas mais rápidas a leads e clientes",
        "Dados de CRM e operação mais limpos",
        "Follow-ups e passagens de trabalho mais consistentes",
        "Reporting atualizado sem perseguição manual"
      ],
      useCasesSection: {
        eyebrow: "Casos de uso",
        title: "Processos de alto impacto que a Vektrum pode automatizar.",
        description:
          "Pontos de partida práticos para empresas que querem operações mais rápidas sem acrescentar equipa ou complexidade."
      },
      useCases: [
        { title: "Onboarding de clientes", description: "Envio automático de contratos, criação de pastas de projeto e notificações de boas-vindas assim que um negócio é ganho no CRM." },
        { title: "Triagem de suporte", description: "Classificação automática de tickets recebidos por urgência, sugestão de respostas baseadas em histórico e alertas no Slack." },
        { title: "Distribuição de leads", description: "Distribuição imediata de leads comerciais com base na indústria ou país da empresa, enviando alertas ao vendedor correto." },
        { title: "Relatórios operacionais", description: "KPIs semanais de vendas e suporte extraídos do CRM e enviados em formato PDF via email à equipa de gestão." },
        { title: "Atualização de bases de dados", description: "Sincronização bidirecional em tempo real entre dados de novos pedidos do Stripe, folha de cálculo operacional e o CRM." },
        { title: "Follow-ups de reuniões", description: "Resumos automáticos de reuniões de Zoom guardados nas notas do cliente, juntamente com o envio de tarefas propostas." }
      ],
      aboutSection: {
        eyebrow: "Sobre",
        title: "A Vektrum é o seu parceiro prático de automação.",
        description:
          "Ajudamos empresas a poupar tempo e reduzir fricção operacional com sistemas adaptados à forma como as equipas já trabalham.",
        body: "Sem promessas inflacionadas ou demos futuristas falsas. Apenas estratégia clara, implementação cuidada e automação que apoia processos reais."
      },
      faqSection: {
        eyebrow: "FAQ",
        title: "Respostas diretas antes da auditoria.",
        description: "Alguns detalhes práticos antes de pedir a auditoria gratuita de IA."
      },
      faqs: [
        { question: "A auditoria de IA é mesmo gratuita?", answer: "Sim. A auditoria é gratuita e serve para identificar oportunidades práticas de automação, sem compromisso." },
        { question: "Temos de saber o que queremos automatizar?", answer: "Não. A auditoria existe para encontrar e priorizar os processos onde a automação faz sentido para o negócio." },
        { question: "Conseguem trabalhar com as nossas ferramentas atuais?", answer: "Sim. Normalmente construímos sobre CRM, email, folhas de cálculo, calendários, bases de dados e ferramentas da equipa." },
        { question: "O que acontece depois da auditoria?", answer: "Recebe um mapa de automação mais claro. Se houver bom enquadramento, a Vektrum pode desenhar e construir o sistema." }
      ],
      reviewsSection: {
        eyebrow: "Prova",
        title: "Só publicamos prova quando é verificável.",
        description: "A Vektrum não publica testemunhos, logos ou resultados inventados."
      },
      reviews: [],
      finalCtaSection: {
        eyebrow: "Auditoria gratuita de IA",
        title: "Encontre o trabalho que a sua equipa não devia fazer manualmente.",
        description:
          "Use a auditoria gratuita para identificar os processos repetitivos, passagens lentas e follow-ups falhados que a automação pode remover primeiro.",
        cta: "Auditoria gratuita de IA"
      },
      contactSection: {
        eyebrow: "Pedir auditoria",
        title: "Comece pelo trabalho que está a abrandar o negócio.",
        description:
          "O formulário da auditoria faz algumas perguntas diretas para entendermos os seus processos e identificarmos as primeiras oportunidades de automação a rever.",
        cta: "Auditoria gratuita de IA",
        submit: "Auditoria gratuita de IA"
      },
      footer: {
        description:
          "Sistemas de automação práticos para empresas que querem poupar tempo, reduzir trabalho manual e operar com mais clareza.",
        quickLinksTitle: "Links Rápidos",
        contactTitle: "Contacto",
        contactNote: "Pedidos de auditoria gratuita de IA e contactos comerciais",
        responseNote: "Tempo típico de resposta: até um dia útil.",
        quickLinks: [
          { label: "Setores", href: "/setores" },
          { label: "Capacidades", href: "/#services" },
          { label: "Processo", href: "/#process" },
          { label: "Casos de Uso", href: "/#use-cases" },
          { label: "Poupança", href: "/#calculator" },
          { label: "Auditoria", href: "/#contact" }
        ]
      }
    }
  }
};
