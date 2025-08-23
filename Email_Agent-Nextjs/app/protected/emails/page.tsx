import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmailDashboard from "@/components/email-dashboard";

export default async function EmailsPage() {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/protected">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Mail className="h-8 w-8" />
              Email Agent Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your email threads and AI replies
            </p>
          </div>
        </div>
      </div>

      {/* Email Dashboard Component */}
      <EmailDashboard />
    </div>
  );
}
