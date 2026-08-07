export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // آدرس Realtime Database شما
  const firebaseUrl = `https://progem-945c3-default-rtdb.firebaseio.com/submissions.json`;

  try {
    const response = await fetch(firebaseUrl);

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(500).json({ success: false, error: errorData });
    }

    const data = await response.json();
    
    // تبدیل شیء فایربیس به آرایه‌ای از داده‌ها
    const submissions = [];
    if (data) {
      Object.keys(data).forEach((key) => {
        submissions.push({
          id: key,
          ...data[key]
        });
      });
      // مرتب‌سازی بر اساس جدیدترین درخواست‌ها
      submissions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }

    return res.status(200).json({ success: true, submissions });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
