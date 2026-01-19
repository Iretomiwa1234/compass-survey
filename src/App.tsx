import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verification from "./pages/Verification";
import SurveyResearch from "./pages/SurveyResearch";
import SurveyAnalysis from "./pages/SurveyAnalysis";
import CreateSurvey from "./pages/CreateSurvey";
import SocialListening from "./pages/SocialListening";
import AISurvey from "./pages/AiSurvey";
import AIAssistant from "./pages/AiAssistant";
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
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verification" element={<Verification />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              }
            />
            <Route
              path="/survey-research"
              element={
                <ProtectedRoute>
                  <SurveyResearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-survey"
              element={
                <ProtectedRoute>
                  <CreateSurvey />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-survey"
              element={
                <ProtectedRoute>
                  <AISurvey />
                </ProtectedRoute>
              }
            />
            <Route
              path="/survey-analysis"
              element={
                <ProtectedRoute>
                  <SurveyAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/social-listening"
              element={
                <ProtectedRoute>
                  <SocialListening />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/community-panel" element={<CommunityPanel />} /> */}
            <Route
              path="/channels"
              element={
                <ProtectedRoute>
                  <Channels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/campaigns"
              element={
                <ProtectedRoute>
                  <Campaigns />
                </ProtectedRoute>
              }
            />
            <Route
              path="/social-insights"
              element={
                <ProtectedRoute>
                  <SocialInsights />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/report" element={<Report />} /> */}
            <Route
              path="/contacts"
              element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audience-insights"
              element={
                <ProtectedRoute>
                  <AudienceInsights />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/settings" element={<Settings />} />  */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <QuickActions />
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
