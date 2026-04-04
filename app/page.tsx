import { Portfolio } from "@/components/Portfolio";
import { getMessages } from "@/lib/messages";

export default function EnglishHome() {
  return <Portfolio locale="en" messages={getMessages("en")} />;
}
