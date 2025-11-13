'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DollarSign, Check, X, Calendar, CreditCard, Save, Edit2 } from 'lucide-react'

interface PaymentData {
  payment_schedule: '60_30_10' | '50_50' | '100_upfront' | 'custom'
  estimated_cost: number
  deposit_amount: number
  deposit_paid: boolean
  deposit_paid_date: string | null
  deposit_payment_method: string | null
  progress_payment_amount: number
  progress_payment_paid: boolean
  progress_payment_paid_date: string | null
  progress_payment_method: string | null
  final_payment_amount: number
  final_payment_paid: boolean
  final_payment_paid_date: string | null
  final_payment_method: string | null
  total_paid: number
  balance_due: number
  payment_notes: string | null
}

interface Props {
  payments: PaymentData
  onSave: (data: Partial<PaymentData>) => Promise<void>
}

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'other', label: 'Other' }
]

export default function PaymentTracker({ payments, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editedPayments, setEditedPayments] = useState(payments)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not paid'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleScheduleChange = (schedule: PaymentData['payment_schedule']) => {
    const { estimated_cost } = editedPayments
    let deposit_amount = 0
    let progress_payment_amount = 0
    let final_payment_amount = 0

    switch (schedule) {
      case '60_30_10':
        deposit_amount = estimated_cost * 0.6
        progress_payment_amount = estimated_cost * 0.3
        final_payment_amount = estimated_cost * 0.1
        break
      case '50_50':
        deposit_amount = estimated_cost * 0.5
        progress_payment_amount = 0
        final_payment_amount = estimated_cost * 0.5
        break
      case '100_upfront':
        deposit_amount = estimated_cost
        progress_payment_amount = 0
        final_payment_amount = 0
        break
      case 'custom':
        // Keep current amounts when switching to custom
        break
    }

    setEditedPayments({
      ...editedPayments,
      payment_schedule: schedule,
      deposit_amount,
      progress_payment_amount,
      final_payment_amount
    })
  }

  const handleMarkPaid = async (paymentType: 'deposit' | 'progress' | 'final') => {
    const now = new Date().toISOString()
    const updates: Partial<PaymentData> = {}

    if (paymentType === 'deposit') {
      updates.deposit_paid = true
      updates.deposit_paid_date = now
    } else if (paymentType === 'progress') {
      updates.progress_payment_paid = true
      updates.progress_payment_paid_date = now
    } else {
      updates.final_payment_paid = true
      updates.final_payment_paid_date = now
    }

    // Calculate new totals
    const newPaid =
      (paymentType === 'deposit' || payments.deposit_paid ? payments.deposit_amount : 0) +
      (paymentType === 'progress' || payments.progress_payment_paid ? payments.progress_payment_amount : 0) +
      (paymentType === 'final' || payments.final_payment_paid ? payments.final_payment_amount : 0)

    updates.total_paid = newPaid
    updates.balance_due = payments.estimated_cost - newPaid

    setSaving(true)
    try {
      await onSave(updates)
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const total_paid =
        (editedPayments.deposit_paid ? editedPayments.deposit_amount : 0) +
        (editedPayments.progress_payment_paid ? editedPayments.progress_payment_amount : 0) +
        (editedPayments.final_payment_paid ? editedPayments.final_payment_amount : 0)

      await onSave({
        ...editedPayments,
        total_paid,
        balance_due: editedPayments.estimated_cost - total_paid
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedPayments(payments)
    setEditing(false)
  }

  if (!editing) {
    const depositPercent = (payments.deposit_amount / payments.estimated_cost * 100).toFixed(0)
    const progressPercent = (payments.progress_payment_amount / payments.estimated_cost * 100).toFixed(0)
    const finalPercent = (payments.final_payment_amount / payments.estimated_cost * 100).toFixed(0)

    return (
      <div className="border-b border-slate-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Payment Tracking</h3>
            <p className="text-sm text-slate-600 mt-1">
              Schedule: {payments.payment_schedule === '60_30_10' ? '60/30/10' :
                        payments.payment_schedule === '50_50' ? '50/50' :
                        payments.payment_schedule === '100_upfront' ? '100% Upfront' : 'Custom'}
            </p>
          </div>
          <Button
            onClick={() => setEditing(true)}
            size="sm"
            variant="outline"
            className="text-amber-600 border-amber-300 hover:bg-amber-50"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Payments
          </Button>
        </div>

        <div className="space-y-4">
          {/* Deposit Payment */}
          {payments.deposit_amount > 0 && (
            <div className={`p-4 rounded-lg border-2 ${
              payments.deposit_paid ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {payments.deposit_paid ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-slate-400" />
                  )}
                  <div>
                    <h4 className="font-semibold text-slate-900">Deposit ({depositPercent}%)</h4>
                    <p className="text-sm text-slate-600">{formatCurrency(payments.deposit_amount)}</p>
                  </div>
                </div>
                {!payments.deposit_paid && (
                  <Button
                    onClick={() => handleMarkPaid('deposit')}
                    size="sm"
                    disabled={saving}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Mark Paid
                  </Button>
                )}
              </div>
              {payments.deposit_paid && (
                <div className="mt-2 text-sm text-slate-600 flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(payments.deposit_paid_date)}
                  </span>
                  {payments.deposit_payment_method && (
                    <span className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-1" />
                      {PAYMENT_METHODS.find(m => m.value === payments.deposit_payment_method)?.label}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Progress Payment */}
          {payments.progress_payment_amount > 0 && (
            <div className={`p-4 rounded-lg border-2 ${
              payments.progress_payment_paid ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {payments.progress_payment_paid ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-slate-400" />
                  )}
                  <div>
                    <h4 className="font-semibold text-slate-900">Progress Payment ({progressPercent}%)</h4>
                    <p className="text-sm text-slate-600">{formatCurrency(payments.progress_payment_amount)}</p>
                  </div>
                </div>
                {!payments.progress_payment_paid && (
                  <Button
                    onClick={() => handleMarkPaid('progress')}
                    size="sm"
                    disabled={saving || !payments.deposit_paid}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Mark Paid
                  </Button>
                )}
              </div>
              {payments.progress_payment_paid && (
                <div className="mt-2 text-sm text-slate-600 flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(payments.progress_payment_paid_date)}
                  </span>
                  {payments.progress_payment_method && (
                    <span className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-1" />
                      {PAYMENT_METHODS.find(m => m.value === payments.progress_payment_method)?.label}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Final Payment */}
          {payments.final_payment_amount > 0 && (
            <div className={`p-4 rounded-lg border-2 ${
              payments.final_payment_paid ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {payments.final_payment_paid ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-slate-400" />
                  )}
                  <div>
                    <h4 className="font-semibold text-slate-900">Final Payment ({finalPercent}%)</h4>
                    <p className="text-sm text-slate-600">{formatCurrency(payments.final_payment_amount)}</p>
                  </div>
                </div>
                {!payments.final_payment_paid && (
                  <Button
                    onClick={() => handleMarkPaid('final')}
                    size="sm"
                    disabled={saving || (!payments.deposit_paid || (payments.progress_payment_amount > 0 && !payments.progress_payment_paid))}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Mark Paid
                  </Button>
                )}
              </div>
              {payments.final_payment_paid && (
                <div className="mt-2 text-sm text-slate-600 flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(payments.final_payment_paid_date)}
                  </span>
                  {payments.final_payment_method && (
                    <span className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-1" />
                      {PAYMENT_METHODS.find(m => m.value === payments.final_payment_method)?.label}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Summary */}
          <div className="pt-4 border-t-2 border-slate-300">
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-700">Total Paid</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(payments.total_paid)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-700">Balance Due</span>
              <span className={`text-lg font-bold ${payments.balance_due > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {formatCurrency(payments.balance_due)}
              </span>
            </div>
            {payments.balance_due === 0 && payments.estimated_cost > 0 && (
              <div className="mt-3 p-3 bg-green-100 rounded-lg text-center">
                <p className="text-green-800 font-semibold">✓ Fully Paid</p>
              </div>
            )}
          </div>

          {payments.payment_notes && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Notes:</strong> {payments.payment_notes}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Editing mode
  return (
    <div className="border-b border-slate-200 p-8 bg-amber-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Edit Payment Schedule</h3>
        <div className="flex gap-2">
          <Button
            onClick={handleCancel}
            size="sm"
            variant="outline"
            disabled={saving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            disabled={saving}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-lg">
        {/* Payment Schedule Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Payment Schedule</label>
          <select
            value={editedPayments.payment_schedule}
            onChange={(e) => handleScheduleChange(e.target.value as PaymentData['payment_schedule'])}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            <option value="60_30_10">60/30/10 (60% deposit, 30% progress, 10% final)</option>
            <option value="50_50">50/50 (50% deposit, 50% final)</option>
            <option value="100_upfront">100% Upfront (full payment before work)</option>
            <option value="custom">Custom Amounts</option>
          </select>
        </div>

        {/* Payment Amounts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Deposit Amount</label>
            <input
              type="number"
              value={editedPayments.deposit_amount}
              onChange={(e) => setEditedPayments({ ...editedPayments, deposit_amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              step="0.01"
              min="0"
              disabled={editedPayments.payment_schedule !== 'custom'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Progress Payment</label>
            <input
              type="number"
              value={editedPayments.progress_payment_amount}
              onChange={(e) => setEditedPayments({ ...editedPayments, progress_payment_amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              step="0.01"
              min="0"
              disabled={editedPayments.payment_schedule !== 'custom'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Final Payment</label>
            <input
              type="number"
              value={editedPayments.final_payment_amount}
              onChange={(e) => setEditedPayments({ ...editedPayments, final_payment_amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              step="0.01"
              min="0"
              disabled={editedPayments.payment_schedule !== 'custom'}
            />
          </div>
        </div>

        {/* Payment Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Payment Notes (Optional)</label>
          <textarea
            value={editedPayments.payment_notes || ''}
            onChange={(e) => setEditedPayments({ ...editedPayments, payment_notes: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            rows={3}
            placeholder="Add any notes about payment terms, special agreements, etc."
          />
        </div>
      </div>
    </div>
  )
}
