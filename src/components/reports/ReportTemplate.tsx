
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface ReportTemplateProps {
  title: string;
  description: string;
  onUse?: () => void;
}

export function ReportTemplate({ title, description, onUse }: ReportTemplateProps) {
  const navigate = useNavigate();
  
  const handleUse = () => {
    if (onUse) {
      onUse();
    } else {
      toast({
        title: "Template applied",
        description: `The ${title} template has been applied.`,
      });
      
      // In a real app, this would load the template configuration
      console.log(`Using template: ${title}`);
    }
  };
  
  return (
    <div className="flex items-center justify-between pb-2 border-b">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleUse}>Use</Button>
    </div>
  );
}

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SaveTemplateDialog({ open, onOpenChange }: TemplateDialogProps) {
  const handleSave = () => {
    toast({
      title: "Template saved",
      description: "Your report template has been saved for future use.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Report Template</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Template Name</label>
            <input
              id="name"
              placeholder="Enter template name"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              placeholder="Enter template description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Template</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
