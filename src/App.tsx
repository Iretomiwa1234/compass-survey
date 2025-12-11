import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Verification from "./pages/Verification";
import SurveyResearch from "./pages/SurveyResearch";
import SurveyAnalysis from "./pages/SurveyAnalysis";
import CreateSurvey from "./pages/CreateSurvey";
import SocialListening from "./pages/SocialListening";
import AISurvey from "./pages/AiSurvey";
<<<<<<< Updated upstream
import AIAssistant from "./pages/AiAssistant";
=======
import AIAssistant from "./pages/AIAssistant";
>>>>>>> Stashed changes
// import CommunityPanel from "./pages/CommunityPanel";
import Channels from "./pages/Channels";
import Campaigns from "./pages/Campaigns";
import SocialInsights from "./pages/SocialInsights";
// import Report from "./pages/Report";
import Contacts from "./pages/Contacts";
import AudienceInsights from "./pages/AudienceInsights";
// import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { QuickActions } from "./components/QuickActions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/survey-research" element={<SurveyResearch />} />
          <Route path="/create-survey" element={<CreateSurvey />} />
          <Route path="/ai-survey" element={<AISurvey />} />
          <Route path="/survey-analysis" element={<SurveyAnalysis />} />
          <Route path="/social-listening" element={<SocialListening />} />
          {/* <Route path="/community-panel" element={<CommunityPanel />} /> */}
          <Route path="/channels" element={<Channels />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/social-insights" element={<SocialInsights />} />
          {/* <Route path="/report" element={<Report />} /> */}
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/audience-insights" element={<AudienceInsights />} />
          {/* <Route path="/settings" element={<Settings />} />  */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <QuickActions />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
