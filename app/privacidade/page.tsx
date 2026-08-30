import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { defaultSiteConfig } from "@/lib/site-config";
import { PrivacyLanguage } from "./privacy-language";

type PrivacyPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

type PrivacyLocale = "pt-PT" | "en" | "es";

function resolveLocale(value: string | string[] | undefined): PrivacyLocale {
  const selected = Array.isArray(value) ? value[0] : value;
  if (selected === "en") return "en";
  if (selected === "es") return "es";
  return "pt-PT";
}

export async function generateMetadata({ searchParams }: PrivacyPageProps): Promise<Metadata> {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);

  if (locale === "en") {
    return {
      title: "Privacy Policy | Vektrum",
      description: "How Vektrum processes information submitted through the automation diagnosis.",
      alternates: { canonical: "/privacidade?lang=en" }
    };
  }

  if (locale === "es") {
    return {
      title: "Política de Privacidad | Vektrum",
      description: "Cómo trata Vektrum la información enviada a través del diagnóstico de automatización.",
      alternates: { canonical: "/privacidade?lang=es" }
    };
  }

  return {
    title: "Política de Privacidade | Vektrum",
    description: "Como a Vektrum trata os dados enviados através do diagnóstico de automação.",
    alternates: { canonical: "/privacidade" }
  };
}

