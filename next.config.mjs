/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },

  // Add the middleware to the list of server middleware
};

export default nextConfig;
