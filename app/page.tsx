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

  // All keywords from latest entry
  const keywords = latest?.slots ?? [];
  const activeSlots = keywords.length;
  const lastUpdate = latest?.date ?? '-';

  return (
    <div style={{ backgroundColor: '#0f0f0f', color: '#e5e5e5', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Title */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>
          쿠참 제빙기 슬롯 순위 대시보드
        </h1>

        {/* Slot Status Cards */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div style={{ background: '#1a1a1a', borderRadius: 12, padding: '1.25rem 1.5rem', minWidth: 180, border: '1px solid #2a2a2a' }}>
            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: 4 }}>사용 중인 슬롯</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#60a5fa' }}>{activeSlots}</div>
          </div>
          {keywords.map((slot) => (
            <div key={slot.keyword} style={{ background: '#1a1a1a', borderRadius: 12, padding: '1.25rem 1.5rem', minWidth: 180, border: '1px solid #2a2a2a' }}>
              <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: 4 }}>{slot.keyword}</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: slot.rank <= 30 ? '#34d399' : slot.rank <= 60 ? '#fbbf24' : '#f87171' }}>
                {slot.rank}위
              </div>
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
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>제품</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>키워드</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>순위</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>카테고리순위</th>
              </tr>
            </thead>
            <tbody>
              {sorted.flatMap((entry) =>
                entry.slots.map((slot, i) => (
                  <tr key={`${entry.date}-${slot.keyword}`} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>{i === 0 ? entry.date : ''}</td>
                    <td style={{ padding: '0.75rem 1rem', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {i === 0 ? entry.product : ''}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{slot.keyword}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: slot.rank <= 30 ? '#34d399' : slot.rank <= 60 ? '#fbbf24' : '#f87171' }}>
                      {slot.rank}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>{i === 0 ? entry.category_rank : ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Last Update */}
        <div style={{ textAlign: 'center', color: '#555', fontSize: '0.8rem', padding: '1rem 0' }}>
          마지막 업데이트: {lastUpdate}
        </div>
      </div>
    </div>
  );
}
