import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  return (
    <div className="pb-10">
      <PageHeader
        title="Dashboard"
        description="Overview of your activity."
        actions={<Button>New Project</Button>}
      />
      <div className="p-4 md:p-6">Your dashboard content…</div>
    </div>
  );
}
