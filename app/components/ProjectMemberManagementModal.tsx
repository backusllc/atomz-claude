import React, { useState, useRef, useEffect } from "react";
import { X, UserPlus, Mail, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProjectMemberManagementModal = ({ isOpen, onClose }) => {
  const [members, setMembers] = useState([
    { id: 1, name: "森田 亜衣加", email: "aika.morita@gmail.com", role: "オーナー" },
    { id: 2, name: "kumazawa yamato", email: "smartcompany.222@gmail.com", role: "編集者" },
    { id: 3, name: "Arima yuki", email: "watermakioy.222@gmail.com", role: "編集者" },
  ]);
  const [newMember, setNewMember] = useState({ email: "", role: "編集者" });
  const [emailError, setEmailError] = useState("");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showInviteButton, setShowInviteButton] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showDeletedAlert, setShowDeletedAlert] = useState(false);

  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        // onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleAddMember = () => {
    if (!newMember.email) {
      setEmailError("メールアドレスを入力してください");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(newMember.email)) {
      setEmailError("有効なメールアドレスを入力してください");
      return;
    }
    const newId = Math.max(...members.map(m => m.id), 0) + 1;
    setMembers([...members, { ...newMember, id: newId, name: newMember.email.split("@")[0] }]);
    setNewMember({ email: "", role: "編集者" });
    setEmailError("");
    setShowInviteForm(false);
    setShowInviteButton(true);
  };

  const handleRoleChange = (id, newRole) => {
    if (newRole === "削除") {
      const memberToDelete = members.find(m => m.id === id);
      setMemberToDelete(memberToDelete);
      setShowDeleteConfirmation(true);
    } else {
      setMembers(members.map(member => (member.id === id ? { ...member, role: newRole } : member)));
    }
  };

  const confirmDelete = () => {
    setMembers(members.filter(m => m.id !== memberToDelete.id));
    setShowDeleteConfirmation(false);
    setShowDeletedAlert(true);
    setTimeout(() => setShowDeletedAlert(false), 3000);
  };

  const handleShowInviteForm = () => {
    setShowInviteForm(true);
    setShowInviteButton(false);
  };

  const handleCancelInvite = () => {
    setShowInviteForm(false);
    setShowInviteButton(true);
    setNewMember({ email: "", role: "編集者" });
    setEmailError("");
  };

  const roleColors = {
    オーナー: "bg-purple-100 text-purple-800",
    編集者: "bg-blue-100 text-blue-800",
    閲覧者: "bg-green-100 text-green-800",
  };

  if (!isOpen) return null;

  return (
    <Card ref={cardRef} className="fixed top-16 right-4 w-110 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-xl z-50">
      <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-10">
        <CardTitle>プロジェクトメンバー管理</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {showDeletedAlert && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>メンバーを削除しました</AlertTitle>
            <AlertDescription>
              {memberToDelete?.name} ({memberToDelete?.email}) をプロジェクトから削除しました。
            </AlertDescription>
          </Alert>
        )}
        <div className="mb-6">
          {showInviteButton && (
            <Button onClick={handleShowInviteForm} className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-4">
              <UserPlus className="h-4 w-4 mr-2" />
              新しいメンバーを招待
            </Button>
          )}
          {showInviteForm && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    id="email"
                    placeholder="例: colleague@example.com"
                    value={newMember.email}
                    onChange={e => {
                      setNewMember({ ...newMember, email: e.target.value });
                      setEmailError("");
                    }}
                    className={`pl-10 ${emailError ? "border-red-500" : ""}`}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                </div>
                {emailError && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    {emailError}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  役割
                </Label>
                <Select value={newMember.role} onValueChange={value => setNewMember({ ...newMember, role: value })}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="オーナー">オーナー</SelectItem>
                    <SelectItem value="編集者">編集者</SelectItem>
                    <SelectItem value="閲覧者">閲覧者</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddMember} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                  招待を送信
                </Button>
                <Button onClick={handleCancelInvite} variant="outline" className="flex-1">
                  キャンセル
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {members.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg bg-white border hover:shadow-md transition-shadow duration-300 ease-in-out"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gray-200 text-gray-600">{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-800">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              <Select defaultValue={member.role} onValueChange={value => handleRoleChange(member.id, value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="オーナー">オーナー</SelectItem>
                  <SelectItem value="編集者">編集者</SelectItem>
                  <SelectItem value="閲覧者">閲覧者</SelectItem>
                  <SelectItem value="削除" className="text-red-500">
                    削除
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>メンバーの削除確認</DialogTitle>
          </DialogHeader>
          <p>
            {memberToDelete?.name} ({memberToDelete?.email}) をプロジェクトから削除してもよろしいですか？
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProjectMemberManagementModal;
