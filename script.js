const tableBody = document.getElementById('tableBody');
const submissionsTable = document.getElementById('submissionsTable');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const refreshBtn = document.getElementById('refreshBtn');

async function fetchSubmissions() {
  loadingDiv.style.display = 'block';
  submissionsTable.style.display = 'none';
  errorDiv.style.display = 'none';

  try {
    const response = await fetch('/api/get-submissions');
    const result = await response.json();

    if (result.success) {
      renderTable(result.submissions);
    } else {
      showError('خطا در دریافت اطلاعات از سرور.');
    }
  } catch (err) {
    showError('ارتباط با سرور برقرار نشد.');
  } finally {
    loadingDiv.style.display = 'none';
  }
}

function renderTable(submissions) {
  tableBody.innerHTML = '';

  if (!submissions || submissions.length === 0) {
    loadingDiv.innerText = 'هنوز هیچ اطلاعاتی ثبت نشده است.';
    loadingDiv.style.display = 'block';
    return;
  }

  submissions.forEach((item, index) => {
    const tr = document.createElement('tr');

    const u1 = item.usernames && item.usernames[0] ? item.usernames[0] : '-';
    const u2 = item.usernames && item.usernames[1] ? item.usernames[1] : '-';
    const u3 = item.usernames && item.usernames[2] ? item.usernames[2] : '-';
    const time = item.createdAt || '-';

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td><span class="username-tag">${escapeHtml(u1)}</span></td>
      <td><span class="username-tag">${escapeHtml(u2)}</span></td>
      <td><span class="username-tag">${escapeHtml(u3)}</span></td>
      <td dir="ltr" style="text-align: right;">${escapeHtml(time)}</td>
    `;

    tableBody.appendChild(tr);
  });

  submissionsTable.style.display = 'table';
}

function showError(msg) {
  errorDiv.innerText = msg;
  errorDiv.style.display = 'block';
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

refreshBtn.addEventListener('click', fetchSubmissions);

// بارگذاری اولیه لیست هنگام باز شدن صفحه
fetchSubmissions();
