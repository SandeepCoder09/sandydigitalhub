import { redirect } from "next/navigation";

interface ProfilePageProps {
  searchParams: Promise<{ payment?: string }>;
}

export default async function ProfileRedirectPage({ searchParams }: ProfilePageProps) {
  const { payment } = await searchParams;
  if (payment) {
    redirect(`/requests?payment=${payment}`);
  }
  redirect("/account");
}
