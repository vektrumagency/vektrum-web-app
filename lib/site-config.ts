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
    bookCallUrl: "mailto:vektrum.agency@gmail.com?subject=Free%20AI%20Audit%20request",
    domain: "vecktrum-agency.com"
  },
  locales: {
    en: {
      navItems: [
        { href: "#calculator", label: "Savings Calculator" },
        { href: "#services", label: "Capabilities" },
        { href: "#process", label: "Free Audit" },
        { href: "#use-cases", label: "Use Cases" },
        { href: "#contact", label: "Contact" }
      ],
      hero: {
        eyebrow: "Free AI Audit",
        title: "Discover where AI can save time, money, and manual work in your business.",
        subtitle:
          "Vektrum analyzes your workflows and identifies real AI automation opportunities with no commitment.",
        primaryCta: "Book a Free AI Audit",
        secondaryCta: "See how it works",
        auditLabel: "Free operational audit",
        proofPoints: ["No commitment", "Practical recommendations", "Built for SMEs and service teams"]
      },
      valueProp: {
        eyebrow: "Why Vektrum",
        title: "Automation that creates measurable operational gains.",
        description:
          "We design high-leverage AI systems that remove manual friction, reduce execution delay, and improve how your team works every day.",
        highlights: [
          { metric: "15-40h", description: "Average weekly hours reclaimed after core workflow automation." },
          { metric: "2-6 weeks", description: "Typical implementation window for production-ready systems." },
          { metric: "Practical", description: "Systems designed around your workflows, tools, and operating reality." }
        ],
        teamsLabel: "Teams building with Vektrum"
      },
      heroStats: {
        dashboardLabel: "AI Audit Snapshot",
        liveLabel: "Estimate",
        hoursSavedLabel: "Potential Hours Saved / Month",
        automationsLabel: "Automation Opportunities",
        pipelineHealthLabel: "Manual Workload",
        pipelineHealthNote: "Most teams discover multiple repeatable workflows worth automating."
      },
      problemSection: {
        eyebrow: "The operational drag",
        title: "Manual work is costing more than it looks.",
        description:
          "Most companies already have valuable automation opportunities hidden inside daily admin, sales, support, and reporting routines."
      },
      problems: [
        "Repetitive processes consuming hours every week",
        "Data scattered across multiple tools",
        "Leads answered too late or not at all",
        "Teams stuck in admin work",
        "No clear idea where AI can actually be useful"
      ],
      solutionSection: {
        eyebrow: "What Vektrum builds",
        title: "Practical AI systems for smoother operations.",
        description:
          "We turn AI into usable business infrastructure: workflows, agents, integrations, and internal tools that reduce friction.",
        outcomes: [
          { title: "Fewer manual tasks", description: "Automate repeatable work so your team spends less time moving information between tools." },
          { title: "Faster response times", description: "Route leads, messages, and follow-ups automatically before opportunities go cold." },
          { title: "Cleaner operations", description: "Connect systems, standardize steps, and keep data easier to trust." },
          { title: "Scalable processes", description: "Build workflows that support growth without adding avoidable admin overhead." }
        ]
      },
      calculatorSection: {
        eyebrow: "Savings Calculator",
        title: "Put a number on the hours your team could reclaim.",
        description:
          "Use a simple estimate to see how much repetitive work may be worth automating, then use the audit to validate the opportunity.",
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
        ctaTitle: "Want to know if this potential is realistic for your business?",
        ctaLabel: "Book a Free AI Audit",
        disclaimer:
          "Indicative estimate. Actual results depend on the company’s workflows, tools, and operational volume."
      },
      servicesSection: {
        eyebrow: "Capabilities",
        title: "What Vektrum can build after the audit.",
        description:
          "Each system is designed around a real operational bottleneck, not around generic AI hype."
      },
      services: [
        { title: "AI agents for internal operations", description: "Assist teams with research, triage, data entry, document handling, and repeatable decisions." },
        { title: "Administrative process automation", description: "Reduce manual copy-paste work across finance, operations, support, and back-office tasks." },
        { title: "Tool integrations", description: "Connect CRMs, inboxes, spreadsheets, databases, calendars, and business apps into cleaner workflows." },
        { title: "Sales and follow-up automation", description: "Capture, qualify, route, and follow up with leads faster and more consistently." },
        { title: "Internal AI-powered systems", description: "Build focused tools that help your team search, summarize, classify, and act on business data." },
        { title: "Automated dashboards and reporting", description: "Turn scattered operational data into scheduled reporting and useful decision views." }
      ],
      processSection: {
        eyebrow: "How the free AI audit works",
        title: "A clear way to find the best first automation opportunities.",
        description:
          "The audit is free, practical, and built to show where AI can create measurable value in your current operation.",
        note: "Free and with no commitment."
      },
      processSteps: [
        { step: "01", title: "We schedule a short call", description: "We understand the company, team, tools, and where manual work is slowing things down." },
        { step: "02", title: "We map repetitive workflows", description: "Together we identify the recurring steps that consume time every week." },
        { step: "03", title: "We identify AI opportunities", description: "We separate realistic automation candidates from areas where AI would add little value." },
        { step: "04", title: "You receive practical recommendations", description: "You leave with clear next steps for what to automate first and why." }
      ],
      whySection: {
        eyebrow: "Practical positioning",
        title: "We do not sell AI for the hype. We build systems that solve real business problems.",
        description:
          "Vektrum starts with bottlenecks, constraints, and measurable outcomes before choosing the technology."
      },
      differentiators: [
        "We identify operational bottlenecks before proposing tools",
        "We design automations that fit your existing business",
        "We focus on reliability, adoption, and measurable time savings",
        "We build implementation-ready systems, not abstract AI demos"
      ],
      resultsSection: {
        eyebrow: "Outcomes",
        title: "What AI automation can improve.",
        description: "The best opportunities usually sit where volume, repetition, and slow handoffs meet."
      },
      results: [
        "Fewer hours lost to repetitive admin",
        "Faster sales and support response times",
        "Better organized data across tools",
        "More consistent internal workflows",
        "Processes that scale without extra overhead"
      ],
      useCasesSection: {
        eyebrow: "Use Cases",
        title: "Concrete examples across business types.",
        description:
          "The audit helps decide which of these patterns fits your company and where the strongest business case sits."
      },
      useCases: [
        { title: "Restaurants and hospitality", description: "Reservations, customer messages, supplier workflows, shift coordination, and reporting." },
        { title: "Local businesses", description: "Lead capture, follow-up, review requests, customer communication, and performance reporting." },
        { title: "E-commerce", description: "Customer support, order workflows, inventory alerts, product data, and post-purchase follow-ups." },
        { title: "Service businesses", description: "CRM updates, proposal generation, client onboarding, recurring admin, and project handoffs." },
        { title: "Real estate, finance, and consulting", description: "Document processing, research automation, reporting, compliance support, and client updates." }
      ],
      aboutSection: {
        eyebrow: "About",
        title: "Vektrum is your practical AI automation partner.",
        description:
          "We help companies find and implement automation opportunities that remove real operational friction.",
        body: "No inflated promises, just well-designed systems that fit the way your business works."
      },
      faqSection: {
        eyebrow: "FAQ",
        title: "Straight answers before the audit.",
        description: "A few practical details before booking the free AI audit."
      },
      faqs: [
        { question: "Is the AI audit really free?", answer: "Yes. The audit is free and has no commitment. It is designed to identify realistic automation opportunities." },
        { question: "Do we need to know exactly what we want automated?", answer: "No. The audit exists to help clarify where AI can be useful and where it is not worth applying yet." },
        { question: "Can you work with our existing tools?", answer: "Yes. We usually build around current CRMs, inboxes, spreadsheets, calendars, databases, and communication tools." },
        { question: "What happens after the audit?", answer: "You receive practical recommendations. If there is a strong fit, Vektrum can design and build the automation system." }
      ],
      reviewsSection: {
        eyebrow: "Reviews",
        title: "Trusted by teams that value execution.",
        description: "A few recent outcomes shared by Vektrum clients."
      },
      reviews: [
        { name: "Lucas Almeida", role: "COO", company: "NorthGrid", quote: "Vektrum replaced manual workflows that were wasting over 20 hours weekly. Execution was fast, clear, and production-ready." },
        { name: "Sara Bennett", role: "Founder", company: "Lumino Studio", quote: "Our lead qualification flow is now fully automated. Response times dropped and conversions improved within weeks." },
        { name: "Miguel Santos", role: "Operations Lead", company: "Arcwell", quote: "They built practical automations around our existing tools. No hype, just systems that work and scale." }
      ],
      finalCtaSection: {
        eyebrow: "Free AI Audit",
        title: "Ready to discover where AI can save time in your business?",
        description:
          "Book the audit and leave with a clearer view of where automation can create practical value.",
        cta: "Book a Free AI Audit"
      },
      contactSection: {
        eyebrow: "Request the audit",
        title: "Tell us where your team loses time.",
        description:
          "Share a few details and we will help identify the first workflows worth reviewing in your free AI audit.",
        cta: "Book a Free AI Audit",
        submit: "Request Free AI Audit"
      },
      footer: {
        description:
          "AI automation systems for businesses that want to save time, reduce manual work, and operate with more clarity.",
        quickLinksTitle: "Quick Links",
        contactTitle: "Contact",
        contactNote: "Free AI audit requests and business inquiries",
        responseNote: "Typical response time: within one business day.",
        quickLinks: [
          { label: "Savings Calculator", href: "#calculator" },
          { label: "Capabilities", href: "#services" },
          { label: "Free Audit", href: "#process" },
          { label: "Use Cases", href: "#use-cases" },
          { label: "Contact", href: "#contact" }
        ]
      }
    },
    "pt-PT": {
      navItems: [
        { href: "#calculator", label: "Calculadora" },
        { href: "#services", label: "Capacidades" },
        { href: "#process", label: "Auditoria Gratuita" },
        { href: "#use-cases", label: "Casos de Uso" },
        { href: "#contact", label: "Contacto" }
      ],
      hero: {
        eyebrow: "Auditoria Gratuita de Inteligência Artificial",
        title: "Descubra onde a Inteligência Artificial pode poupar tempo, dinheiro e trabalho manual na sua empresa.",
        subtitle:
          "A Vektrum analisa os seus processos e identifica oportunidades reais de automação com IA sem compromisso.",
        primaryCta: "Marcar Auditoria Gratuita",
        secondaryCta: "Ver como funciona",
        auditLabel: "Auditoria operacional gratuita",
        proofPoints: ["Sem compromisso", "Recomendações práticas", "Criado para PME e empresas de serviços"]
      },
      valueProp: {
        eyebrow: "Porquê a Vektrum",
        title: "Automação com impacto operacional mensurável.",
        description:
          "Desenhamos sistemas de IA práticos que removem fricção manual, reduzem atrasos e melhoram a eficiência da sua equipa.",
        highlights: [
          { metric: "15-40h", description: "Média de horas semanais recuperadas após automatizar processos críticos." },
          { metric: "2-6 semanas", description: "Prazo típico de implementação para sistemas prontos para produção." },
          { metric: "Prático", description: "Sistemas desenhados à volta dos seus processos, ferramentas e realidade operacional." }
        ],
        teamsLabel: "Equipas a construir com a Vektrum"
      },
      heroStats: {
        dashboardLabel: "Resumo da Auditoria de IA",
        liveLabel: "Estimativa",
        hoursSavedLabel: "Potencial de Horas Poupadas / Mês",
        automationsLabel: "Oportunidades de Automação",
        pipelineHealthLabel: "Carga de Trabalho Manual",
        pipelineHealthNote: "A maioria das equipas descobre vários processos repetitivos com potencial de automação."
      },
      problemSection: {
        eyebrow: "O peso operacional",
        title: "O trabalho manual custa mais do que parece.",
        description:
          "Muitas empresas já têm oportunidades de automação escondidas nas rotinas diárias de administração, vendas, suporte e reporting."
      },
      problems: [
        "Processos repetitivos a consumir horas todas as semanas",
        "Dados espalhados por várias ferramentas",
        "Leads que chegam tarde ou ficam sem resposta",
        "Equipas presas a tarefas administrativas",
        "Falta de clareza sobre onde aplicar IA de forma prática"
      ],
      solutionSection: {
        eyebrow: "O que a Vektrum constrói",
        title: "Sistemas de IA práticos para operações mais eficientes.",
        description:
          "Transformamos IA em infraestrutura útil para a empresa: processos, agentes, integrações e ferramentas internas que reduzem fricção.",
        outcomes: [
          { title: "Menos tarefas manuais", description: "Automatizar processos repetitivos para a sua equipa perder menos tempo a mover informação entre ferramentas." },
          { title: "Respostas mais rápidas", description: "Encaminhar leads, mensagens e follow-ups automaticamente antes de as oportunidades arrefecerem." },
          { title: "Operações mais organizadas", description: "Ligar sistemas, normalizar passos e tornar os dados mais fáceis de confiar." },
          { title: "Processos escaláveis", description: "Criar fluxos que suportam crescimento sem acrescentar carga administrativa desnecessária." }
        ]
      },
      calculatorSection: {
        eyebrow: "Calculadora de Poupança",
        title: "Dê um valor às horas que a sua equipa pode recuperar.",
        description:
          "Use uma estimativa simples para perceber quanto trabalho repetitivo pode justificar automação e valide a oportunidade na auditoria.",
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
        ctaTitle: "Quer perceber se este potencial é realista para a sua empresa?",
        ctaLabel: "Marque uma Auditoria Gratuita de IA",
        disclaimer:
          "Estimativa indicativa. Os resultados reais dependem dos processos, ferramentas e volume operacional da empresa."
      },
      servicesSection: {
        eyebrow: "Capacidades",
        title: "O que a Vektrum pode construir depois da auditoria.",
        description:
          "Cada sistema é desenhado à volta de um bloqueio operacional real, não de promessas genéricas sobre IA."
      },
      services: [
        { title: "Agentes de IA para operações internas", description: "Apoiar equipas em pesquisa, triagem, introdução de dados, análise documental e decisões repetitivas." },
        { title: "Automatização de processos administrativos", description: "Reduzir trabalho manual em finanças, operações, suporte e tarefas de back-office." },
        { title: "Integrações entre ferramentas", description: "Ligar CRM, email, folhas de cálculo, bases de dados, calendários e aplicações de negócio." },
        { title: "Automação de vendas e follow-ups", description: "Captar, qualificar, encaminhar e acompanhar leads com mais rapidez e consistência." },
        { title: "Sistemas internos com IA", description: "Criar ferramentas focadas para pesquisar, resumir, classificar e agir sobre dados da empresa." },
        { title: "Dashboards e reporting automático", description: "Transformar dados dispersos em relatórios programados e vistas úteis para decisão." }
      ],
      processSection: {
        eyebrow: "Como funciona a auditoria gratuita",
        title: "Uma forma clara de encontrar as melhores primeiras automações.",
        description:
          "A auditoria é gratuita, prática e pensada para mostrar onde a IA pode criar valor mensurável na sua operação atual.",
        note: "Gratuita e sem compromisso."
      },
      processSteps: [
        { step: "01", title: "Marcamos uma chamada breve", description: "Percebemos a empresa, equipa, ferramentas e onde o trabalho manual está a atrasar a operação." },
        { step: "02", title: "Mapeamos os processos mais repetitivos", description: "Identificamos os passos recorrentes que consomem tempo todas as semanas." },
        { step: "03", title: "Identificamos oportunidades de automação com IA", description: "Separamos oportunidades realistas de áreas onde a IA ainda não acrescenta valor suficiente." },
        { step: "04", title: "Entregamos recomendações práticas", description: "Fica com próximos passos claros sobre o que automatizar primeiro e porquê." }
      ],
      whySection: {
        eyebrow: "Posicionamento prático",
        title: "Não vendemos IA por moda. Criamos sistemas que resolvem problemas reais.",
        description:
          "A Vektrum começa pelos bloqueios, limitações e resultados mensuráveis antes de escolher a tecnologia."
      },
      differentiators: [
        "Identificamos bloqueios operacionais antes de propor ferramentas",
        "Desenhamos automações que se adaptam ao negócio existente",
        "Focamo-nos em fiabilidade, adoção e poupança de tempo mensurável",
        "Construímos sistemas prontos a implementar, não demos abstratas de IA"
      ],
      resultsSection: {
        eyebrow: "Resultados",
        title: "O que a automação com IA pode melhorar.",
        description: "As melhores oportunidades aparecem onde existem volume, repetição e passagens lentas entre pessoas ou ferramentas."
      },
      results: [
        "Menos horas perdidas em tarefas administrativas repetitivas",
        "Respostas mais rápidas em vendas e suporte",
        "Dados mais organizados entre ferramentas",
        "Processos internos mais consistentes",
        "Operações que escalam com menos carga adicional"
      ],
      useCasesSection: {
        eyebrow: "Casos de Uso",
        title: "Exemplos concretos para vários tipos de negócio.",
        description:
          "A auditoria ajuda a decidir quais destes padrões fazem sentido para a sua empresa e onde está o melhor caso de negócio."
      },
      useCases: [
        { title: "Restauração e hotelaria", description: "Reservas, mensagens de clientes, processos com fornecedores, coordenação de turnos e reporting." },
        { title: "Negócios locais", description: "Captação de leads, follow-up, pedidos de avaliação, comunicação com clientes e relatórios." },
        { title: "Comércio eletrónico", description: "Suporte ao cliente, processos de encomendas, alertas de stock, dados de produto e pós-venda." },
        { title: "Empresas de serviços", description: "Atualizações de CRM, criação de propostas, onboarding de clientes, administração recorrente e passagens de projeto." },
        { title: "Imobiliário, finanças e consultoria", description: "Processamento documental, pesquisa automática, reporting, apoio a conformidade e atualizações a clientes." }
      ],
      aboutSection: {
        eyebrow: "Sobre",
        title: "A Vektrum é o seu parceiro prático de automação com IA.",
        description:
          "Ajudamos empresas a encontrar e implementar oportunidades de automação que removem fricção operacional real.",
        body: "Sem promessas inflacionadas, apenas sistemas bem desenhados que se adaptam à forma como a sua empresa trabalha."
      },
      faqSection: {
        eyebrow: "FAQ",
        title: "Respostas diretas antes da auditoria.",
        description: "Alguns detalhes práticos antes de marcar a auditoria gratuita de IA."
      },
      faqs: [
        { question: "A auditoria de IA é mesmo gratuita?", answer: "Sim. A auditoria é gratuita e sem compromisso. Serve para identificar oportunidades realistas de automação." },
        { question: "Temos de saber exatamente o que queremos automatizar?", answer: "Não. A auditoria existe precisamente para clarificar onde a IA pode ser útil e onde ainda não vale a pena aplicar." },
        { question: "Conseguem trabalhar com as nossas ferramentas atuais?", answer: "Sim. Normalmente construímos sobre CRM, email, folhas de cálculo, calendários, bases de dados e ferramentas de comunicação existentes." },
        { question: "O que acontece depois da auditoria?", answer: "Recebe recomendações práticas. Se existir bom enquadramento, a Vektrum pode desenhar e implementar o sistema de automação." }
      ],
      reviewsSection: {
        eyebrow: "Avaliações",
        title: "Equipas que valorizam execução confiam na Vektrum.",
        description: "Alguns resultados partilhados por clientes recentes."
      },
      reviews: [
        { name: "Rita Lopes", role: "COO", company: "NorthGrid", quote: "A Vektrum substituiu tarefas manuais críticas e devolveu mais de 20 horas semanais à equipa." },
        { name: "João Pereira", role: "Fundador", company: "Lumino Studio", quote: "O fluxo de qualificação de leads ficou totalmente automatizado e melhorou a conversão." },
        { name: "Inês Carvalho", role: "Responsável de Operações", company: "Arcwell", quote: "Implementação rápida, foco no negócio e sistemas fiáveis desde o primeiro dia." }
      ],
      finalCtaSection: {
        eyebrow: "Auditoria Gratuita de IA",
        title: "Pronto para descobrir onde a IA pode poupar tempo à sua empresa?",
        description:
          "Marque a auditoria e saia com uma visão mais clara sobre onde a automação pode criar valor prático.",
        cta: "Marcar Auditoria Gratuita"
      },
      contactSection: {
        eyebrow: "Pedir auditoria",
        title: "Diga-nos onde a sua equipa perde tempo.",
        description:
          "Partilhe alguns detalhes e ajudamos a identificar os primeiros processos que vale a pena rever na auditoria gratuita de IA.",
        cta: "Marcar Auditoria Gratuita",
        submit: "Pedir Auditoria Gratuita de IA"
      },
      footer: {
        description:
          "Sistemas de automação com IA para empresas que querem poupar tempo, reduzir trabalho manual e operar com mais clareza.",
        quickLinksTitle: "Links Rápidos",
        contactTitle: "Contacto",
        contactNote: "Pedidos de auditoria gratuita de IA e contactos comerciais",
        responseNote: "Tempo típico de resposta: até um dia útil.",
        quickLinks: [
          { label: "Calculadora", href: "#calculator" },
          { label: "Capacidades", href: "#services" },
          { label: "Auditoria Gratuita", href: "#process" },
          { label: "Casos de Uso", href: "#use-cases" },
          { label: "Contacto", href: "#contact" }
        ]
      }
    }
  }
};
