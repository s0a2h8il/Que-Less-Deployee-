import React from "react";
import { Layers3 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import HowItWorks from "../components/home/HowItWorks";

const HowItWorksPage = () => {
  return (
    <div className="pb-16">
      <PageHeader
        title="How It Works"
        description="A quick look at how QueueLess helps customers and businesses move faster."
        icon={Layers3}
      />
      <HowItWorks />
    </div>
  );
};

export default HowItWorksPage;
