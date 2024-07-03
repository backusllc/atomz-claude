import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Info, CreditCard, ChevronDown, ChevronUp, Download, Filter } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { plans } from "consts/plans";

const PlanCard = ({ plan, billingPeriod, isRecommended }) => {
  const yearlyDiscount = plan.monthlyPrice * 12 - plan.yearlyPrice;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`flex flex-col h-full relative ${isRecommended ? "border-blue-500 shadow-lg" : ""}`}>
        {isRecommended && (
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-bl">おすすめ</div>
        )}
        <CardHeader className="pb-2">
          <CardTitle className="text-lg mb-1">{plan.name}</CardTitle>
          <motion.div
            key={billingPeriod}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-2xl font-bold"
          >
            ¥{billingPeriod === "yearly" ? plan.yearlyPrice.toLocaleString() : plan.monthlyPrice.toLocaleString()}
            <span className="text-sm font-normal">/{billingPeriod === "yearly" ? "年" : "月"}</span>
          </motion.div>
          <div className="text-xs text-pink-500 h-4">
            {" "}
            {/* Fixed height to prevent layout shift */}
            {billingPeriod === "yearly" && `年払いで¥${yearlyDiscount.toLocaleString()}お得`}
          </div>
        </CardHeader>
        <CardContent className="flex-grow py-2">
          <p className="text-xs text-gray-500 mb-2">{plan.description}</p>
          <ul className="space-y-1 text-sm">
            {plan.features.slice(0, 5).map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="text-green-500 mr-1 flex-shrink-0" size={14} />
                <span className="text-xs">{feature}</span>
              </li>
            ))}
          </ul>
          {plan.features.length > 5 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1">
                    +{plan.features.length - 5}機能 <Info size={12} className="ml-1" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <ul className="list-disc pl-4">
                    {plan.features.slice(5).map((feature, index) => (
                      <li key={index} className="text-xs">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <Button className="w-full text-sm py-1" variant={isRecommended ? "default" : "outline"}>
            選択する
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const CreditCardChangeForm = ({ isOpen, onClose }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    console.log("New card info submitted:", { cardNumber, cardName, expiryDate, cvv });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>クレジットカード情報の変更</DialogTitle>
          <DialogDescription>新しいクレジットカード情報を入力してください。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardNumber" className="text-right">
                カード番号
              </Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                className="col-span-3"
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cardName" className="text-right">
                カード名義
              </Label>
              <Input
                id="cardName"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                className="col-span-3"
                placeholder="TARO YAMADA"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDate" className="text-right">
                有効期限
              </Label>
              <Input
                id="expiryDate"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
                className="col-span-3"
                placeholder="MM/YY"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cvv" className="text-right">
                CVV
              </Label>
              <Input id="cvv" value={cvv} onChange={e => setCvv(e.target.value)} className="col-span-3" placeholder="123" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">変更を保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const PaymentHistoryItem = ({ payment, onToggleDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    onToggleDetails();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4"
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={toggleDetails}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <CreditCard className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="font-medium">{payment.date}</p>
            <p className="text-sm text-gray-600">{payment.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              payment.status === "お支払い済" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {payment.status}
          </span>
          <Button variant="ghost" size="sm">
            {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">請求額</p>
                <p>{payment.amount}</p>
              </div>
              <div>
                <p className="font-medium">支払い方法</p>
                <p>{payment.method}</p>
              </div>
              <div>
                <p className="font-medium">請求書番号</p>
                <p>{payment.invoiceNumber}</p>
              </div>
              <div>
                <p className="font-medium">プラン</p>
                <p>{payment.plan}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button variant="outline" size="sm">
                <Download size={16} className="mr-2" />
                請求書をダウンロード
              </Button>
              <Button variant="outline" size="sm">
                サポートに問い合わせ
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch payment history
    const fetchPaymentHistory = async () => {
      // In a real application, this would be an API call
      const mockData = [
        {
          date: "2023年5月23日",
          description: "CMSプラン年間払い",
          status: "お支払い済",
          amount: "¥19,800",
          method: "クレジットカード",
          invoiceNumber: "INV-001",
          plan: "Pro",
        },
        {
          date: "2023年4月23日",
          description: "CMSプラン年間払い",
          status: "お支払い済",
          amount: "¥19,800",
          method: "クレジットカード",
          invoiceNumber: "INV-002",
          plan: "Pro",
        },
        {
          date: "2023年3月23日",
          description: "CMSプラン年間払い",
          status: "処理中",
          amount: "¥19,800",
          method: "銀行振込",
          invoiceNumber: "INV-003",
          plan: "Pro",
        },
      ];
      setPaymentHistory(mockData);
      setFilteredHistory(mockData);

      // Prepare chart data
      const chartData = mockData.map(payment => ({
        date: payment.date,
        amount: parseInt(payment.amount.replace("¥", "").replace(",", "")),
      }));
      setChartData(chartData.reverse());
    };

    fetchPaymentHistory();
  }, []);

  const handleFilterChange = value => {
    setFilterPeriod(value);
    // Apply filter logic here
    // This is a simplified example. In a real application, you'd use more sophisticated date filtering.
    if (value === "all") {
      setFilteredHistory(paymentHistory);
    } else {
      const threemonthsAgo = new Date();
      threemonthsAgo.setMonth(threemonthsAgo.getMonth() - 3);
      const filtered = paymentHistory.filter(payment => new Date(payment.date) > threemonthsAgo);
      setFilteredHistory(filtered);
    }
  };

  const handleSortChange = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    const sorted = [...filteredHistory].sort((a, b) => {
      return newOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    });
    setFilteredHistory(sorted);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">お支払い履歴</h3>
        <div className="flex space-x-2">
          <Select value={filterPeriod} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="期間を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全期間</SelectItem>
              <SelectItem value="3months">過去3ヶ月</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleSortChange}>
            <Filter size={16} className="mr-2" />
            {sortOrder === "desc" ? "新しい順" : "古い順"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredHistory.map((payment, index) => (
          <PaymentHistoryItem key={index} payment={payment} onToggleDetails={() => {}} />
        ))}
      </div>
    </div>
  );
};

const PricingPlans = () => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

  return (
    <div className="container mx-auto py-2 px-4">
      <Tabs defaultValue="plan" className="w-full">
        <div className="min-h-[500px]">
          <TabsContent value="plan" className="mt-0">
            <Tabs value={billingPeriod} onValueChange={setBillingPeriod} className="mb-4 w-1/2">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="monthly" className="text-sm w-auto">
                  月払い
                </TabsTrigger>
                <TabsTrigger value="yearly" className="text-sm w-auto">
                  年払い（2ヶ月分お得）
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan, index) => (
                <PlanCard key={plan.name} plan={plan} billingPeriod={billingPeriod} isRecommended={index === 1} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="payment-info">
            <CreditCardInfo />
          </TabsContent>
          <TabsContent value="payment-history">
            <PaymentHistory />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

const CreditCardInfo = () => {
  const [isChangeFormOpen, setIsChangeFormOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">クレジットカード情報</h3>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="font-medium">VISA ••••4164</p>
              <p className="text-sm text-gray-500">Yamato Kumazawa</p>
              <p className="text-sm text-gray-500">有効期限: 04/2025</p>
            </div>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={() => setIsChangeFormOpen(true)}>
              カードを変更する
            </Button>
            <Button variant="outline" className="w-full text-red-500 hover:text-red-700">
              カードを削除する
            </Button>
          </div>
        </div>
      </div>
      <CreditCardChangeForm isOpen={isChangeFormOpen} onClose={() => setIsChangeFormOpen(false)} />
    </div>
  );
};

const PriceModal = ({ open, onOpenChange }) => {
  const [activeSection, setActiveSection] = useState("plan");

  const renderContent = () => {
    switch (activeSection) {
      case "plan":
        return <PricingPlans />;
      case "payment-info":
        return <CreditCardInfo />;
      case "payment-history":
        return <PaymentHistory />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-w-4xl min-h-[80vh] w-full max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>お支払い</DialogTitle>
        </DialogHeader>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger onClick={() => setActiveSection("plan")}>プラン</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger onClick={() => setActiveSection("payment-info")}>お支払い情報</MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger onClick={() => setActiveSection("payment-history")}>お支払い履歴</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
        <div className="mt-4 flex-1 overflow-y-auto">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceModal;
