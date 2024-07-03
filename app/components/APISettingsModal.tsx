import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BarChart, Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const APIDetailView = ({ api, onBack, onSave }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    onSave(api.name, data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <api.icon className="w-8 h-8 text-blue-500" />
        <h2 className="text-2xl font-bold">{t(api.name)}</h2>
      </div>
      <p>{t(api.description)}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="trackingId">{t('Tracking ID')}</Label>
          <Input
            id="trackingId"
            {...register("trackingId", { 
              required: t("Tracking ID is required"),
              pattern: {
                value: /^(UA|G)-[a-zA-Z0-9-]+$/,
                message: t("Invalid Tracking ID format")
              }
            })}
            placeholder={t("Enter UA- or G- code")}
            className="w-full"
          />
          {errors.trackingId && (
            <Alert variant="destructive">
              <AlertTitle>{t("Error")}</AlertTitle>
              <AlertDescription>{errors.trackingId.message}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onBack}>{t('Back')}</Button>
          <Button type="submit">{t('Save')}</Button>
        </div>
      </form>
    </motion.div>
  );
};

const APIIntegrationModal = ({ open, onOpenChange }) => {
  const [selectedApi, setSelectedApi] = useState(null);
  const [apiConfigurations, setApiConfigurations] = useState({});
  const { t } = useTranslation();

  const apiList = [
    { name: "Google Analytics", description: "Analyze web data", icon: BarChart },
    { name: "Google Tag Manager", description: "Manage marketing tags", icon: Tag },
    { name: "Google Search Console", description: "Monitor search performance", icon: Search },
  ];

  const handleApiClick = (api) => {
    setSelectedApi(api);
  };

  const handleBack = () => {
    setSelectedApi(null);
  };

  const handleSave = (apiName, data) => {
    setApiConfigurations(prev => ({
      ...prev,
      [apiName]: data
    }));
    setSelectedApi(null);
  };

  useEffect(() => {
    // Simulating API data fetch
    const fetchData = async () => {
      // Fetch logic here
    };
    fetchData();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] max-h-[90vh] w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t('API Integration')}</DialogTitle>
          <DialogDescription>{t('Available APIs for integration')}</DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {selectedApi ? (
            <APIDetailView key="detail" api={selectedApi} onBack={handleBack} onSave={handleSave} />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-y-auto max-h-[60vh]"
            >
              {apiList.map((api, index) => (
                <Card 
                  key={index} 
                  className={`flex flex-col items-center p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${apiConfigurations[api.name] ? 'border-green-500 bg-green-50' : 'hover:bg-gray-100'}`}
                  onClick={() => handleApiClick(api)}
                >
                  <CardHeader>
                    <api.icon className="w-12 h-12 text-blue-500" />
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardTitle className="text-lg mb-2">{t(api.name)}</CardTitle>
                    <p className="text-sm text-gray-600">{t(api.description)}</p>
                    {apiConfigurations[api.name] && (
                      <Alert className="mt-2">
                        <AlertTitle>{t('Configured')}</AlertTitle>
                        <AlertDescription>{t('Click to edit')}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default APIIntegrationModal;