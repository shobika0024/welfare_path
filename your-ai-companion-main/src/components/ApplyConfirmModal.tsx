import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ApplyConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schemeName: string;
  portalName: string;
  applyUrl: string;
}

const ApplyConfirmModal = ({
  open,
  onOpenChange,
  schemeName,
  portalName,
  applyUrl,
}: ApplyConfirmModalProps) => {
  const { t } = useTranslation();

  const handleApply = () => {
    window.open(applyUrl, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" />
            {t("applyModal.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-3">
            <p>
              {t("applyModal.description")}
            </p>
            <p className="font-semibold text-foreground">{schemeName}</p>
            <p className="text-sm">
              {t("applyModal.portal")}: <span className="text-primary">{portalName}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {t("applyModal.documentsReady")}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleApply}>
            {t("applyModal.continueToPortal")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApplyConfirmModal;