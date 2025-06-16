
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Home } from "lucide-react";

interface AdminPreviewBarProps {
  demoId?: string;
  onStartEditing: () => void;
}

export const AdminPreviewBar: React.FC<AdminPreviewBarProps> = ({
  demoId,
  onStartEditing,
}) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 bg-slate-800 bg-opacity-90 shadow-sm animate-fade-in">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-slate-700"
          onClick={() => navigate("/admin")}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Admin Dashboard
        </Button>
        {demoId && (
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-slate-700"
            onClick={() => navigate(`/admin/edit-demo/${demoId}`)}
          >
            <Home className="w-4 h-4 mr-1" />
            View in Admin
          </Button>
        )}
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="text-slate-800 bg-white hover:bg-purple-100"
        onClick={onStartEditing}
      >
        <Edit className="w-4 h-4 mr-1" />
        Edit This Site
      </Button>
    </div>
  );
};

export default AdminPreviewBar;