export default async function PrivacyPage({ searchParams }: PrivacyPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
  const en = locale === "en";
  const es = locale === "es";
  const diagnosisHref = en ? "/diagnostico?lang=en" : es ? "/diagnostico?lang=es" : "/diagnostico";
  const homeHref = en ? "/?lang=en" : es ? "/?lang=es" : "/?lang=pt-PT";

  const sectionsEn = [
    ["1. Who is responsible", `Vektrum is responsible for processing the information submitted through the automation diagnosis. You can contact us at ${defaultSiteConfig.brand.email}.`],
    ["2. Information we collect", "We collect the company, operational, software, objective, and contact information you voluntarily provide during the diagnosis."],
    ["3. Why we use it", "We use this information solely to analyze your automation opportunities, prepare the requested report, deliver information about that request, and contact you in connection with it."],
    ["4. Legal basis", "Processing is based on the consent you provide before submitting the diagnosis. You may withdraw consent at any time without affecting processing already carried out."],
    ["5. Service providers", "We may use carefully selected technology and communication providers to store, process, or transmit the information on our behalf. We do not sell your personal information."],
    ["6. Retention", "Diagnosis information is retained for up to 12 months after submission, unless a longer period is required by law or an ongoing business relationship justifies continued retention."],
    ["7. Your rights", "You may request access, correction, deletion, restriction, portability, or object to processing where applicable. You may also lodge a complaint with the Portuguese Data Protection Authority (CNPD)."],
    ["8. Contact", `To exercise your rights or ask a privacy question, email ${defaultSiteConfig.brand.email}.`]
  ];

  const sectionsEs = [
    ["1. Responsable del tratamiento", `Vektrum es responsable del tratamiento de la información enviada a través del diagnóstico de automatización. Puedes contactarnos en ${defaultSiteConfig.brand.email}.`],
    ["2. Información que recopilamos", "Recopilamos los datos de la empresa, la operación, el software, los objetivos y el contacto que facilitas voluntariamente durante el diagnóstico."],
    ["3. Por qué la usamos", "Usamos esta información únicamente para analizar tus oportunidades de automatización, preparar el informe solicitado, entregar información sobre esa solicitud y contactarte en relación con ella."],
    ["4. Base legal", "El tratamiento se basa en el consentimiento que prestas antes de enviar el diagnóstico. Puedes retirar el consentimiento en cualquier momento, sin que ello afecte al tratamiento ya realizado."],
    ["5. Proveedores de servicios", "Podemos recurrir a proveedores tecnológicos y de comunicación cuidadosamente seleccionados para almacenar, tratar o transmitir la información en nuestro nombre. No vendemos tus datos personales."],
    ["6. Conservación", "La información del diagnóstico se conserva hasta 12 meses después del envío, salvo que la ley exija un plazo superior o una relación comercial en curso justifique su conservación."],
    ["7. Tus derechos", "Puedes solicitar acceso, rectificación, supresión, limitación, portabilidad u oponerte al tratamiento cuando corresponda. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD)."],
    ["8. Contacto", `Para ejercer tus derechos o resolver una duda sobre privacidad, escribe a ${defaultSiteConfig.brand.email}.`]
  ];

  const sectionsPt = [
    ["1. Responsável pelo tratamento", `A Vektrum é responsável pelo tratamento da informação enviada através do diagnóstico de automação. Pode contactar-nos através de ${defaultSiteConfig.brand.email}.`],
    ["2. Informação recolhida", "Recolhemos os dados da empresa, operação, software, objetivos e contacto que fornece voluntariamente durante o diagnóstico."],
    ["3. Finalidade", "Utilizamos estes dados apenas para analisar oportunidades de automação, preparar o relatório solicitado, enviar informação sobre esse pedido e entrar em contacto no âmbito do mesmo."],
    ["4. Fundamento legal", "O tratamento baseia-se no consentimento prestado antes do envio do diagnóstico. Pode retirar o consentimento a qualquer momento, sem afetar o tratamento já realizado."],
    ["5. Prestadores de serviços", "Podemos recorrer a prestadores tecnológicos e de comunicação cuidadosamente selecionados para armazenar, tratar ou transmitir dados em nosso nome. Não vendemos os seus dados pessoais."],
    ["6. Conservação", "Os dados do diagnóstico são conservados até 12 meses após o envio, salvo quando a lei exija um prazo superior ou uma relação comercial em curso justifique a sua conservação."],
    ["7. Os seus direitos", "Pode solicitar acesso, retificação, apagamento, limitação, portabilidade ou oposição ao tratamento, quando aplicável. Pode também apresentar reclamação junto da Comissão Nacional de Proteção de Dados (CNPD)."],
    ["8. Contacto", `Para exercer os seus direitos ou esclarecer uma questão de privacidade, escreva para ${defaultSiteConfig.brand.email}.`]
  ];

  const sections = en ? sectionsEn : es ? sectionsEs : sectionsPt;

  const heading = en ? "Privacy Policy" : es ? "Política de Privacidad" : "Política de Privacidade";
  const intro = en
    ? "This notice explains how we process information submitted through Vektrum's interactive automation diagnosis."
    : es
      ? "Este aviso explica cómo tratamos la información enviada a través del diagnóstico interactivo de automatización de Vektrum."
      : "Este aviso explica como tratamos a informação enviada através do diagnóstico interativo de automação da Vektrum.";
  const lastUpdated = en ? "Last updated: 7 August 2026" : es ? "Última actualización: 7 de agosto de 2026" : "Última atualização: 7 de agosto de 2026";
  const returnLabel = en ? "Return to diagnosis" : es ? "Volver al diagnóstico" : "Voltar ao diagnóstico";

  const languageOptions: { value: PrivacyLocale; label: string }[] = [
    { value: "pt-PT", label: "PT" },
    { value: "en", label: "EN" },
    { value: "es", label: "ES" }
  ];
  const buildLanguageHref = (target: PrivacyLocale) => (target === "pt-PT" ? "/privacidade" : `/privacidade?lang=${target}`);

  return (
    <div className="min-h-screen bg-background">
      <PrivacyLanguage language={locale} />
      <header className="mx-auto flex w-[calc(100%-32px)] max-w-4xl items-center justify-between py-6 sm:w-[calc(100%-64px)] sm:py-8">
        <Link href={homeHref} aria-label="Vektrum"><Image src="/vektrum-logo-transparent.png" alt="Vektrum" width={168} height={48} priority className="h-9 w-auto" /></Link>
        <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
          {languageOptions.map((option) => (
            <Link
              key={option.value}
              href={buildLanguageHref(option.value)}
              aria-current={locale === option.value ? "true" : undefined}
              className={`rounded-full px-2.5 py-1.5 text-xs font-bold tracking-wider transition ${
                locale === option.value ? "bg-accent text-white" : "text-muted hover:text-accent"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </header>
      <main className="mx-auto w-[calc(100%-32px)] max-w-3xl pb-24 pt-12 sm:w-[calc(100%-64px)] sm:pt-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Vektrum</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-text sm:text-6xl">{heading}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{intro}</p>
        <p className="mt-3 text-sm text-muted">{lastUpdated}</p>
        <div className="mt-12 space-y-9 border-t border-border pt-10">
          {sections.map(([title, body]) => <section key={title}><h2 className="text-xl font-semibold tracking-tight text-text">{title}</h2><p className="mt-3 leading-relaxed text-muted">{body}</p></section>)}
        </div>
        <div className="mt-12 border-t border-border pt-8"><Link href={diagnosisHref} className="diagnosis-primary">← {returnLabel}</Link></div>
      </main>
    </div>
  );
}
