import MissionClient from "./MissionClient";
import "./styles.css";

// ✅ 정적 빌드 시 dynamic route 건너뛰기
export async function generateStaticParams() {
  return [];
}

export default function MissionDetailPage() {
  return <MissionClient />;
}
