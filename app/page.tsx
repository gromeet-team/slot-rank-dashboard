import fs from 'fs';
import path from 'path';
import RankChart from './components/RankChart';

interface SlotEntry {
  keyword: string;
  rank: number;
  page: number;
  page_rank: number;
}

interface RankEntry {
  date: string;
  product: string;
  slot_name?: string;
  slot_count?: number;
  slot_expiry?: string;
  category_rank: number;
  slots: SlotEntry[];
}

export default function Home() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'rank_history.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data: RankEntry[] = JSON.parse(raw);

  // Sort by date descending
  const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];

  // Slot info from latest entry
  const keywords = latest?.slots ?? [];
  const slotName = latest?.slot_name ?? '-';
  const slotCount = latest?.slot_count ?? keywords.length;
  const slotExpiry = latest?.slot_expiry ?? '-';
  const lastUpdate = latest?.date ?? '-';

  // Days remaining until expiry
  let daysLeft: number | null = null;
  if (latest?.slot_expiry) {
    const expDate = new Date(latest.slot_expiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    daysLeft = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <div style={{ backgroundColor: '#0f0f0f', color: '#e5e5e5', minHeight: '100vh', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Title */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
          쿠참 제빙기 슬롯 순위 대시보드
        </h1>
        <div style={{ color: '#555', fontSize: '0.85rem', marginBottom: '2rem' }}>마지막 업데이트: {lastUpdate}</div>

        {/* Slot Info Cards */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {/* Slot Name */}
          <div style={{ background: '#1a1a1a', borderRadius: 12, padding: '1.25rem 1.5rem', minWidth: 160, border: '1px solid #2a2a2a' }}>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 6 }}>슬롯 유형</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#a78bfa' }}>{slotName}</div>
          </div>
          {/* Slot Count */}
          <div style={{ background: '#1a1a1a', borderRadius: 12, padding: '1.25rem 1.5rem', minWidth: 160, border: '1px solid #2a2a2a' }}>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 6 }}>사용 슬롯 수</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#60a5fa' }}>{slotCount}개</div>
          </div>
          {/* Expiry */}
          <div style={{ background: '#1a1a1a', borderRadius: 12, padding: '1.25rem 1.5rem', minWidth: 160, border: '1px solid #2a2a2a' }}>
            <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 6 }}>만료일</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: daysLeft !== null && daysLeft <= 7 ? '#f87171' : '#fbbf24' }}>
              {slotExpiry}
            </div>
            {daysLeft !== null && (
              <div style={{ fontSize: '0.8rem', color: daysLeft <= 7 ? '#f87171' : '#888', marginTop: 4 }}>
                {daysLeft > 0 ? `D-${daysLeft}` : daysLeft === 0 ? '오늘 만료' : '만료됨'}
              </div>
            )}
          </div>
          {/* Keyword Ranks */}
          {keywords.map((slot) => (
            <div key={slot.keyword} style={{ background: '#1a1a1a', borderRadius: 12, padding: '1.25rem 1.5rem', minWidth: 160, border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: 6 }}>{slot.keyword}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: slot.rank <= 10 ? '#34d399' : slot.rank <= 30 ? '#60a5fa' : slot.rank <= 60 ? '#fbbf24' : '#f87171' }}>
                {slot.rank}위
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: 4 }}>{slot.page}페이지 {slot.page_rank}위</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: '#1a1a1a', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem', border: '1px solid #2a2a2a' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#ccc' }}>순위 추이</h2>
          <RankChart data={data} />
        </div>

        {/* History Table */}
        <div style={{ background: '#1a1a1a', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem', border: '1px solid #2a2a2a', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#ccc' }}>히스토리</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>날짜</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>슬롯</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>제품</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>키워드</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>순위</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>카테고리</th>
              </tr>
            </thead>
            <tbody>
              {sorted.flatMap((entry) =>
                entry.slots.map((slot, i) => (
                  <tr key={`${entry.date}-${slot.keyword}`} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem 1rem', color: '#aaa' }}>{i === 0 ? entry.date : ''}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#a78bfa', fontWeight: 600 }}>{i === 0 ? (entry.slot_name ?? '-') : ''}</td>
                    <td style={{ padding: '0.75rem 1rem', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#ccc' }}>
                      {i === 0 ? entry.product : ''}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{slot.keyword}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: slot.rank <= 10 ? '#34d399' : slot.rank <= 30 ? '#60a5fa' : slot.rank <= 60 ? '#fbbf24' : '#f87171' }}>
                      {slot.rank}위
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#888' }}>{i === 0 ? `${entry.category_rank}위` : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
