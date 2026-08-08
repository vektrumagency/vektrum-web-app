export type Locale = "pt-PT" | "en";
export type Localized = { "pt-PT": string; en: string };
export type QuestionKind = "company" | "website" | "single" | "multi" | "text" | "contact";

export type OptionDefinition = {
  id: string;
  label: Localized;
  mark: string;
  exclusive?: boolean;
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
};

export type SectorDefinition = {
  id: string;
  label: Localized;
  mark: string;
  questions: QuestionDefinition[];
};

const l = (pt: string, en: string): Localized => ({ "pt-PT": pt, en });
const o = (id: string, pt: string, en: string, mark: string, exclusive = false): OptionDefinition => ({
  id,
  label: l(pt, en),
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
  eyebrow: l("A compreender o processo", "Understanding the workflow"),
  title: l(pt, en),
  help: l(ptHelp, enHelp),
  options,
  legacyRole
});

export const uiCopy = {
  "pt-PT": {
    skip: "Ir para o conteúdo",
    brandLabel: "Vektrum — página inicial",
    language: "English",
    languageCode: "EN",
    introEyebrow: "Diagnóstico inteligente de automação",
    introTitle: "Descubra onde a sua empresa pode ganhar tempo com IA",
    introBody: "Uma conversa rápida e adaptada ao seu negócio para identificar os processos com maior potencial de automação.",
    duration: "Menos de 3 minutos",
    privateNote: "Os seus dados são tratados de forma confidencial.",
    start: "Começar diagnóstico",
    startHint: "Sem compromisso. Cada pergunta torna o relatório mais útil.",
    back: "Voltar",
    continue: "Continuar",
    optional: "Opcional",
    step: "Passo",
    of: "de",
    remainingOne: "1 pergunta restante",
    remainingMany: "perguntas restantes",
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
      other: "Especifique a opção selecionada.",
      text: "Partilhe uma resposta curta para continuar.",
      name: "Indique o seu nome.",
      email: "Introduza um endereço de email válido.",
      consent: "É necessário aceitar o tratamento dos dados para receber o relatório.",
      submit: "Não foi possível enviar as respostas. Verifique a ligação e tente novamente.",
      config: "O envio ainda não está configurado. Contacte a Vektrum ou tente novamente mais tarde."
    },
    consentPrefix: "Autorizo a Vektrum a tratar estes dados para preparar o relatório e contactar-me sobre este pedido. Li a",
    privacy: "Política de Privacidade",
    submit: "Criar o meu relatório",
    loadingEyebrow: "A enviar o seu diagnóstico",
    loadingTitle: "A preparar o seu Relatório de Automação...",
    loadingBody: "Estamos a entregar as suas respostas em segurança. Só mais um momento.",
    successEyebrow: "Diagnóstico concluído",
    successTitle: "O seu pedido foi recebido!",
    successBody: "Estamos agora a analisar as suas respostas. A nossa equipa irá preparar o seu Relatório de Automação personalizado.",
    successEmail: "Receberá brevemente um email de confirmação com mais informações. Se não o encontrar, verifique a pasta de SPAM e marque-o como seguro para que os nossos emails não se percam.",
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
    language: "Português",
    languageCode: "PT",
    introEyebrow: "Intelligent automation diagnosis",
    introTitle: "Discover where AI can save your business time",
    introBody: "A quick conversation tailored to your business, designed to identify the processes with the greatest automation potential.",
    duration: "Under 3 minutes",
    privateNote: "Your information is treated confidentially.",
    start: "Start diagnosis",
    startHint: "No commitment. Every answer makes your report more useful.",
    back: "Back",
    continue: "Continue",
    optional: "Optional",
    step: "Step",
    of: "of",
    remainingOne: "1 question remaining",
    remainingMany: "questions remaining",
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
      other: "Tell us more about the selected option.",
      text: "Share a short answer to continue.",
      name: "Enter your name.",
      email: "Enter a valid email address.",
      consent: "You need to accept data processing to receive the report.",
      submit: "We couldn't send your answers. Check your connection and try again.",
      config: "Submission is not configured yet. Contact Vektrum or try again later."
    },
    consentPrefix: "I authorize Vektrum to process this information to prepare the report and contact me about this request. I have read the",
    privacy: "Privacy Policy",
    submit: "Create my report",
    loadingEyebrow: "Submitting your diagnosis...",
    loadingTitle: "Preparing your Automation Report...",
    loadingBody: "We're securely delivering your answers. This will only take a moment.",
    successEyebrow: "Diagnosis complete",
    successTitle: "Your request has been received!",
    successBody: "We're now analyzing your answers. Our team will prepare your personalized Automation Report.",
    successEmail: "You'll shortly receive a confirmation email with more information. If you can't find it, check your spam folder and mark it as safe so you don't miss our emails.",
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
  }
} as const;

