import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({ open, onOpenChange }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [publicationStatus, setPublicationStatus] = useState("private");
  const [favicon, setFavicon] = useState<string | null>(null);
  const [snsImage, setSnsImage] = useState<string | null>(null);

  const handleSave = () => {
    onOpenChange(false);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setterFunction: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setterFunction(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[70vw] max-h-[90vh] w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle>サイトの設定</DialogTitle>
        </DialogHeader>
        <div className="flex gap-6 h-full">
          <div className="flex-1 max-w-[50%]">
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="projectName">プロジェクト名</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder=""
                  description="Googleの検索結果のタイトル部分に表示されます"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="projectDescription">プロジェクト説明</Label>
                <Textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={e => setProjectDescription(e.target.value)}
                  placeholder=""
                  maxLength={120}
                  description="Googleの検索結果の説明部分に表示されます 文字数は120文字以内が一般的です"
                />
              </div>
              <div className="grid gap-2">
                <Label>ファビコン</Label>
                <div className="flex items-start gap-2 flex-col">
                  <Input
                    type="file"
                    onChange={e => handleFileUpload(e, setFavicon)}
                    className="hidden"
                    id="favicon-upload"
                    accept=".ico,.png,.gif,.jpg,image/*"
                  />
                  <Label htmlFor="favicon-upload" className="cursor-pointer">
                    <Button variant="outline" type="button">
                      <Upload className="mr-2 h-4 w-4" /> アップロード
                    </Button>
                  </Label>
                  <span className="text-sm text-gray-500">32x32ピクセルのICO、PNG、GIF、またはJPG</span>
                </div>
                {favicon && (
                  <div className="flex items-start gap-2 flex-col">
                    <img src={favicon} alt="Favicon" className="w-8 h-8" />
                    <Button variant="ghost" size="icon" onClick={() => setFavicon(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label>SNS共有画像</Label>
                <div className="flex items-start gap-2 flex-col">
                  <Input
                    type="file"
                    onChange={e => handleFileUpload(e, setSnsImage)}
                    className="hidden"
                    id="sns-image-upload"
                    accept="image/*"
                  />
                  <Label htmlFor="sns-image-upload" className="cursor-pointer">
                    <Button variant="outline" type="button">
                      <Upload className="mr-2 h-4 w-4" /> アップロード
                    </Button>
                  </Label>
                </div>
                {snsImage && (
                  <div className="flex items-center gap-2">
                    <img src={snsImage} alt="SNS共有画像" className="w-20 h-20 object-cover" />
                    <Button variant="ghost" size="icon" onClick={() => setSnsImage(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label>公開設定</Label>
                <RadioGroup value={publicationStatus} onValueChange={setPublicationStatus}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">公開</Label>
                  </div>
                  <p className="text-sm text-gray-500 ml-6">誰でもWebサイトにアクセス可能です。</p>

                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="limited" id="limited" />
                    <Label htmlFor="limited">限定公開</Label>
                  </div>
                  <p className="text-sm text-gray-500 ml-6">
                    Googleなどの検索エンジンにサイトを表示されないようにします。
                    URLを知っている人は誰でもWebサイトにアクセスが可能です。
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">非公開</Label>
                  </div>
                  <p className="text-sm text-gray-500 ml-6">プロジェクトメンバーのみWebサイトにアクセスが可能です。</p>
                </RadioGroup>
              </div>
            </div>
          </div>
          <div className="w-px bg-gray-200 mx-2"></div>
          <div className="flex-1 max-w-[50%] pl-6">
            <h3 className="font-semibold mb-4">プレビュー</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">Google検索結果</h4>
                <div className="text-blue-600 text-lg">{projectName || "プロジェクト名"}</div>
                <div className="text-green-700 text-sm">https://example.com/your-project</div>
                <div className="text-sm text-gray-600">{projectDescription || "プロジェクトの説明文がここに表示されます。"}</div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">ブラウザタブ</h4>
                <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                  {favicon ? (
                    <img src={favicon} alt="Favicon" className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  )}
                  <span className="text-sm truncate">{projectName || "プロジェクト名"}</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h4 className="font-semibold mb-2">SNS共有プレビュー</h4>
                <div className="border rounded overflow-hidden">
                  {snsImage ? (
                    <img src={snsImage} alt="SNS共有画像" className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">画像なし</span>
                    </div>
                  )}
                  <div className="p-2">
                    <div className="font-semibold">{projectName || "プロジェクト名"}</div>
                    <div className="text-sm text-gray-600 truncate">
                      {projectDescription || "プロジェクトの説明文がここに表示されます。"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            保存する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSettingsModal;
