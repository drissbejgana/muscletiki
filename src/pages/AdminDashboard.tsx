import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, CreditCard, TrendingUp, Search, MoreHorizontal, Loader2, AlertCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {subscriptionService} from '@/services/subscriptionService';
import { adminService } from '@/services/AdminService';



const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [statusFilter, planFilter]);

  const fetchDashboardStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err);
    }
  };

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getAllSubscriptions({
        status: statusFilter,
        plan: planFilter,
      });
      setSubscriptions(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const userEmail = sub.user?.email || "";
    const userName = sub.user?.name || "";
    const searchLower = searchTerm.toLowerCase();
    return (
      userEmail.toLowerCase().includes(searchLower) ||
      userName.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Active</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const getPlanAmount = (plan) => {
    switch (plan?.toLowerCase()) {
      case "pro":
        return "$9.99";
      case "premium":
        return "$19.99";
      case "free":
        return "$0";
      default:
        return "-";
    }
  };

  const handleCancelSubscription = async (userId) => {
    if (window.confirm("Are you sure you want to cancel this subscription?")) {
      try {
        await subscriptionService.cancelSubscription(userId);
        fetchSubscriptions();
        fetchDashboardStats();
      } catch (err) {
        alert(err);
      }
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const user = await adminService.getUserDetails(userId);
      alert(`User: ${user.name}\nEmail: ${user.email}\nCheck console for full details.`);
      console.log("User details:", user);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage subscription records and user accounts</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? stats.totalUsers : <Loader2 className="h-6 w-6 animate-spin" />}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? stats.activeSubscriptions : <Loader2 className="h-6 w-6 animate-spin" />}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats ? `$${stats.monthlyRevenue}` : <Loader2 className="h-6 w-6 animate-spin" />}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Records</CardTitle>
            <CardDescription>View and manage all user subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium text-gray-700">User</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Plan</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Start Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">End Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Amount</th>
                   <th className="px-4 py-3 text-left font-medium text-gray-700 w-12"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                      </td>
                    </tr>
                  ) : filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        No subscriptions found
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((sub) => (
                      <tr key={sub._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{sub.user?.name || "N/A"}</div>
                            <div className="text-xs text-gray-500">{sub.user?.email || "N/A"}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="capitalize">{sub.plan}</Badge>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(sub.status)}</td>
                        <td className="px-4 py-3 text-gray-700">{formatDate(sub.createdAt)}</td>
                        <td className="px-4 py-3 text-gray-700">{formatDate(sub.endDate)}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{getPlanAmount(sub.plan)}</td>
                      <td className="px-4 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(sub.user?._id)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit Subscription</DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleCancelSubscription(sub.user?._id)}
                                >
                                  Cancel Subscription
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;