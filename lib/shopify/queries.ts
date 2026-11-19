export const getProductsQuery = `
  query getProducts($first: Int, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          id
          title
          handle
          reviewRating: metafield(namespace: "reviews", key: "rating") { value }
          reviewCount: metafield(namespace: "reviews", key: "rating_count") { value }
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      reviewRating: metafield(namespace: "reviews", key: "rating") { value }
      reviewCount: metafield(namespace: "reviews", key: "rating_count") { value }
      descriptionHtml
      description
      seo {
        title
        description
      }
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
          }
        }
      }
      composition: metafield(namespace: "custom", key: "composition") {
        value
      }
      ritual: metafield(namespace: "custom", key: "ritual") {
        value
      }
      sizing_note: metafield(namespace: "custom", key: "sizing_note") {
        value
      }
    }
  }
`;

export const getCollectionsQuery = `
  query getCollections($first: Int) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image { url altText }
        }
      }
    }
  }
`;

export const getCollectionQuery = `
  query getCollection($handle: String!, $first: Int) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image { url altText }
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            reviewRating: metafield(namespace: "reviews", key: "rating") { value }
            reviewCount: metafield(namespace: "reviews", key: "rating_count") { value }
            priceRange { maxVariantPrice { amount currencyCode } }
            featuredImage { url altText }
            images(first: 2) { edges { node { url altText } } }
          }
        }
      }
    }
  }
`;

export const getRecommendationsQuery = `
  query getRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      reviewRating: metafield(namespace: "reviews", key: "rating") { value }
      reviewCount: metafield(namespace: "reviews", key: "rating_count") { value }
      priceRange { maxVariantPrice { amount currencyCode } }
      featuredImage { url altText }
      images(first: 2) { edges { node { url altText } } }
    }
  }
`;

export const getShopPoliciesQuery = `
  query getShopPolicies {
    shop {
      privacyPolicy { title body }
      refundPolicy { title body }
      shippingPolicy { title body }
      termsOfService { title body }
    }
  }
`;


export const getGiftProductsQuery = `
  query getGiftProducts($first: Int) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          priceRange { maxVariantPrice { amount currencyCode } }
          featuredImage { url altText }
          images(first: 2) { edges { node { url altText } } }
          variants(first: 20) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount currencyCode }
              }
            }
          }
        }
      }
    }
  }
`;
