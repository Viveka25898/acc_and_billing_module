const normalizeDate = (dateStr) => {
  if (!dateStr) return null;
  
  // Handle different date formats
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  
  // Return in YYYY-MM-DD format
  return date.toISOString().split('T')[0];
};

const normalizeAmount = (amount) => {
  if (!amount) return 0;
  return Math.abs(Number(amount.toString().replace(/,/g, '')));
};

const normalizeDescription = (desc) => {
  if (!desc) return '';
  return desc.toString().toLowerCase().trim();
};

const calculateMatchScore = (bankEntry, bookEntry) => {
  let score = 0;
  
  // Date match (40 points)
  const bankDate = normalizeDate(bankEntry.date);
  const bookDate = normalizeDate(bookEntry.date);
  
  if (bankDate && bookDate) {
    if (bankDate === bookDate) {
      score += 40;
    } else {
      // Allow for close dates (within 3 days) with reduced score
      const daysDiff = Math.abs(new Date(bankDate) - new Date(bookDate)) / (1000 * 60 * 60 * 24);
      if (daysDiff <= 3) {
        score += Math.max(20, 40 - (daysDiff * 5));
      }
    }
  }
  
  // Amount match (50 points)
  const bankAmount = normalizeAmount(bankEntry.amount);
  const bookAmount = normalizeAmount(bookEntry.amount);
  
  if (bankAmount > 0 && bookAmount > 0) {
    if (bankAmount === bookAmount) {
      score += 50;
    } else {
      // Allow small differences (up to 1% or 100 rupees, whichever is smaller)
      const difference = Math.abs(bankAmount - bookAmount);
      const tolerance = Math.min(Math.max(bankAmount, bookAmount) * 0.01, 100);
      
      if (difference <= tolerance) {
        score += 30;
      }
    }
  }
  
  // Description/Reference similarity (10 points)
  const bankDesc = normalizeDescription(bankEntry.description);
  const bookDesc = normalizeDescription(bookEntry.description);
  const bankRef = normalizeDescription(bankEntry.reference || '');
  const bookRef = normalizeDescription(bookEntry.reference || '');
  
  // Check if descriptions contain similar keywords
  const bankWords = bankDesc.split(/\s+/).filter(w => w.length > 2);
  const bookWords = bookDesc.split(/\s+/).filter(w => w.length > 2);
  
  let commonWords = 0;
  bankWords.forEach(bankWord => {
    if (bookWords.some(bookWord => 
        bookWord.includes(bankWord) || bankWord.includes(bookWord)
    )) {
      commonWords++;
    }
  });
  
  if (commonWords > 0) {
    score += Math.min(10, commonWords * 3);
  }
  
  // Reference match bonus
  if (bankRef && bookRef && (bankRef === bookRef || bankRef.includes(bookRef) || bookRef.includes(bankRef))) {
    score += 15;
  }
  
  return score;
};

export const matchTransactions = (bankData, bookData) => {
  console.log('Starting transaction matching...');
  console.log('Bank data:', bankData);
  console.log('Book data:', bookData);
  
  if (!Array.isArray(bankData) || !Array.isArray(bookData)) {
    console.error('Invalid input data for matching');
    return [];
  }
  
  const matchedResults = [];
  const matchedBookIndices = new Set();
  const matchedBankIndices = new Set();
  
  // First pass: Find high-confidence matches (score >= 70)
  bankData.forEach((bankEntry, bankIndex) => {
    if (matchedBankIndices.has(bankIndex)) return;
    
    let bestMatch = null;
    let bestScore = 0;
    let bestBookIndex = -1;
    
    bookData.forEach((bookEntry, bookIndex) => {
      if (matchedBookIndices.has(bookIndex)) return;
      
      const score = calculateMatchScore(bankEntry, bookEntry);
      
      if (score > bestScore && score >= 70) {
        bestMatch = bookEntry;
        bestScore = score;
        bestBookIndex = bookIndex;
      }
    });
    
    if (bestMatch && bestScore >= 70) {
      matchedResults.push({
        id: `match_${bankIndex}_${bestBookIndex}`,
        date: bankEntry.date,
        amount: bankEntry.amount,
        description: bankEntry.description,
        reference: bankEntry.reference || bestMatch.reference || '',
        inBank: true,
        inBooks: true,
        matchScore: bestScore,
        bankEntry: bankEntry,
        bookEntry: bestMatch
      });
      
      matchedBankIndices.add(bankIndex);
      matchedBookIndices.add(bestBookIndex);
      
      console.log(`High-confidence match found: Bank[${bankIndex}] <-> Book[${bestBookIndex}] (Score: ${bestScore})`);
    }
  });
  
  // Second pass: Add unmatched bank entries (only in bank)
  bankData.forEach((bankEntry, bankIndex) => {
    if (matchedBankIndices.has(bankIndex)) return;
    
    matchedResults.push({
      id: `bank_only_${bankIndex}`,
      date: bankEntry.date,
      amount: bankEntry.amount,
      description: bankEntry.description,
      reference: bankEntry.reference || '',
      inBank: true,
      inBooks: false,
      matchScore: 0,
      bankEntry: bankEntry,
      bookEntry: null
    });
    
    console.log(`Unmatched bank entry: ${bankEntry.description} - ₹${bankEntry.amount}`);
  });
  
  // Third pass: Add unmatched book entries (only in books)
  bookData.forEach((bookEntry, bookIndex) => {
    if (matchedBookIndices.has(bookIndex)) return;
    
    matchedResults.push({
      id: `book_only_${bookIndex}`,
      date: bookEntry.date,
      amount: bookEntry.amount,
      description: bookEntry.description,
      reference: bookEntry.reference || '',
      inBank: false,
      inBooks: true,
      matchScore: 0,
      bankEntry: null,
      bookEntry: bookEntry
    });
    
    console.log(`Unmatched book entry: ${bookEntry.description} - ₹${bookEntry.amount}`);
  });
  
  // Sort results by date
  matchedResults.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  console.log('Matching completed. Results:', matchedResults);
  console.log(`Summary: ${matchedResults.filter(r => r.inBank && r.inBooks).length} matched, ${matchedResults.filter(r => r.inBank && !r.inBooks).length} only in bank, ${matchedResults.filter(r => !r.inBank && r.inBooks).length} only in books`);
  
  return matchedResults;
};