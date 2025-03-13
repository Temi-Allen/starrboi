
import React, { useState, useRef } from 'react';
import { useCV } from '@/context/CVContext';
import { Step } from '@/utils/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Upload, File, AlertCircle } from 'lucide-react';

const CVUpload: React.FC = () => {
  const { setCvData, setCurrentStep } = useCV();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = (file: File) => {
    setError(null);
    
    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, Word document, or text file.");
      setFile(null);
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      setFile(null);
      return;
    }
    
    setFile(file);
    
    // In a real app, we would parse the CV text here
    // For now, we'll just use the filename
    const mockText = "This is the text content extracted from your CV.";
    
    setCvData({
      text: mockText,
      filename: file.name
    });
  };

  const handleContinue = () => {
    if (file) {
      setCurrentStep(Step.QUESTIONS);
    } else {
      setError("Please upload your CV to continue.");
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-slide-in">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          Step 1
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Your CV</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We'll analyze your CV to create personalized STARR format answers for competency-based questions.
        </p>
      </div>

      {/* Upload Area */}
      <div 
        className={`
          mt-6 border-2 border-dashed rounded-xl p-8 transition-all duration-300
          text-center flex flex-col items-center justify-center space-y-4
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'}
          ${error ? 'border-destructive/50 bg-destructive/5' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileDrop}
      >
        <div className={`
          rounded-full p-4 transition-all duration-300
          ${isDragging ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}
          ${file ? 'bg-primary/10 text-primary' : ''}
          ${error ? 'bg-destructive/10 text-destructive' : ''}
        `}>
          {error ? (
            <AlertCircle className="w-8 h-8" />
          ) : file ? (
            <File className="w-8 h-8" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {file ? file.name : "Upload your CV"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {file 
              ? `${(file.size / 1024 / 1024).toFixed(2)} MB · ${file.type}`
              : "Drag and drop your file here, or click to browse"
            }
          </p>
          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
        />
        
        {!file && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary/10 hover:bg-primary/20 text-primary rounded-lg px-4 py-2 text-sm font-medium transition-all focus-ring"
          >
            Select file
          </button>
        )}
        
        {file && (
          <button 
            onClick={() => {
              setFile(null);
              setCvData(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Remove file
          </button>
        )}
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!file}
          className={`
            px-6 py-3 rounded-lg text-white font-medium transition-all focus-ring
            ${file 
              ? 'bg-primary hover:bg-primary/90' 
              : 'bg-muted-foreground/30 cursor-not-allowed'
            }
          `}
        >
          Continue to Questions
        </button>
      </div>
    </div>
  );
};

export default CVUpload;
