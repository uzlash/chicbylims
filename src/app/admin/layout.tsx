import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/Admin/Sidebar";
import AdminHeader from "@/components/Admin/Header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/signin");
  }

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen overflow-hidden bg-gray-2">
          <AdminSidebar />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <AdminHeader user={session.user} />
            <main>
              <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
