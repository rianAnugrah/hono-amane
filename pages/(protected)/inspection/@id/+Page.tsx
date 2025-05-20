import { usePageContext } from "@/renderer/usePageContext";
import InspectionDetail from "@/components/inspection/InspectionDetail";

export default function InspectionDetailPage() {
  const pageContext = usePageContext();
  const inspectionId = pageContext.routeParams?.id;

  if (!inspectionId) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Missing inspection ID
        </div>
      </div>
    );
  }

  return <InspectionDetail inspectionId={inspectionId} isStandalone={true} />;
}
