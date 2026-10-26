import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!url || !serviceKey || !email || !password) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, and ADMIN_PASSWORD.");
  console.error("Do not prefix the service-role key with NEXT_PUBLIC_.");
  process.exit(1);
}

if (password.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error || !data.user) {
  console.error(error?.message || "The administrator account could not be created.");
  process.exit(1);
}

const { error: adminError } = await supabase.from("admins").insert({ user_id: data.user.id });
if (adminError) {
  console.error(adminError.message);
  process.exit(1);
}

console.log(`Administrator ready for ${email}.`);
console.log("The service-role key was used only by this script. It is not part of the website.");
