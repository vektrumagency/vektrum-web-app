import { expect, test } from "@playwright/test";

type CapturedPayload = {
  metadata: { formVersion: string };
  diagnosis: { answers: { sectorSpecific: unknown[]; universal: unknown[] } };
  utm: { source: string | null; campaign: string | null };
};

test("mobile diagnosis keeps progress and actions available without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/diagnostico?sector=real-estate&utm_source=meta");
  await page.getByRole("button", { name: /Ver as minhas oportunidades/i }).click();

  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continuar" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);

  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.locator("#diagnosis-error")).toContainText("nome da empresa");
  await expect(page.getByRole("textbox", { name: /qual é o nome/i })).toHaveAttribute("aria-invalid", "true");
});

test("completes a real-estate branch with the n8n contract mocked", async ({ page }) => {
  let submittedPayload: CapturedPayload | null = null;
  await page.route("**/api/automation-diagnosis", async (route) => {
    submittedPayload = route.request().postDataJSON() as CapturedPayload;
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.goto("/diagnostico?sector=real-estate&utm_source=meta&utm_campaign=icp-test");
  await page.getByRole("button", { name: /Ver as minhas oportunidades/i }).click();
  await page.getByRole("textbox", { name: /Qual é o nome/i }).fill("Imobiliária Teste");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: /não tem website/i }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("radio", { name: "Imobiliário" }).click();

  await expect(page.getByRole("heading", { name: /novos leads imobiliários/i })).toBeVisible();
  await page.getByRole("button", { name: "Anúncios Meta" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("radio", { name: /Telefone e email manual/i }).click();
  await expect(page.getByRole("heading", { name: /dados dos imóveis/i })).toBeVisible();
  await page.getByRole("radio", { name: /Atualização manual em vários locais/i }).click();
  await expect(page.getByRole("heading", { name: /CRM, portais/i })).toBeVisible();
  await page.getByRole("button", { name: "CRM imobiliário" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("radio", { name: /Responder rapidamente/i }).click();

  await expect(page.getByRole("heading", { name: /Quantas pessoas/i })).toBeVisible();
  await page.getByRole("radio", { name: "2–5" }).click();
  await expect(page.getByRole("heading", { name: /ferramentas sustentam/i })).toBeVisible();
  await page.getByRole("button", { name: "CRM", exact: true }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("radio", { name: /10–20 horas/i }).click();
  await expect(page.getByRole("heading", { name: /resultado teria mais valor/i })).toBeVisible();
  await page.getByRole("radio", { name: "Crescer" }).click();
  await expect(page.getByRole("heading", { name: /acontece automaticamente/i })).toBeVisible();
  await page.getByRole("radio", { name: /Algumas regras/i }).click();
  await expect(page.getByRole("heading", { name: /fluxo concreto/i })).toBeVisible();
  await page.getByRole("textbox").fill("O lead chega pelo Meta, é copiado para o CRM e recebe follow-up manual.");
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByRole("textbox", { name: "Nome" }).fill("Ana Teste");
  await page.getByRole("textbox", { name: /Email profissional/i }).fill("ana@example.pt");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Criar o meu relatório/i }).click();

  await expect(page.getByRole("heading", { name: /relatório está a ser criado/i })).toBeVisible();
  await expect(page.getByText("ana@example.pt")).toBeVisible();
  expect(submittedPayload).not.toBeNull();
  expect(submittedPayload!.metadata.formVersion).toBe("automation-diagnosis-v1");
  expect(submittedPayload!.diagnosis.answers.sectorSpecific).toHaveLength(5);
  expect(submittedPayload!.diagnosis.answers.universal).toHaveLength(6);
  expect(submittedPayload!.utm).toMatchObject({ source: "meta", campaign: "icp-test" });
});
