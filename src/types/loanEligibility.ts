import type { LoanPurpose } from "./loanProducts";

export type EmploymentStatus = "employed" | "self_employed" | "unemployed" | "retired" | string;
export type RiskCategory = "low" | "medium" | "high" | string;
export type AffordabilityScore = "poor" | "fair" | "good" | "excellent" | string;

export interface PersonalInfo {
    age: number;
    employmentStatus: EmploymentStatus;
    employmentDuration: number;
}

export interface FinancialInfo {
    monthlyIncome: number;
    monthlyExpenses: number;
    existingDebt: number;
    creditScore: number;
}

export interface LoanDetails {
    requestedAmount: number;
    loanTerm: number;
    loanPurpose: LoanPurpose;
}

export interface LoanEligibilityRequest {
    personalInfo: PersonalInfo;
    financialInfo: FinancialInfo;
    loanDetails: LoanDetails;
}


export interface EligibilityResult {
    isEligible: boolean;
    approvalLikelihood: number;
    riskCategory: RiskCategory;
    decisionReason: string;
}

export interface RecommendedLoan {
    maxAmount: number;
    recommendedAmount: number;
    interestRate: number;
    monthlyPayment: number;
    totalRepayment: number;
}

export interface AffordabilityAnalysis {
    disposableIncome: number;
    debtToIncomeRatio: number;
    loanToIncomeRatio: number;
    affordabilityScore: AffordabilityScore;
}

export interface LoanEligibilityResponse {
    eligibilityResult: EligibilityResult;
    recommendedLoan: RecommendedLoan;
    affordabilityAnalysis: AffordabilityAnalysis;
}