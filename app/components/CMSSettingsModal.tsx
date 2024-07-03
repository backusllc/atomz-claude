import React, { useState, useCallback, useMemo } from "react";
import { Loader2, ArrowRight, Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { templates } from "consts/cms-templates";
import { sampleData } from "consts/sample-data";
import BlogModelList from "./BlogModelList";

const ModelSelectionModal = ({ open, onOpenChange }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sampleSize, setSampleSize] = useState("3");
  const [createdModels, setCreatedModels] = useState([]);
  const [showCreatedList, setShowCreatedList] = useState(false);

  const filteredTemplates = useMemo(
    () => templates.filter(template => template.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  const handleModelSelect = useCallback(model => {
    setSelectedModel(prevModel => (prevModel === model ? null : model));
  }, []);

  const handleCreateModel = useCallback(async () => {
    if (!selectedModel) return;
    setIsCreating(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCreatedModels(prev => [...prev, selectedModel]);
      setShowCreatedList(true);
    } catch (err) {
      setError("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsCreating(false);
    }
  }, [selectedModel]);

  const renderLeftSidebar = () => (
    <div className="w-64 bg-gray-50 p-6 border-r border-gray-200">
      <h2 className="text-base font-semibold mb-2 mt-6">モデル</h2>
      {createdModels.length > 0 ? (
        <ul className="text-sm text-gray-500 mb-6">
          {createdModels.map((model, index) => (
            <li key={index}>{model}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mb-6">モデルがありません</p>
      )}
      <h2 className="text-base font-semibold mb-2">インポート</h2>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-full text-sm h-9" onClick={() => console.log("WordPress import")}>
              <span>WordPress取り込み</span>
              <Info className="w-4 h-4 ml-2" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" className="max-w-[230px]">
            <p className="text-xs">
              WordPressのエクスポートファイルから投稿データ、カテゴリー、タグをワンクリックで移行できます。
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  const renderModelCard = useCallback(
    template => (
      <Card
        key={template.name}
        className={`cursor-pointer bg-gradient-to-br from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 ${
          selectedModel === template.name ? "ring-4 ring-purple-400" : ""
        }`}
        onClick={() => handleModelSelect(template.name)}
      >
        <CardContent className="p-2 pb-0 flex flex-col items-center">
          <div className="w-6 h-6 mb-2">{template.image}</div>
          <h3 className="text-sm font-medium text-center">{template.name}</h3>
        </CardContent>
      </Card>
    ),
    [handleModelSelect, selectedModel]
  );

  const renderSampleData = useCallback(() => {
    if (!selectedModel || !sampleData[selectedModel]) return null;

    const displayData = sampleData[selectedModel].slice(0, parseInt(sampleSize));

    return (
      <div>
        <div className="mt-6 border-t pt-4">
          <h2 className="text-lg font-semibold mb-4">サンプルデータ: {selectedModel}</h2>
        </div>
        <div className="flex mt-4">
          <div className="inline-flex items-center rounded-md shadow-sm" role="group">
            {["3", "5", "0"].map(size => (
              <Button
                key={size}
                onClick={() => setSampleSize(size)}
                variant={sampleSize === size ? "default" : "outline"}
                className={`${
                  size === "3" ? "rounded-l-md" : size === "0" ? "rounded-r-md" : ""
                } px-4 py-2 text-sm font-medium focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {size === "0" ? "なし" : `${size}件`}
              </Button>
            ))}
          </div>
        </div>
        {sampleSize !== "0" && (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>タイトル</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>日付</TableHead>
                <TableHead>タグ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "公開" ? "default" : "secondary"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.tag.split(",").map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  }, [selectedModel, sampleSize]);

  const renderCreatedModelsList = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">作成されたモデル</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>モデル名</TableHead>
            <TableHead>作成日時</TableHead>
            <TableHead>ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {createdModels.map((model, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{model}</TableCell>
              <TableCell>{new Date().toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant="success">作成済み</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button className="mt-4" onClick={() => setShowCreatedList(false)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        モデル選択に戻る
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden">
        <div className="flex h-[80vh]">
          {renderLeftSidebar()}
          <div className="flex-1 p-6 overflow-y-auto">
            {showCreatedList ? (
              <BlogModelList
                modelName={selectedModel}
                templateData={templates.find(t => t.name === selectedModel)}
                sampleData={sampleData[selectedModel]}
              />
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">モデルを作成する</h2>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                  {filteredTemplates.map(renderModelCard)}
                </div>
                {renderSampleData()}
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleCreateModel} disabled={isCreating || !selectedModel}>
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        作成中...
                      </>
                    ) : (
                      <>
                        このモデルで作成
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModelSelectionModal;
