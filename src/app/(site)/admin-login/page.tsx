import { AdminLoginForm } from "./admin-login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = params.next?.startsWith("/") && !params.next.startsWith("//") ? params.next : "/admin";

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-10 px-4 py-20 sm:px-6">
      <AdminLoginForm nextPath={nextPath} />
    </div>
  );
}
