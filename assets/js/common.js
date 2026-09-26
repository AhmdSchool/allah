// ============ التبويبات ============
const TABS = [
  { href: 'index.html', label: '🏠 الرئيسية', id: 'home' },
  { href: 'surahs.html', label: '📖 السور', id: 'surahs' },
  { href: 'quiz.html', label: '🎯 اختبارات', id: 'quiz' },
  { href: 'plans.html', label: '📋 خطتي', id: 'plans' },
  { href: 'order.html', label: '🔤 ترتيب', id: 'order' },
  { href: 'progress.html', label: '📊 تقدمي', id: 'progress' },
  { href: 'encyclopedia.html', label: '📚 موسوعة الحفاظ', id: 'encyclopedia' },
  { href: 'maps.html', label: '🗺️ خرائط القرآن', id: 'maps' }
];

// ============ الحالة العامة ============
let userData = { name: '', photo: '', registeredAt: '' };
let currentTheme = 'light';

// ============ أدوات ============
function safeSetText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function showToast(msg) { const t = document.getElementById('toast'); if (!t) return; t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2500); }

// ============ إنشاء التبويبات ============
function createTabs(activeId) {
  const container = document.getElementById('tabsContainer');
  if (!container) return;
  container.innerHTML = '';
  TABS.forEach(tab => {
    const a = document.createElement('a');
    a.href = tab.href;
    a.className = 'tab' + (tab.id === activeId ? ' active' : '');
    a.textContent = tab.label;
    container.appendChild(a);
  });
}

// ============ تبديل المظهر ============
function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.classList.toggle('dark-mode', currentTheme === 'dark');
  try { localStorage.setItem('quran_theme', currentTheme); } catch(e) {}
  const btn = document.querySelector('.fab-theme');
  if (btn) btn.firstChild.nodeValue = currentTheme === 'dark' ? '☀️' : '🌙';
  showToast(currentTheme === 'dark' ? '🌙 المظهر الليلي' : '☀️ المظهر النهاري');
}

// ============ تسجيل المستخدم ============
function loadUserData() {
  try { const s = localStorage.getItem('quran_user'); if (s) userData = JSON.parse(s); } catch(e) {}
}
function saveUserDataToStorage() { try { localStorage.setItem('quran_user', JSON.stringify(userData)); } catch(e) {} }

function openRegisterModal() {
  const regName = document.getElementById('regName');
  if (regName) regName.value = userData.name || '';
  const modalAvatar = document.getElementById('modalAvatar');
  if (modalAvatar) {
    if (userData.photo) modalAvatar.innerHTML = `<img src="${userData.photo}" alt="">`;
    else modalAvatar.textContent = '👤';
  }
  const modal = document.getElementById('registerModal');
  if (modal) modal.classList.add('show');
}
function closeRegisterModal() {
  const modal = document.getElementById('registerModal');
  if (modal) modal.classList.remove('show');
}
function saveUserData() {
  const name = document.getElementById('regName')?.value.trim();
  if (!name) { showToast('⚠️ اكتب اسمك'); return; }
  userData.name = name;
  if (!userData.registeredAt) userData.registeredAt = new Date().toLocaleString('ar-EG', { dateStyle: 'long', timeStyle: 'short' });
  saveUserDataToStorage();
  closeRegisterModal();
  showToast('✅ تم حفظ بياناتك');
}

// رفع الصورة
function setupPhotoUpload() {
  const input = document.getElementById('regPhoto');
  if (!input) return;
  input.addEventListener('change', function(e) {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max = 300;
        let { width: w, height: h } = img;
        if (w > h) { if (w > max) { h = h * max / w; w = max; } }
        else { if (h > max) { w = w * max / h; h = max; } }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        userData.photo = canvas.toDataURL('image/jpeg', 0.8);
        const modalAvatar = document.getElementById('modalAvatar');
        if (modalAvatar) modalAvatar.innerHTML = `<img src="${userData.photo}" alt="">`;
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(f);
  });
}

// ============ التهيئة ============
function initCommon(activeId) {
  // تحميل المظهر
  try {
    const savedTheme = localStorage.getItem('quran_theme');
    if (savedTheme === 'dark') {
      currentTheme = 'dark';
      document.body.classList.add('dark-mode');
    }
  } catch(e) {}
  const btn = document.querySelector('.fab-theme');
  if (btn) btn.firstChild.nodeValue = currentTheme === 'dark' ? '☀️' : '🌙';

  // تحميل بيانات المستخدم
  loadUserData();
  setupPhotoUpload();

  // إنشاء التبويبات
  createTabs(activeId);
}
