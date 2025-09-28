import {
    CheckCircle,
    Warning,
    Cancel,
    AttachMoney,
    Security,
    Info
} from '@mui/icons-material';
import './LoanEligibilityResult.css';
import type { LoanEligibilityResponse } from '../../types/loanEligibility';
import type { FC } from 'react';

interface LoanEligibilityResultProps {
    result: LoanEligibilityResponse;
}
const LoanEligibilityResult: FC<LoanEligibilityResultProps> = ({ result }) => {
    const { eligibilityResult, recommendedLoan } = result;
    const { isEligible, approvalLikelihood, riskCategory, decisionReason } = eligibilityResult;

    const getTheme = (likelihood: number) => {
        if (likelihood >= 80) return 'success';
        if (likelihood >= 60) return 'warning';
        return 'danger';
    };

    const getIcon = (likelihood: number) => {
        if (likelihood >= 80) return CheckCircle;
        if (likelihood >= 60) return Warning;
        return Cancel;
    };

    const theme = getTheme(approvalLikelihood);
    const IconComponent = getIcon(approvalLikelihood);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const CircularProgress = ({ value, theme }: { value: number, theme: string }) => {
        const circumference = 2 * Math.PI * 45;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (value / 100) * circumference;

        return (
            <div className="circular-progress">
                <svg className="progress-svg" viewBox="0 0 100 100">
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className="progress-bg"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        className={`progress-bar ${theme}`}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                <div className="progress-text">
                    <div className={`progress-value ${theme}`}>{value}%</div>
                    <div className="progress-label">Approval</div>
                </div>
            </div>
        );
    };

    return (
        <div className="loan-eligibility-container">
            <div className={`loan-eligibility-card ${theme}`}>
                <div className={`loan-eligibility-header ${theme}`}>
                    <div className="header-content">
                        <div className="header-icon">
                            <IconComponent sx={{ fontSize: 32 }} />
                        </div>
                        <div className="header-text">
                            <h2>{isEligible ? 'Congratulations!' : 'Application Update'}</h2>
                            <p>{isEligible ? 'Your loan application looks promising' : 'We\'ve reviewed your application'}</p>
                        </div>
                    </div>
                </div>

                <div className="loan-eligibility-content">

                    <div className="details-section">
                        <CircularProgress value={approvalLikelihood} theme={theme} />

                        <div className="progress-info">
                            <h3 className="progress-title">Approval Likelihood</h3>
                            <div className={`risk-badge ${theme}`}>
                                <Security sx={{ fontSize: 16 }} />
                                {riskCategory} Risk
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-header">
                                <div className="info-icon amount">
                                    <AttachMoney sx={{ fontSize: 24 }} />
                                </div>
                                <div className="info-text">
                                    <h4>Recommended Amount</h4>
                                    <p>Based on your financial profile</p>
                                </div>
                            </div>
                            <div className="amount-display">
                                {formatCurrency(recommendedLoan.recommendedAmount)}
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-header">
                                <div className="info-icon reason">
                                    <Info sx={{ fontSize: 20 }} />
                                </div>
                                <div className="info-text">
                                    <h4>Decision Summary</h4>
                                </div>
                            </div>
                            <p className="reason-text">
                                {decisionReason}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanEligibilityResult;