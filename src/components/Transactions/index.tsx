import { useCallback, useEffect, useState } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()

  const [approvedStatus, setApprovedStatus] = useState<{ [key: string]: boolean }>({})
  const [selected, setSelected] = useState<{ selectedId: string | null; approved: boolean }[]>([])

  useEffect(() => {
    // Initialize the approved status dictionary when transactions are first loaded
    if (transactions) {
      const initialStatus: { [key: string]: boolean } = {}
      transactions.forEach((transaction) => {
        initialStatus[transaction.id] = transaction.approved || false
      })
      setApprovedStatus(initialStatus)
    }
  }, [transactions])

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })

      // Update the approved status in the dictionary
      setApprovedStatus((prevStatus) => ({
        ...prevStatus,
        [transactionId]: newValue,
      }))

      const filtered = selected.filter((t) => t.selectedId === transactionId)

      if (filtered.length === 0) {
        setSelected((prev) => [...prev, { selectedId: transactionId, approved: newValue }])
      } else {
        const all = selected.filter((t) => t.selectedId !== transactionId)
        const comb = [...all, { selectedId: transactionId, approved: newValue }]
        setSelected(comb)
      }
    },
    [fetchWithoutCache, selected]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
          approved={approvedStatus[transaction.id]} // Pass the approved status
          selected={selected}
        />
      ))}
    </div>
  )
}
