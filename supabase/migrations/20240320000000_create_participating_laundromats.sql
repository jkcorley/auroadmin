-- Create participating_laundromats table
CREATE TABLE IF NOT EXISTS public.participating_laundromats (
    laundromat_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    phone_number TEXT,
    hours_of_operation TEXT,
    contact_person TEXT,
    contact_email TEXT,
    onboarding_date DATE,
    contract_status TEXT,
    payment_terms TEXT,
    commission_rate DECIMAL(5,2),
    average_monthly_revenue DECIMAL(10,2),
    last_revenue_update DATE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create machines table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.machines (
    machine_id TEXT PRIMARY KEY,
    laundromat_id TEXT REFERENCES public.participating_laundromats(laundromat_id),
    machine_type TEXT NOT NULL,
    status TEXT NOT NULL,
    last_maintenance DATE,
    usage_percentage INTEGER,
    onboarding_date DATE,
    contract_status TEXT,
    payment_terms TEXT,
    commission_rate DECIMAL(5,2),
    average_monthly_revenue DECIMAL(10,2),
    last_revenue_update DATE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create stored procedure to create participating_laundromats table
CREATE OR REPLACE FUNCTION public.create_participating_laundromats_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- The table creation is handled by the migration above
    -- This function exists to maintain compatibility with the TypeScript code
    RETURN;
END;
$$; 