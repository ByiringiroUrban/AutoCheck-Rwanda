import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardFrame } from "@/components/DashboardFrame";
import { DealerApplicationForm } from "@/components/dealer/DealerApplicationForm";
import { DEALER_APPLICATION_ROLES } from "@/utils/roles";

export default function DealerApplicationPage() {
  return (
    <ProtectedRoute allow={DEALER_APPLICATION_ROLES}>
      <DashboardFrame title="Request dealer access" subtitle="Apply as an individual or include your registered organization details.">
        <div className="max-w-xl rounded-[8px] border border-solid border-[#ddd] bg-white p-5">
          <DealerApplicationForm />
        </div>
      </DashboardFrame>
    </ProtectedRoute>
  );
}
