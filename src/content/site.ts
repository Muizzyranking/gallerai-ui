export const site = {
  name: "GallerAI",
  tagline: "Every guest finds their photos.",
  contactEmail: "hello@gallerai.events",
  supportEmail: "support@gallerai.events",
  privacyEmail: "privacy@gallerai.events",
};

export const nav = {
  primary: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Events", href: "/#events" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
  ],
  secondary: [
    { label: "Sign in", href: "/login" },
    { label: "Create event", href: "/register" },
  ],
};

export const hero = {
  kicker: "For weddings, graduations, concerts and more",
  headlineA: "Your event photos,",
  headlineB: "found in seconds.",
  lede: "Photos land in one shared gallery from every angle. Each person takes a quick selfie and instantly sees every photo they appear in. No scrolling, no shared drives, no missing memories.",
  primaryCta: { label: "Create your event", href: "/register" },
  secondaryCta: { label: "See how it works", href: "/#how-it-works" },
};

export const galleryStrip = {
  kicker: "Real events, real galleries",
  heading: "One gallery for the whole celebration",
  body: "From first dance to final Encore, every angle lands in one place. Guests see the full story and keep only the moments that include them.",
  images: [
    {
      src: "/images/wedding-2.jpg",
      alt: "Wedding couple dancing while guests celebrate",
      caption: "Weddings",
    },
    {
      src: "/images/graduation.jpg",
      alt: "Graduates throwing caps in the air",
      caption: "Graduations",
    },
    {
      src: "/images/concert-festival.jpg",
      alt: "Concert crowd with stage lights",
      caption: "Concerts",
    },
    {
      src: "/images/birthday-party.jpg",
      alt: "Friends celebrating at a party with confetti",
      caption: "Parties",
    },
    {
      src: "/images/conference.jpg",
      alt: "Speaker on stage at a professional conference",
      caption: "Conferences",
    },
    {
      src: "/images/talk-show.jpg",
      alt: "Talk show style stage with audience",
      caption: "Talk shows",
    },
  ],
};

export const howItWorks = {
  kicker: "How it works",
  heading: "Three steps, zero photo hunts",
  body: "Set up the gallery in minutes, fill it from every angle, and let each guest find themselves with one selfie.",
  steps: [
    {
      n: "01",
      title: "Create the event",
      body: "Name your event, set the date, and share one link or QR code. Add an optional access code when the guest list should stay closed.",
      image: "/images/create-event.webp",
      imageAlt: "Decorated event venue ready for guests",
    },
    {
      n: "02",
      title: "Add photos",
      body: "Photos are added from every angle until the whole story sits in one gallery. A single link or QR code brings everyone's shots together.",
      image: "/images/find-images.jpg",
      imageAlt: "Friends taking photos together at an event",
    },
    {
      n: "03",
      title: "Guests find their images",
      body: "Each attendee takes a quick selfie. GallerAI surfaces every group shot and candid they appear in, ready to download.",
      image: "/images/wedding.jpg",
      imageAlt: "Bride smiling with friends at wedding",
    },
  ],
  privacyNote:
    "Galleries are unlisted and never in public search. Add an optional access code so having the link alone is not enough. Off by default, on whenever you want it.",
};

export const useCases = {
  kicker: "Made for every kind of gathering",
  heading: "If people gather, GallerAI fits",
  body: "Formal or loud, intimate or arena-size. Each event type gets its own gallery style and guest flow.",
  cards: [
    {
      title: "Weddings",
      body: "Ceremony, reception and after-party in one gallery. Families find themselves without asking the photographer.",
      image: "/images/wedding-image.png",
      imageAlt: "Wedding couple holding hands",
    },
    {
      title: "Graduations",
      body: "Stage walks, family portraits and class parties. Every graduate keeps their own highlight reel.",
      image: "/images/graduations.webp",
      imageAlt: "Graduates in gowns celebrating",
    },
    {
      title: "Concerts & festivals",
      body: "Crowd shots, stage moments and fan uploads combined. Attendees pull their night out of thousands of frames.",
      image: "/images/concert.jpg",
      imageAlt: "Festival crowd at sunset",
    },
    {
      title: "Birthdays & parties",
      body: "Candid chaos, organised instantly. Hosts stop playing photographer and guests keep the shots they are in.",
      image: "/images/birthday.jpg",
      imageAlt: "Birthday party with balloons",
    },
    {
      title: "Conferences & talk shows",
      body: "Keynotes, panels and networking, searchable by face. Speakers and sponsors get their coverage fast.",
      image: "/images/conference.webp",
      imageAlt: "Conference audience seated",
    },
    {
      title: "Corporate & team events",
      body: "Retreats, launches and holiday parties with controlled sharing. Downloads respect your permissions.",
      image: "/images/corporate.jpg",
      imageAlt: "Team celebrating at corporate event",
    },
  ],
};