export const baseQuestions: QuestionDefinition[] = [
  {
    id: "companyName",
    kind: "company",
    eyebrow: l("Vamos começar", "Let's begin"),
    title: l("Qual é o nome da sua empresa?", "What's your company name?"),
    help: l("Usaremos este nome para personalizar o relatório.", "We'll use it to personalize your report.")
  },
  {
    id: "website",
    kind: "website",
    eyebrow: l("Contexto digital", "Digital context"),
    title: l("Qual é o website da empresa?", "What's your company website?"),
    help: l("Ajuda-nos a compreender melhor o negócio antes da análise.", "It helps us understand the business before the analysis."),
    optional: true
  }
];

export const sectorOptions: OptionDefinition[] = [
  o("accounting-consulting", "Contabilidade e consultoria", "Accounting and consulting", "CC"),
  o("legal-admin", "Serviços jurídicos e administrativos", "Legal and administrative services", "SJ"),
  o("real-estate", "Imobiliário", "Real estate", "IM"),
  o("finance-insurance", "Finanças e seguros", "Finance and insurance", "FS"),
  o("healthcare", "Saúde e clínicas", "Healthcare and clinics", "SC"),
  o("construction", "Construção e serviços técnicos", "Construction and technical services", "CT"),
  o("commerce", "Comércio e e-commerce", "Commerce and e-commerce", "CE"),
  o("logistics", "Logística e transportes", "Logistics and transportation", "LT"),
  o("hospitality", "Hotelaria e restauração", "Hospitality and restaurants", "HR"),
  o("education", "Educação e formação", "Education and training", "EF"),
  o("manufacturing", "Indústria", "Manufacturing", "IN"),
  o("marketing-agency", "Agência de marketing ou criativa", "Marketing or creative agency", "MK"),
  o("other", "Outro setor", "Other sector", "+")
];

