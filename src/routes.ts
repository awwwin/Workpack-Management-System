import { createBrowserRouter } from "react-router";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";
import { DashboardLayout } from "./components/DashboardLayout";
import { ContractorDashboard } from "./components/ContractorDashboard";
import { CreateWorkpack } from "./components/CreateWorkpack";
import { WorkpackList } from "./components/WorkpackList";
import { ReviewerDashboard } from "./components/ReviewerDashboard";
import { WorkpackReview } from "./components/WorkpackReview";
import { StatusTracking } from "./components/StatusTracking";
import { AdminDashboard } from "./components/AdminDashboard";
import { ReportingDashboard } from "./components/ReportingDashboard";
import { LoadingScreen } from "./components/LoadingScreen";
import { ProfilePage } from "./components/ProfilePage";
import { SettingsPage } from "./components/SettingsPage";
import { UserManagement } from "./components/UserManagement";
import { SystemSettings } from "./components/SystemSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginScreen,
  },
  {
    path: "/register",
    Component: RegisterScreen,
  },
  {
    path: "/onboarding",
    Component: LoadingScreen,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: ContractorDashboard },
      { path: "contractor", Component: ContractorDashboard },
      { path: "reviewer", Component: ReviewerDashboard },
      { path: "admin", Component: AdminDashboard },
      { path: "create-workpack", Component: CreateWorkpack },
      { path: "workpacks", Component: WorkpackList },
      { path: "workpack/:id/review", Component: WorkpackReview },
      { path: "workpack/:id/status", Component: StatusTracking },
      { path: "reports", Component: ReportingDashboard },
      { path: "profile", Component: ProfilePage },
      { path: "settings", Component: SettingsPage },
      { path: "user-management", Component: UserManagement },
      { path: "system-settings", Component: SystemSettings },
    ],
  },
]);