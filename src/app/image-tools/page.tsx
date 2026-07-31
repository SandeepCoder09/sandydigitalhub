import ToolsHubPage from "@/app/tools/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Tools Hub | Sandy Digital Hub",
  description: "Free browser-based tools: image compressor, PDF generator, QR code generator, word counter, password generator, passport photo maker & converter. 100% private.",
};

export default function ImageToolsPageRedirect() {
  return <ToolsHubPage />;
}
