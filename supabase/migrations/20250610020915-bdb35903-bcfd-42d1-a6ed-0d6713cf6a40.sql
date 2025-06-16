
-- Create customization requests table
CREATE TABLE IF NOT EXISTS public.customization_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  site_id UUID REFERENCES public.chairlinked_sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  admin_notes TEXT,
  assigned_to UUID REFERENCES public.user_profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.customization_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - admins can see all requests
CREATE POLICY "Admins can view all customization requests" 
  ON public.customization_requests 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can create customization requests" 
  ON public.customization_requests 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update customization requests" 
  ON public.customization_requests 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Customers can view their own requests
CREATE POLICY "Customers can view their own requests" 
  ON public.customization_requests 
  FOR SELECT 
  USING (customer_email = (SELECT email FROM public.user_profiles WHERE user_id = auth.uid()));

-- Add updated_at trigger
CREATE TRIGGER handle_customization_requests_updated_at
  BEFORE UPDATE ON public.customization_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customization_requests_status ON public.customization_requests(status);
CREATE INDEX IF NOT EXISTS idx_customization_requests_priority ON public.customization_requests(priority);
CREATE INDEX IF NOT EXISTS idx_customization_requests_customer_email ON public.customization_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_customization_requests_site_id ON public.customization_requests(site_id);
