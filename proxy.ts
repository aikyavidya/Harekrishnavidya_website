import { NextRequest, NextResponse } from 'next/server';

// Define the routes that should NOT be redirected (your existing routes)
const EXCLUDED_ROUTES = [
  '/home',
  '/about-us',
  '/contact',
  '/sponsorships',
  '/donate',
  '/donation',
  '/career',
  '/urban', // Add this line to exclude /urban from redirect
  '/r/donations', // Special donation campaign route
  '/u/donations',
  '/rural',
  '/donate-to-cause',
  '/campaign-page',
  '/grocery-donation',
  '/donation-kit',

  '/blog',
  '/events',
  '/gallery',
  '/volunteer',
  '/governance',
  '/policies',
  '/terms-conditions',
  '/trust',
  '/refund',
  '/certificates',
  '/our-initiative',
  // donation
  '/build-school',
  '/grocery',
  ' general-support',
  "education-support-kit",
  "/grocery-checkout",
  "/support-compaign",
  // Neew Pages

  // media pages
  "/video-gallery",
  "/donor-wall",
  "/photo-gallery",

  '/api',
  '/dashboard',
  '/_next', // Next.js internal routes
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
  '/sw.js',
  '/workbox-*.js',
  '/static',
  '/images',
  '/public',
  '/assets',
  '/css',
  '/js',
  '/fonts',
  '/icons',
  '/logos',
  '/photos',
  '/photosOfEvents',
  '/GalleryImages',
  '/galleryection',
  '/blogs',
  '/ISKON.pdf',
  '/site.webmanifest',
  '/android-chrome-*.png',
  '/apple-touch-icon.png',
  '/favicon-*.png',
  '/file.svg',
  '/globe.svg',
  '/next.svg',
  '/vercel.svg',
  '/window.svg'
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle special donation campaigns FIRST (before excluded routes check)
  if (pathname === "/r/donations" || pathname === "/r/donations/") {
    // Only redirect if UTM parameters are not already present
    if (!request.nextUrl.searchParams.has("utm_source")) {
      const redirectUrl = new URL("/r/donations", request.url);
      redirectUrl.searchParams.set("utm_source", "AHB RURAL");
      redirectUrl.searchParams.set("utm_medium", "HUNDI");
      redirectUrl.searchParams.set("utm_campaign", "AHB003");
      return NextResponse.redirect(redirectUrl);
    }
    // If UTM parameters are already present, let the page handle it
    return NextResponse.next();
  }

  if (pathname === "/u/donations" || pathname === "/u/donations/") {
    // Only redirect if UTM parameters are not already present
    if (!request.nextUrl.searchParams.has("utm_source")) {
      const redirectUrl = new URL("/u/donations", request.url);
      redirectUrl.searchParams.set("utm_source", "HYD URBAN");
      redirectUrl.searchParams.set("utm_medium", "HUNDI");
      redirectUrl.searchParams.set("utm_campaign", "HYD004");
      return NextResponse.redirect(redirectUrl);
    }
    // If UTM parameters are already present, let the page handle it
    return NextResponse.next();
  }

  // Early return for special donation routes to prevent further processing
  if (pathname.startsWith("/r/donations") || pathname.startsWith("/u/donations")) {
    return NextResponse.next();
  }

  // Skip middleware for excluded routes
  if (EXCLUDED_ROUTES.some(route => {
    // Handle exact matches
    if (pathname === route) return true;

    // Handle routes that start with the excluded path
    if (route.endsWith('*') && pathname.startsWith(route.slice(0, -1))) return true;

    // Handle routes that should match the beginning of the path
    if (pathname.startsWith(route + '/')) return true;

    return false;
  })) {
    return NextResponse.next();
  }

  // Skip middleware for the home page itself
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Skip middleware for files with extensions (images, CSS, JS, etc.)
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // Extract the campaign name from the path (remove leading slash)
  const campaign = pathname.slice(1);

  // Create the redirect URL with UTM parameters
  const redirectUrl = new URL('/', request.url);
  redirectUrl.searchParams.set('utm_source', 'AIKYA');
  redirectUrl.searchParams.set('utm_medium', 'SMS');
  redirectUrl.searchParams.set('utm_campaign', campaign);

  // Perform the redirect
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
