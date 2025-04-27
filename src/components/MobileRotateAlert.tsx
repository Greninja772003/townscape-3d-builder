
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RotateCw } from "lucide-react";

const MobileRotateAlert = () => (
  <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-5/6 max-w-sm">
    <Alert className="bg-white/90 border-amber-500">
      <RotateCw className="h-4 w-4 text-amber-500 mr-2" />
      <AlertDescription>
        For the best experience, please rotate your device to landscape mode.
      </AlertDescription>
    </Alert>
  </div>
);

export default MobileRotateAlert;

