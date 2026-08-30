export type Locale = "pt-PT" | "en" | "es";
export type Localized = { "pt-PT": string; en: string; es?: string };
export type QuestionKind = "company" | "website" | "single" | "multi" | "text" | "contact";

export type OptionDefinition = {
  id: string;
  label: Localized;
  mark: string;
  exclusive?: boolean;
};

export type DiagnosisPhase = "business" | "operation" | "impact" | "report";

export type OptionGroupDefinition = {
  id: string;
  label: Localized;
  optionIds: string[];
  required?: boolean;
  compact?: boolean;
};

export type OptionVisibilityRule = {
  optionIds: string[];
  dependsOn: string;
  includesAny: string[];
};

export type QuestionDefinition = {
  id: string;
  kind: QuestionKind;
  eyebrow: Localized;
  title: Localized;
  help: Localized;
  options?: OptionDefinition[];
  optional?: boolean;
  placeholder?: Localized;
  maxLength?: number;
  legacyRole?: "challenge" | "task";
  phase?: DiagnosisPhase;
  optionGroups?: OptionGroupDefinition[];
  optionVisibility?: OptionVisibilityRule[];
  insightKey?: string;
};

export type SectorDefinition = {
  id: string;
  label: Localized;
  mark: string;
  questions: QuestionDefinition[];
};

const l = (pt: string, en: string, es?: string): Localized => ({ "pt-PT": pt, en, es });
const o = (id: string, pt: string, en: string, mark: string, exclusive = false, es?: string): OptionDefinition => ({
  id,
  label: l(pt, en, es),
  mark,
  exclusive
});
const q = (
  id: string,
  kind: "single" | "multi",
  pt: string,
  en: string,
  ptHelp: string,
  enHelp: string,
  options: OptionDefinition[],
  legacyRole?: "challenge" | "task"
): QuestionDefinition => ({
  id,
  kind,
  eyebrow: l("A compreender o processo", "Understanding the workflow", "Entendiendo el proceso"),
  title: l(pt, en),
  help: l(ptHelp, enHelp),
  options,
  legacyRole,
  phase: "operation"
});

export const uiCopy = {
  "pt-PT": {
    skip: "Ir para o conteúdo",
    brandLabel: "Vektrum — página inicial",
    language: "Idioma",
    languageCode: "EN",
    introEyebrow: "Relatório gratuito de automação",
    introTitle: "Descubra onde a sua empresa pode poupar mais tempo e reduzir trabalho manual",
    introBody: "Responda a algumas perguntas adaptadas ao seu setor e receba, em poucos minutos, um relatório com oportunidades priorizadas e próximos passos práticos.",
    duration: "Menos de 3 minutos",
    privateNote: "Os seus dados são tratados de forma confidencial.",
    start: "Ver as minhas oportunidades",
    startHint: "Gratuito · personalizado · enviado por email em poucos minutos.",
    introProof: ["Processos avaliados", "Prioridades identificadas", "Próximos passos práticos"],
    back: "Voltar",
    continue: "Continuar",
    optional: "Opcional",
    step: "Passo",
    of: "de",
    remainingOne: "1 pergunta restante",
    remainingMany: "perguntas restantes",
    phase: "Fase",
    phases: { business: "O seu negócio", operation: "Como funciona", impact: "Impacto e prioridades", report: "O seu relatório" },
    showAllSectors: "Ver todos os setores",
    showPrioritySectors: "Ver setores prioritários",
    selectedSector: "Diagnóstico adaptado a",
    otherPlaceholder: "Especifique aqui",
    noWebsite: "A empresa não tem website",
    labels: { name: "Nome", email: "Email profissional", phone: "Telefone", chars: "caracteres" },
    placeholders: {
      company: "Ex.: Empresa Exemplo, Lda.",
      website: "exemplo.pt",
      name: "O seu nome",
      email: "nome@empresa.pt",
      phone: "+351 912 345 678"
    },
    errors: {
      company: "Indique o nome da empresa para continuar.",
      website: "Introduza um website válido, como exemplo.pt.",
      required: "Escolha uma opção para continuar.",
      multi: "Escolha pelo menos uma opção para continuar.",
      group: "Escolha pelo menos uma opção em cada grupo assinalado.",
      other: "Especifique a opção selecionada.",
      text: "Partilhe uma resposta curta para continuar.",
      name: "Indique o seu nome.",
      email: "Introduza um endereço de email válido.",
      consent: "É necessário aceitar o tratamento dos dados para receber o relatório.",
      submit: "Não foi possível entregar o diagnóstico. As respostas estão guardadas — tente novamente.",
      config: "O envio ainda não está configurado. Contacte a Vektrum ou tente novamente mais tarde."
    },
    consentPrefix: "Autorizo a Vektrum a tratar estes dados para preparar o relatório e contactar-me sobre este pedido. Li a",
    privacy: "Política de Privacidade",
    submit: "Criar o meu relatório",
    retry: "Tentar novamente",
    loadingEyebrow: "A enviar o seu diagnóstico",
    loadingTitle: "A preparar o seu Relatório de Automação...",
    loadingBody: "Estamos a entregar as suas respostas em segurança. Só mais um momento.",
    successEyebrow: "Diagnóstico concluído",
    successTitle: "O seu relatório está a ser criado",
    successBody: "A análise já começou. O Relatório de Automação personalizado deverá chegar ao seu email nos próximos minutos.",
    successEmail: "Se não aparecer de imediato, verifique também as pastas de spam e promoções.",
    successDestination: "Vamos enviar para",
    successRecap: "O que analisámos",
    successNext: "Enquanto espera, pode conhecer exemplos de sistemas já construídos pela Vektrum.",
    visit: "Conhecer a Vektrum",
    restart: "Iniciar outro diagnóstico",
    encouragement: [
      "Ótimo começo.", "Já temos o contexto essencial.", "Agora a entrevista adapta-se ao seu setor.",
      "Estamos a mapear onde o trabalho entra.", "Isto revela como a informação circula.",
      "Já conseguimos ver oportunidades concretas.", "As ferramentas atuais ajudam-nos a evitar recomendações genéricas.",
      "Só faltam algumas perguntas.", "A dimensão ajuda-nos a estimar o impacto.",
      "Estamos a ligar processos e ferramentas.", "Esta estimativa ajuda-nos a priorizar.",
      "Objetivo definido.", "Já percebemos o ponto de partida.", "Quase concluído.", "Tudo pronto para a análise."
    ]
  },
  en: {
    skip: "Skip to content",
    brandLabel: "Vektrum — homepage",
    language: "Language",
    languageCode: "PT",
    introEyebrow: "Free automation report",
    introTitle: "Discover where your business can save the most time and reduce manual work",
    introBody: "Answer a few questions tailored to your industry and receive, within minutes, a report with prioritized opportunities and practical next steps.",
    duration: "Under 3 minutes",
    privateNote: "Your information is treated confidentially.",
    start: "See my opportunities",
    startHint: "Free · personalized · delivered by email within minutes.",
    introProof: ["Workflows assessed", "Priorities identified", "Practical next steps"],
    back: "Back",
    continue: "Continue",
    optional: "Optional",
    step: "Step",
    of: "of",
    remainingOne: "1 question remaining",
    remainingMany: "questions remaining",
    phase: "Phase",
    phases: { business: "Your business", operation: "How it works", impact: "Impact and priorities", report: "Your report" },
    showAllSectors: "Show all industries",
    showPrioritySectors: "Show priority industries",
    selectedSector: "Diagnosis tailored to",
    otherPlaceholder: "Tell us more",
    noWebsite: "The company doesn't have a website",
    labels: { name: "Name", email: "Work email", phone: "Phone", chars: "characters" },
    placeholders: {
      company: "e.g. Example Company Ltd.",
      website: "example.com",
      name: "Your name",
      email: "name@company.com",
      phone: "+351 912 345 678"
    },
    errors: {
      company: "Enter your company name to continue.",
      website: "Enter a valid website, such as example.com.",
      required: "Choose an option to continue.",
      multi: "Choose at least one option to continue.",
      group: "Choose at least one option in each required group.",
      other: "Tell us more about the selected option.",
      text: "Share a short answer to continue.",
      name: "Enter your name.",
      email: "Enter a valid email address.",
      consent: "You need to accept data processing to receive the report.",
      submit: "We couldn't deliver the diagnosis. Your answers are saved — please try again.",
      config: "Submission is not configured yet. Contact Vektrum or try again later."
    },
    consentPrefix: "I authorize Vektrum to process this information to prepare the report and contact me about this request. I have read the",
    privacy: "Privacy Policy",
    submit: "Create my report",
    retry: "Try again",
    loadingEyebrow: "Submitting your diagnosis...",
    loadingTitle: "Preparing your Automation Report...",
    loadingBody: "We're securely delivering your answers. This will only take a moment.",
    successEyebrow: "Diagnosis complete",
    successTitle: "Your report is being created",
    successBody: "The analysis has already started. Your personalized Automation Report should reach your inbox within the next few minutes.",
    successEmail: "If it does not appear immediately, check your spam and promotions folders too.",
    successDestination: "We'll send it to",
    successRecap: "What we analyzed",
    successNext: "While you wait, you can explore systems Vektrum has already built.",
    visit: "Visit Vektrum",
    restart: "Start another diagnosis",
    encouragement: [
      "A great start.", "We have the essential context.", "The interview now adapts to your sector.",
      "We're mapping where work enters.", "This shows us how information moves.",
      "We can already see concrete opportunities.", "Your current tools help us avoid generic recommendations.",
      "Only a few questions left.", "Team size helps us estimate the impact.",
      "We're connecting processes and tools.", "This estimate helps us prioritize.",
      "Priority set.", "We understand your starting point.", "Almost done.", "Everything is ready for analysis."
    ]
  },
  es: {
    skip: "Ir al contenido",
    brandLabel: "Vektrum — página de inicio",
    language: "Idioma",
    languageCode: "PT",
    introEyebrow: "Informe de automatización gratuito",
    introTitle: "Descubre dónde tu empresa puede ahorrar más tiempo y reducir el trabajo manual",
    introBody: "Responde a unas pocas preguntas adaptadas a tu sector y recibe, en pocos minutos, un informe con oportunidades priorizadas y próximos pasos prácticos.",
    duration: "Menos de 3 minutos",
    privateNote: "Tus datos se tratan de forma confidencial.",
    start: "Ver mis oportunidades",
    startHint: "Gratuito · personalizado · enviado por email en pocos minutos.",
    introProof: ["Procesos evaluados", "Prioridades identificadas", "Próximos pasos prácticos"],
    back: "Atrás",
    continue: "Continuar",
    optional: "Opcional",
    step: "Paso",
    of: "de",
    remainingOne: "1 pregunta restante",
    remainingMany: "preguntas restantes",
    phase: "Fase",
    phases: { business: "Tu negocio", operation: "Cómo funciona", impact: "Impacto y prioridades", report: "Tu informe" },
    showAllSectors: "Ver todos los sectores",
    showPrioritySectors: "Ver sectores prioritarios",
    selectedSector: "Diagnóstico adaptado a",
    otherPlaceholder: "Especifica aquí",
    noWebsite: "La empresa no tiene sitio web",
    labels: { name: "Nombre", email: "Email profesional", phone: "Teléfono", chars: "caracteres" },
    placeholders: {
      company: "Ej.: Empresa Ejemplo, S.L.",
      website: "ejemplo.es",
      name: "Tu nombre",
      email: "nombre@empresa.es",
      phone: "+34 912 345 678"
    },
    errors: {
      company: "Indica el nombre de la empresa para continuar.",
      website: "Introduce un sitio web válido, como ejemplo.es.",
      required: "Elige una opción para continuar.",
      multi: "Elige al menos una opción para continuar.",
      group: "Elige al menos una opción en cada grupo marcado.",
      other: "Especifica la opción seleccionada.",
      text: "Comparte una respuesta breve para continuar.",
      name: "Indica tu nombre.",
      email: "Introduce una dirección de email válida.",
      consent: "Es necesario aceptar el tratamiento de los datos para recibir el informe.",
      submit: "No hemos podido entregar el diagnóstico. Tus respuestas están guardadas — inténtalo de nuevo.",
      config: "El envío todavía no está configurado. Contacta con Vektrum o inténtalo de nuevo más tarde."
    },
    consentPrefix: "Autorizo a Vektrum a tratar estos datos para preparar el informe y contactarme sobre esta solicitud. He leído la",
    privacy: "Política de Privacidad",
    submit: "Crear mi informe",
    retry: "Intentar de nuevo",
    loadingEyebrow: "Enviando tu diagnóstico",
    loadingTitle: "Preparando tu Informe de Automatización...",
    loadingBody: "Estamos entregando tus respuestas de forma segura. Solo un momento más.",
    successEyebrow: "Diagnóstico completado",
    successTitle: "Tu informe se está creando",
    successBody: "El análisis ya ha comenzado. Tu Informe de Automatización personalizado debería llegar a tu email en los próximos minutos.",
    successEmail: "Si no aparece de inmediato, revisa también las carpetas de spam y promociones.",
    successDestination: "Lo enviaremos a",
    successRecap: "Lo que hemos analizado",
    successNext: "Mientras esperas, puedes conocer ejemplos de sistemas ya construidos por Vektrum.",
    visit: "Conocer Vektrum",
    restart: "Iniciar otro diagnóstico",
    encouragement: [
      "Un gran comienzo.", "Ya tenemos el contexto esencial.", "Ahora la entrevista se adapta a tu sector.",
      "Estamos mapeando por dónde entra el trabajo.", "Esto nos muestra cómo circula la información.",
      "Ya podemos ver oportunidades concretas.", "Las herramientas actuales nos ayudan a evitar recomendaciones genéricas.",
      "Solo faltan algunas preguntas.", "El tamaño del equipo nos ayuda a estimar el impacto.",
      "Estamos conectando procesos y herramientas.", "Esta estimación nos ayuda a priorizar.",
      "Prioridad definida.", "Ya entendemos tu punto de partida.", "Casi terminado.", "Todo listo para el análisis."
    ]
  }
} as const;

