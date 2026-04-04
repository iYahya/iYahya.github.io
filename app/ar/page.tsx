import { Portfolio } from "@/components/Portfolio";
import { getMessages } from "@/lib/messages";

export default function ArabicHome() {
  return <Portfolio locale="ar" messages={getMessages("ar")} />;
}
