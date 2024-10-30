const footerItems = [
  {
    title: "Account",
    links: [
      { text: "Profile", url: "/profile" },
      { text: "List Events", url: "/events" },
      { text: "Tickets", url: "/my-tickets" },
      { text: "Interested", url: "/interested" },
    ],
  },
  {
    title: "Categories",
    links: [
      { text: "Entertainment", url: "/events?category=Entertainment" },
      {
        text: "Educational & Business",
        url: "/events?category=Educational & Business",
      },
      { text: "Arts & Culture", url: "/events?category=Arts & Culture" },
      { text: "Sports & Fitness", url: "/events?category=Sports & Fitness" },
      {
        text: "Technology & Innovation",
        url: "/events?category=Technology & Innovation",
      },
      { text: "Travel & Outdoor", url: "/events?category=Travel & Adventure" },
    ],
  },
];

export default footerItems;
