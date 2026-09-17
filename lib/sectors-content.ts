import { Locale } from "@/lib/site-config";

export type SectorProjectPhase = {
  label: string;
  title: string;
};

export type SectorProject = {
  name: string;
  context: string;
  work: string[];
  results: string[];
  tags: string[];
  phases?: SectorProjectPhase[];
};

export type Sector = {
  slug: string;
  title: string;
  description: string;
  helpTitle: string;
  helpPoints: string[];
  projectsTitle: string;
};

export type SectorsLabels = {
  eyebrow: string;
  title: string;
  description: string;
  badgeLabel: string;
  viewSectorLabel: string;
  backLabel: string;
  whatWeBuiltLabel: string;
  resultsLabel: string;
  disclaimer: string;
  ctaTitle: string;
};

export type SectorsContent = {
  labels: SectorsLabels;
  sectors: Sector[];
  projects: Record<string, SectorProject[]>;
};

export const sectorsContent: Record<Locale, SectorsContent> = {
  en: {
    labels: {
      eyebrow: "Projects",
      title: "Automation shaped around every sector's reality.",
      description:
        "Every market has its own bottlenecks. These are the sectors where we've already built real systems, with the projects and outcomes to show for it.",
      badgeLabel: "Portfolio",
      viewSectorLabel: "View sector",
      backLabel: "Projects",
      whatWeBuiltLabel: "What we built",
      resultsLabel: "Results",
      disclaimer: "Results and metrics are only published once confirmed with the client.",
      ctaTitle: "Want a system like this for your business?"
    },
    sectors: [
      {
        slug: "imobiliario",
        title: "Real Estate",
        description:
          "From first contact to closing, we help agents and agencies capture leads, organize opportunities, and free up time for what actually sells: the client relationship.",
        helpTitle: "Where we help real estate operations",
        helpPoints: [
          "We centralize leads from portals, social media, and referrals in one place, with a clear record of who was contacted and when",
          "We automate market research and comparables, so data is ready for every new project",
          "We build automatic follow-up processes, so no opportunity depends on anyone's memory",
          "We give full visibility into the pipeline, so you always know how many real opportunities exist right now"
        ],
        projectsTitle: "Real estate projects"
      },
      {
        slug: "ecommerce",
        title: "Ecommerce",
        description:
          "We automate catalog, stock, pricing, and day-to-day operations, so online stores can grow without multiplying manual work.",
        helpTitle: "Where we help ecommerce brands grow",
        helpPoints: [
          "We automate catalog and stock sync between suppliers and the store, with no manual product-by-product updates",
          "We build AI-powered pricing engines that track the competition and adjust prices to the market automatically",
          "We automate recurring operational work, like order confirmations, stock updates, and invoicing, so the team doesn't lose time on repetitive tasks",
          "We handle site speed and technical SEO, so the technical foundation supports growth instead of holding it back"
        ],
        projectsTitle: "Ecommerce projects"
      }
    ],
    projects: {
      imobiliario: [
        {
          name: "André Reis — IAD Agent (Miraflores and Cascais)",
          context:
            "An independent real estate agent building a scalable structure, aiming to move away from manual work and gain real commercial intelligence on his market.",
          work: [
            "Automated lead generation and market research",
            "Automatic enrichment of captured leads",
            "Automatic follow-up on commercial opportunities",
            "Custom CRM with activity and pipeline dashboards",
            "Technology foundation built to support team growth"
          ],
          results: [],
          tags: ["Lead Generation", "CRM", "Follow-up Automation", "Dashboards"],
          phases: [
            { label: "Phase 1", title: "Lead generation, market research, and enrichment" },
            { label: "Phase 2", title: "Automatic follow-up + CRM with dashboards" },
            { label: "Phase 3", title: "Support for team growth" }
          ]
        },
        {
          name: "Pixel & Property",
          context:
            "A property management platform that needed an online presence to match its product, with clear subscription options.",
          work: [
            "Full rebuild of the company website",
            "Three-tier pricing structure",
            "CMS for content management with no technical dependency",
            "Optional booking system for property management"
          ],
          results: [],
          tags: ["Website", "CMS", "Pricing", "Booking System"]
        }
      ],
      ecommerce: [
        {
          name: "order2party.pt",
          context:
            "A WooCommerce store selling party supplies — from catalog automation and AI-driven pricing to technical optimization and a new visual identity.",
          work: [
            "Automatic catalog sync between the supplier and the store: Excel/CSV upload, automatic classification of new products vs. stock updates, and direct dispatch to WooCommerce via n8n",
            "AI-powered pricing engine that researches competitor prices, validates product matches with an LLM, and automatically sets the selling price based on the market",
            "Technical SEO optimization: schema markup, robots.txt, sitemap, and Open Graph",
            "Visual rebuild with a child theme — turquoise/lilac palette, Bricolage Grotesque + DM Sans typography",
            "Headless architecture proposal (WordPress + Next.js), backed by real PageSpeed data"
          ],
          results: [],
          tags: ["Catalog Automation", "AI Pricing", "WooCommerce", "Technical SEO", "Headless"]
        }
      ]
    }
  },
  "pt-PT": {
    labels: {
      eyebrow: "Projetos",
      title: "Automação moldada à realidade de cada setor.",
      description:
        "Cada mercado tem os seus próprios bloqueios. Estes são os setores onde já construímos sistemas reais, com os projetos e resultados que provam isso.",
      badgeLabel: "Portefólio",
      viewSectorLabel: "Ver setor",
      backLabel: "Projetos",
      whatWeBuiltLabel: "O que construímos",
      resultsLabel: "Resultados",
      disclaimer: "Resultados e métricas só são publicados depois de confirmados com o cliente.",
      ctaTitle: "Quer um sistema assim para o seu negócio?"
    },
    sectors: [
      {
        slug: "imobiliario",
        title: "Imobiliário",
        description:
          "Do primeiro contacto ao fecho, ajudamos consultores e agências a captar leads, organizar oportunidades e libertar tempo para o que realmente vende: a relação com o cliente.",
        helpTitle: "Onde ajudamos a sua operação imobiliária",
        helpPoints: [
          "Centralizamos leads de portais, redes sociais e referências num único lugar, com registo claro de quem foi contactado e quando",
          "Automatizamos a pesquisa de mercado e comparáveis, para ter dados prontos em cada novo projeto",
          "Criamos processos de follow-up automático, para nenhuma oportunidade depender da memória de ninguém",
          "Damos visibilidade total sobre o pipeline, para saber sempre quantas oportunidades reais existem agora"
        ],
        projectsTitle: "Projetos em imobiliário"
      },
      {
        slug: "ecommerce",
        title: "Ecommerce",
        description:
          "Automatizamos catálogo, stock, pricing e operações do dia a dia, para lojas online crescerem sem multiplicar trabalho manual.",
        helpTitle: "Onde ajudamos as marcas de ecommerce a crescer",
        helpPoints: [
          "Automatizamos a sincronização de catálogo e stock entre fornecedores e a loja, sem atualizações manuais produto a produto",
          "Construímos motores de pricing com IA que acompanham a concorrência e ajustam preços automaticamente ao mercado",
          "Automatizamos processos operacionais recorrentes, como confirmações de encomenda, atualizações de stock e faturação, para a equipa não perder tempo com trabalho repetitivo",
          "Tratamos da velocidade do site e do SEO técnico, para que a base tecnológica sustente o crescimento em vez de o travar"
        ],
        projectsTitle: "Projetos em ecommerce"
      }
    ],
    projects: {
      imobiliario: [
        {
          name: "André Reis — Consultor IAD (Miraflores e Cascais)",
          context:
            "Consultor imobiliário individual a construir uma estrutura escalável, com o objetivo de sair do trabalho manual e ganhar inteligência comercial sobre o seu mercado.",
          work: [
            "Geração de leads e pesquisa de mercado automatizada",
            "Enriquecimento automático de leads captados",
            "Follow-up automático de oportunidades comerciais",
            "CRM personalizado com dashboards de atividade e pipeline",
            "Base tecnológica preparada para suportar o crescimento de uma equipa"
          ],
          results: [],
          tags: ["Lead Generation", "CRM", "Automação de Follow-up", "Dashboards"],
          phases: [
            { label: "Fase 1", title: "Lead generation, pesquisa de mercado e enriquecimento" },
            { label: "Fase 2", title: "Follow-up automático + CRM com dashboards" },
            { label: "Fase 3", title: "Suporte ao crescimento da equipa" }
          ]
        },
        {
          name: "Pixel & Property",
          context:
            "Plataforma de gestão de imóveis a precisar de uma presença online à altura do produto, com opções claras de subscrição.",
          work: [
            "Rebuild completo do site institucional",
            "Estrutura de pricing em três tiers",
            "CMS para gestão de conteúdo sem dependência técnica",
            "Sistema de reservas opcional para gestão de imóveis"
          ],
          results: [],
          tags: ["Website", "CMS", "Pricing", "Sistema de Reservas"]
        }
      ],
      ecommerce: [
        {
          name: "order2party.pt",
          context:
            "Loja WooCommerce de artigos de festa — da automação de catálogo e pricing com IA à otimização técnica e nova identidade visual da loja.",
          work: [
            "Sistema de sincronização automática de catálogo entre o fornecedor e a loja: upload de Excel/CSV, classificação automática de produtos novos vs. atualizações de stock, e disparo direto para o WooCommerce via n8n",
            "Motor de pricing com IA que pesquisa os preços da concorrência, valida a correspondência de produtos com um LLM, e define automaticamente o preço de venda com base no mercado",
            "Otimização técnica de SEO: schema markup, robots.txt, sitemap e Open Graph",
            "Rebuild visual com child theme — paleta turquesa/lilás, tipografia Bricolage Grotesque + DM Sans",
            "Proposta de arquitetura headless (WordPress + Next.js), sustentada em dados reais de PageSpeed"
          ],
          results: [],
          tags: ["Automação de Catálogo", "Pricing com IA", "WooCommerce", "SEO Técnico", "Headless"]
        }
      ]
    }
  }
};

export function getSector(locale: Locale, slug: string): Sector | undefined {
  return sectorsContent[locale].sectors.find((sector) => sector.slug === slug);
}

export function getSectorProjects(locale: Locale, slug: string): SectorProject[] {
  return sectorsContent[locale].projects[slug] ?? [];
}
