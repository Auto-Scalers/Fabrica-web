import { getSupabaseBrowser, isSupabaseConfigured } from '@/lib/supabase-browser'

export type AuthApiError = { error: string }

export type SignInWithPasswordInput = {
  email: string
  password: string
}

export type SignUpInput = {
  email: string
  password: string
}

export type ResetPasswordInput = {
  email: string
  redirectTo: string
}

export type UpdateUserInput = {
  password: string
}

export type SignInWithOAuthInput = {
  provider: 'github' | 'google'
  redirectTo: string
  locale?: string
}

function err(message: string): AuthApiError {
  return { error: message }
}

export async function signInWithPassword(
  input: SignInWithPasswordInput
): Promise<AuthApiError | { user: { id: string; email?: string } | null }> {
  if (!isSupabaseConfigured()) return err('Supabase not configured')
  const supabase = getSupabaseBrowser()
  if (!supabase) return err('Supabase not configured')

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })

  if (error) return err(error.message)
  return { user: data.user ? { id: data.user.id, email: data.user.email ?? undefined } : null }
}

export async function signUp(
  input: SignUpInput
): Promise<AuthApiError | { user: { id: string; email?: string } | null }> {
  if (!isSupabaseConfigured()) return err('Supabase not configured')
  const supabase = getSupabaseBrowser()
  if (!supabase) return err('Supabase not configured')

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  })

  if (error) return err(error.message)
  return { user: data.user ? { id: data.user.id, email: data.user.email ?? undefined } : null }
}

export async function resetPasswordForEmail(
  input: ResetPasswordInput
): Promise<AuthApiError | { ok: true }> {
  if (!isSupabaseConfigured()) return err('Supabase not configured')
  const supabase = getSupabaseBrowser()
  if (!supabase) return err('Supabase not configured')

  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: input.redirectTo,
  })

  if (error) return err(error.message)
  return { ok: true }
}

export async function updateUser(
  input: UpdateUserInput
): Promise<AuthApiError | { user: { id: string; email?: string } | null }> {
  if (!isSupabaseConfigured()) return err('Supabase not configured')
  const supabase = getSupabaseBrowser()
  if (!supabase) return err('Supabase not configured')

  const { data, error } = await supabase.auth.updateUser({ password: input.password })

  if (error) return err(error.message)
  return { user: data.user ? { id: data.user.id, email: data.user.email ?? undefined } : null }
}

export async function signInWithOAuth(
  input: SignInWithOAuthInput
): Promise<AuthApiError | { url: string }> {
  if (!isSupabaseConfigured()) return err('Supabase not configured')
  const supabase = getSupabaseBrowser()
  if (!supabase) return err('Supabase not configured')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: input.provider,
    options: {
      redirectTo: input.redirectTo,
      queryParams: { access_type: 'offline', prompt: 'consent' },
      ...(input.locale ? { locale: input.locale } : {}),
    },
  })

  if (error) return err(error.message)
  if (!data.url) return err('No OAuth URL returned by Supabase')
  return { url: data.url }
}