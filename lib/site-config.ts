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
      featuredProjectsSection: SectionIntro;
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
    domain: "vektrum.agency"
  },
  locales: {
    en: {
      navItems: [
        { href: "/en/projetos", label: "Projects" },
        { href: "/en/diagnostico", label: "Audit" }
      ],
      hero: {
        eyebrow: "Process automation",
        title: "We automate manual, repetitive business processes.",
        subtitle:
          "We look at the everyday work: leads, support, reporting, CRM. Then we build the systems that automate what's currently done by hand.",
        primaryCta: "Free AI audit",
        secondaryCta: "See the process",
        auditLabel: "Operational audit",
        proofPoints: ["Reply within 1 business day", "Built around the tools you already use", "No-commitment audit"]
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
        eyebrow: "What usually happens",
        title: "Manual tasks that repeat every week.",
        description:
          "Copying an email into the CRM. Updating a spreadsheet. Confirming an order by hand. These are common in sales, support, and admin, and they add up to hours every week."
      },
      problems: [
        "A lead waits because nobody has copied their details into the CRM yet",
        "Support spends the morning sorting routine requests from urgent ones",
        "Friday's report depends on someone opening a spreadsheet and updating it by hand",
        "The CRM is missing information, or it's updated days too late",
        "Following up with a client depends on someone remembering, and they don't always remember"
      ],
      solutionSection: {
        eyebrow: "What we do",
        title: "What we build depends on what we find in the process.",
        description:
          "Sometimes the answer is connecting tools you already use, like your CRM and your inbox. Other times there's no existing tool that solves the problem, so we build a new one. We decide after looking at the process, not before.",
        outcomes: [
          { title: "Leads", description: "A lead lands in the CRM automatically, gets qualified, and the right salesperson is notified, without anyone copying anything by hand." },
          { title: "Support", description: "Tickets arrive already classified by urgency, with a first draft reply ready to review before it goes to the customer." },
          { title: "Reporting", description: "This week's numbers are pulled automatically from the tools where they already live and land in an inbox, so nobody has to open a spreadsheet." },
          { title: "Admin", description: "Documents, reminders, and updates that repeat every week start happening without anyone doing them by hand." }
        ]
      },
      calculatorSection: {
        eyebrow: "Savings estimate",
        title: "Savings calculator.",
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
        ctaTitle: "The audit shows which workflows to automate first.",
        ctaLabel: "Free AI audit",
        disclaimer:
          "Indicative estimate. Actual results depend on process volume, tool access, process quality, and how quickly the team adopts the new way of working."
      },
      servicesSection: {
        eyebrow: "Capabilities",
        title: "What we usually build.",
        description:
          "We focus on where teams lose the most time: leads, support, reporting, admin, and the tools that don't talk to each other."
      },
      services: [
        { title: "Lead management automation", description: "Capture, enrich, qualify, route, and follow up with leads across forms, CRM, email, and calendars." },
        { title: "Customer support workflows", description: "Classify requests, draft first responses, and escalate the exceptions that actually need a person." },
        { title: "Reporting and dashboards", description: "Scattered operational data turned into scheduled reports and views that management actually uses." },
        { title: "Admin workflow automation", description: "Automate recurring back-office tasks, document handling, reminders, updates, and handoffs." },
        { title: "CRM and tool integrations", description: "Keep CRM, inboxes, spreadsheets, databases, and internal tools in sync with fewer manual steps." },
        { title: "Internal AI assistants", description: "Build focused assistants for search, summarization, triage, drafting, and repeatable knowledge work." }
      ],
      processSection: {
        eyebrow: "Process",
        title: "From audit to a working automation system.",
        description:
          "The first step is a clear audit of where automation can create commercial value. If there is a fit, we map, build, test, deploy, and improve the system.",
        note: "The audit is free, with no sales pitch, just the next steps."
      },
      processSteps: [
        { step: "01", title: "Audit", description: "We review the team, tools, repetitive tasks, missed handoffs, and places where work slows down." },
        { step: "02", title: "Automation map", description: "We prioritize the workflows with the strongest business case and define what should happen automatically." },
        { step: "03", title: "Build and integrate", description: "We create the workflow, agent, dashboard, or internal tool and connect it to your existing stack." },
        { step: "04", title: "Test and deploy", description: "We validate edge cases, document the process, launch with the team, and improve based on real usage." }
      ],
      whySection: {
        eyebrow: "How we work",
        title: "Four things we do on every project.",
        description:
          "The technology (n8n, a CRM, an LLM) is a means, not the point. These four things stay the same across every project, regardless of what we end up building."
      },
      differentiators: [
        "We look at the process before picking any tool",
        "We work with what you already use (CRM, spreadsheets, email) instead of asking you to replace it all",
        "We measure what actually saves time, not what looks impressive in a demo",
        "We tell you when something isn't worth automating"
      ],
      resultsSection: {
        eyebrow: "Outcomes",
        title: "After automating.",
        description: "What usually changes for the teams we work with."
      },
      results: [
        "Fewer hours spent on repetitive admin",
        "Faster replies to leads and customers",
        "A CRM with more complete, more current data",
        "Follow-ups that no longer depend on someone remembering",
        "Reports that show up on their own, with nobody assembling them by hand"
      ],
      useCasesSection: {
        eyebrow: "Use cases",
        title: "A few concrete examples of what we automate.",
        description:
          "Practical starting points for teams that want to move faster without hiring more people or adding more complexity."
      },
      useCases: [
        { title: "Client onboarding", description: "Automate contract creation, project folder setup, and welcome emails when a deal is closed won in your CRM." },
        { title: "Support triage", description: "Automatically tag incoming tickets by urgency, draft initial responses based on knowledge bases, and alert the team." },
        { title: "Lead routing", description: "Route new inbound leads instantly based on industry or region, setting reminders for sales reps to follow up." },
        { title: "Weekly reporting", description: "Pull weekly sales and support KPIs automatically, compile them into a PDF, and email it to management." },
        { title: "Data synchronization", description: "Keep Stripe purchases, operational Google Sheets, and CRM databases in sync automatically in real-time." },
        { title: "Meeting follow-ups", description: "Transcribe Zoom calls, extract action items, log them in your CRM under the client profile, and email follow-ups." }
      ],
      featuredProjectsSection: {
        eyebrow: "Projects",
        title: "A few of the projects we've already built.",
        description: "Real examples, with client names attached. See more detail on the Projects page."
      },
      aboutSection: {
        eyebrow: "About",
        title: "Who we are.",
        description:
          "We build automation systems for businesses, starting from what they already have, or from something new when that's what the process needs.",
        body: "We'd rather show real work than promise generic results. The projects on the Projects page have client names attached and can be checked."
      },
      faqSection: {
        eyebrow: "FAQ",
        title: "Frequently asked questions.",
        description: "A few practical details before requesting the free AI audit."
      },
      faqs: [
        { question: "Is the AI audit really free?", answer: "Yes. The audit is free and designed to identify practical automation opportunities with no commitment." },
        { question: "Do we need to know what we want automated?", answer: "No. It's normal not to know exactly. The audit exists to find out what's actually worth automating first." },
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
        title: "Free audit, no commitment.",
        description:
          "An audit to find out which processes are worth automating first.",
        cta: "Free AI audit"
      },
      footer: {
        description:
          "Practical automation systems for businesses that want to save time, reduce manual work, and operate with more clarity.",
        quickLinksTitle: "Quick Links",
        contactTitle: "Contact",
        contactNote: "Free AI audit requests and business inquiries",
        responseNote: "Typical response time: within one business day.",
        quickLinks: [
          { label: "Projects", href: "/en/projetos" },
          { label: "Audit", href: "/en/diagnostico" }
        ]
      }
    },
    "pt-PT": {
      navItems: [
        { href: "/projetos", label: "Projetos" },
        { href: "/diagnostico", label: "Auditoria" }
      ],
      hero: {
        eyebrow: "Automação de processos",
        title: "Automatizamos processos manuais e repetitivos.",
        subtitle:
          "Olhamos para o dia a dia da equipa: leads, suporte, relatórios, CRM. Depois construímos os sistemas que faltam para automatizar o que hoje é feito à mão.",
        primaryCta: "Auditoria gratuita de IA",
        secondaryCta: "Ver o processo",
        auditLabel: "Auditoria operacional",
        proofPoints: ["Resposta em 1 dia útil", "Construído à volta das ferramentas que já usa", "Auditoria sem compromisso"]
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
        eyebrow: "O que costuma acontecer",
        title: "Tarefas manuais que se repetem todas as semanas.",
        description:
          "Copiar um email para o CRM. Atualizar uma folha de Excel. Confirmar um pedido à mão. São tarefas comuns em vendas, suporte e administração, e ocupam horas todas as semanas."
      },
      problems: [
        "Uma lead fica à espera porque ainda ninguém copiou os dados para o CRM",
        "O suporte passa a manhã a separar pedidos repetidos dos urgentes",
        "O relatório de sexta-feira depende de alguém abrir o Excel e atualizar tudo à mão",
        "O CRM tem informação a menos, ou só é atualizado dias depois",
        "O follow-up ao cliente depende de alguém se lembrar, e nem sempre se lembra"
      ],
      solutionSection: {
        eyebrow: "O que fazemos",
        title: "O que construímos depende do que encontramos no processo.",
        description:
          "Às vezes a resposta é ligar ferramentas que já usa, como o CRM ao email. Outras vezes não existe nenhuma ferramenta que resolva o problema, e construímos uma nova. Decidimos depois de ver o processo, não antes.",
        outcomes: [
          { title: "Leads", description: "A lead entra automaticamente no CRM, fica qualificada e o vendedor certo recebe um aviso, sem ninguém copiar nada à mão." },
          { title: "Suporte", description: "Os pedidos chegam já classificados por urgência, com uma primeira resposta pronta a rever antes de seguir para o cliente." },
          { title: "Relatórios", description: "Os números da semana são recolhidos automaticamente das ferramentas onde já existem e chegam por email, sem ninguém abrir o Excel." },
          { title: "Administração", description: "Documentos, lembretes e atualizações que se repetem todas as semanas passam a acontecer sem alguém ter de os fazer manualmente." }
        ]
      },
      calculatorSection: {
        eyebrow: "Estimativa de poupança",
        title: "Calculadora de poupança.",
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
        ctaTitle: "A auditoria mostra quais os processos a automatizar primeiro.",
        ctaLabel: "Auditoria gratuita de IA",
        disclaimer:
          "Estimativa indicativa. Os resultados reais dependem do volume dos processos, acesso às ferramentas, qualidade operacional e da rapidez com que a equipa passa a usar o novo processo."
      },
      servicesSection: {
        eyebrow: "Capacidades",
        title: "O que costumamos construir.",
        description:
          "Focamos nos sítios onde a equipa perde mais tempo: leads, suporte, relatórios, administração e ferramentas que não falam entre si."
      },
      services: [
        { title: "Automação de gestão de leads", description: "Captura, enriquecimento, qualificação, encaminhamento e follow-ups entre formulários, CRM, email e calendários." },
        { title: "Fluxos de suporte ao cliente", description: "Classificação de pedidos, rascunhos de resposta e escalonamento das excepções que precisam mesmo de uma pessoa." },
        { title: "Reporting e dashboards", description: "Dados dispersos por várias ferramentas transformados em relatórios automáticos e vistas que a gestão consegue mesmo usar." },
        { title: "Automação administrativa", description: "Tarefas recorrentes de back-office, documentos, lembretes, atualizações e passagens de trabalho entre pessoas." },
        { title: "Integrações com CRM e ferramentas", description: "CRM, emails, folhas de cálculo, bases de dados e ferramentas internas sincronizadas com menos passos manuais." },
        { title: "Assistentes internos com IA", description: "Assistentes focados em pesquisa, resumo, triagem e primeiras versões de texto para trabalho de conhecimento repetitivo." }
      ],
      processSection: {
        eyebrow: "Processo",
        title: "Da auditoria a um sistema de automação em funcionamento.",
        description:
          "O primeiro passo é uma auditoria clara sobre onde a automação pode criar valor comercial. Se houver enquadramento, mapeamos, construímos, testamos, lançamos e melhoramos.",
        note: "A auditoria é gratuita e sem apresentação de vendas, só os próximos passos."
      },
      processSteps: [
        { step: "01", title: "Auditoria", description: "Revemos equipa, ferramentas, tarefas repetitivas, passagens falhadas e pontos onde o trabalho abranda." },
        { step: "02", title: "Mapa de automação", description: "Priorizamos os fluxos com melhor caso de negócio e definimos o que deve acontecer automaticamente." },
        { step: "03", title: "Construção e integração", description: "Criamos o fluxo, agente, dashboard ou ferramenta interna e ligamos ao stack existente." },
        { step: "04", title: "Teste e lançamento", description: "Validamos exceções, documentamos o processo, lançamos com a equipa e melhoramos com uso real." }
      ],
      whySection: {
        eyebrow: "Como trabalhamos",
        title: "Quatro coisas que fazemos sempre.",
        description:
          "A tecnologia (n8n, um CRM, um LLM) é um meio, não o objetivo. Estas quatro coisas mantêm-se iguais em qualquer projeto, seja o que for que acabamos por construir."
      },
      differentiators: [
        "Olhamos para o processo antes de escolher qualquer ferramenta",
        "Trabalhamos com o que já usa (CRM, Excel, email) em vez de pedir para substituir tudo",
        "Medimos o que poupa tempo de facto, não o que parece impressionante numa demonstração",
        "Dizemos quando algo não vale a pena automatizar"
      ],
      resultsSection: {
        eyebrow: "Resultados",
        title: "Depois de automatizar.",
        description: "O que costuma mudar para as equipas com quem trabalhamos."
      },
      results: [
        "Menos horas gastas em administração repetitiva",
        "Respostas mais rápidas a leads e a clientes",
        "CRM com dados mais completos e mais atuais",
        "Follow-ups que já não dependem de ninguém se lembrar",
        "Relatórios que aparecem sozinhos, sem ninguém os montar à mão"
      ],
      useCasesSection: {
        eyebrow: "Casos de uso",
        title: "Alguns exemplos concretos do que automatizamos.",
        description:
          "Pontos de partida práticos para quem quer operar mais rápido sem contratar mais gente ou complicar o que já funciona."
      },
      useCases: [
        { title: "Onboarding de clientes", description: "Envio automático de contratos, criação de pastas de projeto e notificações de boas-vindas assim que um negócio é ganho no CRM." },
        { title: "Triagem de suporte", description: "Classificação automática de tickets recebidos por urgência, sugestão de respostas baseadas em histórico e alertas no Slack." },
        { title: "Distribuição de leads", description: "Distribuição imediata de leads comerciais com base na indústria ou país da empresa, enviando alertas ao vendedor correto." },
        { title: "Relatórios operacionais", description: "KPIs semanais de vendas e suporte extraídos do CRM e enviados em formato PDF via email à equipa de gestão." },
        { title: "Atualização de bases de dados", description: "Sincronização bidirecional em tempo real entre dados de novos pedidos do Stripe, folha de cálculo operacional e o CRM." },
        { title: "Follow-ups de reuniões", description: "Resumos automáticos de reuniões de Zoom guardados nas notas do cliente, juntamente com o envio de tarefas propostas." }
      ],
      featuredProjectsSection: {
        eyebrow: "Projetos",
        title: "Alguns dos projetos que já fizemos.",
        description: "Exemplos reais, com nome de cliente. Veja mais detalhe na página de Projetos."
      },
      aboutSection: {
        eyebrow: "Sobre",
        title: "Quem somos.",
        description:
          "Construímos sistemas de automação a partir do que o negócio já tem ou, quando o processo exige, de algo novo.",
        body: "Preferimos mostrar trabalho real a prometer resultados genéricos. Os projetos na página de Projetos têm nome de cliente e podem ser confirmados."
      },
      faqSection: {
        eyebrow: "FAQ",
        title: "Perguntas frequentes.",
        description: "Alguns detalhes práticos antes de pedir a auditoria gratuita de IA."
      },
      faqs: [
        { question: "A auditoria de IA é mesmo gratuita?", answer: "Sim. A auditoria é gratuita e serve para identificar oportunidades práticas de automação, sem compromisso." },
        { question: "Temos de saber o que queremos automatizar?", answer: "Não. É normal não saber ao certo. A auditoria serve exatamente para descobrir onde vale a pena automatizar primeiro." },
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
        title: "Auditoria gratuita, sem compromisso.",
        description:
          "Uma auditoria para identificar os processos que vale a pena automatizar primeiro.",
        cta: "Auditoria gratuita de IA"
      },
      footer: {
        description:
          "Sistemas de automação práticos para empresas que querem poupar tempo, reduzir trabalho manual e operar com mais clareza.",
        quickLinksTitle: "Links Rápidos",
        contactTitle: "Contacto",
        contactNote: "Pedidos de auditoria gratuita de IA e contactos comerciais",
        responseNote: "Tempo típico de resposta: até um dia útil.",
        quickLinks: [
          { label: "Projetos", href: "/projetos" },
          { label: "Auditoria", href: "/diagnostico" }
        ]
      }
    }
  }
};