export const features = {
  kicker: "Why organisers switch",
  heading: "Less scrolling, more celebrating",
  items: [
    {
      title: "Selfie search",
      body: "Guests take one selfie and see every photo they appear in. No scrolling through thousands of shots to find themselves.",
    },
    {
      title: "One gallery for everything",
      body: "The full set plus phone shots land in one place. No scattered drives, no chat threads, no missing angles.",
    },
    {
      title: "Organiser controls",
      body: "Approve uploads, toggle downloads, hide the gallery until the highlight edit is ready.",
    },
    {
      title: "Private when you need it",
      body: "Galleries are unlisted and never appear in public search. Add an optional access code so the link alone is not enough. Face data is used only inside your event and can be deleted anytime.",
    },
  ],
};

export const pricing = {
  kicker: "Pricing",
  heading: "Pay per event, not per headache",
  body: "Start free. Upgrade when the guest list grows or you need full-resolution downloads.",
  plans: [
    {
      name: "Taster",
      price: "Free",
      per: "1 event · 100 photos",
      body: "Try GallerAI at a small gathering.",
      cta: { label: "Start free", href: "/register" },
      points: ["1 event gallery", "100 photos", "Guest uploads via link", "Selfie search", "Standard downloads"],
    },
    {
      name: "Celebration",
      price: "$29",
      per: "per event · 2,000 photos",
      body: "For weddings, graduations and big parties.",
      cta: { label: "Create event", href: "/register" },
      featured: true,
      points: [
        "Everything in Taster",
        "2,000 photos",
        "Full-resolution downloads",
        "Upload approval queue",
        "QR posters + gallery link",
        "30-day gallery hosting",
      ],
    },
    {
      name: "Production",
      price: "$89",
      per: "per event · 10,000 photos",
      body: "For festivals, conferences and pros.",
      cta: { label: "Talk to us", href: "/contact" },
      points: [
        "Everything in Celebration",
        "10,000 photos",
        "Multiple photographers",
        "Download permissions per role",
        "Extended 12-month hosting",
        "Priority support",
      ],
    },
  ],
  note: `Need something custom for a venue or a season of events? Write to ${site.contactEmail} and we will scope it.`,
  everyPlan: [
    { title: "Selfie search", body: "Every guest finds their own photos in seconds." },
    { title: "Guest uploads, your call", body: "Open contributions with an approval queue when you want them." },
    { title: "Unlisted galleries", body: "Share by link or QR. Optional access code for closed lists." },
    { title: "No card to start", body: "Try the free plan at a real event before paying anything." },
  ],
};

export const faqTeaser = {
  kicker: "Questions",
  heading: "Asked at every event",
  items: [
    {
      q: "Do guests need the app or an account?",
      a: "No. Guests open the gallery link, upload photos, and run a selfie search without installing anything or creating an account.",
    },
    {
      q: "How does the selfie search work?",
      a: "A guest takes a quick selfie. GallerAI compares it against photos in that event's gallery only, then shows matches for review and download.",
    },
    {
      q: "Who can see my event gallery?",
      a: "Only people with your gallery link or QR code. Galleries are unlisted and never appear in public search. For extra control, add an optional access code so the link alone is not enough.",
    },
    {
      q: "What happens to face data?",
      a: "Face data is used only to match photos inside your event. Organisers can delete an event and its data at any time from settings.",
    },
  ],
};

export const faqFull = [
  ...faqTeaser.items,
  {
    q: "Can the organiser approve uploads first?",
    a: "Yes. Turn on upload approval and new guest photos wait in a review queue before they appear in the public gallery.",
  },
  {
    q: "Can guests download photos?",
    a: "If downloads are enabled by the organiser. You can allow full-resolution downloads, previews only, or turn downloads off entirely.",
  },
  {
    q: "How long are galleries kept?",
    a: "Paid event galleries stay online for the period in your plan (30 days on Celebration, 12 months on Production). You can extend or export anytime.",
  },
  {
    q: "Does GallerAI work for professional photographers?",
    a: "Yes. Upload the full edited set, let guests self-serve their photos, and cut the back-and-forth of manual delivery.",
  },
];

export const finalCta = {
  heading: "Stop scrolling. Start celebrating.",
  body: "Create your event gallery in two minutes and give every guest their own highlight reel by the last dance.",
  primary: { label: "Create your event", href: "/register" },
  secondary: { label: "Contact us", href: "/contact" },
  image: "/images/party.jpg",
  imageAlt: "Guests celebrating with sparklers at an evening event",
};

