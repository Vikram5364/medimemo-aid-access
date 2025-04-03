
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DocumentList from '@/components/documents/DocumentList';

interface DocumentSectionProps {
  records: any[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const DocumentSection: React.FC<DocumentSectionProps> = ({ records, isLoading, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Documents</CardTitle>
        <CardDescription>
          Manage and organize your medical records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DocumentList records={records} isLoading={isLoading} onDelete={onDelete} />
      </CardContent>
    </Card>
  );
};

export default DocumentSection;
