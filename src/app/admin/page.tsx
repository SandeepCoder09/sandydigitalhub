import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileDigit, IndianRupee, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  // In a real app, verify admin role here
  // if (session.role !== 'admin') redirect('/dashboard');

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-140px)] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
            <p className="text-muted-foreground">Manage your business metrics, clients, and content.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">View Site</Button>
            <Button>Generate Report</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1,24,500</div>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                 +20.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+14</div>
              <p className="text-xs text-muted-foreground mt-1">+3 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                 +12% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
              <FileDigit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">3 pending review</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Latest inquiries from the contact form.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-muted-foreground">
                  <thead className="text-xs text-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Name</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium text-foreground">Rahul Kumar</td>
                      <td className="px-4 py-3">Website Development</td>
                      <td className="px-4 py-3">Today, 10:23 AM</td>
                      <td className="px-4 py-3"><span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">New</span></td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3 font-medium text-foreground">Priya Singh</td>
                      <td className="px-4 py-3">PAN Card Correction</td>
                      <td className="px-4 py-3">Yesterday</td>
                      <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Contacted</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-foreground">Amit Patel</td>
                      <td className="px-4 py-3">Mobile App</td>
                      <td className="px-4 py-3">Oct 24, 2024</td>
                      <td className="px-4 py-3"><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Converted</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Manage content and users</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" /> Manage Clients
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Activity className="mr-2 h-4 w-4" /> Manage Projects
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileDigit className="mr-2 h-4 w-4" /> Blog CMS
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Target className="mr-2 h-4 w-4" /> Portfolio CMS
              </Button>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
