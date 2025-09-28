// src/components/LoanForm/LoanForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoanForm } from "./LoanForm";
import type { FormValidationSchema } from "../../types/formValidation";

const validationRules: FormValidationSchema = {
    personalInfo: {
        age: { required: true, min: 18, max: 70, errorMessage: "Invalid age" },
        employmentStatus: { required: true, options: ["employed", "self_employed", "unemployed", "retired"], errorMessage: "Invalid status" },
        employmentDuration: { required: true, min: 0, errorMessage: "Invalid duration" },
    },
    financialInfo: {
        monthlyIncome: { required: true, min: 0, errorMessage: "Invalid income" },
        monthlyExpenses: { required: true, min: 0, errorMessage: "Invalid expenses" },
        creditScore: { required: false, min: 0, max: 850, errorMessage: "Invalid credit score" },
    },
    loanDetails: {
        requestedAmount: { required: true, min: 1000, max: 500000, errorMessage: "Invalid amount" },
        loanTerm: { required: true, min: 6, max: 360, errorMessage: "Invalid term" },
    },
};

describe("LoanForm", () => {
    beforeEach(() => {
        // Ensure fetch is a mock for each test
        (globalThis as any).fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const fillValidForm = () => {
        // Personal info
        fireEvent.change(screen.getByLabelText(/Age/i), { target: { value: "30" } });
        fireEvent.change(screen.getByLabelText(/Employment Duration/i), { target: { value: "24" } });
        fireEvent.mouseDown(screen.getByLabelText(/Employment Status/i));
        // Select the exact option to avoid partial matches like "Self employed"
        fireEvent.click(screen.getByRole('option', { name: /^Employed$/i }));

        // Financial info
        fireEvent.change(screen.getByLabelText(/Monthly Income/i), { target: { value: "30000" } });
        fireEvent.change(screen.getByLabelText(/Monthly Expenses/i), { target: { value: "10000" } });
        fireEvent.change(screen.getByLabelText(/Credit Score/i), { target: { value: "700" } });

        // Loan details
        fireEvent.change(screen.getByLabelText(/Requested Amount/i), { target: { value: "150000" } });
        fireEvent.change(screen.getByLabelText(/Loan Term/i), { target: { value: "60" } });
    };

    it("renders form and submits successfully", async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({
                eligibilityResult: { isEligible: true, approvalLikelihood: 85, riskCategory: "low", decisionReason: "Good" },
                recommendedLoan: { recommendedAmount: 180000 },
                affordabilityAnalysis: {}
            }),
        });

        render(<LoanForm validationRules={validationRules} />);
        fillValidForm();

        // Submit
        fireEvent.click(screen.getByText(/Check Eligibility/i));

        // Wait for success alert
        await waitFor(() => {
            expect(screen.getByText(/Approval Likelihood/i)).toBeInTheDocument();
            expect(screen.getByText(/Recommended Amount/i)).toBeInTheDocument();
        });

        // Submit button stays disabled after result is shown
        expect(screen.getByRole('button', { name: /Check Eligibility/i })).toBeDisabled();
    });

    it("shows validation errors when required fields are missing", async () => {
        render(<LoanForm validationRules={validationRules} />);

        // Directly submit without filling
        fireEvent.click(screen.getByText(/Check Eligibility/i));

        // Errors should appear for required fields
        await waitFor(() => {
            expect(screen.getByText("Invalid age")).toBeInTheDocument();
            expect(screen.getByText("Invalid status")).toBeInTheDocument();
            expect(screen.getByText("Invalid duration")).toBeInTheDocument();
            expect(screen.getByText("Invalid income")).toBeInTheDocument();
            expect(screen.getByText("Invalid expenses")).toBeInTheDocument();
            expect(screen.getByText("Invalid amount")).toBeInTheDocument();
            expect(screen.getByText("Invalid term")).toBeInTheDocument();
        });

        // No request should be sent
        expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it("validates max/min boundaries (credit score)", async () => {
        render(<LoanForm validationRules={validationRules} />);

        // Enter invalid credit score > max
        fireEvent.change(screen.getByLabelText(/Credit Score/i), { target: { value: "900" } });
        fireEvent.blur(screen.getByLabelText(/Credit Score/i));

        expect(await screen.findByText("Invalid credit score")).toBeInTheDocument();
    });

    it("renders select options with proper capitalization", () => {
        render(<LoanForm validationRules={validationRules} />);
        fireEvent.mouseDown(screen.getByLabelText(/Employment Status/i));
        expect(screen.getByText(/^Employed$/)).toBeInTheDocument();
        expect(screen.getByText(/^Self employed$/)).toBeInTheDocument();
        expect(screen.getByText(/^Unemployed$/)).toBeInTheDocument();
        expect(screen.getByText(/^Retired$/)).toBeInTheDocument();
    });

    it("shows backend error when API responds with non-ok status and message", async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ error: "Server says no" }),
        });

        render(<LoanForm validationRules={validationRules} />);
        fillValidForm();
        fireEvent.click(screen.getByText(/Check Eligibility/i));

        expect(await screen.findByText("Server says no")).toBeInTheDocument();
    });

    it("shows generic backend error when API responds with non-ok without message", async () => {
        (globalThis.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: async () => ({}),
        });

        render(<LoanForm validationRules={validationRules} />);
        fillValidForm();
        fireEvent.click(screen.getByText(/Check Eligibility/i));

        expect(await screen.findByText(/Submission failed\./i)).toBeInTheDocument();
    });

    it("shows network error when fetch rejects", async () => {
        (globalThis.fetch as jest.Mock).mockRejectedValue(new Error("network down"));

        render(<LoanForm validationRules={validationRules} />);
        fillValidForm();
        fireEvent.click(screen.getByText(/Check Eligibility/i));

        expect(await screen.findByText(/Network error: network down/i)).toBeInTheDocument();
    });

    it("disables submit while loading and shows spinner text", async () => {
        // Resolve quickly but we can still check intermediate state after click
        (globalThis.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({
                eligibilityResult: { isEligible: true, approvalLikelihood: 92, riskCategory: "low", decisionReason: "Great" },
                recommendedLoan: { recommendedAmount: 200000 },
                affordabilityAnalysis: {}
            }),
        });

        render(<LoanForm validationRules={validationRules} />);
        fillValidForm();

        const submitBtn = screen.getByRole('button', { name: /Check Eligibility/i });
        fireEvent.click(submitBtn);

        // Immediately after click, loading state should reflect (state update is async)
        await waitFor(() => expect(submitBtn).toBeDisabled());

        // After resolution, result should appear and button remains disabled due to result
        await screen.findByText(/Approval Likelihood/i);
        expect(submitBtn).toBeDisabled();
    });
});
