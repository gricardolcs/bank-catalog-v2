/** @type {import('@eventcatalog/core/bin/eventcatalog.config').Config} */
import path from 'node:path';

export default {
  title: 'ICBC Bank SA',
  tagline:
    'ICBC Bank SA infrastructure - testing Event Catalog with AsyncAPI generator plugin',
  organizationName: 'ICBC Bank SA',
  theme: {
    mode: 'dark',
  },
  homepageLink: 'https://eventcatalog.dev/',
  // Used to build the "Editar" links shown on /entidades and on each resource page.
  editUrl: 'https://github.com/gricardolcs/bank-catalog-v2/edit/main',
  // Supports static or server. Static renders a static site, server renders a server side rendered site
  // large catalogs may benefit from server side rendering
  output: 'static',
  // By default set to false, add true to get urls ending in /
  trailingSlash: false,
  // Change to make the base url of the site different, by default https://{website}.com/docs,
  // changing to /company would be https://{website}.com/company/docs,
  base: '/',
  // Resource search is the default lightweight search. Change this to { type: 'indexed' }
  // to enable full-content search. Indexed search requires running a build to generate the index.
  search: {
    type: 'indexed',
  },
  // Customize the navigation for your docs sidebar.
  // read more at https://eventcatalog.dev/docs/development/customization/customize-sidebars/documentation-sidebar
  navigation: {
    pages: ['list:top-level-domains', 'list:top-level-diagrams', 'list:all'],
  },
  mermaid: {
    enableSupportForElkLayout: true,
    iconPacks: ['logos'],
  },
  rss: {
    enabled: false,
    limit: 15,
  },
  visualiser: {
    enabled: true,
    channels: {
      renderMode: 'flat',
    },
    architectureGraph: {
      enabled: true,
    },
  },
  // Customize the logo, add your logo to public/ folder
  logo: {
    alt: 'ICBC Bank SA Logo',
    src: '/logo.png',
    text: 'ICBC Bank SA',
  },
  // This lets you copy markdown contents from EventCatalog to your clipboard
  // Including schemas for your events and services
  llmsTxt: {
    enabled: true,
  },
  // required random generated id used by eventcatalog
  cId: 'cbaf8b33-37b7-4fd9-91ec-b2d0d68cbc04',

  generators: [
    [
      '@eventcatalog/plugin-doc-generator-asyncapi',
      {
        // Ruta al archivo AsyncAPI
        pathToSpec: path.join(process.cwd(), 'asyncapi-specs', 'payment-processed.yaml'),
        // Opcional: Asignar a un dominio específico en EventCatalog
        domainName: 'ReservaDeVuelos',
      },
    ],
    [
      '@eventcatalog/plugin-doc-generator-asyncapi',
      {
        pathToSpec: path.join(process.cwd(), 'asyncapi-specs/payment-failed.yaml'),
        domainName: 'Pagos',
      },
    ],
  ],
};
