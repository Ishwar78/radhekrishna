import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Download } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  orderId: string;
  transactionId: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
  description?: string;
}

const AdminTransactionManagement = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, transactions]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/admin/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    if (!searchTerm) {
      setFilteredTransactions(transactions);
      return;
    }

    const search = searchTerm.toLowerCase();
    const filtered = transactions.filter(
      (transaction) =>
        transaction.userId.name.toLowerCase().includes(search) ||
        transaction.userId.email.toLowerCase().includes(search) ||
        transaction.transactionId.toLowerCase().includes(search) ||
        transaction.orderId.toLowerCase().includes(search)
    );
    setFilteredTransactions(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const calculateTotalRevenue = () => {
    return filteredTransactions
      .filter(t => t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'success' || t.status?.toLowerCase() === 'paid')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'User Name', 'Transaction ID', 'Amount', 'Status', 'Payment Method'];
    const data = filteredTransactions.map(t => [
      format(new Date(t.createdAt), 'dd/MM/yyyy HH:mm'),
      t.userId.name,
      t.transactionId,
      `₹${t.amount?.toFixed(2) || '0.00'}`,
      t.status,
      t.paymentMethod || 'N/A'
    ]);

    const csv = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: 'Success',
      description: 'Transactions exported successfully',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transaction Management</h2>
          <p className="text-muted-foreground">View and manage all transactions</p>
        </div>
        <Button onClick={exportToCSV} disabled={filteredTransactions.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {transactions.filter(t => t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'success' || t.status?.toLowerCase() === 'paid').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Completed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {transactions.filter(t => t.status?.toLowerCase() === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{calculateTotalRevenue().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">From successful transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Search className="h-5 w-5 text-muted-foreground mt-2.5" />
            <Input
              placeholder="Search by name, email, transaction ID, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading transactions...</span>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        {format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell className="font-medium">{transaction.userId.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {transaction.userId.email}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {transaction.transactionId}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {transaction.orderId}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{transaction.amount?.toFixed(2) || '0.00'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transaction.paymentMethod || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="border-t bg-card py-6 px-6 text-center text-sm text-muted-foreground">
        <div className="space-y-2">
          <p>© 2024 Vasstra Fashion. All rights reserved.</p>
          <p>Transaction Management System v1.0</p>
          <p className="text-xs">
            For support, contact: <a href="mailto:support@vasstra.com" className="text-primary hover:underline">support@vasstra.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminTransactionManagement;
