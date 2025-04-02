
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Calendar, CalendarIcon, FileType, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MedicalRecord } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const recordFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  type: z.string().min(1, { message: 'Please select a record type' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  date: z.date({ required_error: 'Please select a date' }),
  notes: z.string().optional(),
});

type RecordFormValues = z.infer<typeof recordFormSchema>;

interface AddMedicalRecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (record: MedicalRecord) => void;
}

const AddMedicalRecordForm: React.FC<AddMedicalRecordFormProps> = ({
  isOpen,
  onClose,
  onAddRecord,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      title: '',
      type: '',
      category: '',
      notes: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  const onSubmit = async (values: RecordFormValues) => {
    if (!file) {
      toast.error('Please upload a file');
      return;
    }

    setIsSubmitting(true);

    // Simulate file upload and record creation
    setTimeout(() => {
      try {
        const fileUrl = URL.createObjectURL(file); // In a real app, this would be a server URL
        
        // Create new record
        const newRecord: MedicalRecord = {
          id: `record-${Date.now()}`,
          title: values.title,
          type: values.type,
          category: values.category,
          date: format(values.date, 'yyyy-MM-dd'),
          fileUrl: fileUrl,
          fileSize: file.size,
          thumbnailUrl: values.type === 'image' ? fileUrl : undefined,
        };

        // Get existing records or initialize empty array
        const existingRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
        
        // Add new record
        localStorage.setItem('medicalRecords', JSON.stringify([...existingRecords, newRecord]));
        
        // Call the callback with the new record
        onAddRecord(newRecord);
        
        toast.success('Medical record added successfully');
        form.reset();
        setFile(null);
        onClose();
      } catch (error) {
        console.error('Error adding record:', error);
        toast.error('Failed to add medical record');
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Medical Record</DialogTitle>
          <DialogDescription>
            Upload and categorize your medical documents
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Title</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., Blood Test Results" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Record Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lab_report">Lab Report</SelectItem>
                        <SelectItem value="prescription">Prescription</SelectItem>
                        <SelectItem value="image">Medical Image</SelectItem>
                        <SelectItem value="discharge">Discharge Summary</SelectItem>
                        <SelectItem value="vaccination">Vaccination Record</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Record Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes about this record" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-1">
              <FormLabel>Upload File</FormLabel>
              <div className="mt-1">
                {!file ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                    <div className="flex justify-center">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center space-y-2">
                          <FileType className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-gray-400">
                            PDF, JPG, PNG up to 10MB
                          </span>
                          <Button type="button" variant="secondary" size="sm">
                            Select File
                          </Button>
                        </div>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center space-x-2">
                      <FileType className="h-5 w-5 text-blue-500" />
                      <div className="text-sm text-gray-700">
                        <div className="font-medium">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFile}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={18} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !file}
              >
                {isSubmitting ? 'Uploading...' : 'Add Record'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicalRecordForm;
