
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Download, Mail, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ReportGeneratorProps {
  reportType: string;
  format: string;
  onScheduleEmail?: () => void;
}

export function ReportGenerator({ reportType, format, onScheduleEmail }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGenerating(false);
    
    // Show success message
    toast({
      title: "Report generated successfully",
      description: `Your ${reportType} report has been generated in ${format} format.`,
    });
    
    // In a real app, this would trigger a download or open the report
    console.log(`Generated ${reportType} report in ${format} format`);
  };

  const handleScheduleEmail = () => {
    if (onScheduleEmail) {
      onScheduleEmail();
    } else {
      toast({
        title: "Email scheduled",
        description: "This report will be delivered to your email when ready.",
      });
    }
  };

  return (
    <div className="pt-4 flex justify-end gap-2">
      <Button variant="outline" onClick={handleScheduleEmail}>
        <Mail className="mr-2 h-4 w-4" />
        Schedule Email Delivery
      </Button>
      <Button onClick={handleGenerateReport} disabled={isGenerating}>
        {isGenerating ? (
          <>
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </>
        )}
      </Button>
    </div>
  );
}
