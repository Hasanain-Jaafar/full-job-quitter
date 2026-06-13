-- Add profile personalization fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_job_title TEXT,
ADD COLUMN IF NOT EXISTS why_quit TEXT,
ADD COLUMN IF NOT EXISTS risk_tolerance TEXT CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive'));

-- Add goal personalization fields
ALTER TABLE public.financial_goals
ADD COLUMN IF NOT EXISTS desired_post_quit_income NUMERIC(12, 2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS emergency_fund_months INTEGER NOT NULL DEFAULT 6;
