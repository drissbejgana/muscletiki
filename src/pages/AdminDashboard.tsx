import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, CreditCard, TrendingUp, Search, MoreHorizontal, Loader2, AlertCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { subscriptionService } from '@/services/subscriptionService';
import { adminService } from '@/services/AdminService';
import { useTranslation } from "@/i18n";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [editForm, setEditForm] = useState({ plan: '', status: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => { fetchDashboardStats(); fetchSubscriptions(); }, []);
  useEffect(() => { fetchSubscriptions(); }, [statusFilter, planFilter]);

  const fetchDashboardStats = async () => { try { setStats(await adminService.getDashboardStats()); } catch (err) { setError(err); } };
  const fetchSubscriptions = async () => { setLoading(true); setError(null); try { setSubscriptions(await adminService.getAllSubscriptions({ status: statusFilter, plan: planFilter })); } catch (err) { setError(err); } finally { setLoading(false); } };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const searchLower = searchTerm.toLowerCase();
    return (sub.user?.email || "").toLowerCase().includes(searchLower) || (sub.user?.name || "").toLowerCase().includes(searchLower);
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active": return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">{t('admin.active')}</Badge>;
      case "cancelled": return <Badge variant="secondary">{t('admin.cancelled')}</Badge>;
      case "expired": return <Badge variant="destructive">{t('admin.expired')}</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : "-";
  const getPlanAmount = (plan) => { switch (plan?.toLowerCase()) { case "pro": return "$9.99"; case "premium": return "$19.99"; case "free": return "$0"; default: return "-"; } };

  const handleCancelSubscription = async (userId) => { if (window.confirm(t('admin.confirmCancel'))) { try { await subscriptionService.cancelSubscription(userId); fetchSubscriptions(); fetchDashboardStats(); } catch (err) { alert(err); } } };
  const handleViewDetails = async (userId) => { try { const user = await adminService.getUserDetails(userId); alert(`User: ${user.name}\nEmail: ${user.email}`); } catch (err) { alert(err); } };

  const handleOpenEditModal = (sub) => { setEditingSubscription(sub); setEditForm({ plan: sub.plan, status: sub.status }); setEditError(null); setEditModalOpen(true); };
  const handleCloseEditModal = () => { setEditModalOpen(false); setEditingSubscription(null); setEditForm({ plan: '', status: '' }); setEditError(null); };
  const handleSaveEdit = async () => {
    if (!editingSubscription) return;
    setEditLoading(true); setEditError(null);
    try { await adminService.updateUserSubscription(editingSubscription.user._id, editForm); await fetchSubscriptions(); await fetchDashboardStats(); handleCloseEditModal(); }
    catch (err) { setEditError(err); } finally { setEditLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('admin.title')}</h1>
          <p className="text-gray-600">{t('admin.subtitle')}</p>
        </div>

        {error && (<Alert variant="destructive" className="mb-6"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>)}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { title: t('admin.totalUsers'), icon: Users, value: stats?.totalUsers },
            { title: t('admin.activeSubscriptions'), icon: CreditCard, value: stats?.activeSubscriptions },
            { title: t('admin.monthlyRevenue'), icon: TrendingUp, value: stats ? `$${stats.monthlyRevenue}` : null },
          ].map(({ title, icon: Icon, value }) => (
            <Card key={title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle><Icon className="h-4 w-4 text-gray-500" /></CardHeader>
              <CardContent><div className="text-2xl font-bold">{value ?? <Loader2 className="h-6 w-6 animate-spin" />}</div></CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader><CardTitle>{t('admin.subscriptionRecords')}</CardTitle><CardDescription>{t('admin.manageSubscriptions')}</CardDescription></CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><Input placeholder={t('admin.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
              <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{t('admin.allStatus')}</SelectItem><SelectItem value="active">{t('admin.active')}</SelectItem><SelectItem value="cancelled">{t('admin.cancelled')}</SelectItem><SelectItem value="expired">{t('admin.expired')}</SelectItem></SelectContent></Select>
              <Select value={planFilter} onValueChange={setPlanFilter}><SelectTrigger className="w-full md:w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{t('admin.allPlans')}</SelectItem><SelectItem value="free">Free</SelectItem><SelectItem value="pro">Pro</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent></Select>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr className="border-b">
                  {[t('admin.user'), t('admin.plan'), t('admin.status'), t('admin.startDate'), t('admin.endDate'), t('admin.amount'), ''].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left font-medium text-gray-700">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="bg-white divide-y">
                  {loading ? (<tr><td colSpan={7} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" /></td></tr>)
                    : filteredSubscriptions.length === 0 ? (<tr><td colSpan={7} className="text-center py-8 text-gray-500">{t('admin.noSubscriptions')}</td></tr>)
                    : filteredSubscriptions.map((sub) => (
                      <tr key={sub._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3"><div className="font-medium text-gray-900">{sub.user?.name || "N/A"}</div><div className="text-xs text-gray-500">{sub.user?.email || "N/A"}</div></td>
                        <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{sub.plan}</Badge></td>
                        <td className="px-4 py-3">{getStatusBadge(sub.status)}</td>
                        <td className="px-4 py-3 text-gray-700">{formatDate(sub.createdAt)}</td>
                        <td className="px-4 py-3 text-gray-700">{formatDate(sub.endDate)}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{getPlanAmount(sub.plan)}</td>
                        <td className="px-4 py-3">
                          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(sub.user?._id)}>{t('admin.viewDetails')}</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenEditModal(sub)}>{t('admin.editSubscription')}</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleCancelSubscription(sub.user?._id)}>{t('admin.cancelSubscription')}</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('admin.editTitle')}</DialogTitle>
            <DialogDescription>{t('admin.editDesc', { name: editingSubscription?.user?.name || '' })}</DialogDescription>
          </DialogHeader>
          {editError && (<Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{editError}</AlertDescription></Alert>)}
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>{t('admin.plan')}</Label><Select value={editForm.plan} onValueChange={(v) => setEditForm(p => ({ ...p, plan: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="free">Free</SelectItem><SelectItem value="pro">Pro</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>{t('admin.status')}</Label><Select value={editForm.status} onValueChange={(v) => setEditForm(p => ({ ...p, status: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">{t('admin.active')}</SelectItem><SelectItem value="cancelled">{t('admin.cancelled')}</SelectItem><SelectItem value="expired">{t('admin.expired')}</SelectItem></SelectContent></Select></div>
            <div className="bg-gray-50 p-3 rounded-md space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">{t('admin.user')}:</span><span className="font-medium">{editingSubscription?.user?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">{t('profile.emailLabel')}:</span><span className="font-medium">{editingSubscription?.user?.email}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">{t('admin.currentPlan')}:</span><Badge variant="outline" className="capitalize">{editingSubscription?.plan}</Badge></div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCloseEditModal} disabled={editLoading}>{t('common.cancel')}</Button>
            <Button onClick={handleSaveEdit} disabled={editLoading}>{editLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('admin.saving')}</>) : t('admin.saveChanges')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
