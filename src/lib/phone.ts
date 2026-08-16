// 电话号码解析：phone 字段常写成「主号 / 副号」或「主号（说明）」，
// 直接把整串数字拼进 tel: 会拨出错号（说明里的分机号、营业时间都会被吞进去）。
// 这里只取第一个完整的日本号码，中英两套详情页与卡片共用。

// 日本固话/手机：0 开头、三段、连字符分隔
const JP_TEL_RE = /0\d{1,4}-\d{1,4}-\d{3,4}/;

/**
 * 取出可直接拨打的号码（纯数字，无连字符）。
 * 解析不到合法号码时返回 null —— 例如「官网预约」或占位的 03-3342-XXXX。
 */
export function primaryTel(phone?: string): string | null {
  const m = (phone || '').match(JP_TEL_RE);
  if (!m) return null;
  const digits = m[0].replace(/-/g, '');
  // 日本号码去掉连字符后为 10 位（固话）或 11 位（手机 070/080/090）
  return digits.length === 10 || digits.length === 11 ? digits : null;
}