export const footer = {
  tagline:
    "Event galleries where every guest finds their photos. Built for weddings, graduations, concerts, parties and professional events.",
  columns: [
    {
      heading: "Product",
      links: [
        { label: "How it works", href: "/#how-it-works" },
        { label: "Events", href: "/#events" },
        { label: "Pricing", href: "/pricing" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "Sign in", href: "/login" },
        { label: "Create event", href: "/register" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Cookies", href: "/cookies" },
        { label: "Data & faces", href: "/data" },
      ],
    },
  ],
  bottom: "© 2026 GallerAI. All rights reserved.",
};

export const compliance = {
  privacy: {
    title: "Privacy policy",
    updated: "Last updated: January 2026. Edit this date in src/content/site.ts.",
    intro:
      "GallerAI provides private event galleries. This page explains what we collect, why, and the choices you have. Edit every section below to match your legal advice before launch.",
    sections: [
      {
        h: "What we collect",
        p: "Account details you provide (name, email, password), event content (photos, titles, dates), guest uploads, and limited technical logs needed to run the service.",
      },
      {
        h: "Face data",
        p: "When a guest runs a selfie search, we compare that selfie against photos in the same event gallery only. Face data is never sold, never used for advertising, and never shared across events.",
      },
      {
        h: "How we use data",
        p: "To host galleries, match faces inside an event, prevent abuse, and provide support. We do not train third-party models on your photos.",
      },
      {
        h: "Sharing",
        p: "Galleries are unlisted and visible only to people with the link. We share data with infrastructure processors (hosting, storage, email) under contract, and when required by law.",
      },
      {
        h: "Retention and deletion",
        p: "Event data is kept for the hosting period in your plan. Organisers can delete an event and its photos and face data at any time from event settings.",
      },
      {
        h: "Your rights",
        p: `Request access, correction, export or deletion of your data at ${site.privacyEmail}. Guests can ask the organiser to remove their photos.`,
      },
      { h: "Contact", p: `Questions about this policy: ${site.privacyEmail}.` },
    ],
  },
  terms: {
    title: "Terms of service",
    updated: "Last updated: January 2026. Edit this date in src/content/site.ts.",
    intro:
      "These terms cover organisers, photographers and guests. Replace this draft with counsel-reviewed terms before launch.",
    sections: [
      {
        h: "The service",
        p: "GallerAI hosts private event photo galleries with guest uploads and face-based search inside each event.",
      },
      {
        h: "Your content",
        p: "You keep ownership of photos you upload. You grant GallerAI a licence to host and display them inside your event gallery as you configure it.",
      },
      {
        h: "Acceptable use",
        p: "Upload only photos you have the right to share. Do not upload unlawful content or attempt to access galleries you were not invited to.",
      },
      {
        h: "Guest uploads",
        p: "Organisers are responsible for their gallery settings, including whether uploads need approval and whether downloads are allowed.",
      },
      {
        h: "Plans and payment",
        p: "Free galleries include the limits shown on pricing. Paid events unlock the photo limits, hosting periods and download options in your plan.",
      },
      {
        h: "Suspension",
        p: "We may suspend galleries that violate these terms or applicable law, and we will notify the organiser where possible.",
      },
      { h: "Contact", p: `Legal questions: ${site.contactEmail}.` },
    ],
  },
  cookies: {
    title: "Cookie policy",
    updated: "Last updated: January 2026.",
    intro:
      "GallerAI uses a small set of cookies and local storage to keep you signed in and remember gallery preferences.",
    sections: [
      {
        h: "Strictly necessary",
        p: "Session and security cookies that keep authentication working. The site cannot function without these.",
      },
      {
        h: "Preferences",
        p: "Remembering gallery view (all photos vs my photos) and recent selfie-search tokens on the same device.",
      },
      {
        h: "Analytics (optional)",
        p: "If enabled, privacy-friendly page analytics with no cross-site tracking. You can block these and the site still works.",
      },
      {
        h: "Managing cookies",
        p: "Use your browser settings to clear or block cookies. Signing out clears the session cookie.",
      },
    ],
  },
  data: {
    title: "Faces and data",
    updated: "Last updated: January 2026.",
    intro: "Plain-language summary of how face matching works and how to remove your data.",
    sections: [
      {
        h: "One event at a time",
        p: "A selfie is compared only against photos in the gallery it was submitted to. There is no cross-event face database.",
      },
      {
        h: "Guest control",
        p: "Guests choose whether to run a selfie search. No search runs in the background and no account is required.",
      },
      {
        h: "Organiser control",
        p: "Organisers can disable selfie search, disable downloads, or delete the event and all associated face data.",
      },
      {
        h: "Deletion",
        p: `Delete an event from settings to remove its photos and face data. Write to ${site.privacyEmail} for help with guest removals.`,
      },
    ],
  },
};
