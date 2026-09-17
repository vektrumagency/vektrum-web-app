import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { defaultSiteConfig, Locale } from "@/lib/site-config";
import { buildLanguageAlternates, getDiagnosisHref, localizePath } from "@/lib/site-links";

export function getPrivacyMetadata(locale: Locale): Metadata {
  return locale === "en"
    ? {
        title: "Privacy Policy | Vektrum",
        description: "How Vektrum processes information submitted through the automation diagnosis.",
        alternates: { canonical: "/en/privacidade", languages: buildLanguageAlternates("/privacidade") }
      }
    : {
        title: "Política de Privacidade | Vektrum",
        description: "Como a Vektrum trata os dados enviados através do diagnóstico de automação.",
        alternates: { canonical: "/privacidade", languages: buildLanguageAlternates("/privacidade") }
      };
}

export function PrivacyPageContent({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const diagnosisHref = getDiagnosisHref(locale);
  const otherLocaleHref = localizePath("/privacidade", en ? "pt-PT" : "en");

  const sections = en ? [
    ["1. Who is responsible", `Vektrum is responsible for processing the information submitted through the automation diagnosis. You can contact us at ${defaultSiteConfig.brand.email}.`],
    ["2. Information we collect", "We collect the company, operational, software, objective, and contact information you voluntarily provide during the diagnosis."],
    ["3. Why we use it", "We use this information solely to analyze your automation opportunities, prepare the requested report, deliver information about that request, and contact you in connection with it."],
    ["4. Legal basis", "Processing is based on the consent you provide before submitting the diagnosis. You may withdraw consent at any time without affecting processing already carried out."],
    ["5. Service providers", "We may use carefully selected technology and communication providers to store, process, or transmit the information on our behalf. We do not sell your personal information."],
    ["6. Retention", "Diagnosis information is retained for up to 12 months after submission, unless a longer period is required by law or an ongoing business relationship justifies continued retention."],
    ["7. Your rights", "You may request access, correction, deletion, restriction, portability, or object to processing where applicable. You may also lodge a complaint with the Portuguese Data Protection Authority (CNPD)."],
    ["8. Google Calendar data (booking feature)", "To operate the meeting-booking feature, our booking system connects, via Google's authorization process, to the Google Calendar of the Vektrum team account responsible for scheduling. It uses this access only to: check team availability (free/busy) when generating available time slots, and create a calendar event (including a Google Meet link) when you confirm a booking. It does not read event details, contacts, or any other Google data, and it does not use this access for any other purpose. This data is not shared with or sold to third parties. Our use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements."],
    ["9. Contact", `To exercise your rights or ask a privacy question, email ${defaultSiteConfig.brand.email}.`]
  ] : [
    ["1. Responsável pelo tratamento", `A Vektrum é responsável pelo tratamento da informação enviada através do diagnóstico de automação. Pode contactar-nos através de ${defaultSiteConfig.brand.email}.`],
    ["2. Informação recolhida", "Recolhemos os dados da empresa, operação, software, objetivos e contacto que fornece voluntariamente durante o diagnóstico."],
    ["3. Finalidade", "Utilizamos estes dados apenas para analisar oportunidades de automação, preparar o relatório solicitado, enviar informação sobre esse pedido e entrar em contacto no âmbito do mesmo."],
    ["4. Fundamento legal", "O tratamento baseia-se no consentimento prestado antes do envio do diagnóstico. Pode retirar o consentimento a qualquer momento, sem afetar o tratamento já realizado."],
    ["5. Prestadores de serviços", "Podemos recorrer a prestadores tecnológicos e de comunicação cuidadosamente selecionados para armazenar, tratar ou transmitir dados em nosso nome. Não vendemos os seus dados pessoais."],
    ["6. Conservação", "Os dados do diagnóstico são conservados até 12 meses após o envio, salvo quando a lei exija um prazo superior ou uma relação comercial em curso justifique a sua conservação."],
    ["7. Os seus direitos", "Pode solicitar acesso, retificação, apagamento, limitação, portabilidade ou oposição ao tratamento, quando aplicável. Pode também apresentar reclamação junto da Comissão Nacional de Proteção de Dados (CNPD)."],
    ["8. Dados do Google Calendar (funcionalidade de marcação)", "Para operar a funcionalidade de marcação de reuniões, o nosso sistema de marcações liga-se, através do processo de autorização da Google, ao Google Calendar da conta da equipa Vektrum responsável pelos agendamentos. Este acesso é utilizado apenas para: verificar a disponibilidade da equipa (livre/ocupado) ao gerar horários disponíveis, e criar um evento no calendário (incluindo uma ligação Google Meet) quando confirma uma marcação. Não lemos detalhes de eventos, contactos ou quaisquer outros dados da Google, nem utilizamos este acesso para qualquer outra finalidade. Estes dados não são partilhados nem vendidos a terceiros. A utilização de informação recebida através das APIs da Google cumpre a Google API Services User Data Policy, incluindo os requisitos de Limited Use."],
    ["9. Contacto", `Para exercer os seus direitos ou esclarecer uma questão de privacidade, escreva para ${defaultSiteConfig.brand.email}.`]
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex w-[calc(100%-32px)] max-w-4xl items-center justify-between py-6 sm:w-[calc(100%-64px)] sm:py-8">
        <Link href={localizePath("/", locale)} aria-label="Vektrum"><Image src="/vektrum-logo-transparent.png" alt="Vektrum" width={168} height={48} priority className="h-9 w-auto" /></Link>
        <Link href={otherLocaleHref} className="rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-bold tracking-wider text-muted hover:text-accent">{en ? "PT" : "EN"}</Link>
      </header>
      <main className="mx-auto w-[calc(100%-32px)] max-w-3xl pb-24 pt-12 sm:w-[calc(100%-64px)] sm:pt-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Vektrum</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-text sm:text-6xl">{en ? "Privacy Policy" : "Política de Privacidade"}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{en ? "This notice explains how we process information submitted through Vektrum's interactive automation diagnosis." : "Este aviso explica como tratamos a informação enviada através do diagnóstico interativo de automação da Vektrum."}</p>
        <p className="mt-3 text-sm text-muted">{en ? "Last updated: 7 August 2026" : "Última atualização: 7 de agosto de 2026"}</p>
        <div className="mt-12 space-y-9 border-t border-border pt-10">
          {sections.map(([title, body]) => <section key={title}><h2 className="text-xl font-semibold tracking-tight text-text">{title}</h2><p className="mt-3 leading-relaxed text-muted">{body}</p></section>)}
        </div>
        <div className="mt-12 border-t border-border pt-8"><Link href={diagnosisHref} className="diagnosis-primary">← {en ? "Return to diagnosis" : "Voltar ao diagnóstico"}</Link></div>
      </main>
    </div>
  );
}
