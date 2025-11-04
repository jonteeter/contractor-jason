'use client'

interface Customer {
  name: string
  address: string
  city: string
  state: string
}

interface ContractTemplateProps {
  customer: Customer
  introMessage: string
  workDescription: string
  estimatedCost: number
  estimatedDays: number | null
  startDate: string | null
  completionDate: string | null
}

export default function ContractTemplate({
  customer,
  introMessage,
  workDescription,
  estimatedCost,
  estimatedDays,
  startDate,
  completionDate
}: ContractTemplateProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'To be determined'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const downPayment = estimatedCost * 0.6
  const secondPayment = estimatedCost * 0.3
  const finalPayment = estimatedCost * 0.1

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="prose max-w-none">
        {/* Header with phone */}
        <div className="text-right mb-4">
          <p className="font-semibold">708-762-1003</p>
        </div>

        {/* Customer Info */}
        <p className="font-semibold">{customer.name}</p>
        <p>{customer.address}</p>
        <p>{customer.city}, {customer.state}</p>

        {/* Intro Message */}
        <p className="mt-6 italic whitespace-pre-line">{introMessage}</p>

        {/* Contract Title */}
        <h2 className="text-xl font-bold mt-8 mb-4">Contractor Agreement</h2>

        {/* Agreement Intro */}
        <p className="font-semibold">
          THIS AGREEMENT made by and between The Best Hardwood Flooring Co. hereinafter called the Contractor,
          and {customer.name}, hereinafter called the Owner.
        </p>

        <p className="mt-4">
          WITNESSETH that the Contractor and the Owner for the considerations named agree as follows:
        </p>

        {/* Article 1: Scope of Work */}
        <h3 className="font-semibold mt-6">Article 1. Scope of the Work</h3>
        <p>
          The Contractor shall furnish all of the materials and perform all of the work shown on the Drawings and/or
          described in the Specifications entitled Exhibit A, as annexed hereto as it pertains to work to be performed
          on property at {customer.address}, {customer.city}, {customer.state}.
        </p>

        {/* Article 2: Time of Completion */}
        <h3 className="font-semibold mt-6">Article 2. Time of Completion</h3>
        <p>
          The work to be performed under this Contract shall be commenced on or before{' '}
          <strong>{formatDate(startDate)}</strong>, and shall be substantially completed on or before{' '}
          <strong>{formatDate(completionDate)}</strong>. Time is of the essence.
          The following constitutes substantial completion of work pursuant to this proposal and contract: as indicated in Exhibit A.
        </p>

        {/* Article 3: Contract Price */}
        <h3 className="font-semibold mt-6">Article 3. The Contract Price</h3>
        <p>
          The Owner shall pay the Contractor for the material and labor to be performed under the Contract
          and charged as SEE Exhibit A, subject to additions and deductions pursuant to authorized change orders.
        </p>

        {/* Article 4: Progress Payments */}
        <h3 className="font-semibold mt-6">Article 4. Progress Payments</h3>
        <p>
          Payments of the Contract Price shall be paid in the manner following: As stated in Exhibit A
        </p>

        {/* Article 5: General Provisions */}
        <h3 className="font-semibold mt-6">Article 5. General Provisions</h3>
        <p>
          Any alteration or deviation from the above specifications, including but not limited to any such alteration or deviation involving additional material and/or labor costs, will be executed only upon a written order for same, signed by Owner and Contractor, and if there is any charge for such alteration or deviation, the additional charge will be added to the contract price of this Contract.
        </p>
        <p className="mt-4">
          If payment is not made when due, Contractor may suspend work on the job until such time as all payments due have been made. A failure to make payment for a period in excess of 2 days from the due date of the payment shall be deemed a material breach of this Contract.
        </p>
        <p className="mt-4">In addition, the following general provisions apply:</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>All work shall be completed in a workmanlike manner and in compliance with all building codes and other applicable laws.</li>
          <li>The Contractor shall furnish a description of the work to be done and description of the materials to be used and the equipment to be used or installed, and the agreed consideration for the work.</li>
          <li>To the extent required by law all work shall be performed by individuals duly licensed and authorized by law to perform said work.</li>
          <li>Contractor may at its discretion engage subcontractors to perform work hereunder, provided Contractor shall fully pay said subcontractor and in all instances remain responsible for the proper completion of this Contract.</li>
          <li>Contractor shall furnish Owner appropriate releases or waivers of lien for all work performed or materials provided at the time the next periodic payment shall be due.</li>
          <li>All change orders shall be in writing and signed both by Owner and Contractor, and shall be incorporated in, and become a part of the Contract.</li>
          <li>Owner shall at its own expense obtain all permits necessary for the work to be performed.</li>
          <li>Contractor agrees to leave the premises in broom clean condition and unless otherwise stated will leave garbage in 55 gallon bags on site.</li>
          <li>In the event Owner shall fail to pay any periodic or installment payment due hereunder, Contractor may cease work without breach pending payment or resolution of any dispute.</li>
          <li>All disputes hereunder shall be resolved by binding arbitration in accordance with rules of the American Arbitration Association.</li>
          <li>Contractor shall not be liable for any delay due to circumstances beyond its control including strikes, casualty or general unavailability of materials.</li>
          <li>Contractor warrants all work for a period of 12 months following completion.</li>
        </ul>

        {/* Article 6: Indemnification */}
        <h3 className="font-semibold mt-6">Article 6. Indemnification</h3>
        <p>
          To the fullest extent permitted by law, the Contractor shall indemnify, defend and hold harmless its agents and employees, from and against claims, damages, losses and expenses, including but not limited to attorney's fees, arising out of or resulting from performance of the work or providing of materials to the extent caused in whole or in part by negligent or wrongful acts or omissions of, or a breach of this agreement by, the Contractor, a subcontractor, anyone directly or indirectly employed by them or anyone whose acts they are legally responsible for.
        </p>

        {/* Article 7: Insurance */}
        <h3 className="font-semibold mt-6">Article 7. Insurance</h3>
        <p>
          The Contractor represents that it has purchased and agrees that it will keep in force for the duration of the performance of the work or for such longer term as may be required by this agreement, in a company or companies lawfully authorized to do business in the State of Illinois, such insurance as will protect owner from claims for loss or injury, which might arise out of or result from the Contractor's operations under this project, whether such operations be by the Contractor or by a subcontractor or its subcontractors.
        </p>
        <p className="mt-4">
          The Contractor represents and agrees that said insurance is written for and shall be maintained in an amount not less than the limits of the liability specified below or required by law, whichever coverage is greater. The Contractor certifies that coverage written on a "claims made" form will be maintained without interruption from the commencement of work until the expiration of all applicable statutes of limitation.
        </p>
        <p className="mt-4">
          Prior to commencement of work, the Contractor shall file with the appropriate authorities all Certificates of Insurance naming the owner/person hiring the Contractor as additional insured, in duplicate, and acceptable to all parties, which shall contain a provision that coverage under the policies shall not be canceled or allowed to expire or permit material changes until at least 10 days written notice has been given to additional insured.
        </p>

        {/* Article 8: Additional Terms */}
        <h3 className="font-semibold mt-6">Article 8. Additional Terms</h3>
        <p>
          Contract is not bound until contractor receives deposit. Flooring material should be delivered as early as possible allow for acclimation to site but no less than 48 hours prior to installation.
        </p>

        {/* Exhibit A - Scope of Work */}
        <div className="mt-8 p-6 bg-slate-50 rounded-lg border-2 border-slate-300">
          <h3 className="font-bold text-lg mb-4">Exhibit A - Scope of Work</h3>

          {workDescription ? (
            <div className="whitespace-pre-line text-sm mb-4">{workDescription}</div>
          ) : (
            <p className="text-sm text-slate-500 italic mb-4">
              No detailed work description provided. Please edit contract to add scope of work.
            </p>
          )}

          <div className="border-t border-slate-300 pt-4 mt-4">
            <p className="text-sm mb-4">
              All work will be done in a workmanlike manner and completed in a professional timely manner.
              The estimated completion time is <strong>{estimatedDays || '_____'}</strong> business days. Time is of the essence.
            </p>

            <p className="font-semibold mb-2">
              All Checks will be made payable to Jason Dixon or J. Dixon's Carpentry Services
            </p>

            <p className="font-bold text-lg text-amber-600 mb-2">
              Cost of the total project is {formatCurrency(estimatedCost)}
            </p>

            <p className="text-sm mb-4">
              Terms are 60% down ({formatCurrency(downPayment)}), 30% due upon completion of the second coat ({formatCurrency(secondPayment)}), and 10% due upon completion of the final coat ({formatCurrency(finalPayment)}).
            </p>

            <p className="text-sm mb-2">
              It is recommended that final coat be done after all other contractors are done.
            </p>

            <p className="font-semibold">
              The total cost for the above stated work is {formatCurrency(estimatedCost)}.
              All materials and labor quoted above are included. Any added work or material will be additional in cost.
            </p>
          </div>
        </div>

        {/* Signature Section */}
        <div className="mt-8 pt-8 border-t-2 border-slate-300">
          <p className="mb-8">Agreed this day of _______________________________,2025.</p>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="mb-2">____________________</p>
              <p className="font-semibold">Jason W Dixon</p>
              <p>708-762-1003</p>
            </div>
            <div>
              <p className="mb-2">_______________________</p>
              <p className="font-semibold">{customer.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
