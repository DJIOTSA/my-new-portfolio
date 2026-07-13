alter table public.languages enable row level security;
alter table public.site_settings enable row level security;
alter table public.portfolio_documents enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_authors enable row level security;
alter table public.blog_posts enable row level security;
alter table public.media_files enable row level security;
alter table public.contact_entries enable row level security;
alter table public.social_publications enable row level security;
alter table public.admin_users enable row level security;
alter table public.admin_refresh_tokens enable row level security;
alter table public.admin_email_verification_tokens enable row level security;
alter table public.admin_password_reset_tokens enable row level security;

alter table public.schema_migrations enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'schema_migrations'
      and policyname = 'deny_client_schema_migrations'
  ) then
    create policy "deny_client_schema_migrations"
      on public.schema_migrations
      for all
      to "anon", "authenticated"
      using (false)
      with check (false);
  end if;
end $$;

do $$
begin
  if to_regclass('storage.objects') is not null then
    execute 'drop policy if exists "Enable read access for all users" on storage.objects';
  end if;
end $$;

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public';
    execute 'revoke execute on function public.rls_auto_enable() from anon';
    execute 'revoke execute on function public.rls_auto_enable() from authenticated';
  end if;
end $$;
