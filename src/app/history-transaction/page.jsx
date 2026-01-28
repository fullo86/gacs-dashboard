"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-elements/button';
import { useRouter } from 'next/navigation';

export default function TransactionHistory() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]); 
  const [loading, setLoading] = useState(true);        
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('/api/transaction');
      setTransactions(response?.data);
      console.log(response.data,'sss')
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center py-6">Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No Transactions Found
                </TableCell>
              </TableRow>
            ) : (
              transactions?.data?.map((transaction) => (
                <TableRow key={transaction.id} className="border-[#eee] dark:border-dark-3">
                  <TableCell>{transaction.order_id}</TableCell>
                  <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                  <TableCell>Rp {transaction.gross_amount.toLocaleString("id-ID")}</TableCell>
                  <TableCell>{transaction.service}</TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        'max-w-fit rounded-full px-3.5 py-1 text-sm font-medium',
                        {
                          'bg-[#219653]/[0.08] text-[#219653]': transaction.status === 'active',
                          'bg-[#D34053]/[0.08] text-[#D34053]': transaction.status === 'inactive',
                          'bg-[#FFA70B]/[0.08] text-[#FFA70B]': transaction.status === 'pending',
                        }
                      )}
                    >
                      {transaction.status}
                    </div>
                  </TableCell>
                  <TableCell className="xl:pr-7.5">
                      <Button
                        label="Detail"
                        disabled={transaction.status == 'active'}
                        variant="outlineDark"
                        shape="rounded"
                        size="small"
                        onClick={ transaction.status != 'pending' ? () => router.push(`/checkout/${transaction.id}`) : () => router.push(`/checkout/status/${transaction.id}`)}
                      />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
