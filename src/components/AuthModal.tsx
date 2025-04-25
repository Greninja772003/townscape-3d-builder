
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { loginUser } from "@/utils/buildingData";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (loginUser(password)) {
      toast.success("Authentication successful!");
      onAuthSuccess();
      onClose();
    } else {
      toast.error("Invalid password!");
    }
    
    setPassword("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Administrator Authentication</DialogTitle>
          <DialogClose className="absolute right-4 top-4" asChild>
            <button type="button" className="text-gray-400 hover:text-gray-500">
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password:</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
