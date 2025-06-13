import { Badge } from "@/components/ui/badge";
import { FineTuningJob } from "@/services/api";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: FineTuningJob["status"];
  statusDisplay: string;
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-500 hover:bg-amber-500/80 text-black",
  RUNNING: "bg-blue-500 hover:bg-blue-500/80 text-white",
  SUCCESS: "bg-green-600 hover:bg-green-600/80 text-white",
  FAILED: "bg-red-600 hover:bg-red-600/80 text-white",
  CANCELLED: "bg-gray-500 hover:bg-gray-500/80 text-white",
};

export const StatusBadge = ({ status, statusDisplay }: StatusBadgeProps) => {
  return (
    <Badge className={cn("border-transparent font-medium", statusStyles[status] || "bg-gray-500 text-white")}>
      {statusDisplay}
    </Badge>
  );
};
