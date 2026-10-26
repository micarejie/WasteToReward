import { ProfileForm } from "@/components/admin/ProfileForm";
import { getProfile } from "@/lib/data/repository";
import { seedProfile } from "@/lib/demo/seed-data";

export default async function ProfilePage() {
  const profile = (await getProfile()) ?? seedProfile;
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold text-heading">Profile</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
