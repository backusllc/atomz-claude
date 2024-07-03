import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BlogPostEditor from "./BlogPostEditor";

const DisplaySettingsModal = ({ open, onOpenChange, displaySettings, onSettingsChange, onAddColumn }) => {
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("text");
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const handleAddColumn = () => {
    if (newColumnName) {
      onAddColumn(newColumnName, newColumnType);
      setNewColumnName("");
      setNewColumnType("text");
      setIsAddingColumn(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>表示項目の管理</DialogTitle>
          <DialogClose asChild></DialogClose>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(displaySettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between space-x-2">
              <Label htmlFor={key} className="flex-grow">
                {key}
              </Label>
              <Switch
                id={key}
                checked={value.visible}
                onCheckedChange={checked => onSettingsChange(key, { ...value, visible: checked })}
              />
            </div>
          ))}
        </div>
        {isAddingColumn ? (
          <div className="space-y-4">
            <Input placeholder="カラム名" value={newColumnName} onChange={e => setNewColumnName(e.target.value)} />
            <Select value={newColumnType} onValueChange={setNewColumnType}>
              <SelectTrigger>
                <SelectValue placeholder="フィールドタイプ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">テキスト(改行なし)</SelectItem>
                <SelectItem value="textarea">テキスト(改行あり)</SelectItem>
                <SelectItem value="image">画像</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button onClick={handleAddColumn}>追加</Button>
              <Button variant="outline" onClick={() => setIsAddingColumn(false)}>
                キャンセル
              </Button>
            </div>
          </div>
        ) : (
          <Button className="w-full" onClick={() => setIsAddingColumn(true)}>
            + カラムを追加
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

const BlogModelList = ({ modelName = "ブログ", templateData, sampleData }) => {
  const [sampleSize, setSampleSize] = useState("3");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [displaySettings, setDisplaySettings] = useState({
    タイトル: { visible: true, type: "text" },
    内容: { visible: true, type: "textarea" },
    サムネイル: { visible: true, type: "image" },
    タグ: { visible: true, type: "text" },
    公開日時: { visible: true, type: "text" },
    ステータス: { visible: true, type: "text" },
  });
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleSettingsChange = (key, value) => {
    setDisplaySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAddColumn = (columnName, columnType) => {
    setDisplaySettings(prev => ({
      ...prev,
      [columnName]: { visible: true, type: columnType },
    }));
  };

  const handleNewPost = () => {
    setIsEditorOpen(true);
  };

  const handleSavePost = newPost => {
    console.log("New post:", newPost);
  };

  const displayData = sampleData ? sampleData.slice(0, parseInt(sampleSize)) : [];

  return (
    <div className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          {modelName}
          <span className="text-sm font-normal text-gray-400 ml-2">blog</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            表示項目の編集
          </Button>
          <Button onClick={handleNewPost}>
            <Plus className="mr-2 h-4 w-4" />
            新規追加
          </Button>
        </div>
        {sampleSize !== "0" && (
          <Table>
            <TableHeader>
              <TableRow>
                {Object.entries(displaySettings).map(([key, value]) => value.visible && <TableHead key={key}>{key}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((item, index) => (
                <TableRow key={index}>
                  {Object.entries(displaySettings).map(([key, value]) => {
                    if (!value.visible) return null;
                    if (key === "サムネイル" && item.thumbnail) {
                      return (
                        <TableCell key={key}>
                          <img src={item.thumbnail} alt="サムネイル" className="w-10 h-10 object-cover" />
                        </TableCell>
                      );
                    }
                    if (key === "タグ" && item.tag) {
                      return (
                        <TableCell key={key}>
                          <div className="flex flex-wrap gap-1">
                            {item.tag.split(",").map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      );
                    }
                    if (key === "ステータス") {
                      return (
                        <TableCell key={key}>
                          <Badge variant={item.status === "公開" ? "default" : "secondary"}>{item.status}</Badge>
                        </TableCell>
                      );
                    }
                    return <TableCell key={key}>{item[key.toLowerCase()] || "N/A"}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <DisplaySettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        displaySettings={displaySettings}
        onSettingsChange={handleSettingsChange}
        onAddColumn={handleAddColumn}
      />
      <BlogPostEditor isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} onSave={handleSavePost} />
    </div>
  );
};

export default BlogModelList;
