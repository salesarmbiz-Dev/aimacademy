-- Create organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  admin_user_id UUID NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  max_members INTEGER DEFAULT 50,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'team', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create org_members table
CREATE TABLE public.org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_org_members_org ON public.org_members(org_id);
CREATE INDEX idx_org_members_user ON public.org_members(user_id);
CREATE INDEX idx_organizations_invite ON public.organizations(invite_code);
CREATE INDEX idx_organizations_admin ON public.organizations(admin_user_id);

-- Enable RLS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

-- Security definer function to check org membership
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.org_members
    WHERE user_id = _user_id
      AND org_id = _org_id
  )
$$;

-- Security definer function to check org admin/manager role
CREATE OR REPLACE FUNCTION public.is_org_admin_or_manager(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.org_members
    WHERE user_id = _user_id
      AND org_id = _org_id
      AND role IN ('admin', 'manager')
  )
$$;

-- Function to get user's org_id
CREATE OR REPLACE FUNCTION public.get_user_org_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id
  FROM public.org_members
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Organizations RLS policies
CREATE POLICY "Users can view organizations they are members of"
ON public.organizations
FOR SELECT
USING (public.is_org_member(auth.uid(), id));

CREATE POLICY "Authenticated users can create organizations"
ON public.organizations
FOR INSERT
WITH CHECK (auth.uid() = admin_user_id);

CREATE POLICY "Org admins can update their organization"
ON public.organizations
FOR UPDATE
USING (admin_user_id = auth.uid());

-- Org members RLS policies
CREATE POLICY "Members can view other members in same org"
ON public.org_members
FOR SELECT
USING (public.is_org_member(auth.uid(), org_id));

CREATE POLICY "Admins and managers can add members"
ON public.org_members
FOR INSERT
WITH CHECK (public.is_org_admin_or_manager(auth.uid(), org_id) OR auth.uid() = user_id);

CREATE POLICY "Admins can update member roles"
ON public.org_members
FOR UPDATE
USING (public.is_org_admin_or_manager(auth.uid(), org_id));

CREATE POLICY "Admins can remove members"
ON public.org_members
FOR DELETE
USING (public.is_org_admin_or_manager(auth.uid(), org_id));

-- Allow public to check invite codes (for joining)
CREATE POLICY "Anyone can view org by invite code"
ON public.organizations
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();