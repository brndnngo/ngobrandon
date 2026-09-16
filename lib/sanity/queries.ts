import { groq } from "next-sanity";

export const projectCardsQuery = groq`
  *[_type == "project"] | order(order asc) {
    "slug": slug.current,
    title,
    cardTitle,
    year,
    summary,
    gated,
    order,
    preview,
    thumbnail
  }
`;

export const projectHeroQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    "slug": slug.current,
    title,
    summary,
    impact,
    timeline,
    role,
    collaborators[]{ name, role },
    gated,
    thumbnail
  }
`;

export const projectBodyQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    body[]{
      ...,
      _type == "figure" => {
        ...,
        image
      },
      _type == "figureGrid" => {
        ...,
        figures[]{ ..., image }
      },
      _type == "videoBlock" => {
        ...,
        poster
      }
    }
  }
`;

export const publicProjectSlugsQuery = groq`
  *[_type == "project" && gated != true].slug.current
`;
