import { supabase } from "./supabaseClient"

export const createProfileIfNotExists = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single()

  if (!data && !error) {
    await supabase.from("profiles").insert({
      id: user.id,
      username: `user_${user.id.slice(0, 6)}`
    })
  }
}
