import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CloudUpload, Globe, X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DomainSettingsModal from "~/components/DomainSettingsModal";

const PublishModal = ({ isOpen, onClose }) => {
  const [publishAllPages, setPublishAllPages] = useState(true);
  const [customDomain, setCustomDomain] = useState("");
  const [isDomainSettingsModalOpen, setIsDomainSettingsModalOpen] = useState(false);

  const cardRef = useRef(null);

  const handlePublish = () => {
    console.log("Publishing website", { publishAllPages, customDomain });
    onClose();
  };

  const getPublishUrl = () => {
    if (customDomain) return customDomain;
    return publishAllPages ? "https://temp.atomz.art" : "https://temp.atomz.art/about";
  };

  const openDomainSettingsModal = () => {
    setIsDomainSettingsModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = event => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card ref={cardRef} className="fixed top-16 right-4 w-110 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-xl z-50">
            <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-10">
              <CardTitle>Webサイトに公開しますか？</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Globe className="h-6 w-6" />
                  <div className="flex-grow font-medium">{getPublishUrl()}</div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Button onClick={openDomainSettingsModal} variant="outline">
                    独自ドメインを設定する
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="publish-all" checked={publishAllPages} onCheckedChange={setPublishAllPages} />
                  <Label htmlFor="publish-all">すべてのページを公開する</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          このオプションをオンにすると、すべてのページが公開されます。
                          <br />
                          オフにすると、メインページのみが公開されます。
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onClose}>
                  キャンセル
                </Button>
                <Button onClick={handlePublish}>
                  <CloudUpload className="mr-2 h-4 w-4" />
                  公開
                </Button>
              </div>
            </CardContent>
          </Card>
          {isDomainSettingsModalOpen && (
            <DomainSettingsModal open={isDomainSettingsModalOpen} onOpenChange={() => setIsDomainSettingsModalOpen(false)} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PublishModal;
