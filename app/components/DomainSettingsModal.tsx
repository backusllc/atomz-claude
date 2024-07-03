import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Globe, ShoppingCart, Check, AlertTriangle, Loader2, X, ChevronDown, Copy } from "lucide-react";

interface DomainSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DomainSettings: React.FC<DomainSettingsModalProps> = ({ open, onOpenChange }) => {
  const [connectedDomain, setConnectedDomain] = useState(null);
  const [domain, setDomain] = useState("");
  const [dnsStatus, setDnsStatus] = useState(null);
  const [showDnsConfig, setShowDnsConfig] = useState(false);
  const [purchaseDomain, setPurchaseDomain] = useState("");
  const [purchaseResults, setPurchaseResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [recentlyPurchasedDomains] = useState(["purchased-custom-domain.com"]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = e => {
    const value = e.target.value;
    setDomain(value);
    setShowDropdown(value.length > 0);
  };

  const filteredDomains = recentlyPurchasedDomains.filter(d => d.toLowerCase().includes(domain.toLowerCase()));

  const handleConnect = () => {
    if (domain) {
      setIsConnecting(true);
      setDnsStatus("checking");
      setShowDnsConfig(true);
      setIsConnecting(false);
    }
  };

  const handleVerifyDns = () => {
    setDnsStatus("checking");
    setTimeout(() => {
      setDnsStatus("verified");
      setConnectedDomain(domain);
    }, 2000);
  };

  const handleDisconnect = () => {
    setConnectedDomain(null);
    setDnsStatus(null);
    setShowDnsConfig(false);
  };

  const handlePurchaseSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setPurchaseResults([
        { domain: purchaseDomain, available: true, price: "$12.99/年" },
        { domain: `${purchaseDomain.split(".")[0]}-site.com`, available: true, price: "$14.99/年" },
        { domain: `my-${purchaseDomain}`, available: false, price: "利用不可" },
      ]);
      setIsSearching(false);
    }, 1500);
  };

  const DnsConfigScreen = () => (
    <div className="space-y-4">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>DNSレコードの設定が必要です</AlertTitle>
        <AlertDescription>以下のDNSレコードを設定してください。設定には最大48時間かかる場合があります。</AlertDescription>
      </Alert>
      <Card>
        <CardHeader className="flex flex-row  align-middle justify-between pb-0">
          <CardTitle className="text-sm">A レコード</CardTitle>
          <Button variant="outline" size="sm" className="m-0!" onClick={() => navigator.clipboard.writeText("A @ 203.0.113.1")}>
            <Copy className="mr-2 h-4 w-4" />
            コピー
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <Label>ホスト</Label>
              <Input value="@" readOnly />
            </div>
            <div>
              <Label>値</Label>
              <Input value="203.0.113.1" readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleVerifyDns} className="w-full">
        DNSレコードを確認
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] transition-all duration-300 ease-in-out overflow-hidden">
        <DialogHeader>
          <DialogTitle>ドメイン設定</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="connect">
              <Globe className="mr-2 h-4 w-4" />
              既存ドメイン接続
            </TabsTrigger>
            <TabsTrigger value="buy">
              <ShoppingCart className="mr-2 h-4 w-4" />
              新規ドメイン購入
            </TabsTrigger>
          </TabsList>
          <TabsContent value="connect" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">接続するドメイン</Label>
                <div className="relative">
                  <Input
                    ref={inputRef}
                    id="domain"
                    placeholder="例: example.com"
                    value={domain}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                    autoComplete="off"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  {showDropdown && filteredDomains.length > 0 && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-32 overflow-auto"
                    >
                      {filteredDomains.map((d, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setDomain(d);
                            setShowDropdown(false);
                          }}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Button onClick={handleConnect} disabled={isConnecting || !domain} className="w-full">
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    接続中...
                  </>
                ) : (
                  "ドメインを接続"
                )}
              </Button>
            </div>
            {showDnsConfig && <DnsConfigScreen />}
            {connectedDomain && (
              <Alert>
                <Globe className="h-4 w-4" />
                <AlertTitle>接続済みドメイン</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>{connectedDomain}</span>
                  <Badge variant="secondary">接続中</Badge>
                </AlertDescription>
                <Button variant="outline" size="sm" className="mt-2" onClick={handleDisconnect}>
                  <X className="mr-2 h-4 w-4" />
                  切断
                </Button>
              </Alert>
            )}
            {dnsStatus && (
              <Alert variant={dnsStatus === "verified" ? "default" : "warning"}>
                {dnsStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin" />}
                {dnsStatus === "verified" && <Check className="h-4 w-4" />}
                {dnsStatus === "error" && <AlertTriangle className="h-4 w-4" />}
                <AlertTitle>
                  {dnsStatus === "checking" && "DNSレコード確認中"}
                  {dnsStatus === "verified" && "DNSレコード設定完了"}
                  {dnsStatus === "error" && "DNSレコード設定エラー"}
                </AlertTitle>
              </Alert>
            )}
          </TabsContent>
          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purchase-domain">購入したいドメイン</Label>
              <div className="flex space-x-2">
                <Input
                  id="purchase-domain"
                  placeholder="例: mydomain.com"
                  value={purchaseDomain}
                  onChange={e => setPurchaseDomain(e.target.value)}
                  autoComplete="off"
                />
                <Button onClick={handlePurchaseSearch} disabled={isSearching}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "検索"}
                </Button>
              </div>
            </div>
            {purchaseResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">検索結果:</h3>
                <div className="space-y-2 max-h-[240px] overflow-y-auto pr-2">
                  {purchaseResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <span className="font-medium">{result.domain}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{result.price}</span>
                        {result.available ? (
                          <Button size="sm" onClick={() => setDomain(result.domain)}>
                            購入
                          </Button>
                        ) : (
                          <Badge variant="secondary">利用不可</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DomainSettings;
