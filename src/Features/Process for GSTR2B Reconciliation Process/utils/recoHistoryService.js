const STORAGE_KEY = "gstr2b_reco_history";

export function saveRecoToHistory(record) {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  history.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getRecoHistory() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function getRecoById(id) {
  const history = getRecoHistory();
  return history.find((r) => r.id === id);
}
