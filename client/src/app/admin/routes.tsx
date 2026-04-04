"use client";

import { AdminLayout } from "./admin-layout";
import Dashboard from "./page";
import { UsersManagement } from "./users-management";
import { CoursesManagement } from "./courses-management";
import { ClassesManagement } from "./classes-management";
import { InstructorsManagement } from "./instructors-management";
import { SupportTickets } from "./support-tickets";
import { Reports } from "./reports";
import { Settings } from "./settings";
import NotFound from "./not-found";

export default function AppRouter({ pathname }: { pathname: string }) {
  let Page;

  switch (pathname) {
    case "/":
      Page = Dashboard;
      break;
    case "/users":
      Page = UsersManagement;
      break;
    case "/courses":
      Page = CoursesManagement;
      break;
    case "/classes":
      Page = ClassesManagement;
      break;
    case "/instructors":
      Page = InstructorsManagement;
      break;
    case "/support":
      Page = SupportTickets;
      break;
    case "/reports":
      Page = Reports;
      break;
    case "/settings":
      Page = Settings;
      break;
    default:
      Page = NotFound;
  }

  return (
    <AdminLayout>
      <Page />
    </AdminLayout>
  );
}