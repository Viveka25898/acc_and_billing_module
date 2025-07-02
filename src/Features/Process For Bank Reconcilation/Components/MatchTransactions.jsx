export function matchTransactions(bankEntries, bookEntries) {
  const records = [];

  // Add entries from bank and check if they exist in books
  bankEntries.forEach((bankEntry) => {
    const match = bookEntries.find((bookEntry) => {
      const amountMatch = bookEntry.amount === bankEntry.amount;
      const dateMatch = bookEntry.date === bankEntry.date;
      const descMatch = bookEntry.description
        .toLowerCase()
        .includes(bankEntry.description.toLowerCase().slice(0, 5));
      return amountMatch && dateMatch && descMatch;
    });

    if (match) {
      records.push({ ...bankEntry, inBooks: true, inBank: true });
    } else {
      records.push({ ...bankEntry, inBooks: false, inBank: true });
    }
  });

  // Now add unmatched book entries
  bookEntries.forEach((bookEntry) => {
    const alreadyMatched = records.find(
      (rec) =>
        rec.amount === bookEntry.amount &&
        rec.date === bookEntry.date &&
        rec.inBooks &&
        rec.inBank
    );
    if (!alreadyMatched) {
      records.push({ ...bookEntry, inBooks: true, inBank: false });
    }
  });

  return records;
}
