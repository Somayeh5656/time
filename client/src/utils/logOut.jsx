// utils/logout.js
export function handleLogout({ setLoggedIn, clearStores = [] }) {
  localStorage.removeItem("token");
  setLoggedIn(false);

  // Tyhjennä kaikki rekisteröidyt tilat
  clearStores.forEach(clearFn => clearFn());
}
