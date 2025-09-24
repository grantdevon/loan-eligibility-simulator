import { http, HttpResponse } from 'msw';
import type { LoanEligibilityRequest } from '../types/loanEligibility';
import type { InterestRateCalculationRequest } from '../types/interestRate';

const simulateDelay = async (min = 200, max = 500) => {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const handlers = [
    http.post('/api/loans/eligibility', async () => {
        await simulateDelay();
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

    http.post('/api/loans/eligibility', async ({ request }) => {
        await simulateDelay();
        const body = await request.json() as LoanEligibilityRequest;
        const { personalInfo, loanDetails } = body || {};

        if (!personalInfo?.age || loanDetails?.requestedAmount < 5000) {
            return new HttpResponse(
                JSON.stringify({
                    error: 'Validation failed',
                    details: [
                        !personalInfo?.age ? 'Age is required' : null,
                        loanDetails?.requestedAmount < 5000 ? 'Loan amount must be at least R5,000' : null,
                    ].filter(Boolean),
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return undefined;
    }),

    http.post('/api/loans/eligibility', async ({ request }) => {
        await simulateDelay();
        const body = await request.json() as LoanEligibilityRequest;
        const { loanDetails } = body || {};

        if (loanDetails?.requestedAmount === 999999) {
            return new HttpResponse(
                JSON.stringify({ error: 'Internal server error' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return undefined;
    }),

    http.get('/api/loans/products', async () => {
        await simulateDelay();
        return new HttpResponse(
            JSON.stringify({
                products: [
                    {
                        id: 'personal_loan',
                        name: 'Personal Loan',
                        description: 'Flexible personal financing for various needs',
                        minAmount: 5000.0,
                        maxAmount: 300000.0,
                        minTerm: 6,
                        maxTerm: 60,
                        interestRateRange: { min: 10.5, max: 18.5 },
                        purposes: ['debt_consolidation', 'home_improvement', 'education', 'medical', 'other'],
                    },
                    {
                        id: 'vehicle_loan',
                        name: 'Vehicle Finance',
                        description: 'Financing for new and used vehicles',
                        minAmount: 50000.0,
                        maxAmount: 1500000.0,
                        minTerm: 12,
                        maxTerm: 72,
                        interestRateRange: { min: 8.5, max: 15.0 },
                        purposes: ['new_vehicle', 'used_vehicle'],
                    },
                ],
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }),

    http.get('/api/loans/products', async ({ request }) => {
        await simulateDelay();
        const url = new URL(request.url);
        if (url.searchParams.get('error') === 'true') {
            return new HttpResponse(
                JSON.stringify({ error: 'Failed to fetch loan products' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return undefined;
    }),

    http.post('/api/loans/calculate-rate', async () => {
        await simulateDelay();
        return new HttpResponse(
            JSON.stringify({
                interestRate: 12.5,
                monthlyPayment: 7089.5,
                totalInterest: 20148.0,
                totalRepayment: 170148.0,
                paymentSchedule: [
                    {
                        month: 1,
                        payment: 7089.5,
                        principal: 5527.17,
                        interest: 1562.33,
                        balance: 144472.83,
                    },
                    {
                        month: 2,
                        payment: 7089.5,
                        principal: 5584.89,
                        interest: 1504.61,
                        balance: 138887.94,
                    },
                ],
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }),

    http.post('/api/loans/calculate-rate', async ({ request }) => {
        await simulateDelay();
        const body = await request.json() as InterestRateCalculationRequest;
        const { loanAmount, loanTerm } = body || {};

        if (!loanAmount || loanAmount < 5000 || !loanTerm || loanTerm < 6) {
            return new HttpResponse(
                JSON.stringify({
                    error: 'Validation failed',
                    details: [
                        !loanAmount ? 'Loan amount is required' : null,
                        loanAmount < 5000 ? 'Loan amount must be at least R5,000' : null,
                        !loanTerm ? 'Loan term is required' : null,
                        loanTerm < 6 ? 'Loan term must be at least 6 months' : null,
                    ].filter(Boolean),
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return undefined;
    }),

    http.post('/api/loans/calculate-rate', async ({ request }) => {
        await simulateDelay();
        const body = await request.json() as InterestRateCalculationRequest;
        if (body?.loanAmount === 999999) {
            return new HttpResponse(
                JSON.stringify({ error: 'Failed to calculate interest rate' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return undefined;
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