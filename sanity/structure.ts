import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Projects")
        .schemaType("project")
        .child(S.documentTypeList("project").title("Projects")),
    ]);
