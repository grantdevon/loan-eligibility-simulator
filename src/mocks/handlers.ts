import { http, HttpResponse } from 'msw';
import type { LoanEligibilityRequest } from '../types/loanEligibility';
import type { InterestRateCalculationRequest } from '../types/interestRate';

const simulateDelay = async (min = 200, max = 500) => {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const handlers = [
    http.post('/api/loans/eligibility', async ({ request }) => {
        await simulateDelay();
        const body = await request.json() as LoanEligibilityRequest;
        const { personalInfo, loanDetails } = body || {};

        const errors: string[] = [];

        if (personalInfo?.age === undefined || personalInfo?.age === null) {
            errors.push('Age must be between 18 and 65');
        } else if (personalInfo.age < 18 || personalInfo.age > 65) {
            errors.push('Age must be between 18 and 65');
        }

        if (loanDetails?.requestedAmount === undefined || loanDetails?.requestedAmount === null) {
            errors.push('Loan amount must be between R5,000 and R300,000');
        } else if (loanDetails.requestedAmount < 5000 || loanDetails.requestedAmount > 300000) {
            errors.push('Loan amount must be between R5,000 and R300,000');
        }

        if (loanDetails?.loanTerm === undefined || loanDetails?.loanTerm === null) {
            errors.push('Loan term must be between 6 and 60 months');
        } else if (loanDetails.loanTerm < 6 || loanDetails.loanTerm > 60) {
            errors.push('Loan term must be between 6 and 60 months');
        }

        if (errors.length > 0) {
            return new HttpResponse(
                JSON.stringify({ error: 'Validation failed', details: errors }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new HttpResponse(
            JSON.stringify({
                eligibilityResult: {
                    isEligible: true,
                    approvalLikelihood: 85,
                    riskCategory: 'low',
                    decisionReason: 'Strong income-to-expense ratio and manageable existing debt',
                },
                recommendedLoan: {
                    maxAmount: 180000.0,
                    recommendedAmount: 150000.0,
                    interestRate: 12.5,
                    monthlyPayment: 7089.5,
                    totalRepayment: 170148.0,
                },
                affordabilityAnalysis: {
                    disposableIncome: 10000.0,
                    debtToIncomeRatio: 20.0,
                    loanToIncomeRatio: 60.0,
                    affordabilityScore: 'good',
                },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }),

    http.post('/api/loans/calculate-rate', async ({ request }) => {
        await simulateDelay();
        const body = await request.json() as InterestRateCalculationRequest;
        const { loanAmount, loanTerm } = body || {};

        const errors: string[] = [];

        if (loanAmount === undefined || loanAmount === null) {
            errors.push('Loan amount must be between R5,000 and R300,000');
        } else if (loanAmount < 5000 || loanAmount > 300000) {
            errors.push('Loan amount must be between R5,000 and R300,000');
        }

        if (loanTerm === undefined || loanTerm === null) {
            errors.push('Loan term must be between 6 and 60 months');
        } else if (loanTerm < 6 || loanTerm > 60) {
            errors.push('Loan term must be between 6 and 60 months');
        }

        if (errors.length > 0) {
            return new HttpResponse(
                JSON.stringify({ error: 'Validation failed', details: errors }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new HttpResponse(
            JSON.stringify({
                interestRate: 12.5,
                monthlyPayment: 7089.5,
                totalInterest: 20148.0,
                totalRepayment: 170148.0,
                paymentSchedule: [
                    { month: 1, payment: 7089.5, principal: 5527.17, interest: 1562.33, balance: 144472.83 },
                    { month: 2, payment: 7089.5, principal: 5584.89, interest: 1504.61, balance: 138887.94 },
                ],
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }),

    http.get('/api/loans/validation-rules', async () => {
        await simulateDelay();
        return new HttpResponse(
            JSON.stringify({
                personalInfo: {
                    age: {
                        min: 18,
                        max: 65,
                        required: true,
                        errorMessage: 'Age must be between 18 and 65',
                    },
                    employmentStatus: {
                        required: true,
                        options: ['employed', 'self_employed', 'unemployed', 'retired'],
                        errorMessage: 'Please select your employment status',
                    },
                    employmentDuration: {
                        min: 3,
                        required: true,
                        errorMessage: 'Minimum 3 months employment required',
                    },
                },
                financialInfo: {
                    monthlyIncome: {
                        min: 5000.0,
                        required: true,
                        errorMessage: 'Minimum monthly income of R5,000 required',
                    },
                    monthlyExpenses: {
                        min: 0,
                        required: true,
                        errorMessage: 'Please enter your monthly expenses',
                    },
                    creditScore: {
                        min: 300,
                        max: 850,
                        required: false,
                        errorMessage: 'Credit score must be between 300 and 850',
                    },
                },
                loanDetails: {
                    requestedAmount: {
                        min: 5000.0,
                        max: 300000.0,
                        required: true,
                        errorMessage: 'Loan amount must be between R5,000 and R300,000',
                    },
                    loanTerm: {
                        min: 6,
                        max: 60,
                        required: true,
                        errorMessage: 'Loan term must be between 6 and 60 months',
                    },
                },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }),

    http.get('/api/loans/validation-rules', async ({ request }) => {
        await simulateDelay();
        const url = new URL(request.url);
        if (url.searchParams.get('error') === 'true') {
            return new HttpResponse(
                JSON.stringify({ error: 'Failed to fetch validation rules' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return undefined;
    }),
];