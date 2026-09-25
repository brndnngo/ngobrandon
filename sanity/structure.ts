import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Case studies")
        .schemaType("caseStudy")
        .child(
          S.documentTypeList("caseStudy")
            .title("Case studies")
            .defaultOrdering([{ field: "orderRank", direction: "asc" }]),
        ),
    ]);
