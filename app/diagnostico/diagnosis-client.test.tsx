import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { DiagnosisClient } from "./diagnosis-client";

describe("DiagnosisClient", () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(cleanup);

  it("personalizes the intro without selecting the campaign sector", async () => {
    const user = userEvent.setup();
    render(<DiagnosisClient locale="pt-PT" campaignSectorId="real-estate" />);
    expect(screen.getByText(/relatório de automação para imobiliário/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /ver as minhas oportunidades/i }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "7");
  });

  it("exposes and focuses an inline company-name error", async () => {
    const user = userEvent.setup();
    render(<DiagnosisClient locale="pt-PT" />);
    await user.click(screen.getByRole("button", { name: /ver as minhas oportunidades/i }));
    await user.click(screen.getByRole("button", { name: /^continuar$/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/nome da empresa/i);
    const companyInput = screen.getByRole("textbox", { name: /qual é o nome/i });
    expect(companyInput).toHaveAttribute("aria-invalid", "true");
    await waitFor(() => expect(companyInput).toHaveFocus());
  });
});
