import * as z from 'zod';
import { defineEmail } from '../send';
import { getDefaultTemplate } from '../templates';

export const welcomeEmail = defineEmail({
  id: 'welcome',
  subject: 'Chào mừng đến với MP Learning',
  schema: z.object({ name: z.string().min(1) }),
  render: () => {
    const content = `
      <p>Chào mừng bạn đến với cổng đào tạo nội bộ MP Transformation.</p>
      <p>Đăng nhập để xem các khóa học được giao, hoàn thành bài tập và theo dõi tiến độ học tập của mình.</p>
      <p>Nếu cần hỗ trợ, hãy liên hệ người phụ trách đào tạo trong công ty.</p>
    `;
    return getDefaultTemplate(content);
  }
});
