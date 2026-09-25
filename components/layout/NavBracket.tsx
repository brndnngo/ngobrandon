import { Bracket } from "@/components/layout/Bracket";

export function NavBracket() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-(--nav-height) z-40">
      <div className="page-grid">
        <div className="col-span-full">
          <Bracket orientation="down" />
        </div>
      </div>
    </div>
  );
}