export const baseQuestions: QuestionDefinition[] = [
  {
    id: "companyName",
    kind: "company",
    phase: "business",
    eyebrow: l("Vamos começar", "Let's begin", "Vamos a empezar"),
    title: l("Qual é o nome da sua empresa?", "What's your company name?", "¿Cuál es el nombre de tu empresa?"),
    help: l("Usaremos este nome para personalizar o relatório.", "We'll use it to personalize your report.", "Usaremos este nombre para personalizar tu informe.")
  },
  {
    id: "website",
    kind: "website",
    phase: "business",
    eyebrow: l("Contexto digital", "Digital context", "Contexto digital"),
    title: l("Qual é o website da empresa?", "What's your company website?", "¿Cuál es el sitio web de tu empresa?"),
    help: l("Ajuda-nos a compreender melhor o negócio antes da análise.", "It helps us understand the business before the analysis.", "Nos ayuda a entender mejor el negocio antes del análisis."),
    optional: true
  }
];

export const sectorOptions: OptionDefinition[] = [
  o("accounting-consulting", "Contabilidade e consultoria", "Accounting and consulting", "CC", false, "Contabilidad y consultoría"),
  o("legal-admin", "Serviços jurídicos e administrativos", "Legal and administrative services", "SJ", false, "Servicios jurídicos y administrativos"),
  o("real-estate", "Imobiliário", "Real estate", "IM", false, "Inmobiliario"),
  o("finance-insurance", "Finanças e seguros", "Finance and insurance", "FS", false, "Finanzas y seguros"),
  o("healthcare", "Saúde e clínicas", "Healthcare and clinics", "SC", false, "Salud y clínicas"),
  o("construction", "Construção e serviços técnicos", "Construction and technical services", "CT", false, "Construcción y servicios técnicos"),
  o("commerce", "Comércio e e-commerce", "Commerce and e-commerce", "CE", false, "Comercio y ecommerce"),
  o("logistics", "Logística e transportes", "Logistics and transportation", "LT", false, "Logística y transporte"),
  o("hospitality", "Hotelaria e restauração", "Hospitality and restaurants", "HR", false, "Hostelería y restauración"),
  o("education", "Educação e formação", "Education and training", "EF", false, "Educación y formación"),
  o("manufacturing", "Indústria", "Manufacturing", "IN", false, "Industria"),
  o("marketing-agency", "Agência de marketing ou criativa", "Marketing or creative agency", "MK", false, "Agencia de marketing o creativa"),
  o("other", "Outro setor", "Other sector", "+", false, "Otro sector")
];

export const sectorQuestion: QuestionDefinition = {
  id: "businessSector",
  kind: "single",
  phase: "business",
  eyebrow: l("Sobre o negócio", "About the business", "Sobre el negocio"),
  title: l("O que melhor descreve a sua empresa?", "What best describes your business?", "¿Qué describe mejor a tu empresa?"),
  help: l("A partir daqui, as perguntas adaptam-se à realidade do seu setor.", "From here, the questions adapt to the reality of your sector.", "A partir de aquí, las preguntas se adaptan a la realidad de tu sector."),
  options: sectorOptions
};