export const sectorQuestion: QuestionDefinition = {
  id: "businessSector",
  kind: "single",
  eyebrow: l("Sobre o negócio", "About the business"),
  title: l("O que melhor descreve a sua empresa?", "What best describes your business?"),
  help: l("A partir daqui, as perguntas adaptam-se à realidade do seu setor.", "From here, the questions adapt to the reality of your sector."),
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

export const sectors: SectorDefinition[] = [
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

export const universalQuestions: QuestionDefinition[] = [
  {
    id: "employeeRange", kind: "single", eyebrow: l("Dimensão da equipa", "Team size"),
    title: l("Quantas pessoas trabalham na empresa?", "How many people work at the company?"),
    help: l("Uma estimativa é suficiente.", "A rough estimate is enough."),
    options: [o("1", "1", "1", "01"), o("2-5", "2–5", "2–5", "05"), o("6-10", "6–10", "6–10", "10"), o("11-25", "11–25", "11–25", "25"), o("26-50", "26–50", "26–50", "50"), o("51-100", "51–100", "51–100", "100"), o("101+", "101+", "101+", "+")]
  },
  {
    id: "dailySoftware", kind: "multi", eyebrow: l("Ferramentas transversais", "Everyday tools"),
    title: l("Que software utilizam diariamente?", "Which software do you use every day?"),
    help: l("Agora pense nas ferramentas usadas por várias áreas da empresa.", "Now think about the tools used across the business."),
    options: [o("excel", "Excel", "Excel", "XL"), o("google-workspace", "Google Workspace", "Google Workspace", "GW"), o("microsoft-365", "Microsoft 365", "Microsoft 365", "M3"), o("erp", "ERP", "ERP", "ER"), o("crm", "CRM", "CRM", "CR"), o("whatsapp-business", "WhatsApp Business", "WhatsApp Business", "WA"), o("slack", "Slack", "Slack", "SL"), o("none", "Nenhum / não sei", "None / not sure", "—", true), o("other", "Outro", "Other", "+")]
  },
  {
    id: "repetitiveHours", kind: "single", eyebrow: l("Impacto atual", "Current impact"),
    title: l("Quantas horas por semana se perdem em trabalho repetitivo?", "How many hours per week are lost to repetitive work?"),
    help: l("Uma estimativa honesta é suficiente.", "An honest estimate is enough."),
    options: [o("under-5", "Menos de 5 horas", "Under 5 hours", "<5"), o("5-10", "5–10 horas", "5–10 hours", "10"), o("10-20", "10–20 horas", "10–20 hours", "20"), o("20-40", "20–40 horas", "20–40 hours", "40"), o("40-plus", "Mais de 40 horas", "More than 40 hours", "40+")]
  },
  {
    id: "mainObjective", kind: "single", eyebrow: l("Prioridade do negócio", "Business priority"),
    title: l("Qual é a prioridade atual da empresa?", "What is the company's current priority?"),
    help: l("Vamos orientar o relatório para o resultado mais importante.", "We'll shape the report around the outcome that matters most."),
    options: [o("save-time", "Poupar tempo", "Save time", "PT"), o("reduce-costs", "Reduzir custos", "Reduce costs", "RC"), o("grow", "Crescer", "Grow", "CR"), o("customer-service", "Melhorar o atendimento", "Improve customer service", "AC"), o("scale-without-hiring", "Escalar sem contratar", "Scale without hiring", "SC"), o("organize-operations", "Organizar operações", "Organize operations", "OP"), o("connect-systems", "Ligar sistemas", "Connect systems", "LS")]
  },
  {
    id: "automationMaturity", kind: "single", eyebrow: l("Ponto de partida", "Starting point"),
    title: l("Qual é o nível atual de automação?", "What is your current automation maturity?"),
    help: l("Não há respostas certas — queremos recomendar o próximo passo adequado.", "There are no right answers — we want to recommend the right next step."),
    options: [o("none", "Nenhuma", "None", "00"), o("very-little", "Muito pouca", "Very little", "01"), o("some", "Alguma", "Some", "02"), o("advanced", "Avançada", "Advanced", "03")]
  },
  {
    id: "automationWish", kind: "text", eyebrow: l("A oportunidade principal", "The main opportunity"),
    title: l("Se a IA pudesse remover uma tarefa repetitiva amanhã, qual escolheria?", "If AI could remove one repetitive task tomorrow, which would you choose?"),
    help: l("Descreva a tarefa numa frase simples.", "Describe the task in one simple sentence."),
    placeholder: l("Ex.: Copiar dados de emails para o nosso sistema e responder ao cliente...", "e.g. Copying data from emails into our system and replying to the customer..."),
    maxLength: 500
  }
];

export const contactQuestion: QuestionDefinition = {
  id: "contact",
  kind: "contact",
  eyebrow: l("Último passo", "Final step"),
  title: l("Para onde devemos enviar o relatório?", "Where should we send your report?"),
  help: l("Precisamos apenas dos dados essenciais para entrar em contacto.", "We only need the essential details to get in touch.")
};

export function getSector(sectorId: string) {
  return sectors.find((sector) => sector.id === sectorId) ?? null;
}

export function getFlow(sectorId: string): QuestionDefinition[] {
  const sector = getSector(sectorId);
  return [...baseQuestions, sectorQuestion, ...(sector?.questions ?? []), ...universalQuestions, contactQuestion];
}

export function localize(value: Localized, locale: Locale) {
  return value[locale];
}
