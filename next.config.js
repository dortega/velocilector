const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./next-intl.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'hhmkxybpgklelxspsqac.supabase.co', // Dominio de Supabase Storage
      'oaidalleapiprodscus.blob.core.windows.net' // Dominio de OpenAI (por si acaso)
    ],
  },
};

module.exports = withNextIntl(nextConfig); 