const common = {
  channels: [
    o("email", "Email", "Email", "EM"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"),
    o("phone", "Telefone", "Phone", "TF"), o("website-form", "Website ou formulário", "Website or form", "WB"),
    o("in-person", "Presencialmente", "In person", "PR"), o("other", "Outro", "Other", "+")
  ],
  office: [
    o("microsoft-365", "Microsoft 365", "Microsoft 365", "M3"), o("google-workspace", "Google Workspace", "Google Workspace", "GW"),
    o("excel", "Excel", "Excel", "XL"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")
  ]
};

export const legacySectors: SectorDefinition[] = [
  {
    id: "accounting-consulting", label: sectorOptions[0].label, mark: "CC", questions: [
      q("accounting_document_intake", "multi", "Como é que os clientes enviam documentos?", "How do clients send documents?", "Selecione todos os canais utilizados.", "Select every channel you use.", [o("email", "Email", "Email", "EM"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("client-portal", "Portal do cliente", "Client portal", "PC"), o("cloud-folder", "Pasta partilhada", "Shared folder", "NP"), o("paper", "Papel ou entrega presencial", "Paper or in-person", "PP"), o("direct-integration", "Integração direta", "Direct integration", "ID"), o("other", "Outro", "Other", "+")]),
      q("accounting_time_consumers", "multi", "O que consome mais tempo na equipa?", "What takes up the most team time?", "Pense no trabalho que se repete todas as semanas.", "Think about the work repeated every week.", [o("requesting-documents", "Pedir documentos em falta", "Requesting missing documents", "PD"), o("organizing-files", "Organizar e classificar ficheiros", "Organizing and classifying files", "OF"), o("bookkeeping", "Lançamentos contabilísticos", "Bookkeeping and data entry", "LC"), o("reconciliations", "Reconciliações", "Reconciliations", "RC"), o("client-questions", "Responder a clientes", "Answering clients", "CL"), o("approvals", "Aprovações e validações", "Approvals and validation", "AV"), o("other", "Outro", "Other", "+")], "challenge"),
      q("accounting_client_communication", "multi", "Como comunicam com os clientes?", "How do you communicate with clients?", "Queremos perceber onde as mensagens ficam dispersas.", "We want to understand where messages become scattered.", [o("email", "Email", "Email", "EM"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("phone", "Telefone", "Phone", "TF"), o("client-portal", "Portal do cliente", "Client portal", "PC"), o("meetings", "Reuniões", "Meetings", "RE"), o("other", "Outro", "Other", "+")]),
      q("accounting_software", "multi", "Que software especializado utilizam?", "Which specialist software do you use?", "Selecione as ferramentas ligadas ao trabalho contabilístico.", "Select the tools connected to accounting work.", [o("toconline", "TOConline", "TOConline", "TO"), o("sage", "Sage", "Sage", "SG"), o("primavera", "Primavera", "Primavera", "PR"), o("phc", "PHC", "PHC", "PH"), o("excel", "Excel", "Excel", "XL"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]),
      q("accounting_priority_task", "single", "Se automatizasse uma tarefa amanhã, qual escolheria?", "If you automated one task tomorrow, which would it be?", "Escolha a que libertaria mais tempo à equipa.", "Choose the one that would free up the most team time.", [o("document-chasing", "Pedir documentos em falta", "Chasing missing documents", "PD"), o("file-classification", "Classificar documentos", "Classifying documents", "CD"), o("reconciliation", "Fazer reconciliações", "Completing reconciliations", "RC"), o("client-replies", "Responder a perguntas recorrentes", "Answering recurring questions", "RR"), o("reporting", "Preparar relatórios", "Preparing reports", "RT"), o("other", "Outra", "Other", "+")], "task")
    ]
  },
  {
    id: "legal-admin", label: sectorOptions[1].label, mark: "SJ", questions: [
      q("legal_case_intake", "multi", "Como chegam os novos processos ou pedidos?", "How do new cases or requests arrive?", "Selecione todas as origens relevantes.", "Select every relevant source.", [o("referrals", "Referências", "Referrals", "RF"), ...common.channels, o("platform", "Plataforma externa", "External platform", "PL")]),
      q("legal_deadlines", "single", "Como são geridos os prazos?", "How are deadlines managed?", "Escolha o método principal da equipa.", "Choose the team's primary method.", [o("calendar", "Calendário partilhado", "Shared calendar", "CA"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("case-software", "Software de processos", "Case management software", "SP"), o("personal-reminders", "Lembretes individuais", "Personal reminders", "LI"), o("paper", "Agenda ou papel", "Diary or paper", "PP"), o("other", "Outro", "Other", "+")]),
      q("legal_documents", "single", "Como organizam os documentos?", "How do you organize documents?", "Indique onde está a versão principal de cada documento.", "Tell us where the primary version of each document lives.", [o("network-folders", "Pastas no servidor", "Network folders", "PS"), o("cloud-drive", "Cloud drive", "Cloud drive", "CL"), o("case-software", "Software de processos", "Case management software", "SP"), o("email", "Email", "Email", "EM"), o("physical", "Arquivo físico", "Physical archive", "AF"), o("other", "Outro", "Other", "+")]),
      q("legal_software", "multi", "Que software especializado utilizam?", "Which specialist software do you use?", "Inclua sistemas jurídicos e ferramentas de expediente.", "Include legal systems and casework tools.", [o("legal-management", "Software de gestão jurídica", "Legal management software", "GJ"), o("citius", "Citius", "Citius", "CI"), ...common.office]),
      q("legal_repetitive_task", "single", "Qual é a tarefa mais repetitiva?", "What is the most repetitive task?", "Escolha o trabalho que mais se repete entre processos.", "Choose the work repeated most often across cases.", [o("document-drafting", "Preparar documentos semelhantes", "Drafting similar documents", "DO"), o("filing", "Organizar e arquivar", "Organizing and filing", "AR"), o("deadline-entry", "Registar prazos", "Recording deadlines", "PZ"), o("client-updates", "Atualizar clientes", "Updating clients", "CL"), o("appointments", "Agendar reuniões", "Scheduling meetings", "AG"), o("billing", "Registar tempos e faturar", "Time entry and billing", "FT"), o("other", "Outra", "Other", "+")], "task")
    ]
  },
  {
    id: "real-estate", label: sectorOptions[2].label, mark: "IM", questions: [
      q("realestate_lead_sources", "multi", "De onde vêm os novos leads?", "Where do new leads come from?", "Selecione todos os canais que geram contactos.", "Select every channel that generates enquiries.", [o("idealista", "Idealista", "Idealista", "ID"), o("imovirtual", "Imovirtual", "Imovirtual", "IM"), o("website", "Website", "Website", "WB"), o("referrals", "Referências", "Referrals", "RF"), o("social-media", "Redes sociais", "Social media", "RS"), o("phone-walkin", "Telefone ou presencial", "Phone or walk-in", "TF"), o("other", "Outro", "Other", "+")]),
      q("realestate_followup", "single", "Como fazem follow-up aos potenciais clientes?", "How do you follow up with prospects?", "Escolha o processo mais habitual.", "Choose the most common process.", [o("manual-phone-email", "Telefone e email manual", "Manual phone and email", "ME"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("crm-reminders", "Lembretes no CRM", "CRM reminders", "CR"), o("automated-sequence", "Sequência automática", "Automated sequence", "SA"), o("no-process", "Sem processo consistente", "No consistent process", "—"), o("other", "Outro", "Other", "+")]),
      q("realestate_listings", "single", "Como são geridos os anúncios dos imóveis?", "How are property listings managed?", "Queremos perceber onde existe duplicação de informação.", "We want to understand where information is duplicated.", [o("sector-crm", "CRM imobiliário", "Real estate CRM", "CR"), o("portal-backoffice", "Backoffice dos portais", "Portal back offices", "BP"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("website-cms", "Website ou CMS", "Website or CMS", "WB"), o("manual-multiple", "Atualização manual em vários locais", "Manual updates in several places", "MV"), o("other", "Outro", "Other", "+")]),
      q("realestate_software", "multi", "Que CRM ou software imobiliário utilizam?", "Which CRM or real estate software do you use?", "Selecione todas as ferramentas especializadas.", "Select every specialist tool.", [o("sector-crm", "CRM imobiliário", "Real estate CRM", "CI"), o("general-crm", "CRM generalista", "General CRM", "CR"), o("portal-tools", "Ferramentas dos portais", "Portal tools", "PT"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("none", "Nenhum", "None", "—", true), o("other", "Outro", "Other", "+")]),
      q("realestate_bottleneck", "single", "Qual é o maior gargalo comercial?", "What is the biggest commercial bottleneck?", "Escolha onde as oportunidades perdem mais velocidade.", "Choose where opportunities lose the most momentum.", [o("lead-response", "Responder rapidamente aos leads", "Responding quickly to leads", "RL"), o("followup", "Manter o follow-up", "Maintaining follow-up", "FU"), o("listing-updates", "Atualizar anúncios", "Updating listings", "AN"), o("documents", "Recolher documentação", "Collecting documents", "DC"), o("viewings", "Agendar visitas", "Scheduling viewings", "VI"), o("reporting", "Preparar reporting", "Preparing reports", "RT"), o("other", "Outro", "Other", "+")], "challenge")
    ]
  },
  {
    id: "finance-insurance", label: sectorOptions[3].label, mark: "FS", questions: [
      q("finance_document_intake", "multi", "Como enviam os clientes a documentação?", "How do customers submit documentation?", "Selecione todos os canais utilizados.", "Select every channel used.", [o("email", "Email", "Email", "EM"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("client-portal", "Portal do cliente", "Client portal", "PC"), o("in-person", "Presencialmente", "In person", "PR"), o("paper", "Papel", "Paper", "PP"), o("other", "Outro", "Other", "+")]),
      q("finance_renewals", "single", "Como são acompanhadas as renovações?", "How are renewals tracked?", "Escolha o método principal.", "Choose the primary method.", [o("calendar", "Calendário", "Calendar", "CA"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("crm", "CRM", "CRM", "CR"), o("sector-platform", "Plataforma setorial", "Sector platform", "PS"), o("manual", "Memória ou controlo manual", "Memory or manual tracking", "MN"), o("other", "Outro", "Other", "+")]),
      q("finance_communication", "multi", "Que canais usam para comunicar com clientes?", "Which channels do you use to communicate with customers?", "Selecione todos os canais habituais.", "Select every channel you regularly use.", [o("email", "Email", "Email", "EM"), o("phone", "Telefone", "Phone", "TF"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("client-portal", "Portal do cliente", "Client portal", "PC"), o("in-person", "Presencialmente", "In person", "PR"), o("other", "Outro", "Other", "+")]),
      q("finance_software", "multi", "Que software especializado utilizam?", "Which specialist software do you use?", "Inclua plataformas financeiras, de seguros ou compliance.", "Include finance, insurance, or compliance platforms.", [o("crm", "CRM", "CRM", "CR"), o("sector-platform", "Plataforma setorial", "Sector platform", "PS"), o("erp-accounting", "ERP ou software contabilístico", "ERP or accounting software", "ER"), o("document-management", "Gestão documental", "Document management", "GD"), o("excel", "Excel", "Excel", "XL"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]),
      q("finance_repetitive_task", "single", "Qual é a tarefa mais repetitiva?", "What is the most repetitive task?", "Escolha onde existe mais trabalho manual recorrente.", "Choose where the most recurring manual work exists.", [o("data-entry", "Introduzir dados", "Entering data", "ID"), o("document-validation", "Validar documentos", "Validating documents", "VD"), o("renewal-reminders", "Enviar lembretes de renovação", "Sending renewal reminders", "LR"), o("quotes", "Preparar propostas", "Preparing proposals", "PP"), o("compliance", "Verificações de compliance", "Compliance checks", "CP"), o("customer-updates", "Atualizar clientes", "Updating customers", "CL"), o("other", "Outra", "Other", "+")], "task")
    ]
  },
  {
    id: "healthcare", label: sectorOptions[4].label, mark: "SC", questions: [
      q("healthcare_booking", "multi", "Como são marcadas as consultas?", "How are appointments booked?", "Selecione todos os canais disponíveis aos pacientes.", "Select every channel available to patients.", [o("phone", "Telefone", "Phone", "TF"), o("website", "Website", "Website", "WB"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("doctoralia", "Doctoralia", "Doctoralia", "DO"), o("email", "Email", "Email", "EM"), o("walk-in", "Presencialmente", "In person", "PR"), o("other", "Outro", "Other", "+")]),
      q("healthcare_confirmation", "single", "Como confirmam as consultas?", "How do you confirm appointments?", "Escolha o método mais utilizado.", "Choose the method used most often.", [o("manual-phone", "Telefonema manual", "Manual phone call", "TF"), o("sms", "SMS", "SMS", "SM"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("email", "Email", "Email", "EM"), o("software-automatic", "Automático pelo software", "Automatic through software", "AU"), o("none", "Não confirmamos", "We don't confirm", "—", true), o("other", "Outro", "Other", "+")]),
      q("healthcare_reminders", "single", "Como recordam os pacientes antes da consulta?", "How do you remind patients before an appointment?", "Isto ajuda-nos a perceber o potencial de reduzir faltas.", "This helps us understand the potential to reduce no-shows.", [o("manual-phone", "Telefonema manual", "Manual phone call", "TF"), o("sms", "SMS", "SMS", "SM"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("email", "Email", "Email", "EM"), o("software-automatic", "Automático pelo software", "Automatic through software", "AU"), o("none", "Não enviamos lembretes", "We don't send reminders", "—", true), o("other", "Outro", "Other", "+")]),
      q("healthcare_software", "multi", "Que software clínico ou administrativo utilizam?", "Which clinical or administrative software do you use?", "Selecione os sistemas ligados ao funcionamento da clínica.", "Select the systems connected to clinic operations.", [o("clinic-management", "Gestão clínica", "Clinic management", "GC"), o("doctoralia", "Doctoralia", "Doctoralia", "DO"), o("billing-erp", "Faturação ou ERP", "Billing or ERP", "FT"), o("crm", "CRM", "CRM", "CR"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]),
      q("healthcare_bottleneck", "single", "Qual é o maior desafio administrativo?", "What is the biggest administrative challenge?", "Escolha o ponto que mais pressiona a equipa.", "Choose the point that puts the most pressure on the team.", [o("booking", "Gerir marcações", "Managing bookings", "AG"), o("no-shows", "Confirmações e faltas", "Confirmations and no-shows", "FT"), o("patient-messages", "Responder a pacientes", "Answering patients", "RP"), o("billing", "Faturação", "Billing", "FA"), o("records", "Documentos e registos", "Documents and records", "DR"), o("reporting", "Relatórios", "Reporting", "RT"), o("other", "Outro", "Other", "+")], "challenge")
    ]
  },
  {
    id: "construction", label: sectorOptions[5].label, mark: "CT", questions: [
      q("construction_quotes", "single", "Como preparam os orçamentos?", "How do you prepare quotations?", "Escolha o método principal.", "Choose the primary method.", [o("word-excel", "Word ou Excel", "Word or Excel", "XL"), o("erp", "ERP", "ERP", "ER"), o("estimating-software", "Software de orçamentação", "Estimating software", "SO"), o("supplier-quotes", "A partir de propostas de fornecedores", "From supplier quotations", "PF"), o("templates", "Modelos internos", "Internal templates", "MI"), o("other", "Outro", "Other", "+")]),
      q("construction_team_communication", "multi", "Como comunicam as equipas no terreno?", "How do field teams communicate?", "Selecione todos os canais utilizados diariamente.", "Select every channel used each day.", [o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("phone", "Telefone", "Phone", "TF"), o("email", "Email", "Email", "EM"), o("project-app", "Aplicação de projeto ou obra", "Project or site app", "AP"), o("meetings-paper", "Reuniões ou papel", "Meetings or paper", "RP"), o("other", "Outro", "Other", "+")]),
      q("construction_projects", "single", "Como são geridos os projetos e obras?", "How are projects and sites managed?", "Indique onde a equipa acompanha tarefas e progresso.", "Tell us where the team tracks tasks and progress.", [o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("project-software", "Software de projetos", "Project software", "SP"), o("erp", "ERP", "ERP", "ER"), o("paper-whiteboard", "Papel ou quadro", "Paper or whiteboard", "PQ"), o("individual", "Cada responsável gere à sua maneira", "Each manager uses their own method", "IN"), o("other", "Outro", "Other", "+")]),
      q("construction_software", "multi", "Que software especializado utilizam?", "Which specialist software do you use?", "Inclua gestão, orçamentação e acompanhamento de obra.", "Include management, estimating, and site tracking tools.", [o("primavera", "Primavera", "Primavera", "PR"), o("phc", "PHC", "PHC", "PH"), o("sage", "Sage", "Sage", "SG"), o("project-management", "Gestão de projetos", "Project management", "GP"), o("construction-software", "Software de construção", "Construction software", "SC"), o("excel", "Excel", "Excel", "XL"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]),
      q("construction_bottleneck", "single", "Qual é o maior gargalo operacional?", "What is the biggest operational bottleneck?", "Escolha onde o trabalho mais atrasa.", "Choose where work slows down the most.", [o("quotations", "Preparar orçamentos", "Preparing quotations", "OR"), o("purchasing", "Pedidos e compras", "Purchasing and orders", "CP"), o("planning", "Planeamento de equipas", "Team planning", "PL"), o("field-reports", "Relatórios de obra", "Site reports", "RO"), o("documents", "Gerir documentos", "Managing documents", "DC"), o("billing", "Medições e faturação", "Measurements and billing", "FT"), o("other", "Outro", "Other", "+")], "challenge")
    ]
  },
  {
    id: "commerce", label: sectorOptions[6].label, mark: "CE", questions: [
      q("commerce_order_sources", "multi", "Como chegam as encomendas?", "How do orders arrive?", "Selecione todos os canais de venda.", "Select every sales channel.", [o("physical-store", "Loja física", "Physical store", "LF"), o("website", "Website", "Website", "WB"), o("phone", "Telefone", "Phone", "TF"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("marketplace", "Marketplace", "Marketplace", "MP"), o("email", "Email", "Email", "EM"), o("other", "Outro", "Other", "+")]),
      q("commerce_inventory", "single", "Como gerem o inventário?", "How do you manage inventory?", "Escolha o sistema principal de stock.", "Choose the primary stock system.", [o("pos", "POS", "POS", "PS"), o("ecommerce", "Plataforma de e-commerce", "E-commerce platform", "EC"), o("erp", "ERP", "ERP", "ER"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("manual", "Controlo manual", "Manual tracking", "MN"), o("no-realtime", "Sem stock em tempo real", "No real-time stock", "—"), o("other", "Outro", "Other", "+")]),
      q("commerce_customer_channels", "multi", "Como entram em contacto os clientes?", "How do customers contact you?", "Selecione todos os canais de apoio.", "Select every support channel.", [o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("email", "Email", "Email", "EM"), o("phone", "Telefone", "Phone", "TF"), o("social-media", "Redes sociais", "Social media", "RS"), o("website-chat", "Chat do website", "Website chat", "CH"), o("in-store", "Na loja", "In store", "LJ"), o("other", "Outro", "Other", "+")]),
      q("commerce_software", "multi", "Que software comercial utilizam?", "Which commerce software do you use?", "Selecione as plataformas ligadas a vendas e operações.", "Select the platforms connected to sales and operations.", [o("shopify", "Shopify", "Shopify", "SH"), o("woocommerce", "WooCommerce", "WooCommerce", "WC"), o("moloni", "Moloni", "Moloni", "MO"), o("phc", "PHC", "PHC", "PH"), o("primavera", "Primavera", "Primavera", "PR"), o("vendus", "Vendus", "Vendus", "VE"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]),
      q("commerce_repetitive_task", "single", "Qual é a tarefa mais repetitiva?", "What is the most repetitive task?", "Escolha o trabalho manual com maior volume.", "Choose the highest-volume manual work.", [o("order-entry", "Registar encomendas", "Entering orders", "EN"), o("inventory-sync", "Sincronizar stock", "Synchronizing stock", "ST"), o("customer-replies", "Responder a clientes", "Answering customers", "CL"), o("invoicing", "Emitir faturas", "Issuing invoices", "FT"), o("supplier-orders", "Encomendar a fornecedores", "Ordering from suppliers", "FR"), o("product-updates", "Atualizar produtos", "Updating products", "PR"), o("returns", "Gerir devoluções", "Managing returns", "DV"), o("other", "Outra", "Other", "+")], "task")
    ]
  },
  {
    id: "logistics", label: sectorOptions[7].label, mark: "LT", questions: [
      q("logistics_request_sources", "multi", "Como são recebidos os pedidos de entrega?", "How are delivery requests received?", "Selecione todos os canais utilizados.", "Select every channel used.", [o("email", "Email", "Email", "EM"), o("phone", "Telefone", "Phone", "TF"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("portal", "Portal", "Portal", "PT"), o("api-edi", "API ou EDI", "API or EDI", "AP"), o("recurring", "Planeamento recorrente", "Recurring schedule", "RC"), o("other", "Outro", "Other", "+")]),
      q("logistics_routes", "single", "Como são planeadas as rotas?", "How are routes planned?", "Escolha o método principal de planeamento.", "Choose the primary planning method.", [o("route-software", "Software de rotas", "Route planning software", "SR"), o("dispatcher", "Manualmente pelo gestor de tráfego", "Manually by a dispatcher", "GT"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("maps", "Google Maps ou semelhante", "Google Maps or similar", "MP"), o("driver", "Decisão do motorista", "Driver decides", "MO"), o("other", "Outro", "Other", "+")]),
      q("logistics_driver_communication", "multi", "Como comunicam com os motoristas?", "How do drivers communicate?", "Selecione todos os canais operacionais.", "Select every operational channel.", [o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("phone", "Telefone", "Phone", "TF"), o("driver-app", "Aplicação do motorista", "Driver app", "AP"), o("sms", "SMS", "SMS", "SM"), o("radio", "Rádio", "Radio", "RD"), o("other", "Outro", "Other", "+")]),
      q("logistics_software", "multi", "Que software logístico utilizam?", "Which logistics software do you use?", "Inclua transporte, frota, rotas e tracking.", "Include transport, fleet, routing, and tracking tools.", [o("tms", "TMS", "TMS", "TM"), o("erp", "ERP", "ERP", "ER"), o("fleet-gps", "Gestão de frota ou GPS", "Fleet management or GPS", "GP"), o("route-planner", "Planeador de rotas", "Route planner", "RT"), o("excel", "Excel", "Excel", "XL"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]),
      q("logistics_bottleneck", "single", "Qual é o maior gargalo operacional?", "What is the biggest operational bottleneck?", "Escolha onde a operação perde mais tempo.", "Choose where operations lose the most time.", [o("dispatch", "Despacho de serviços", "Dispatching jobs", "DP"), o("route-planning", "Planeamento de rotas", "Route planning", "RT"), o("status-updates", "Atualizações de estado", "Status updates", "ST"), o("proof-delivery", "Provas de entrega", "Proof of delivery", "PE"), o("data-entry", "Introdução de dados", "Data entry", "ID"), o("billing", "Faturação", "Billing", "FT"), o("other", "Outro", "Other", "+")], "challenge")
    ]
  },
  {
    id: "hospitality", label: sectorOptions[8].label, mark: "HR", questions: [
      q("hospitality_reservations", "multi", "Como chegam as reservas?", "How do reservations arrive?", "Selecione todos os canais de reserva.", "Select every reservation channel.", [o("phone", "Telefone", "Phone", "TF"), o("website", "Website", "Website", "WB"), o("ota", "Booking.com ou outras OTA", "Booking.com or other OTAs", "OT"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("email", "Email", "Email", "EM"), o("walk-in", "Presencialmente", "Walk-in", "PR"), o("other", "Outro", "Other", "+")]),
      q("hospitality_shifts", "single", "Como são organizados os turnos?", "How are shifts organized?", "Escolha o método principal.", "Choose the primary method.", [o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("paper-board", "Papel ou quadro", "Paper or board", "PQ"), o("scheduling-app", "Aplicação de turnos", "Scheduling app", "AT"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("manager", "Manualmente pelo responsável", "Manually by the manager", "MN"), o("other", "Outro", "Other", "+")]),
      q("hospitality_suppliers", "single", "Como são geridos os fornecedores?", "How are suppliers managed?", "Indique onde controlam pedidos e entregas.", "Tell us where orders and deliveries are tracked.", [o("email-phone", "Email e telefone", "Email and phone", "ET"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("supplier-portals", "Portais de fornecedores", "Supplier portals", "PF"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("erp", "ERP", "ERP", "ER"), o("manual", "Sem sistema central", "No central system", "—"), o("other", "Outro", "Other", "+")]),
      q("hospitality_software", "multi", "Que software especializado utilizam?", "Which specialist software do you use?", "Selecione os sistemas ligados à operação.", "Select the systems connected to operations.", [o("pms", "PMS", "PMS", "PM"), o("pos", "POS", "POS", "PS"), o("channel-manager", "Channel manager", "Channel manager", "CM"), o("booking-engine", "Motor de reservas", "Booking engine", "MR"), o("erp-accounting", "ERP ou faturação", "ERP or billing", "ER"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]),
      q("hospitality_repetitive_task", "single", "Qual é a tarefa mais repetitiva?", "What is the most repetitive task?", "Escolha o trabalho que mais ocupa a equipa.", "Choose the work that occupies the team most.", [o("confirmations", "Confirmar reservas", "Confirming reservations", "RS"), o("guest-questions", "Responder a hóspedes", "Answering guests", "HG"), o("supplier-orders", "Fazer pedidos a fornecedores", "Ordering from suppliers", "FR"), o("shifts", "Organizar turnos", "Organizing shifts", "TR"), o("invoicing", "Faturação", "Billing", "FT"), o("reviews", "Pedir e responder a avaliações", "Requesting and answering reviews", "AV"), o("other", "Outra", "Other", "+")], "task")
    ]
  },
  {
    id: "education", label: sectorOptions[9].label, mark: "EF", questions: [
      q("education_enrolment", "multi", "Como se inscrevem os novos alunos?", "How do new students register?", "Selecione todos os canais de inscrição.", "Select every enrolment channel.", [o("website-form", "Website ou formulário", "Website or form", "WB"), o("email", "Email", "Email", "EM"), o("phone-whatsapp", "Telefone ou WhatsApp", "Phone or WhatsApp", "TF"), o("in-person", "Presencialmente", "In person", "PR"), o("platform", "Plataforma de inscrições", "Enrolment platform", "PL"), o("referrals", "Referências", "Referrals", "RF"), o("other", "Outro", "Other", "+")]),
      q("education_communication", "multi", "Como comunicam com alunos e encarregados?", "How do you communicate with students and families?", "Selecione todos os canais habituais.", "Select every channel you regularly use.", [o("email", "Email", "Email", "EM"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("lms", "LMS", "LMS", "LM"), o("portal-app", "Portal ou aplicação", "Portal or app", "AP"), o("phone-sms", "Telefone ou SMS", "Phone or SMS", "TF"), o("other", "Outro", "Other", "+")]),
      q("education_payments", "single", "Como são geridos os pagamentos?", "How are payments managed?", "Escolha o método principal de cobrança e controlo.", "Choose the primary collection and tracking method.", [o("bank-transfer", "Transferência e controlo manual", "Bank transfer and manual tracking", "TR"), o("direct-debit", "Débito direto", "Direct debit", "DD"), o("online-card", "Pagamento online ou cartão", "Online payment or card", "PO"), o("billing-software", "Software de faturação", "Billing software", "SF"), o("erp", "ERP", "ERP", "ER"), o("cash", "Dinheiro", "Cash", "DN"), o("other", "Outro", "Other", "+")]),
      q("education_software", "multi", "Que software educativo ou administrativo utilizam?", "Which education or administrative software do you use?", "Selecione os sistemas ligados a alunos e operação.", "Select the systems connected to students and operations.", [o("lms", "LMS", "LMS", "LM"), o("school-management", "Gestão escolar", "School management", "GE"), o("crm", "CRM", "CRM", "CR"), o("erp-billing", "ERP ou faturação", "ERP or billing", "ER"), o("workspace", "Google Workspace ou Microsoft 365", "Google Workspace or Microsoft 365", "WS"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]),
      q("education_repetitive_task", "single", "Qual é a tarefa mais repetitiva?", "What is the most repetitive task?", "Escolha o trabalho administrativo com maior volume.", "Choose the highest-volume administrative work.", [o("enrolments", "Processar inscrições", "Processing enrolments", "IN"), o("attendance", "Registar presenças", "Recording attendance", "PR"), o("payment-chasing", "Cobrar pagamentos", "Chasing payments", "PG"), o("certificates", "Preparar certificados e documentos", "Preparing certificates and documents", "CD"), o("scheduling", "Organizar horários", "Organizing schedules", "HR"), o("communications", "Enviar comunicações", "Sending communications", "CM"), o("other", "Outra", "Other", "+")], "task")
    ]
  },
  {
    id: "manufacturing", label: sectorOptions[10].label, mark: "IN", questions: [
      q("manufacturing_orders", "multi", "Como chegam as ordens de produção?", "How do production orders arrive?", "Selecione todas as origens utilizadas.", "Select every source used.", [o("email", "Email", "Email", "EM"), o("erp", "ERP", "ERP", "ER"), o("sales-team", "Equipa comercial", "Sales team", "EC"), o("edi-api", "EDI ou API", "EDI or API", "AP"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("paper-phone", "Papel ou telefone", "Paper or phone", "PT"), o("other", "Outro", "Other", "+")]),
      q("manufacturing_planning", "single", "Como é planeada a produção?", "How is production planned?", "Escolha o método principal de planeamento.", "Choose the primary planning method.", [o("erp-mrp", "ERP ou MRP", "ERP or MRP", "ER"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("whiteboard-paper", "Quadro ou papel", "Whiteboard or paper", "QP"), o("planning-software", "Software de planeamento", "Planning software", "SP"), o("manager", "Manualmente pelo responsável", "Manually by the manager", "MN"), o("other", "Outro", "Other", "+")]),
      q("manufacturing_inventory", "single", "Como são geridos os inventários?", "How is inventory managed?", "Indique onde existe a informação principal de stock.", "Tell us where the primary stock information lives.", [o("erp-wms", "ERP ou WMS", "ERP or WMS", "ER"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("manual-counts", "Contagens e registos manuais", "Manual counts and records", "MN"), o("barcode", "Sistema de códigos de barras", "Barcode system", "CB"), o("no-realtime", "Sem stock em tempo real", "No real-time stock", "—"), o("other", "Outro", "Other", "+")]),
      q("manufacturing_software", "multi", "Que ERP ou software industrial utilizam?", "Which ERP or manufacturing software do you use?", "Selecione os sistemas ligados à produção.", "Select the systems connected to production.", [o("sap", "SAP", "SAP", "SA"), o("primavera", "Primavera", "Primavera", "PR"), o("phc", "PHC", "PHC", "PH"), o("sage", "Sage", "Sage", "SG"), o("dynamics", "Microsoft Dynamics", "Microsoft Dynamics", "MD"), o("other-erp", "Outro ERP/MRP", "Other ERP/MRP", "ER"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]),
      q("manufacturing_bottleneck", "single", "Qual é o maior gargalo operacional?", "What is the biggest operational bottleneck?", "Escolha onde a produção perde mais eficiência.", "Choose where production loses the most efficiency.", [o("planning", "Planeamento da produção", "Production planning", "PL"), o("stock", "Precisão do stock", "Stock accuracy", "ST"), o("suppliers", "Coordenação com fornecedores", "Supplier coordination", "FR"), o("quality", "Registos de qualidade", "Quality records", "QL"), o("downtime", "Paragens e manutenção", "Downtime and maintenance", "MN"), o("reporting", "Reporting de produção", "Production reporting", "RT"), o("other", "Outro", "Other", "+")], "challenge")
    ]
  },
  {
    id: "marketing-agency", label: sectorOptions[11].label, mark: "MK", questions: [
      q("agency_client_sources", "multi", "Como chegam os novos clientes?", "How do new clients arrive?", "Selecione todos os canais que geram oportunidades.", "Select every channel that generates opportunities.", [o("referrals", "Referências", "Referrals", "RF"), o("website", "Website", "Website", "WB"), o("social-media", "Redes sociais", "Social media", "RS"), o("outbound", "Prospecção ativa", "Outbound prospecting", "PA"), o("email", "Email", "Email", "EM"), o("partners", "Parceiros ou plataformas", "Partners or platforms", "PC"), o("other", "Outro", "Other", "+")]),
      q("agency_approvals", "single", "Como aprovam os clientes o trabalho?", "How do clients approve work?", "Escolha o processo mais habitual.", "Choose the most common process.", [o("email", "Email", "Email", "EM"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("project-tool", "Ferramenta de projetos", "Project tool", "FP"), o("pdf-comments", "PDF ou comentários em ficheiros", "PDF or file comments", "PD"), o("meetings", "Reuniões ou chamadas", "Meetings or calls", "RE"), o("no-process", "Sem processo consistente", "No consistent process", "—"), o("other", "Outro", "Other", "+")]),
      q("agency_projects", "single", "Como são geridos os projetos?", "How are projects managed?", "Indique onde a equipa acompanha trabalho e prazos.", "Tell us where the team tracks work and deadlines.", [o("asana-trello-clickup", "Asana, Trello ou ClickUp", "Asana, Trello, or ClickUp", "PM"), o("notion", "Notion", "Notion", "NO"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("agency-software", "Software de agência", "Agency software", "AG"), o("email-chat", "Email ou chat", "Email or chat", "EM"), o("other", "Outro", "Other", "+")]),
      q("agency_software", "multi", "Que software especializado utilizam?", "Which specialist software do you use?", "Selecione as ferramentas ligadas à operação da agência.", "Select the tools connected to agency operations.", [o("crm", "CRM", "CRM", "CR"), o("project-management", "Gestão de projetos", "Project management", "GP"), o("time-tracking", "Registo de tempo", "Time tracking", "TP"), o("reporting", "Reporting e dashboards", "Reporting and dashboards", "RT"), o("creative-collaboration", "Revisão criativa", "Creative collaboration", "RC"), o("spreadsheet", "Folha de cálculo", "Spreadsheet", "FC"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]),
      q("agency_repetitive_task", "single", "Qual é a tarefa mais repetitiva?", "What is the most repetitive task?", "Escolha o trabalho que mais se repete entre clientes.", "Choose the work repeated most often across clients.", [o("reporting", "Preparar relatórios", "Preparing reports", "RT"), o("proposals", "Criar propostas", "Creating proposals", "PP"), o("onboarding", "Onboarding de clientes", "Client onboarding", "ON"), o("client-updates", "Atualizar clientes", "Updating clients", "CL"), o("approvals", "Gerir aprovações", "Managing approvals", "AP"), o("content-scheduling", "Agendar conteúdos", "Scheduling content", "CT"), o("invoicing", "Faturação", "Billing", "FT"), o("other", "Outra", "Other", "+")], "task")
    ]
  },
  {
    id: "other", label: sectorOptions[12].label, mark: "+", questions: [
      q("other_time_area", "multi", "Que área consome mais tempo?", "Which area consumes the most time?", "Selecione as áreas onde o trabalho mais se acumula.", "Select the areas where work accumulates most.", [o("clients", "Clientes", "Clients", "CL"), o("emails", "Emails", "Emails", "EM"), o("documents", "Documentos", "Documents", "DC"), o("finance", "Finanças", "Finance", "FN"), o("operations", "Operações", "Operations", "OP"), o("purchasing", "Compras", "Purchasing", "CP"), o("marketing", "Marketing", "Marketing", "MK"), o("hr", "Recursos humanos", "Human resources", "RH"), o("scheduling", "Agendamentos", "Scheduling", "AG"), o("other", "Outra", "Other", "+")], "challenge"),
      q("other_work_intake", "multi", "Como chega normalmente o trabalho?", "How does work usually arrive?", "Pense em pedidos de clientes e tarefas internas.", "Think about customer requests and internal tasks.", [o("email", "Email", "Email", "EM"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("phone", "Telefone", "Phone", "TF"), o("website-form", "Website ou formulário", "Website or form", "WB"), o("platform", "Plataforma ou portal", "Platform or portal", "PL"), o("in-person-referral", "Presencial ou referência", "In person or referral", "PR"), o("internal-request", "Pedido interno", "Internal request", "IN"), o("other", "Outro", "Other", "+")]),
      q("other_customer_communication", "multi", "Como comunicam com os clientes?", "How do you communicate with customers?", "Selecione todos os canais utilizados.", "Select every channel used.", [o("email", "Email", "Email", "EM"), o("whatsapp", "WhatsApp", "WhatsApp", "WA"), o("phone", "Telefone", "Phone", "TF"), o("meetings", "Reuniões", "Meetings", "RE"), o("in-person", "Presencialmente", "In person", "PR"), o("social-chat", "Redes sociais ou chat", "Social media or chat", "RS"), o("portal", "Portal", "Portal", "PT"), o("other", "Outro", "Other", "+")]),
      q("other_operational_software", "multi", "Que software operacional utilizam?", "Which operational software do you use?", "Selecione os sistemas que suportam o trabalho principal.", "Select the systems supporting your core work.", [o("erp", "ERP", "ERP", "ER"), o("crm", "CRM", "CRM", "CR"), o("accounting", "Faturação ou contabilidade", "Billing or accounting", "FT"), o("project-management", "Gestão de projetos", "Project management", "GP"), o("sector-software", "Software específico do setor", "Sector-specific software", "SS"), o("excel", "Excel", "Excel", "XL"), o("none", "Sem sistema central", "No central system", "—", true), o("other", "Outro", "Other", "+")]),
      q("other_repetitive_task", "single", "Qual é a tarefa repetitiva que mais gostaria de remover?", "Which repetitive task would you most like to remove?", "Escolha a que teria maior impacto imediato.", "Choose the one with the greatest immediate impact.", [o("data-entry", "Introdução de dados", "Data entry", "ID"), o("email-replies", "Responder a emails", "Answering emails", "EM"), o("documents", "Preparar documentos", "Preparing documents", "DC"), o("scheduling", "Agendamentos", "Scheduling", "AG"), o("followups", "Follow-ups", "Follow-ups", "FU"), o("reporting", "Relatórios", "Reporting", "RT"), o("quotes-invoices", "Orçamentos ou faturas", "Quotes or invoices", "FT"), o("other", "Outra", "Other", "+")], "task")
    ]
  }
];

type QuestionEnhancement = {
  title?: Localized;
  help?: Localized;
  addOptions?: OptionDefinition[];
  optionGroups?: OptionGroupDefinition[];
  optionVisibility?: OptionVisibilityRule[];
  insightKey?: string;
};

const group = (
  id: string,
  pt: string,
  en: string,
  optionIds: string[],
  required = false,
  compact = false
): OptionGroupDefinition => ({ id, label: l(pt, en), optionIds, required, compact });

const questionEnhancements: Record<string, QuestionEnhancement> = {
  accounting_document_intake: {
    title: l("Que documentos recebe com regularidade e por onde chegam?", "Which documents arrive regularly, and through which channels?"),
    help: l("Selecione pelo menos um tipo de documento e um canal de entrada.", "Select at least one document type and one intake channel."),
    addOptions: [o("invoices-receipts", "Faturas e recibos", "Invoices and receipts", "FR"), o("bank-statements", "Extratos bancários", "Bank statements", "EB"), o("payroll", "Dados de salários", "Payroll data", "SL"), o("tax-support", "Documentos fiscais", "Tax documents", "DF"), o("management-info", "Informação de gestão", "Management information", "IG")],
    optionGroups: [
      group("document-types", "Tipos de documento", "Document types", ["invoices-receipts", "bank-statements", "payroll", "tax-support", "management-info"], true, true),
      group("intake-channels", "Canais de entrada", "Intake channels", ["email", "whatsapp", "client-portal", "cloud-folder", "paper", "direct-integration", "other"], true)
    ],
    insightKey: "fragmented-intake"
  },
  accounting_time_consumers: {
    title: l("Em que tarefas a equipa perde mais tempo todas as semanas?", "Which tasks take the most team time every week?"),
    help: l("Inclua tarefas repetidas entre clientes, sistemas ou períodos contabilísticos.", "Include work repeated across clients, systems, or accounting periods."),
    addOptions: [o("rekeying-data", "Voltar a introduzir dados", "Re-entering data", "ID"), o("payroll-processing", "Processar salários", "Processing payroll", "SL"), o("recurring-reporting", "Preparar reporting recorrente", "Preparing recurring reporting", "RT")],
    insightKey: "time-sinks"
  },
  accounting_client_communication: {
    title: l("Como sabe o que falta e faz os pedidos aos clientes?", "How do you track what is missing and request it from clients?"),
    help: l("Queremos perceber se o controlo depende de mensagens, listas ou lembretes manuais.", "We want to understand whether tracking depends on messages, lists, or manual reminders."),
    addOptions: [o("spreadsheet-checklist", "Lista ou folha de cálculo", "Checklist or spreadsheet", "FC"), o("automatic-reminders", "Lembretes automáticos", "Automatic reminders", "AU"), o("not-tracked", "Não existe um controlo consistente", "No consistent tracking", "—")],
    insightKey: "manual-followup"
  },
  accounting_software: {
    title: l("Em que sistemas vivem hoje os dados contabilísticos e financeiros?", "Which systems currently hold your accounting and financial data?"),
    help: l("Inclua faturação, contabilidade, bancos, portais e folhas de cálculo.", "Include billing, accounting, banks, portals, and spreadsheets."),
    addOptions: [o("moloni", "Moloni", "Moloni", "MO"), o("invoice-express", "InvoiceXpress", "InvoiceXpress", "IX"), o("jasmin", "Jasmin", "Jasmin", "JA"), o("banking", "Portais bancários", "Banking portals", "BC")]
  },
  accounting_priority_task: { title: l("Qual destes fluxos automatizaria primeiro?", "Which of these workflows would you automate first?"), help: l("Escolha o que teria maior impacto em tempo, erros ou serviço ao cliente.", "Choose the one with the greatest impact on time, errors, or client service."), addOptions: [o("payroll", "Processar salários", "Processing payroll", "SL"), o("data-sync", "Sincronizar dados entre sistemas", "Synchronizing data between systems", "LS")] },

  legal_case_intake: {
    title: l("Como entram novos clientes ou processos e que informação é recolhida?", "How do new clients or matters arrive, and what information is collected?"),
    help: l("Selecione as origens e os elementos que a equipa recolhe antes de abrir o processo.", "Select the sources and details the team collects before opening a matter."),
    addOptions: [o("identity-kyc", "Identificação ou KYC", "Identity or KYC", "ID"), o("matter-details", "Dados do pedido ou processo", "Matter or request details", "DP"), o("supporting-documents", "Documentos de suporte", "Supporting documents", "DS"), o("conflict-check", "Verificação de conflitos", "Conflict check", "VC")],
    optionGroups: [group("case-sources", "Origem do pedido", "Request source", ["referrals", "email", "whatsapp", "phone", "website-form", "in-person", "other", "platform"], true), group("intake-data", "Informação recolhida", "Information collected", ["identity-kyc", "matter-details", "supporting-documents", "conflict-check"], true, true)],
    insightKey: "structured-intake"
  },
  legal_deadlines: { title: l("Como são registados, atribuídos e acompanhados os prazos?", "How are deadlines recorded, assigned, and monitored?"), help: l("Escolha o método que representa a prática diária da equipa.", "Choose the method that reflects the team's daily practice."), addOptions: [o("automatic-rules", "Regras e lembretes automáticos", "Automated rules and reminders", "AU"), o("dual-control", "Dupla validação", "Dual control", "DV")], insightKey: "deadline-risk" },
  legal_documents: { title: l("Como criam documentos recorrentes e controlam a versão certa?", "How do you create recurring documents and control the correct version?"), help: l("Pense em modelos, cópias de documentos anteriores, revisões e arquivo.", "Think about templates, copying prior documents, reviews, and filing."), addOptions: [o("templates-fields", "Modelos preenchidos com dados", "Data-driven templates", "MD"), o("copy-paste", "Copiar e adaptar documentos anteriores", "Copying and adapting prior documents", "CP"), o("document-automation", "Automação documental", "Document automation", "AU")], insightKey: "document-workflow" },
  legal_software: { title: l("Que sistemas apoiam processos, documentos, tempos e faturação?", "Which systems support matters, documents, time, and billing?"), help: l("Selecione todas as ferramentas usadas no trabalho jurídico e administrativo.", "Select every tool used in legal and administrative work."), addOptions: [o("document-management", "Gestão documental", "Document management", "GD"), o("e-signature", "Assinatura eletrónica", "Electronic signature", "AE"), o("time-billing", "Tempos e faturação", "Time and billing", "TF")] },
  legal_repetitive_task: { title: l("Qual tarefa administrativa se repete mais entre processos?", "Which administrative task repeats most across matters?"), help: l("Escolha o primeiro fluxo que justificaria uma análise de automação.", "Choose the first workflow worth an automation review."), addOptions: [o("intake", "Abrir processos e recolher dados", "Opening matters and collecting data", "IN"), o("kyc-conflicts", "KYC e conflitos", "KYC and conflict checks", "KC")] },

  realestate_lead_sources: { title: l("De onde chegam os novos leads imobiliários?", "Where do new real-estate leads come from?"), help: l("Selecione portais, campanhas e canais diretos usados pela equipa.", "Select the portals, campaigns, and direct channels used by the team."), addOptions: [o("meta-ads", "Anúncios Meta", "Meta ads", "MA"), o("google-ads", "Google Ads", "Google Ads", "GA"), o("email-campaigns", "Campanhas de email", "Email campaigns", "EM")], insightKey: "lead-fragmentation" },
  realestate_followup: { title: l("Com que rapidez e processo fazem follow-up aos leads?", "How quickly and consistently do you follow up with leads?"), help: l("Escolha a opção que melhor representa o primeiro contacto e os passos seguintes.", "Choose the option that best represents first contact and the next steps."), addOptions: [o("under-five-minutes", "Em menos de 5 minutos", "Within 5 minutes", "5M"), o("same-day", "No próprio dia", "On the same day", "HD"), o("when-possible", "Quando é possível", "When possible", "QP")], insightKey: "speed-to-lead" },
  realestate_listings: { title: l("Como mantêm os dados dos imóveis atualizados entre sistemas e portais?", "How do you keep property data updated across systems and portals?"), help: l("Queremos localizar duplicação, atrasos e versões inconsistentes.", "We want to locate duplication, delays, and inconsistent versions."), addOptions: [o("automatic-syndication", "Publicação e atualização automáticas", "Automatic publishing and updates", "AU"), o("mixed-process", "Parte automática e parte manual", "Partly automatic, partly manual", "MX")] },
  realestate_software: { title: l("Que CRM, portais ou ferramentas imobiliárias utilizam?", "Which CRM, portal, or real-estate tools do you use?"), help: l("Selecione os sistemas onde vivem leads, imóveis, visitas e oportunidades.", "Select the systems holding leads, properties, viewings, and opportunities."), addOptions: [o("ego", "eGO Real Estate", "eGO Real Estate", "EG"), o("witei", "Witei", "Witei", "WI"), o("casafari", "CASAFARI", "CASAFARI", "CA"), o("comparables", "Pesquisa e comparáveis", "Research and comparables", "PC")] },
  realestate_bottleneck: { title: l("Onde perde hoje mais oportunidades comerciais?", "Where do you currently lose the most commercial opportunities?"), help: l("Escolha o ponto com maior impacto em velocidade ou conversão.", "Choose the point with the greatest impact on speed or conversion."), addOptions: [o("qualification", "Qualificar leads", "Qualifying leads", "QL"), o("seller-prospecting", "Prospeção de proprietários", "Seller prospecting", "PR"), o("comparables", "Pesquisa de mercado e comparáveis", "Market research and comparables", "PC"), o("post-viewing", "Follow-up após visitas", "Post-viewing follow-up", "PV")], insightKey: "commercial-bottleneck" },

  finance_document_intake: {
    title: l("A que processos pertence a documentação e por onde chega?", "Which processes does the documentation support, and how does it arrive?"),
    help: l("Selecione pelo menos um processo e um canal de entrada.", "Select at least one process and one intake channel."),
    addOptions: [o("onboarding-kyc", "Onboarding e KYC", "Onboarding and KYC", "KY"), o("quotes-proposals", "Cotações ou propostas", "Quotes or proposals", "PP"), o("policies-contracts", "Apólices ou contratos", "Policies or contracts", "AP"), o("claims", "Sinistros", "Claims", "SI"), o("renewals", "Renovações", "Renewals", "RN")],
    optionGroups: [group("finance-processes", "Processos", "Processes", ["onboarding-kyc", "quotes-proposals", "policies-contracts", "claims", "renewals"], true, true), group("finance-channels", "Canais de entrada", "Intake channels", ["email", "whatsapp", "client-portal", "in-person", "paper", "other"], true)],
    insightKey: "document-volume"
  },
  finance_renewals: { title: l("Como acompanham renovações, revisões ou datas críticas?", "How do you track renewals, reviews, or critical dates?"), help: l("Escolha o método principal para saber o que exige ação e quando.", "Choose the main method for knowing what needs action and when."), addOptions: [o("automatic-workflow", "Workflow automático", "Automated workflow", "AU"), o("expiry-dashboard", "Dashboard de datas críticas", "Critical-date dashboard", "DB")], insightKey: "renewal-risk" },
  finance_communication: { title: l("Como recebem pedidos, informação em falta e atualizações de clientes?", "How do you receive requests, missing information, and client updates?"), help: l("Selecione os canais onde o estado de cada processo pode ficar disperso.", "Select the channels where each process status can become scattered."), addOptions: [o("automatic-status", "Atualizações automáticas", "Automatic status updates", "AU"), o("case-tracking", "Acompanhamento central por processo", "Central case tracking", "AC")] },
  finance_software: { title: l("Que sistemas suportam clientes, documentação e compliance?", "Which systems support clients, documents, and compliance?"), help: l("Inclua CRM, plataformas setoriais, validação, assinatura e arquivo.", "Include CRM, sector platforms, validation, signing, and filing."), addOptions: [o("compliance-kyc", "Compliance ou KYC", "Compliance or KYC", "KY"), o("e-signature", "Assinatura eletrónica", "Electronic signature", "AE") ] },
  finance_repetitive_task: { title: l("Qual tarefa manual recorrente tem maior impacto?", "Which recurring manual task has the greatest impact?"), help: l("Considere tempo, risco, experiência do cliente e receita recorrente.", "Consider time, risk, client experience, and recurring revenue."), addOptions: [o("quote-comparison", "Comparar cotações", "Comparing quotes", "CQ"), o("claims", "Processar sinistros", "Processing claims", "SI"), o("kyc-onboarding", "Onboarding e KYC", "Onboarding and KYC", "KY")], insightKey: "regulated-workflow" },

  healthcare_booking: { title: l("Por onde entram os pedidos de marcação?", "Where do appointment requests come from?"), help: l("Selecione os canais que a receção ou equipa clínica precisa de acompanhar.", "Select the channels the reception or clinical team must monitor."), addOptions: [o("social-ads", "Redes sociais ou anúncios", "Social media or ads", "RS"), o("referrals", "Referências clínicas", "Clinical referrals", "RF"), o("insurance", "Seguradoras ou convenções", "Insurers or health plans", "SG")], insightKey: "booking-fragmentation" },
  healthcare_confirmation: { title: l("Como um pedido se transforma numa consulta confirmada na agenda?", "How does a request become a confirmed appointment in the calendar?"), help: l("Escolha o passo que melhor descreve validação, resposta e registo.", "Choose the step that best describes validation, response, and entry."), addOptions: [o("manual-reentry", "Resposta e registo manual", "Manual reply and re-entry", "MN"), o("online-live-calendar", "Agenda online em tempo real", "Live online calendar", "AO")], insightKey: "booking-handoff" },
  healthcare_reminders: { title: l("Como reduzem faltas e preenchem cancelamentos?", "How do you reduce no-shows and fill cancellations?"), help: l("Considere lembretes, confirmação ativa, sinal, lista de espera e reativação.", "Consider reminders, active confirmation, deposits, waitlists, and reactivation."), addOptions: [o("confirmation-request", "Pedido de confirmação", "Confirmation request", "CF"), o("deposit", "Sinal ou pré-pagamento", "Deposit or prepayment", "PG"), o("waitlist", "Lista de espera para cancelamentos", "Cancellation waitlist", "LE"), o("recall-reactivation", "Recall ou reativação", "Recall or reactivation", "RC")], insightKey: "no-show-control" },
  healthcare_software: { title: l("Que sistemas apoiam agenda, processo clínico e faturação?", "Which systems support scheduling, clinical records, and billing?"), help: l("Selecione os sistemas que precisam de partilhar dados sem nova introdução manual.", "Select the systems that need to share data without manual re-entry."), addOptions: [o("ehr", "Processo clínico eletrónico", "Electronic health record", "PE"), o("online-booking", "Agenda online", "Online booking", "AO"), o("patient-forms", "Formulários de pacientes", "Patient forms", "FP")] },
  healthcare_bottleneck: { title: l("Qual é hoje o maior bloqueio administrativo da clínica?", "What is the clinic's biggest administrative bottleneck today?"), help: l("Escolha o ponto que mais pressiona capacidade, receita ou experiência do paciente.", "Choose the point putting the most pressure on capacity, revenue, or patient experience."), addOptions: [o("intake-forms", "Formulários e admissão", "Intake forms and admission", "IN"), o("treatment-followup", "Follow-up de tratamentos", "Treatment follow-up", "FU"), o("recall", "Reativação de pacientes", "Patient reactivation", "RC")], insightKey: "clinic-bottleneck" },

  construction_quotes: { title: l("Como transformam medições e preços num orçamento pronto a enviar?", "How do measurements and prices become a quotation ready to send?"), help: l("Escolha o método principal usado para reunir custos, margens e modelos.", "Choose the main method used to combine costs, margins, and templates."), addOptions: [o("previous-jobs", "A partir de obras anteriores", "From previous jobs", "OA"), o("integrated-pricing", "Preçários e margens integrados", "Integrated price lists and margins", "PI")], insightKey: "quote-workflow" },
  construction_team_communication: {
    title: l("Que informação passa diariamente entre o terreno e o escritório?", "What information moves daily between the field and the office?"),
    help: l("Selecione os canais e os tipos de informação que precisam de ficar registados.", "Select the channels and information types that need to be recorded."),
    addOptions: [o("photos-video", "Fotografias e vídeo", "Photos and video", "FV"), o("voice-notes", "Áudios e notas de voz", "Voice notes", "AV"), o("incidents", "Incidentes e bloqueios", "Incidents and blockers", "IN"), o("changes-approvals", "Alterações e aprovações", "Changes and approvals", "AP")],
    optionGroups: [group("field-channels", "Canais", "Channels", ["whatsapp", "phone", "email", "project-app", "meetings-paper", "other"], true), group("field-information", "Informação operacional", "Operational information", ["photos-video", "voice-notes", "incidents", "changes-approvals"], true, true)],
    insightKey: "field-handoff"
  },
  construction_projects: { title: l("Onde acompanham tarefas, progresso, alterações e responsáveis?", "Where do you track tasks, progress, changes, and ownership?"), help: l("Escolha a fonte que a equipa considera mais fiável no dia a dia.", "Choose the source the team considers most reliable day to day."), addOptions: [o("site-mobile-app", "Aplicação móvel de obra", "Mobile site app", "AP"), o("integrated-erp", "ERP integrado com a obra", "ERP integrated with site work", "EI")] },
  construction_software: { title: l("Que sistemas apoiam orçamentação, obra, documentos e faturação?", "Which systems support estimating, sites, documents, and billing?"), help: l("Selecione ferramentas usadas no escritório e no terreno.", "Select tools used in the office and in the field."), addOptions: [o("site-management", "Gestão de obra no terreno", "Field site management", "GO"), o("document-management", "Gestão documental", "Document management", "GD"), o("time-attendance", "Tempos e presenças", "Time and attendance", "TP")] },
  construction_bottleneck: { title: l("Onde o trabalho perde mais tempo ou margem?", "Where does work lose the most time or margin?"), help: l("Escolha o ponto com maior efeito em prazo, custo ou faturação.", "Choose the point with the greatest effect on schedule, cost, or billing."), addOptions: [o("changes-approvals", "Alterações e aprovações", "Changes and approvals", "AP"), o("timesheets", "Horas e presenças", "Time and attendance", "TP")], insightKey: "delivery-bottleneck" },

  commerce_order_sources: { title: l("Por que canais chegam encomendas e vendas?", "Which channels generate orders and sales?"), help: l("Selecione todos os canais que precisam de partilhar clientes, produtos e stock.", "Select every channel that needs to share customers, products, and stock."), addOptions: [o("social-commerce", "Instagram, Facebook ou TikTok", "Instagram, Facebook, or TikTok", "RS"), o("meta-ads", "Anúncios Meta", "Meta ads", "MA")], insightKey: "omnichannel-orders" },
  commerce_inventory: { title: l("Como sincronizam stock, produtos, fornecedores e preços?", "How do you synchronize stock, products, suppliers, and prices?"), help: l("Escolha a fonte principal e o nível atual de atualização entre canais.", "Choose the main source and current level of synchronization across channels."), addOptions: [o("supplier-feed", "Feed ou ficheiro de fornecedor", "Supplier feed or file", "FF"), o("automatic-multichannel", "Sincronização automática multicanal", "Automatic multichannel sync", "AU"), o("mixed-sync", "Parte automática e parte manual", "Partly automatic, partly manual", "MX")], insightKey: "inventory-sync" },
  commerce_customer_channels: {
    title: l("Em que canais e sobre que temas entram mais pedidos de clientes?", "Which channels and topics generate the most customer requests?"),
    help: l("Selecione pelo menos um canal e um motivo frequente de contacto.", "Select at least one channel and one frequent reason for contact."),
    addOptions: [o("order-status", "Estado da encomenda", "Order status", "ST"), o("product-questions", "Dúvidas sobre produtos", "Product questions", "PR"), o("returns-exchanges", "Devoluções ou trocas", "Returns or exchanges", "DV"), o("availability", "Disponibilidade ou stock", "Availability or stock", "DS")],
    optionGroups: [group("support-channels", "Canais", "Channels", ["whatsapp", "email", "phone", "social-media", "website-chat", "in-store", "other"], true), group("support-topics", "Motivos frequentes", "Frequent topics", ["order-status", "product-questions", "returns-exchanges", "availability"], true, true)],
    insightKey: "support-volume"
  },
  commerce_software: { title: l("Que plataformas ligam vendas, stock, expedição e faturação?", "Which platforms connect sales, stock, fulfilment, and billing?"), help: l("Selecione ecommerce, POS, ERP, marketplaces e ferramentas logísticas.", "Select ecommerce, POS, ERP, marketplaces, and logistics tools."), addOptions: [o("pos", "POS ou loja física", "POS or physical store", "PS"), o("marketplace-tools", "Gestão de marketplaces", "Marketplace management", "MP"), o("shipping", "Expedição e transportadoras", "Shipping and carriers", "EX"), o("supplier-system", "Sistema ou feed de fornecedor", "Supplier system or feed", "FR")] },
  commerce_repetitive_task: { title: l("Qual tarefa operacional tem hoje maior volume manual?", "Which operational task currently has the highest manual volume?"), help: l("Escolha o fluxo que mais limita crescimento ou experiência do cliente.", "Choose the workflow most limiting growth or customer experience."), addOptions: [o("pricing", "Atualizar preços", "Updating prices", "PC"), o("order-status", "Responder sobre encomendas", "Answering order-status questions", "ST")], insightKey: "commerce-priority" },

  logistics_request_sources: { title: l("Como chegam os pedidos de serviço e em que formato?", "How do service requests arrive, and in which format?"), help: l("Selecione todos os canais que exigem leitura, validação ou nova introdução de dados.", "Select every channel requiring reading, validation, or data re-entry."), addOptions: [o("bulk-file", "Excel, CSV ou ficheiro em lote", "Excel, CSV, or bulk file", "FC"), o("customer-erp", "Integração com ERP do cliente", "Customer ERP integration", "ER")], insightKey: "job-intake" },
  logistics_routes: { title: l("Como são atribuídos os serviços e planeadas as rotas?", "How are jobs assigned and routes planned?"), help: l("Escolha o processo principal usado pelo despacho.", "Choose the main process used by dispatch."), addOptions: [o("tms-optimization", "Otimização automática no TMS", "Automatic TMS optimization", "TM"), o("mixed-planning", "Sugestão automática com ajuste manual", "Automatic suggestion with manual adjustment", "MX")], insightKey: "dispatch-planning" },
  logistics_driver_communication: {
    title: l("Como recebem dos motoristas estados, exceções e provas de entrega?", "How do you receive statuses, exceptions, and proof of delivery from drivers?"),
    help: l("Selecione os canais e a informação operacional recebida durante cada serviço.", "Select the channels and operational information received during each job."),
    addOptions: [o("status-eta", "Estado e ETA", "Status and ETA", "ST"), o("exceptions", "Atrasos e exceções", "Delays and exceptions", "EX"), o("proof-delivery", "Prova de entrega", "Proof of delivery", "PE")],
    optionGroups: [group("driver-channels", "Canais", "Channels", ["whatsapp", "phone", "driver-app", "sms", "radio", "other"], true), group("driver-information", "Informação recebida", "Information received", ["status-eta", "exceptions", "proof-delivery"], true, true)],
    insightKey: "driver-visibility"
  },
  logistics_software: { title: l("Que sistemas ligam pedidos, despacho, frota e faturação?", "Which systems connect requests, dispatch, fleet, and billing?"), help: l("Inclua TMS, ERP, GPS, planeamento e gestão de armazém.", "Include TMS, ERP, GPS, planning, and warehouse management."), addOptions: [o("wms", "WMS", "WMS", "WM"), o("proof-delivery", "Prova de entrega digital", "Digital proof of delivery", "PE") ] },
  logistics_bottleneck: { title: l("Onde a operação perde mais tempo ou visibilidade?", "Where does the operation lose the most time or visibility?"), help: l("Escolha o ponto que mais afeta serviço, custo ou faturação.", "Choose the point most affecting service, cost, or billing."), addOptions: [o("exceptions", "Gerir atrasos e exceções", "Managing delays and exceptions", "EX"), o("eta-customer", "Atualizar ETA ao cliente", "Updating customer ETA", "ET")], insightKey: "logistics-bottleneck" },

  hospitality_reservations: {
    title: l("Que operação gere e por onde entram reservas ou pedidos?", "Which operation do you run, and where do reservations or orders arrive?"),
    help: l("Selecione o tipo de operação e todos os canais relevantes.", "Select the operation type and every relevant channel."),
    addOptions: [o("accommodation", "Alojamento ou hotel", "Accommodation or hotel", "HT"), o("restaurant", "Restaurante ou café", "Restaurant or café", "RS"), o("both", "Alojamento e restauração", "Accommodation and food service", "AR"), o("delivery-platform", "Plataforma de delivery", "Delivery platform", "DL"), o("restaurant-platform", "Plataforma de reservas de mesa", "Table-booking platform", "MR")],
    optionGroups: [group("hospitality-type", "Tipo de operação", "Operation type", ["accommodation", "restaurant", "both"], true, true), group("hospitality-channels", "Canais", "Channels", ["phone", "website", "ota", "whatsapp", "email", "walk-in", "delivery-platform", "restaurant-platform", "other"], true)],
    insightKey: "hospitality-intake"
  },
  hospitality_shifts: { title: l("Como organizam turnos e cobrem alterações de última hora?", "How do you organize shifts and cover last-minute changes?"), help: l("Escolha o método usado para publicar, alterar e confirmar escalas.", "Choose the method used to publish, change, and confirm rosters."), addOptions: [o("staff-self-service", "Aplicação com troca de turnos", "App with shift swapping", "AT"), o("multiple-channels", "Vários canais em paralelo", "Several channels in parallel", "VC")], insightKey: "shift-coordination" },
  hospitality_suppliers: { title: l("Como controlam compras, stock e fornecedores?", "How do you control purchasing, stock, and suppliers?"), help: l("Indique onde comparam necessidades, fazem pedidos e confirmam entregas.", "Tell us where needs are compared, orders placed, and deliveries confirmed."), addOptions: [o("pos-inventory", "Stock ligado ao POS", "Inventory linked to POS", "PS"), o("automatic-reorder", "Alertas ou reposição automática", "Alerts or automatic replenishment", "AU")], insightKey: "purchasing-control" },
  hospitality_software: { title: l("Que sistemas suportam reservas, vendas e operação?", "Which systems support bookings, sales, and operations?"), help: l("As opções são adaptadas ao tipo de operação selecionado.", "The options are tailored to the selected operation type."), addOptions: [o("delivery-management", "Gestão de delivery", "Delivery management", "DL"), o("table-booking", "Reservas de mesa", "Table reservations", "MR"), o("staff-scheduling", "Gestão de equipas e turnos", "Staff and shift management", "TR")], optionVisibility: [
    { optionIds: ["pms", "channel-manager", "booking-engine"], dependsOn: "hospitality_reservations", includesAny: ["accommodation", "both"] },
    { optionIds: ["pos", "delivery-management", "table-booking"], dependsOn: "hospitality_reservations", includesAny: ["restaurant", "both"] }
  ] },
  hospitality_repetitive_task: { title: l("Qual tarefa repetitiva mais ocupa a equipa?", "Which repetitive task occupies the team most?"), help: l("As opções são adaptadas ao tipo de operação selecionado.", "The options are tailored to the selected operation type."), addOptions: [o("delivery-orders", "Consolidar pedidos de delivery", "Consolidating delivery orders", "DL"), o("stock-counts", "Contagens e controlo de stock", "Stock counts and control", "ST")], optionVisibility: [
    { optionIds: ["confirmations", "guest-questions", "reviews"], dependsOn: "hospitality_reservations", includesAny: ["accommodation", "both"] },
    { optionIds: ["delivery-orders", "stock-counts"], dependsOn: "hospitality_reservations", includesAny: ["restaurant", "both"] }
  ], insightKey: "hospitality-priority" },

  education_enrolment: {
    title: l("Que tipo de formação presta e por onde entram inscrições?", "What type of education do you provide, and where do enrolments arrive?"),
    help: l("Selecione o tipo de operação e os canais de inscrição utilizados.", "Select the operation type and enrolment channels used."),
    addOptions: [o("school", "Escola ou colégio", "School", "ES"), o("training-centre", "Centro de formação", "Training centre", "CF"), o("tutoring", "Explicações ou tutoria", "Tutoring", "EX"), o("online-courses", "Cursos online", "Online courses", "ON"), o("open-days-ads", "Eventos, campanhas ou open days", "Events, campaigns, or open days", "EV")],
    optionGroups: [group("education-type", "Tipo de operação", "Operation type", ["school", "training-centre", "tutoring", "online-courses"], true, true), group("education-channels", "Canais de inscrição", "Enrolment channels", ["website-form", "email", "phone-whatsapp", "in-person", "platform", "referrals", "open-days-ads", "other"], true)],
    insightKey: "enrolment-intake"
  },
  education_communication: { title: l("Como enviam avisos, lembretes e atualizações a alunos ou famílias?", "How do you send notices, reminders, and updates to students or families?"), help: l("Selecione todos os canais que a equipa precisa de manter atualizados.", "Select every channel the team needs to keep updated."), addOptions: [o("automatic-reminders", "Lembretes automáticos", "Automatic reminders", "AU"), o("segmented-messages", "Comunicações segmentadas", "Segmented communications", "SG")], insightKey: "education-communication" },
  education_payments: { title: l("Como cobram, reconciliam e acompanham pagamentos em atraso?", "How do you collect, reconcile, and follow up overdue payments?"), help: l("Escolha o processo principal de cobrança e controlo.", "Choose the primary collection and tracking process."), addOptions: [o("automatic-reconciliation", "Reconciliação automática", "Automatic reconciliation", "AU"), o("automatic-reminders", "Lembretes de pagamento automáticos", "Automatic payment reminders", "LR")], insightKey: "payment-control" },
  education_software: { title: l("Que sistemas gerem alunos, aprendizagem, horários e faturação?", "Which systems manage students, learning, schedules, and billing?"), help: l("Selecione os sistemas onde a equipa volta a introduzir ou conferir dados.", "Select the systems where the team re-enters or checks data."), addOptions: [o("scheduling", "Horários e recursos", "Scheduling and resources", "HR"), o("forms-automation", "Formulários e documentos", "Forms and documents", "FD") ] },
  education_repetitive_task: { title: l("Qual tarefa administrativa tem maior volume?", "Which administrative task has the highest volume?"), help: l("Escolha o fluxo que mais limita acompanhamento, capacidade ou cobrança.", "Choose the workflow most limiting follow-up, capacity, or collection."), addOptions: [o("lead-followup", "Follow-up de candidatos", "Applicant follow-up", "FU"), o("document-validation", "Validar documentos", "Validating documents", "VD")], insightKey: "education-priority" },

  manufacturing_orders: { title: l("Como chegam as ordens de produção e que dados exigem nova introdução?", "How do production orders arrive, and which data requires re-entry?"), help: l("Selecione todas as origens e formatos usados.", "Select every source and format used."), addOptions: [o("pdf-attachment", "PDF ou anexo", "PDF or attachment", "PD"), o("customer-portal", "Portal do cliente", "Customer portal", "PC")], insightKey: "production-intake" },
  manufacturing_planning: { title: l("Como planeiam produção com procura, materiais, pessoas e máquinas?", "How do you plan production around demand, materials, people, and machines?"), help: l("Escolha o método principal usado para decidir o plano.", "Choose the main method used to decide the plan."), addOptions: [o("advanced-scheduling", "Planeamento avançado integrado", "Integrated advanced scheduling", "PA"), o("mixed-manual", "Sistema com ajustes manuais frequentes", "System with frequent manual adjustments", "MX")], insightKey: "production-planning" },
  manufacturing_inventory: { title: l("Quão atualizada e fiável é a informação de stock?", "How current and reliable is your stock information?"), help: l("Indique a fonte principal e se a produção vê o stock em tempo real.", "Tell us the main source and whether production sees stock in real time."), addOptions: [o("multiple-systems", "Vários sistemas sem sincronização total", "Several systems without full synchronization", "VS"), o("real-time-integrated", "Stock integrado em tempo real", "Real-time integrated stock", "TR")], insightKey: "stock-visibility" },
  manufacturing_software: { title: l("Que sistemas ligam planeamento, execução, stock e qualidade?", "Which systems connect planning, execution, stock, and quality?"), help: l("Inclua ERP/MRP, MES, WMS, qualidade e ferramentas locais.", "Include ERP/MRP, MES, WMS, quality, and local tools."), addOptions: [o("mes", "MES", "MES", "ME"), o("wms", "WMS", "WMS", "WM"), o("quality-management", "Gestão de qualidade", "Quality management", "QL"), o("maintenance", "Manutenção", "Maintenance", "MN") ] },
  manufacturing_bottleneck: { title: l("Onde a operação industrial perde mais capacidade ou fiabilidade?", "Where does the manufacturing operation lose the most capacity or reliability?"), help: l("Escolha o ponto com maior impacto em prazo, custo ou qualidade.", "Choose the point with the greatest impact on schedule, cost, or quality."), addOptions: [o("order-entry", "Preparar ordens de produção", "Preparing production orders", "OP"), o("data-integration", "Ligar dados entre sistemas", "Connecting data across systems", "LS")], insightKey: "manufacturing-bottleneck" },

  agency_client_sources: { title: l("Como entram oportunidades e passam da venda para o projeto?", "How do opportunities arrive and move from sales into delivery?"), help: l("Selecione as origens e a forma como o contexto é entregue à equipa.", "Select the sources and how context is handed to the team."), addOptions: [o("structured-brief", "Brief ou formulário estruturado", "Structured brief or form", "BR"), o("manual-handoff", "Passagem manual em reunião ou mensagem", "Manual handoff in a meeting or message", "MN")], insightKey: "agency-handoff" },
  agency_approvals: { title: l("Como recolhem briefing, feedback e aprovação final?", "How do you collect briefs, feedback, and final approval?"), help: l("Escolha o processo que mais se repete entre clientes e revisões.", "Choose the process repeated most across clients and revisions."), addOptions: [o("client-portal", "Portal do cliente", "Client portal", "PC"), o("structured-workflow", "Workflow com estados e responsáveis", "Workflow with statuses and owners", "WF")], insightKey: "approval-loop" },
  agency_projects: { title: l("Onde acompanham trabalho, prazos, âmbito e capacidade?", "Where do you track work, deadlines, scope, and capacity?"), help: l("Indique a fonte principal usada por operação e liderança.", "Tell us the main source used by delivery and leadership."), addOptions: [o("resource-planning", "Planeamento de recursos", "Resource planning", "PR"), o("multiple-tools", "Várias ferramentas sem visão única", "Several tools without one view", "VF")], insightKey: "agency-operations" },
  agency_software: { title: l("Que sistemas ligam CRM, projetos, tempo, reporting e faturação?", "Which systems connect CRM, projects, time, reporting, and billing?"), help: l("Selecione as ferramentas que precisam de partilhar clientes, trabalho e métricas.", "Select the tools that need to share clients, work, and metrics."), addOptions: [o("billing", "Propostas e faturação", "Proposals and billing", "FT"), o("automation", "Automação ou integrações", "Automation or integrations", "AU") ] },
  agency_repetitive_task: { title: l("Qual tarefa repetida entre clientes consome mais margem?", "Which task repeated across clients consumes the most margin?"), help: l("Escolha o fluxo com maior volume ou maior risco de scope creep.", "Choose the workflow with the highest volume or scope-creep risk."), addOptions: [o("briefs", "Transformar briefs em tarefas", "Turning briefs into tasks", "BR"), o("scope-tracking", "Controlar âmbito e alterações", "Tracking scope and changes", "SC")], insightKey: "agency-priority" },

  other_time_area: { title: l("Em que áreas se acumula mais trabalho manual?", "Which areas accumulate the most manual work?"), help: l("Selecione as áreas que mais pressionam tempo, serviço ou crescimento.", "Select the areas putting the most pressure on time, service, or growth."), insightKey: "general-workload" },
  other_work_intake: { title: l("Como chegam pedidos e como são atribuídos à pessoa certa?", "How do requests arrive and get assigned to the right person?"), help: l("Selecione todos os canais e passagens de trabalho relevantes.", "Select every relevant channel and handoff."), addOptions: [o("automatic-routing", "Encaminhamento automático", "Automatic routing", "AU"), o("manual-assignment", "Atribuição manual", "Manual assignment", "MN")], insightKey: "general-intake" },
  other_customer_communication: {
    title: l("Como comunicam com clientes e atualizam o estado do trabalho?", "How do you communicate with customers and update work status?"),
    help: l("Selecione os canais e a forma de dar visibilidade ao cliente.", "Select the channels and how customers receive visibility."),
    addOptions: [o("status-manual", "Atualizações manuais", "Manual status updates", "MN"), o("status-automatic", "Atualizações automáticas", "Automatic status updates", "AU"), o("status-none", "Sem processo consistente de atualização", "No consistent update process", "—")],
    optionGroups: [group("customer-channels", "Canais", "Channels", ["email", "whatsapp", "phone", "meetings", "in-person", "social-chat", "portal", "other"], true), group("customer-status", "Atualizações de estado", "Status updates", ["status-manual", "status-automatic", "status-none"], true, true)],
    insightKey: "customer-visibility"
  },
  other_operational_software: { title: l("Que sistemas suportam o trabalho principal e precisam de trocar dados?", "Which systems support core work and need to exchange data?"), help: l("Selecione ferramentas operacionais, financeiras e de relacionamento com clientes.", "Select operational, financial, and customer systems."), addOptions: [o("forms", "Formulários", "Forms", "FM"), o("booking", "Agenda ou reservas", "Scheduling or booking", "AG"), o("document-management", "Gestão documental", "Document management", "GD")] },
  other_repetitive_task: { title: l("Qual tarefa repetitiva removeria primeiro?", "Which repetitive task would you remove first?"), help: l("Escolha a que teria maior impacto imediato no negócio.", "Choose the one with the greatest immediate business impact."), addOptions: [o("routing", "Distribuir pedidos e tarefas", "Routing requests and tasks", "RT"), o("status-updates", "Enviar atualizações de estado", "Sending status updates", "ST")], insightKey: "general-priority" }
};

function enhanceQuestion(question: QuestionDefinition): QuestionDefinition {
  const enhancement = questionEnhancements[question.id];
  if (!enhancement) return question;
  const existingOptionIds = new Set(question.options?.map((option) => option.id) ?? []);
  const additiveOptions = enhancement.addOptions?.filter((option) => !existingOptionIds.has(option.id)) ?? [];
  return {
    ...question,
    title: enhancement.title ?? question.title,
    help: enhancement.help ?? question.help,
    options: [...(question.options ?? []), ...additiveOptions],
    optionGroups: enhancement.optionGroups,
    optionVisibility: enhancement.optionVisibility,
    insightKey: enhancement.insightKey
  };
}

export const sectors: SectorDefinition[] = legacySectors.map((sector) => ({
  ...sector,
  questions: sector.questions.map(enhanceQuestion)
}));

export const universalQuestions: QuestionDefinition[] = [
  {
    id: "employeeRange", kind: "single", phase: "impact", eyebrow: l("Dimensão da equipa", "Team size"),
    title: l("Quantas pessoas trabalham na empresa?", "How many people work at the company?"),
    help: l("Uma estimativa é suficiente.", "A rough estimate is enough."),
    options: [o("1", "1", "1", "01"), o("2-5", "2–5", "2–5", "05"), o("6-10", "6–10", "6–10", "10"), o("11-25", "11–25", "11–25", "25"), o("26-50", "26–50", "26–50", "50"), o("51-100", "51–100", "51–100", "100"), o("101+", "101+", "101+", "+")]
  },
  {
    id: "dailySoftware", kind: "multi", phase: "impact", eyebrow: l("Ferramentas transversais", "Everyday tools"),
    title: l("Que ferramentas sustentam o trabalho diário da empresa?", "Which tools support the company's daily work?"),
    help: l("Selecione os sistemas usados entre equipas, clientes e operação.", "Select the systems used across teams, customers, and operations."),
    options: [o("excel", "Excel", "Excel", "XL"), o("google-workspace", "Google Workspace", "Google Workspace", "GW"), o("microsoft-365", "Microsoft 365", "Microsoft 365", "M3"), o("erp", "ERP", "ERP", "ER"), o("crm", "CRM", "CRM", "CR"), o("whatsapp-business", "WhatsApp Business", "WhatsApp Business", "WA"), o("slack", "Slack", "Slack", "SL"), o("sector-software", "Software específico do setor", "Sector-specific software", "SS"), o("project-management", "Gestão de projetos", "Project management", "GP"), o("booking", "Agenda ou reservas", "Scheduling or booking", "AG"), o("billing", "Faturação", "Billing", "FT"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]
  },
  {
    id: "repetitiveHours", kind: "single", phase: "impact", eyebrow: l("Impacto atual", "Current impact"),
    title: l("Somando toda a equipa, quantas horas por semana são gastas nestas tarefas manuais?", "Across the whole team, how many hours per week go into these manual tasks?"),
    help: l("Uma estimativa é suficiente e ajuda-nos a priorizar o impacto.", "A rough estimate is enough and helps us prioritize impact."),
    options: [o("under-5", "Menos de 5 horas", "Under 5 hours", "<5"), o("5-10", "5–10 horas", "5–10 hours", "10"), o("10-20", "10–20 horas", "10–20 hours", "20"), o("20-40", "20–40 horas", "20–40 hours", "40"), o("40-plus", "Mais de 40 horas", "More than 40 hours", "40+"), o("not-sure", "Ainda não sabemos", "We don't know yet", "?")]
  },
  {
    id: "mainObjective", kind: "single", phase: "impact", eyebrow: l("Prioridade do negócio", "Business priority"),
    title: l("Qual resultado teria mais valor para a empresa nos próximos 6 meses?", "Which result would create the most value for the company over the next 6 months?"),
    help: l("Vamos orientar o relatório para o resultado mais importante agora.", "We'll shape the report around the outcome that matters most right now."),
    options: [o("save-time", "Poupar tempo", "Save time", "PT"), o("reduce-costs", "Reduzir custos", "Reduce costs", "RC"), o("grow", "Crescer", "Grow", "CR"), o("customer-service", "Melhorar o atendimento", "Improve customer service", "AC"), o("scale-without-hiring", "Escalar sem contratar", "Scale without hiring", "SC"), o("organize-operations", "Organizar operações", "Organize operations", "OP"), o("connect-systems", "Ligar sistemas", "Connect systems", "LS")]
  },
  {
    id: "automationMaturity", kind: "single", phase: "impact", eyebrow: l("Ponto de partida", "Starting point"),
    title: l("O que já acontece automaticamente hoje?", "What already happens automatically today?"),
    help: l("Não há respostas certas — queremos recomendar o próximo passo adequado.", "There are no right answers — we want to recommend the right next step."),
    options: [o("none", "Nada: o trabalho é essencialmente manual", "Nothing: work is mostly manual", "00"), o("very-little", "Algumas regras ou tarefas isoladas", "A few isolated rules or tasks", "01"), o("some", "Vários fluxos ligados entre sistemas", "Several workflows connected across systems", "02"), o("advanced", "Automação avançada, monitorizada e melhorada", "Advanced automation that is monitored and improved", "03")]
  },
  {
    id: "automationWish", kind: "text", phase: "impact", eyebrow: l("A oportunidade principal", "The main opportunity"),
    title: l("Descreva um fluxo concreto que gostaria de melhorar", "Describe one specific workflow you would like to improve"),
    help: l("Numa frase: onde começa e qual é o passo manual que se segue?", "In one sentence: where does it start, and what manual step follows?"),
    placeholder: l("Ex.: O pedido chega por email, alguém copia os dados para o sistema e responde ao cliente...", "e.g. The request arrives by email, someone copies the data into the system, and replies to the customer..."),
    maxLength: 500
  }
];

export const contactQuestion: QuestionDefinition = {
  id: "contact",
  kind: "contact",
  phase: "report",
  eyebrow: l("Último passo", "Final step", "Último paso"),
  title: l("Para onde devemos enviar o relatório?", "Where should we send your report?", "¿A dónde debemos enviar el informe?"),
  help: l("Precisamos apenas dos dados essenciais para entrar em contacto.", "We only need the essential details to get in touch.", "Solo necesitamos los datos esenciales para ponernos en contacto.")
};

export function getSector(sectorId: string) {
  return sectors.find((sector) => sector.id === sectorId) ?? null;
}

export function getFlow(sectorId: string): QuestionDefinition[] {
  const sector = getSector(sectorId);
  return [...baseQuestions, sectorQuestion, ...(sector?.questions ?? []), ...universalQuestions, contactQuestion];
}

export function localize(value: Localized, locale: Locale) {
  return value[locale] ?? value.en;
}

export const prioritySectorIds = [
  "real-estate",
  "healthcare",
  "commerce",
  "accounting-consulting",
  "construction"
] as const;

export function getVisibleQuestionOptions(
  question: QuestionDefinition,
  responses: Record<string, string | string[]>
) {
  const rules = question.optionVisibility ?? [];
  if (!rules.length) return question.options ?? [];

  return (question.options ?? []).filter((option) => {
    const optionRules = rules.filter((rule) => rule.optionIds.includes(option.id));
    if (!optionRules.length) return true;
    return optionRules.some((rule) => {
      const dependency = responses[rule.dependsOn];
      const values = Array.isArray(dependency) ? dependency : dependency ? [dependency] : [];
      return values.length === 0 || rule.includesAny.some((value) => values.includes(value));
    });
  });
}

export function getCampaignIntro(sectorId: string | null, locale: Locale) {
  const sector = sectorId ? getSector(sectorId) : null;
  if (!sector) return null;
  const label = localize(sector.label, locale);
  if (locale === "en") {
    return {
      eyebrow: `Automation report for ${label}`,
      title: "Discover where your business can save the most time and reduce manual work",
      body: `A short diagnosis tailored to the ${label.toLowerCase()} sector, followed by a prioritized report delivered by email within minutes.`
    };
  }
  if (locale === "es") {
    return {
      eyebrow: `Informe de automatización para ${label}`,
      title: "Descubre dónde tu empresa puede ahorrar más tiempo y reducir el trabajo manual",
      body: `Un diagnóstico breve, adaptado al sector ${label.toLowerCase()}, seguido de un informe priorizado enviado por email en pocos minutos.`
    };
  }
  return {
    eyebrow: `Relatório de automação para ${label}`,
    title: "Descubra onde a sua empresa pode poupar mais tempo e reduzir trabalho manual",
    body: `Um diagnóstico curto, adaptado ao setor ${label.toLowerCase()}, seguido de um relatório priorizado enviado por email em poucos minutos.`
  };
}

export function getQuestionInsight(
  question: QuestionDefinition,
  selected: string | string[],
  locale: Locale
) {
  const values = Array.isArray(selected) ? selected : selected ? [selected] : [];
  if (!values.length || !question.insightKey) return "";

  const manualSignals = new Set([
    "manual", "manual-phone-email", "manual-phone", "manual-counts", "manual-reentry",
    "spreadsheet", "paper", "paper-board", "paper-whiteboard", "whiteboard-paper",
    "no-process", "not-tracked", "none", "when-possible", "email-chat", "individual"
  ]);
  const hasManualSignal = values.some((value) => manualSignals.has(value));

  const pick = (en: string, pt: string, es: string) => (locale === "en" ? en : locale === "es" ? es : pt);

  if (question.insightKey === "speed-to-lead" && hasManualSignal) {
    return pick(
      "Lead response and follow-up still depend on manual action — a likely commercial priority for the report.",
      "A resposta e o follow-up ainda dependem de ação manual — uma provável prioridade comercial para o relatório.",
      "La respuesta y el seguimiento de leads todavía dependen de una acción manual — una probable prioridad comercial para el informe."
    );
  }
  if (question.insightKey === "no-show-control" && (hasManualSignal || values.includes("none"))) {
    return pick(
      "Confirmations, cancellations, and waitlists can often share one automated workflow.",
      "Confirmações, cancelamentos e listas de espera podem normalmente partilhar um único fluxo automático.",
      "Las confirmaciones, cancelaciones y listas de espera suelen poder compartir un único flujo automatizado."
    );
  }
  if (question.insightKey === "inventory-sync" && hasManualSignal) {
    return pick(
      "Manual stock updates create a direct risk of overselling, delays, and repeated data entry.",
      "A atualização manual de stock cria risco direto de ruturas, atrasos e introdução repetida de dados.",
      "Las actualizaciones manuales de stock crean un riesgo directo de sobreventa, retrasos e introducción repetida de datos."
    );
  }
  if (question.insightKey === "deadline-risk" && hasManualSignal) {
    return pick(
      "Deadline control depends on individual reminders, which makes ownership and exception alerts especially important.",
      "O controlo de prazos depende de lembretes individuais, tornando especialmente importantes a responsabilidade e os alertas de exceção.",
      "El control de plazos depende de recordatorios individuales, lo que hace especialmente importantes la responsabilidad y las alertas de excepción."
    );
  }
  if (question.insightKey === "hospitality-intake") {
    return pick(
      "The next questions are now filtered to the operation and channels you selected.",
      "As próximas perguntas estão agora filtradas para a operação e os canais selecionados.",
      "Las próximas preguntas ya están filtradas según la operación y los canales seleccionados."
    );
  }
  if (values.length >= 3) {
    return pick(
      "This workflow spans several inputs or systems — the report will look closely at handoffs and duplicated work.",
      "Este fluxo atravessa várias entradas ou sistemas — o relatório irá analisar passagens e trabalho duplicado.",
      "Este flujo atraviesa varias entradas o sistemas — el informe analizará de cerca los traspasos y el trabajo duplicado."
    );
  }
  if (hasManualSignal) {
    return pick(
      "A manual handoff is visible here, giving the report a concrete process to assess.",
      "Existe aqui uma passagem manual clara, dando ao relatório um processo concreto para avaliar.",
      "Aquí se aprecia un traspaso manual claro, lo que da al informe un proceso concreto que evaluar."
    );
  }
  return pick(
    "This answer is already narrowing the automation opportunities that fit your operation.",
    "Esta resposta já está a reduzir as oportunidades de automação às que fazem sentido para a sua operação.",
    "Esta respuesta ya está acotando las oportunidades de automatización que encajan con tu operación."
  );
}
