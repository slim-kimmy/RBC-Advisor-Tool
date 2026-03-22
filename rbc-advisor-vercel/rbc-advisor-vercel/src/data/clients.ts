export interface Client {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  age: number;
  occupation: string;
  maritalStatus: string;
  background: string;
  city: string;
  province: string;
  email: string;
  phone: string;
  advisorName: string;
  advisorTitle: string;
  clientSince: string;
  lastContact: string;
  segment: 'Private Banking' | 'Wealth Management' | 'Personal Banking';
  // Enhanced fields
  portfolioValue: string;
  portfolioComposition: string;
  riskTolerance: string;
  financialGoals: string;
  recentEvents: string;
  currentProducts: string;
  opportunities: string;
  netWorth: string;
  annualIncome: string;
}

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'CLT-00421',
    name: 'Herschel Walker',
    firstName: 'Herschel',
    lastName: 'Walker',
    age: 52,
    occupation: 'Senior Civil Engineer',
    maritalStatus: 'Married (2 children)',
    background: 'Christian, Canadian-born of Jamaican heritage',
    city: 'Toronto',
    province: 'ON',
    email: 'h.walker@email.com',
    phone: '(416) 555-0192',
    advisorName: 'Sarah Chen',
    advisorTitle: 'Senior Wealth Advisor',
    clientSince: 'March 2015',
    lastContact: 'October 14, 2024',
    segment: 'Wealth Management',
    portfolioValue: '$1.24M CAD',
    portfolioComposition: '58% equities (heavy Canadian financials and US tech), 28% fixed income (government bonds), 9% real estate investment trusts, 5% cash equivalents',
    riskTolerance: 'Moderate-aggressive; comfortable with short-term volatility for long-term growth',
    financialGoals: 'Retire at 60 with $3M, fund both children\'s university education (eldest starting in 3 years), purchase a vacation property in cottage country',
    recentEvents: 'Received a $180K inheritance from late father-in-law in September 2024; eldest child (age 15) approaching RESP contribution limits; recently promoted with 22% salary increase',
    currentProducts: 'RBC Wealth Management portfolio, RRSP (maxed), TFSA (maxed), joint non-registered account, RESP for both children, RBC Visa Infinite',
    opportunities: 'Inheritance not yet deployed — could benefit from a balanced portfolio top-up or real estate. RESP for eldest is near limit but youngest has room. No life insurance review since 2019. Mortgage renewal coming in April 2025. With salary increase, could accelerate cottage property savings plan.',
    netWorth: '~$2.1M',
    annualIncome: '$195,000',
  },
  {
    id: 'CLT-00893',
    name: 'Miriam Goldstein',
    firstName: 'Miriam',
    lastName: 'Goldstein',
    age: 67,
    occupation: 'Retired Professor (Economics, U of T)',
    maritalStatus: 'Widowed (1 adult child)',
    background: 'Jewish, Ashkenazi heritage',
    city: 'North York',
    province: 'ON',
    email: 'm.goldstein@email.com',
    phone: '(416) 555-0347',
    advisorName: 'Sarah Chen',
    advisorTitle: 'Senior Wealth Advisor',
    clientSince: 'January 2008',
    lastContact: 'September 3, 2024',
    segment: 'Private Banking',
    portfolioValue: '$2.87M CAD',
    portfolioComposition: '35% equities (dividend-focused, blue chip), 45% fixed income, 12% alternative investments, 8% cash',
    riskTolerance: 'Conservative; capital preservation is the primary objective',
    financialGoals: 'Preserve wealth for estate transfer to daughter, maintain income stream to cover living expenses, charitable giving to local synagogue and university endowment',
    recentEvents: 'Started drawing RRIF in 2022; granddaughter born in June 2024; reviewing estate plan with lawyer',
    currentProducts: 'RBC Private Banking portfolio, RRIF, TFSA, non-registered accounts, RBC Premium Chequing',
    opportunities: 'New granddaughter — RESP opportunity. Estate planning review needed (daughter named as executor but no updated will since husband passed). Charitable giving could be structured more tax-efficiently through a donor-advised fund. GIC ladder coming due in Q1 2025.',
    netWorth: '~$3.4M',
    annualIncome: '$112,000 (pension + RRIF + investment income)',
  },
];
