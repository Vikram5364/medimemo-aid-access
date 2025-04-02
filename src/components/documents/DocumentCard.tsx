
import React from 'react';
import { AlertCircle, FileText, FilePlus, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MedicalRecord } from '@/types';
import { formatFileSize } from '@/lib/utils';

interface DocumentCardProps {
  document: MedicalRecord;
  onView?: (document: MedicalRecord) => void;
  onDownload?: (document: MedicalRecord) => void;
  onDelete?: (document: MedicalRecord) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onDownload,
  onDelete
}) => {
  const getDocumentIcon = () => {
    switch (document.type) {
      case 'Prescription':
        return <FileText className="h-12 w-12 text-medimemo-primary" />;
      case 'Test Report':
        return <FileText className="h-12 w-12 text-medimemo-secondary" />;
      case 'Surgery':
        return <AlertCircle className="h-12 w-12 text-medimemo-warning" />;
      default:
        return <FileText className="h-12 w-12 text-gray-400" />;
    }
  };

  const handleView = () => onView && onView(document);
  const handleDownload = () => onDownload && onDownload(document);
  const handleDelete = () => onDelete && onDelete(document);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {document.thumbnailUrl ? (
                <img 
                  src={document.thumbnailUrl} 
                  alt={document.title} 
                  className="h-12 w-12 object-cover rounded" 
                />
              ) : (
                getDocumentIcon()
              )}
              <div className="ml-3">
                <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{document.title}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500">{document.date}</span>
                  <span className="mx-1 text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{formatFileSize(document.fileSize)}</span>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>Download</DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-red-600 focus:text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {document.category}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 px-4 py-2 flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleView}>
                <FileText className="h-4 w-4" />
                <span className="sr-only">View document</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View document</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleDownload}>
                <FilePlus className="h-4 w-4" />
                <span className="sr-only">Download document</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download document</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
