import ArchiveClient from "./ArchiveClient";

// ✅ 정적 빌드 시 dynamic route 건너뛰기
export async function generateStaticParams() {
  return [];
}

export default function MyArchiveDetailsPage() {
  return <ArchiveClient />;
}

