import { defineQuery } from "next-sanity";

const mediaFields = `
  alt,
  caption,
  fit,
  stroke,
  padding{ top, right, bottom, left },
  image,
  "width": image.asset->metadata.dimensions.width,
  "height": image.asset->metadata.dimensions.height,
  video{ asset->{ url } }
`;

const mediaProjection = `{${mediaFields}}`;

export const CASE_STUDIES_INDEX_QUERY = defineQuery(`
  *[_type == "caseStudy"] | order(orderRank asc) {
    _id,
    title,
    "slug": slug.current,
    accentColor,
    year,
    category,
    shortDescription,
    previewImage,
    "preview": hero.video.asset->url,
    featured,
    orderRank
  }
`);

export const CASE_STUDY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    timeline,
    role,
    collaborators[]{ name, title },
    hero${mediaProjection},
    accentColor,
    year,
    category,
    shortDescription,
    previewImage,
    featured,
    orderRank,
    body[]{
      ...,
      _type == "section" => {
        ...,
        body[]
      },
      _type == "mediaBlock" => {
        ...,
        ${mediaFields}
      },
      _type == "mediaGrid" => {
        ...,
        items[]{
          ...,
          ${mediaFields}
        }
      }
    }
  }
`);
