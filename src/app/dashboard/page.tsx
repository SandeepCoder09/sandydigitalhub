import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, CreditCard, FileText, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ClientDashboard() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  // Mock user data based on session
  const sessionData = session as any;
  const user = {
    name: sessionData.email?.split("@")[0] || "User",
    email: sessionData.email,
    initials: (sessionData.email as string)?.substring(0, 2).toUpperCase() || "US"
  };

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-140px)] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarFallback className="text-xl bg-primary/10 text-primary">{user.initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground mt-1">E-Commerce Website</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground mt-1">1 Pending, 1 Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Invoices</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground mt-1">0 Unpaid</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
              <LifeBuoy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">No active tickets</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest project updates and requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Project Phase 1 Completed</h4>
                    <p className="text-sm text-muted-foreground">The design phase for your E-Commerce website is now approved.</p>
                    <span className="text-xs text-muted-foreground mt-1 block">2 days ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Invoice Paid</h4>
                    <p className="text-sm text-muted-foreground">Payment of ₹4,999 received successfully.</p>
                    <span className="text-xs text-muted-foreground mt-1 block">1 week ago</span>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <h4 className="font-semibold">Account Created</h4>
                    <p className="text-sm text-muted-foreground">Welcome to Sandy Digital Hub client portal.</p>
                    <span className="text-xs text-muted-foreground mt-1 block">1 week ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>What would you like to do?</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" /> New Service Request
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Briefcase className="mr-2 h-4 w-4" /> Track Project
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" /> Make a Payment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <LifeBuoy className="mr-2 h-4 w-4" /> Open Support Ticket
              </Button>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
