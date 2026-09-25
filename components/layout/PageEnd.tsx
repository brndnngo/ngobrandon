import { FooterRow } from "@/components/layout/FooterRow";
import { WordmarkFooter } from "@/components/layout/WordmarkFooter";

export function PageEnd() {
  return (
    <div className="info-end mt-auto">
      <FooterRow className="info-footer" />
      <WordmarkFooter />
    </div>
  );
}
