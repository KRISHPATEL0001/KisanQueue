export function formatCurrencyINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatQuintals(qtl: number): string {
  if (isNaN(qtl)) return '0.00 qtl';
  return `${Number(qtl).toFixed(2)} qtl`;
}

export function formatIndianDate(dateInput?: string | Date): string {
  if (!dateInput) return '';
  if (typeof dateInput === 'string' && /^\d{2}-\d{2}-\d{4}/.test(dateInput)) {
    return dateInput;
  }
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatTimestamp(dateInput?: string | Date): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${day}-${month}-${year} ${hour12}:${minutes} ${ampm}`;
}

export const formatIndianDateTime = formatTimestamp;

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 10) return phone;
  return `${phone.slice(0, 2)}••••••${phone.slice(-2)}`;
}

export function maskBankAccount(account: string): string {
  if (!account || account.length < 4) return '•••• 0000';
  return `•••• •••• ${account.slice(-4)}`;
}

export function generateBookingRef(cropCode: string): string {
  const code = (cropCode || 'CRP').toUpperCase().slice(0, 3);
  const num = Math.floor(1000 + Math.random() * 9000);
  return `KS-${code}-${num}`;
}

export function generateTokenNumber(counter: number): string {
  return `T-${String(counter).padStart(3, '0')}`;
}

export function generatePaymentRef(year = 2026): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `PAY-${year}-${num}`;
}

export function generateComplaintRef(year = 2026): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `CMP-${year}-${num}`;
}

export function generateFarmerRef(stateCode = 'MH', year = 2026): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `FRM-${stateCode}-${year}-${num}`;
}

export function formatTimeOnly(dateInput?: string | Date): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function generatePurchaseRef(year = 2026): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `PUR-${year}-${num}`;
}
