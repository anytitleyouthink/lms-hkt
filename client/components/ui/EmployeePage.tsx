import { Plus, Users, Briefcase } from "lucide-react";
import { Sidebar } from "./Side";
import { TopNav } from "./TopNav";
import { ActionCard } from "./ActionCard";
import StatCard from "../ui/StatCard"; // Component bạn đã có sẵn
import UserTable from "../ui/UserTable"; // Component bạn đã có sẵn

const EMPLOYEE_LIST = [
    { id: 1, name: "John Doe", email: "john.doe@company.com", role: "Software Engineer", department: "IT", requestedDate: "2024-01-15", date: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane.smith@company.com", role: "Product Manager", department: "Product", requestedDate: "2024-01-18", date: "2024-01-18" },
    { id: 3, name: "Mike Johnson", email: "mike.johnson@company.com", role: "UX Designer", department: "Design", requestedDate: "2024-01-20", date: "2024-01-20" },
];

export default function EmployeePage() {
    return (
        <div className="flex min-h-screen bg-[#f4f7fe] font-sans">
            <Sidebar />
            <div className="flex-1">
                <TopNav />
                <main className="px-10 pb-10 space-y-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black text-[#1b2559] tracking-tight">Trainer Dashboard</h1>
                            <p className="text-slate-400 font-medium mt-1">Managing the future of your learning ecosystem.</p>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[20px] font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2">
                            <Plus size={18} strokeWidth={3} /> Create New Employee
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard label="ACTIVE EMPLOYEES" value="1,284" subtext="+12% this month" icon={<Users size={22} />} />
                        <StatCard label="AVG. TENURE" value="2.4 Years" subtext="+5% increase" icon={<Briefcase size={22} />} />
                        <ActionCard />
                    </div>

                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-50 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h3 className="font-black text-xl text-[#1b2559]">Enrollment Requests</h3>
                            <button className="text-blue-600 font-bold text-sm hover:underline tracking-tight">View Full Report</button>
                        </div>
                        <UserTable
                            title="Enrollment Requests"
                            users={EMPLOYEE_LIST}
                            columns={["EMPLOYEE NAME", "ROLE / DEPT", "REQUESTED DATE", "ACTIONS"]}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}