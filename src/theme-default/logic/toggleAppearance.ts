const APPEARANCE_KEY = 'appearance';

const classList = document.documentElement.classList;

const setClassList = (isDark = false) => {
  if (isDark) {
    classList.add('dark');
  } else {
    classList.remove('dark');
  }
};

const updateAppearance = () => {
  const userPreference = localStorage.getItem(APPEARANCE_KEY);
  setClassList(userPreference === 'dark');
};

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  updateAppearance();
  // 监听 storage 事件，在 localStorage 数据变更时重新读取本地数据，恢复状态即可。
  window.addEventListener('storage', updateAppearance);
}

export function toggle() {
  if (classList.contains('dark')) {
    setClassList(false);
    // 本地状态存储
    localStorage.setItem(APPEARANCE_KEY, 'light');
  } else {
    setClassList(true);
    // 本地状态存储
    localStorage.setItem(APPEARANCE_KEY, 'dark');
  }
}
