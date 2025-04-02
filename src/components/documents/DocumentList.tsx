
import React, { useState } from 'react';
import { Filter, FolderPlus, Grid3X3, List, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DocumentCard from './DocumentCard';
import { MedicalRecord } from '@/types';
import { toast } from 'sonner';

// Mock data
const mockDocuments: MedicalRecord[] = [
  {
    id: '1',
    title: 'Annual Health Checkup',
    type: 'Test Report',
    category: 'Lab Results',
    date: '2023-05-15',
    fileUrl: '#',
    fileSize: 1024 * 1024 * 2.5, // 2.5MB
  },
  {
    id: '2',
    title: 'Diabetes Medication',
    type: 'Prescription',
    category: 'Medication',
    date: '2023-06-10',
    fileUrl: '#',
    fileSize: 1024 * 512, // 512KB
  },
  {
    id: '3',
    title: 'Appendectomy Surgery Report',
    type: 'Surgery',
    category: 'Surgery',
    date: '2023-03-22',
    fileUrl: '#',
    fileSize: 1024 * 1024 * 5.7, // 5.7MB
  },
  {
    id: '4',
    title: 'Blood Test Results',
    type: 'Test Report',
    category: 'Lab Results',
    date: '2023-07-30',
    fileUrl: '#',
    fileSize: 1024 * 1024 * 1.8, // 1.8MB
  },
  {
    id: '5',
    title: 'Hypertension Medication',
    type: 'Prescription',
    category: 'Medication',
    date: '2023-08-05',
    fileUrl: '#',
    fileSize: 1024 * 480, // 480KB
  },
  {
    id: '6',
    title: 'Dental Checkup',
    type: 'Test Report',
    category: 'Dental',
    date: '2023-04-12',
    fileUrl: '#',
    fileSize: 1024 * 1024 * 3.2, // 3.2MB
  }
];

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<MedicalRecord[]>(mockDocuments);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleViewDocument = (document: MedicalRecord) => {
    toast.info(`Viewing document: ${document.title}`);
  };

  const handleDownloadDocument = (document: MedicalRecord) => {
    toast.success(`Downloaded document: ${document.title}`);
  };

  const handleDeleteDocument = (document: MedicalRecord) => {
    setDocuments(documents.filter(doc => doc.id !== document.id));
    toast.success(`Document deleted: ${document.title}`);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      toast.success(`Folder created: ${newFolderName}`);
      setNewFolderName('');
      setCreateFolderDialogOpen(false);
    }
  };

  const handleUploadDocument = () => {
    toast.success('Document uploaded successfully');
    setUploadDialogOpen(false);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(documents.map(doc => doc.category))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List size={18} /> : <Grid3X3 size={18} />}
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a new medical document to your record
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input type="file" />
                <Input placeholder="Document title" className="mt-2" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Document category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab-results">Lab Results</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="dental">Dental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUploadDocument}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={createFolderDialogOpen} onOpenChange={setCreateFolderDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Create a new folder to organize your medical documents
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input 
                  placeholder="Folder name" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateFolderDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateFolder}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredDocuments.length > 0 ? (
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}`}>
              {filteredDocuments.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onView={handleViewDocument}
                  onDownload={handleDownloadDocument}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FileText size={48} />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No documents found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Try a different search term or filter' : 'Get started by uploading a document'}
              </p>
              <div className="mt-6">
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}`}>
            {documents.slice(0, 3).map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onView={handleViewDocument}
                onDownload={handleDownloadDocument}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="shared" className="mt-6">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <FileText size={48} />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No shared documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't shared any documents yet
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="folders" className="mt-6">
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <FolderPlus size={48} />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Create folders to organize</h3>
            <p className="mt-1 text-sm text-gray-500">
              Organize your medical documents into folders
            </p>
            <div className="mt-6">
              <Button onClick={() => setCreateFolderDialogOpen(true)}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Folder
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentList;
