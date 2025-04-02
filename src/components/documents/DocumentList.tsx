
import React, { useState } from 'react';
import { 
  Download, 
  Eye, 
  FileText, 
  Filter, 
  Search, 
  SortAsc, 
  Trash2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { MedicalRecord } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface DocumentListProps {
  records: MedicalRecord[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  records, 
  isLoading,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewRecord, setViewRecord] = useState<MedicalRecord | null>(null);

  // Filter and sort records
  const filteredRecords = records
    .filter(record => {
      const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || record.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleViewDocument = (record: MedicalRecord) => {
    setViewRecord(record);
  };

  const handleDeleteDocument = (id: string) => {
    onDelete(id);
  };

  const handleDownload = (record: MedicalRecord) => {
    // In a real app, this would download the file
    // For demo, we'll just show a toast
    toast.success(`Downloaded "${record.title}"`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'lab_report':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'prescription':
        return <FileText className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search documents..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-40">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="gynecology">Gynecology</SelectItem>
                <SelectItem value="dermatology">Dermatology</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
                <SelectItem value="dental">Dental</SelectItem>
                <SelectItem value="eye">Ophthalmology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleSortOrder}
            title={`Sort by date ${sortOrder === 'asc' ? 'oldest first' : 'newest first'}`}
          >
            <SortAsc className={`h-4 w-4 ${sortOrder === 'desc' ? 'transform rotate-180' : ''}`} />
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-2">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-10 border rounded-md bg-gray-50">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-600">No records found</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
            {searchTerm || filterCategory !== 'all' 
              ? "Try adjusting your search or filter criteria." 
              : "You haven't added any medical records yet."}
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Document Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(record.type)}
                      <span>{record.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {record.category}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>{formatFileSize(record.fileSize)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDocument(record)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDownload(record)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{record.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteDocument(record.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Document Viewer Dialog */}
      <Dialog open={!!viewRecord} onOpenChange={(open) => !open && setViewRecord(null)}>
        {viewRecord && (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{viewRecord.title}</DialogTitle>
              <DialogDescription>
                Added on {new Date(viewRecord.date).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 bg-gray-50 p-4 rounded border">
              {viewRecord.type === 'image' ? (
                <div className="flex justify-center">
                  <img 
                    src={viewRecord.fileUrl} 
                    alt={viewRecord.title}
                    className="max-h-[70vh] object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">Document Preview</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">
                      This file type requires download for full viewing.
                    </p>
                    <Button onClick={() => handleDownload(viewRecord)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default DocumentList;
