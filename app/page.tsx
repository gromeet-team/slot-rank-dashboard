import fs from 'fs';
import path from 'path';
import Dashboard from './components/Dashboard';

interface SlotEntry {
  keyword: string;
  rank: number;
  page: number;
  page_rank: number;
}

interface RankEntry {
  date: string;
  brand?: string;
  product_id: string;
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

  return <Dashboard data={data} />;
}
