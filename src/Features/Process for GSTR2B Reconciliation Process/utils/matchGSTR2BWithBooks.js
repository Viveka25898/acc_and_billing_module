export function matchGSTR2BWithBooks(gstr2b, books) {
  const records = [];

  gstr2b.forEach((entry) => {
    const match = books.find(
      (b) =>
        b.invoiceNo === entry.invoiceNo &&
        b.gstin === entry.gstin &&
        b.amount === entry.amount
    );
    if (match) {
      records.push({ ...entry, inBooks: true, inGSTR2B: true });
    } else {
      records.push({ ...entry, inBooks: false, inGSTR2B: true });
    }
  });

  books.forEach((b) => {
    const matched = records.find(
      (r) =>
        r.invoiceNo === b.invoiceNo &&
        r.gstin === b.gstin &&
        r.amount === b.amount &&
        r.inBooks
    );
    if (!matched) {
      records.push({ ...b, inBooks: true, inGSTR2B: false });
    }
  });

  return records;
}
