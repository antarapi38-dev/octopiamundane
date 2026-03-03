export function getData(key, defaultValue) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

export function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}
