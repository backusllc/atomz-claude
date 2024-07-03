// ~/components/PreviewManagementModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { X, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PreviewManagementModal = ({ isOpen, onClose }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Card ref={cardRef} className="fixed top-16 right-4 w-110 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-xl z-50">
      <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-10">
        <CardTitle>Live Preview</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <img src="https://www.claudeusercontent.com/api/placeholder/200/200" alt="QR Code" className="w-32 h-32" />
          <Button variant="outline" className="w-full">
            <Copy className="mr-2 h-4 w-4" /> URL COPY
          </Button>
          <a
            href="https://preview.atomz.site/live/JgqeXnv9Ok/progress/back1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            https://preview.atomz.site/live/JgqeXnv9Ok/progress/back1
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewManagementModal;
