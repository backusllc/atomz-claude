import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectSettingsModal from "~/components/ProjectSettingsModal";
import DomainSettingsModal from "~/components/DomainSettingsModal";
import CMSSettingsModal from "~/components/CMSSettingsModal";
import { Settings, X, CloudUpload, ScanEye, PersonStanding, Users } from "lucide-react";
import PriceSettingsModal from "~/components/PriceSettingsModal";
import APIIntegrationModal from "~/components/APISettingsModal";
import ProjectMemberManagementModal from "~/components/ProjectMemberManagementModal";
import PreviewManagementModal from "~/components/PreviewManagementModal";
import PublishModal from "~/components/PublishSettingsModal";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [isCMSModalOpen, setIsCMSModalOpen] = useState(false);
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const [isMemberManagementOpen, setIsMemberManagementOpen] = useState(false);
  const [isPreviewManagementOpen, setIsPreviewManagementOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { label: "サイト設定", onClick: () => setIsSettingsModalOpen(true) },
    { label: "ドメイン設定", onClick: () => setIsDomainModalOpen(true) },
    { label: "CMS", onClick: () => setIsCMSModalOpen(true) },
    { label: "API連携", onClick: () => setIsAPIModalOpen(true) },
    { label: "お支払い", onClick: () => setIsPriceModalOpen(true) },
    { label: "メンバー管理", onClick: () => setIsMemberManagementOpen(true) },
  ];

  return (
    <div className="relative">
      <header className="flex justify-between items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Settings className="h-5 w-5" />
        </Button>
        <div className="flex">
          <Button variant="ghost" size="icon" onClick={() => setIsMemberManagementOpen(!isMemberManagementOpen)}>
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsPreviewManagementOpen(!isPreviewManagementOpen)}>
            <ScanEye className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsPublishModalOpen(!isPublishModalOpen)}>
            <CloudUpload className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">設定</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button variant="ghost" className="w-full justify-start" onClick={item.onClick}>
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <main className="p-4">{/* ここにメインコンテンツを配置 */}</main>

      <ProjectSettingsModal open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen} />
      <DomainSettingsModal open={isDomainModalOpen} onOpenChange={setIsDomainModalOpen} />
      <CMSSettingsModal open={isCMSModalOpen} onOpenChange={setIsCMSModalOpen} />
      <APIIntegrationModal open={isAPIModalOpen} onOpenChange={setIsAPIModalOpen} />
      <PriceSettingsModal open={isPriceModalOpen} onOpenChange={setIsPriceModalOpen} />
      <ProjectMemberManagementModal isOpen={isMemberManagementOpen} onClose={setIsMemberManagementOpen} />
      <PreviewManagementModal isOpen={isPreviewManagementOpen} onClose={setIsPreviewManagementOpen} />
      <PublishModal isOpen={isPublishModalOpen} onClose={setIsPublishModalOpen} />
    </div>
  );
}
