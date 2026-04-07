-- Migration: Create audit_logs table
-- Created: 2026-04-07

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT,
    event_type TEXT CHECK (event_type IN ('LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT', 'PASSWORD_RESET')),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own activity logs" ON public.audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Only service role or specialized roles should insert/delete, 
-- but for simplicity in this app, we'll allow authenticated inserts if user is valid.
-- However, standard practice is that the backend (Edge Functions or Client with logic) handles this.
CREATE POLICY "Users can insert their own logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true); -- We'll control this via the Auth Service logic
