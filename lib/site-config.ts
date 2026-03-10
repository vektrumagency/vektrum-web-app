export type Locale = "en" | "pt-PT";

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
      servicesSection: { eyebrow: string; title: string; description: string };
      services: { title: string; description: string }[];
      processSection: { eyebrow: string; title: string; description: string };
      processSteps: { step: string; title: string; description: string }[];
      whySection: { eyebrow: string; title: string; description: string };
      differentiators: string[];
      resultsSection: { eyebrow: string; title: string; description: string };
      results: string[];
      useCasesSection: { eyebrow: string; title: string; description: string };
      useCases: { title: string; description: string }[];
      aboutSection: { eyebrow: string; title: string; description: string; body: string };
      faqSection: { eyebrow: string; title: string; description: string };
      faqs: { question: string; answer: string }[];
      reviewsSection: { eyebrow: string; title: string; description: string };
      reviews: { name: string; role: string; company: string; quote: string }[];
      contactSection: { eyebrow: string; title: string; description: string; cta: string; submit: string };
      footer: { quickLinksTitle: string; contactTitle: string; quickLinks: { label: string; href: string }[] };
    }
  >;
};

export const defaultSiteConfig: SiteConfig = {
  brand: {
    email: "vektrum.agency@gmail.com",
    bookCallUrl: "mailto:vektrum.agency@gmail.com?subject=Book%20a%20Call",
    domain: "vecktrum-agency.com"
  },
  locales: {
    en: {
      navItems: [
        { href: "#services", label: "Services" },
        { href: "#process", label: "Process" },
        { href: "#use-cases", label: "Use Cases" },
        { href: "#reviews", label: "Reviews" },
        { href: "#faq", label: "FAQ" },
        { href: "#contact", label: "Contact" }
      ],
      hero: {
        eyebrow: "AI Automation Agency",
        title: "Build intelligent workflows that move your business faster.",
        subtitle:
          "Vektrum helps teams eliminate repetitive work, streamline operations, and deploy custom AI systems that save time at scale.",
        primaryCta: "Book a Call",
        secondaryCta: "See Services"
      },
      valueProp: {
        eyebrow: "Why Vektrum",
        title: "Automation that creates measurable operational gains.",
        description:
          "We design high-leverage AI systems that remove manual friction, reduce execution delay, and improve how your team works every day.",
        highlights: [
          { metric: "15-40h", description: "Average weekly hours reclaimed after core workflow automation." },
          { metric: "2-6 weeks", description: "Typical implementation window for production-ready systems." },
          { metric: "Reliable", description: "Process logic built with monitoring, guardrails, and clear ownership." }
        ],
        teamsLabel: "Teams building with Vektrum"
      },
      heroStats: {
        dashboardLabel: "Operations Dashboard",
        liveLabel: "Live",
        hoursSavedLabel: "Hours Saved / Week",
        automationsLabel: "Automations",
        pipelineHealthLabel: "Pipeline Health",
        pipelineHealthNote: "82% of key workflows fully automated"
      },
      servicesSection: {
        eyebrow: "Services",
        title: "Built to automate the work that slows growth.",
        description:
          "Vektrum delivers practical AI systems that improve throughput, remove repetitive execution, and keep operations predictable."
      },
      services: [
        { title: "AI Automation", description: "Automate repetitive workflows across your tools so your team can focus on higher-value work." },
        { title: "Workflow Optimization", description: "Map and redesign operational flows to remove bottlenecks, reduce handoffs, and increase output." },
        { title: "Custom AI Agents", description: "Deploy business-specific AI agents trained to execute tasks, assist teams, and support decisions." },
        { title: "Lead Generation Systems", description: "Build intelligent lead capture, enrichment, routing, and qualification pipelines end-to-end." },
        { title: "Internal Business Tools", description: "Create tailored internal apps that centralize data, actions, and reporting for operational clarity." },
        { title: "CRM / Support / Sales Automations", description: "Integrate and automate customer-facing systems to accelerate response time and improve consistency." }
      ],
      processSection: {
        eyebrow: "How It Works",
        title: "A clear system from analysis to continuous improvement.",
        description: "We keep delivery structured and transparent so you know exactly what gets built, why it matters, and how it performs."
      },
      processSteps: [
        { step: "01", title: "Audit", description: "We analyze your current operations, tools, and bottlenecks to identify high-impact automation opportunities." },
        { step: "02", title: "Strategy", description: "We design a practical implementation roadmap aligned with your business goals and team workflows." },
        { step: "03", title: "Build", description: "We develop and integrate your custom AI automations with clean architecture and clear documentation." },
        { step: "04", title: "Optimize", description: "We monitor performance, iterate flows, and continuously improve system reliability and efficiency." }
      ],
      whySection: {
        eyebrow: "Why Choose Vektrum",
        title: "A practical AI partner focused on business outcomes.",
        description: "We prioritize execution quality, operational fit, and long-term reliability over trendy demos."
      },
      differentiators: [
        "Tailored solutions built around your operations",
        "Fast implementation with clear milestones",
        "Business-first strategy focused on measurable outcomes",
        "Scalable systems designed for growth",
        "Real-world automation that prioritizes reliability over hype"
      ],
      resultsSection: {
        eyebrow: "Results",
        title: "Measurable benefits across daily operations.",
        description: "Every implementation is built to create compounding efficiency gains, not isolated improvements."
      },
      results: [
        "Save hours every week through automated execution",
        "Reduce repetitive manual tasks across teams",
        "Improve response times in sales and support",
        "Scale operations with less operational overhead",
        "Increase process consistency and data accuracy"
      ],
      useCasesSection: {
        eyebrow: "Portfolio / Use Cases",
        title: "Real automation systems teams use every day.",
        description: "Examples of high-impact workflows Vektrum builds for growth-focused businesses."
      },
      useCases: [
        { title: "Automated Lead Qualification", description: "Capture and score inbound leads automatically, then route qualified opportunities to the right pipeline." },
        { title: "Customer Support Workflows", description: "Classify tickets, generate first-response drafts, and escalate edge cases using AI-powered logic." },
        { title: "Internal Reporting Systems", description: "Aggregate business metrics from multiple tools and deliver concise, automated reporting dashboards." },
        { title: "AI-Powered Appointment Handling", description: "Automate scheduling, reminders, confirmations, and follow-up steps across email, CRM, and calendar." },
        { title: "Sales Follow-Up Automation", description: "Trigger context-aware follow-ups after calls, form submissions, or quote events to shorten sales cycles." }
      ],
      aboutSection: {
        eyebrow: "About",
        title: "Vektrum is your modern AI automation partner.",
        description:
          "We help businesses deploy practical systems that remove noise from operations and free teams to focus on strategic work.",
        body: "No inflated promises, just well-engineered automation that performs."
      },
      faqSection: {
        eyebrow: "FAQ",
        title: "Straight answers before we start.",
        description: "If you need technical scope clarity, we cover that on the discovery call."
      },
      faqs: [
        { question: "What types of businesses do you work with?", answer: "We work with operations-heavy teams across ecommerce, agencies, local businesses, SaaS, and service providers." },
        { question: "Do you build custom solutions?", answer: "Yes. Every system is designed around your workflow, tools, and business goals rather than templates." },
        { question: "How long does a project take?", answer: "Most projects launch in 2 to 6 weeks depending on scope, integrations, and internal review timelines." },
        { question: "Do you offer ongoing support?", answer: "Yes. We provide maintenance, performance monitoring, and iterative optimization after launch." },
        { question: "Can you integrate with our existing tools?", answer: "Absolutely. We build around your existing stack and connect CRMs, helpdesks, databases, and communication platforms." }
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
      contactSection: {
        eyebrow: "Let's Build",
        title: "Turn your workflows into a scalable AI operating layer.",
        description: "Tell us where your team loses time and we'll show you what to automate first.",
        cta: "Book a Call",
        submit: "Request Strategy Call"
      },
      footer: {
        quickLinksTitle: "Quick Links",
        contactTitle: "Contact",
        quickLinks: [
          { label: "Services", href: "#services" },
          { label: "How It Works", href: "#process" },
          { label: "Use Cases", href: "#use-cases" },
          { label: "Reviews", href: "#reviews" },
          { label: "FAQ", href: "#faq" }
        ]
      }
    },
    "pt-PT": {
      navItems: [
        { href: "#services", label: "Serviços" },
        { href: "#process", label: "Processo" },
        { href: "#use-cases", label: "Casos de Uso" },
        { href: "#reviews", label: "Avaliações" },
        { href: "#faq", label: "FAQ" },
        { href: "#contact", label: "Contacto" }
      ],
      hero: {
        eyebrow: "Agência de Automação com IA",
        title: "Crie fluxos inteligentes que aceleram o seu negócio.",
        subtitle:
          "A Vektrum ajuda equipas a eliminar tarefas repetitivas, otimizar operações e implementar sistemas de IA personalizados que poupam tempo.",
        primaryCta: "Marcar Chamada",
        secondaryCta: "Ver Serviços"
      },
      valueProp: {
        eyebrow: "Porquê a Vektrum",
        title: "Automação com impacto operacional mensurável.",
        description:
          "Desenhamos sistemas de IA práticos que removem fricção manual, reduzem atrasos e melhoram a eficiência da sua equipa.",
        highlights: [
          { metric: "15-40h", description: "Média de horas semanais recuperadas após automatizar fluxos críticos." },
          { metric: "2-6 semanas", description: "Prazo típico de implementação para sistemas prontos para produção." },
          { metric: "Fiável", description: "Lógica de processo com monitorização, salvaguardas e responsabilidade clara." }
        ],
        teamsLabel: "Equipas a construir com a Vektrum"
      },
      heroStats: {
        dashboardLabel: "Painel Operacional",
        liveLabel: "Ativo",
        hoursSavedLabel: "Horas Poupadas / Semana",
        automationsLabel: "Automações",
        pipelineHealthLabel: "Saúde do Pipeline",
        pipelineHealthNote: "82% dos fluxos-chave totalmente automatizados"
      },
      servicesSection: {
        eyebrow: "Serviços",
        title: "Criado para automatizar o trabalho que trava o crescimento.",
        description: "A Vektrum entrega sistemas de IA práticos para aumentar produtividade e reduzir execução manual."
      },
      services: [
        { title: "Automação com IA", description: "Automatize fluxos repetitivos entre ferramentas para libertar tempo da equipa." },
        { title: "Otimização de Fluxos", description: "Redesenhamos processos operacionais para remover bloqueios e aumentar produtividade." },
        { title: "Agentes de IA Personalizados", description: "Implementamos agentes de IA adaptados ao seu negócio e contexto operacional." },
        { title: "Sistemas de Geração de Leads", description: "Construímos pipelines inteligentes de captação, qualificação e encaminhamento." },
        { title: "Ferramentas Internas", description: "Criamos ferramentas internas para centralizar dados, ações e relatórios." },
        { title: "Automação CRM / Suporte / Vendas", description: "Integramos e automatizamos sistemas de contacto com clientes para maior consistência." }
      ],
      processSection: {
        eyebrow: "Como Funciona",
        title: "Um sistema claro do diagnóstico à otimização contínua.",
        description: "Entrega estruturada e transparente para saber exatamente o que está a ser construído."
      },
      processSteps: [
        { step: "01", title: "Auditoria", description: "Analisamos operações, ferramentas e gargalos para identificar automações de maior impacto." },
        { step: "02", title: "Estratégia", description: "Definimos um roadmap prático alinhado com objetivos e fluxo da equipa." },
        { step: "03", title: "Implementação", description: "Desenvolvemos e integramos automações com arquitetura limpa e documentação." },
        { step: "04", title: "Otimização", description: "Monitorizamos performance e iteramos continuamente para máxima eficiência." }
      ],
      whySection: {
        eyebrow: "Porque Escolher a Vektrum",
        title: "Parceiro de IA prático, focado em resultados de negócio.",
        description: "Priorizamos execução, fiabilidade e alinhamento operacional."
      },
      differentiators: [
        "Soluções adaptadas à sua operação",
        "Implementação rápida com marcos claros",
        "Abordagem orientada a resultados de negócio",
        "Sistemas escaláveis para crescimento",
        "Automação real, sem promessas vazias"
      ],
      resultsSection: {
        eyebrow: "Resultados",
        title: "Benefícios mensuráveis no dia a dia da operação.",
        description: "Cada implementação é desenhada para ganhos de eficiência cumulativos."
      },
      results: [
        "Poupe horas todas as semanas com execução automatizada",
        "Reduza tarefas repetitivas entre equipas",
        "Melhore tempos de resposta em vendas e suporte",
        "Escalone operações com menos overhead",
        "Aumente consistência e qualidade de dados"
      ],
      useCasesSection: {
        eyebrow: "Portefólio / Casos de Uso",
        title: "Sistemas reais de automação usados diariamente.",
        description: "Exemplos de fluxos com impacto construídos pela Vektrum."
      },
      useCases: [
        { title: "Qualificação Automática de Leads", description: "Captura e score automáticos para encaminhar oportunidades para o pipeline certo." },
        { title: "Fluxos de Suporte ao Cliente", description: "Classificação de tickets, respostas iniciais e escalonamento inteligente." },
        { title: "Reporting Interno", description: "Agregação de métricas de múltiplas ferramentas com dashboards automáticos." },
        { title: "Gestão de Marcação com IA", description: "Automação de agendamentos, lembretes, confirmações e follow-up." },
        { title: "Automação de Follow-up Comercial", description: "Disparo de follow-ups contextuais para encurtar o ciclo de venda." }
      ],
      aboutSection: {
        eyebrow: "Sobre",
        title: "A Vektrum é o seu parceiro moderno de automação com IA.",
        description: "Ajudamos empresas a implementar sistemas práticos para remover ruído operacional.",
        body: "Sem jargão, apenas automação bem implementada e orientada a resultados."
      },
      faqSection: {
        eyebrow: "FAQ",
        title: "Respostas diretas antes de começar.",
        description: "Se precisar de detalhe técnico, cobrimos isso na chamada de descoberta."
      },
      faqs: [
        { question: "Com que tipos de negócios trabalham?", answer: "Trabalhamos com equipas operacionais em comércio eletrónico, agências, serviços locais e SaaS." },
        { question: "Criam soluções personalizadas?", answer: "Sim. Cada sistema é desenhado para o seu fluxo, ferramentas e objetivos." },
        { question: "Quanto tempo demora um projeto?", answer: "A maioria dos projetos entra em produção entre 2 e 6 semanas, dependendo do escopo." },
        { question: "Oferecem suporte contínuo?", answer: "Sim. Incluímos manutenção, monitorização e otimização após o lançamento." },
        { question: "Integram com as nossas ferramentas atuais?", answer: "Sim. Trabalhamos sobre a infraestrutura existente com integrações a CRM, suporte e bases de dados." }
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
      contactSection: {
        eyebrow: "Vamos Construir",
        title: "Transforme os seus fluxos num sistema operacional com IA.",
        description: "Diga-nos onde a sua equipa perde tempo e mostramos o que automatizar primeiro.",
        cta: "Marcar Chamada",
        submit: "Pedir Chamada Estratégica"
      },
      footer: {
        quickLinksTitle: "Links Rápidos",
        contactTitle: "Contacto",
        quickLinks: [
          { label: "Serviços", href: "#services" },
          { label: "Como Funciona", href: "#process" },
          { label: "Casos de Uso", href: "#use-cases" },
          { label: "Avaliações", href: "#reviews" },
          { label: "FAQ", href: "#faq" }
        ]
      }
    }
  }
};
