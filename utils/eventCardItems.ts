import eventimg from "../public/eventimg.png";

const eventCardItems = [
  {
    id: 1,
    title: "Summer Jazz Festival",
    image: eventimg,
    day: "Monday",
    date: "15 July 2024",
    time: "5:00 PM - 10:00 PM",
    description:
      "The Summer Jazz Festival is a celebration of the vibrant and soulful genre of jazz music, bringing together renowned artists from around the world to perform in an enchanting open-air venue. Immerse yourself in an evening filled with melodious tunes, improvisational solos, and the rhythmic beats that define jazz. This festival is not just a concert, but an experience that captures the essence of summer and the spirit of jazz.\n\n" +
      "Attendees will enjoy a diverse lineup of jazz musicians, from classic jazz bands to modern fusion groups. Each performance is carefully curated to provide a rich and varied auditory experience, ensuring that every attendee finds something that resonates with their musical taste. Alongside the music, the festival features gourmet food trucks, artisan vendors, and interactive workshops, making it a perfect outing for families, friends, and jazz enthusiasts alike.\n\n" +
      "Set against the backdrop of the city's picturesque riverside park, the Summer Jazz Festival offers more than just music. As the sun sets and the stars begin to twinkle, the ambiance becomes magical, creating an unforgettable night. Whether you're a longtime jazz aficionado or a newcomer to the genre, this festival promises a night of great music, delicious food, and wonderful company. Don't miss out on this extraordinary celebration of jazz!",
    price: 400000,
    vipPrice: 800000,
    vvipPrice: 1000000,
    interested: 14,
    category: "Entertainment",
    type: "Offline",
    venue: "ABC Arena",
    location: "Riverside Park, 1234 River Road, Central City, State, 56789",
    city: "Central City",
    host: {
      name: "Central City Music Association",
      logo: "https://placehold.co/40x40",
    },
    quota: 25,
    vipQuota: 8,
    vvipQuota: 5,
  },
  {
    id: 2,
    title: "Autumn Food Fair",
    image: eventimg,
    day: "Saturday",
    date: "23 September 2024",
    time: "11:00 AM - 8:00 PM",
    description:
      "The Autumn Food Fair is a culinary delight, bringing together food enthusiasts from all corners to celebrate the rich and diverse flavors of the season. With an array of food stalls offering everything from gourmet dishes to traditional comfort foods, this fair promises a gastronomic adventure like no other.\n\n" +
      "Visitors can indulge in a variety of cuisines, sample artisanal products, and participate in cooking demonstrations led by renowned chefs. The fair also features a farmer's market, where you can purchase fresh produce and homemade delicacies to take home.\n\n" +
      "Set in the heart of the city’s central park, the Autumn Food Fair is not just about food, but also about community. Live music, family-friendly activities, and an overall festive atmosphere make this event a perfect outing for families, friends, and food lovers. Don't miss out on this feast for the senses!",
    price: 0,
    vipPrice: 0,
    vvipPrice: 1000000,
    interested: 42,
    category: "Entertainment",
    type: "Offline",
    venue: "LA Stadium",
    location: "Central Park, 5678 Maple Avenue, Central City, State, 56789",
    city: "Central City",
    host: {
      name: "Central City Food Association",
      logo: "https://placehold.co/40x40",
    },
    quota: 25,
    vipQuota: 8,
    vvipQuota: 5,
  },
  {
    id: 3,
    title: "Tech Innovators Conference",
    image: eventimg,
    day: "Wednesday",
    date: "1 November 2024",
    time: "9:00 AM - 5:00 PM",
    description:
      "The Tech Innovators Conference is the premier event for technology enthusiasts, entrepreneurs, and industry professionals. This conference brings together leading experts to discuss the latest trends, breakthroughs, and future directions in technology and innovation.\n\n" +
      "Attendees will have the opportunity to attend keynote speeches, participate in interactive workshops, and network with like-minded individuals. The conference covers a wide range of topics, including artificial intelligence, blockchain, cybersecurity, and more.\n\n" +
      "Held at the state-of-the-art City Convention Center, this event provides a platform for knowledge exchange, collaboration, and inspiration. Whether you are a tech professional, a startup founder, or simply passionate about technology, the Tech Innovators Conference is the place to be.",
    price: 1200000,
    vipPrice: 8000000,
    vvipPrice: 10000000,
    interested: 28,
    category: "Technology & Innovation",
    type: "Offline",
    venue: "Staples Center",
    location:
      "City Convention Center, 9101 Tech Drive, Central City, State, 56789",
    city: "Central City",
    host: {
      name: "Central City Tech Council",
      logo: "https://placehold.co/40x40",
    },
    quota: 25,
    vipQuota: 8,
    vvipQuota: 5,
  },
  {
    id: 4,
    title: "Winter Wonderland Gala",
    image: eventimg,
    day: "Friday",
    date: "15 December 2024",
    time: "7:00 PM - 11:00 PM",
    description:
      "The Winter Wonderland Gala is an elegant evening event celebrating the joy and beauty of the winter season. With a formal dress code and a stunning venue decorated in a winter wonderland theme, this gala is an event to remember.\n\n" +
      "Guests will enjoy a gourmet dinner, live entertainment, and a silent auction featuring unique items and experiences. The evening will also include dancing to a live band, adding to the festive atmosphere.\n\n" +
      "Proceeds from the Winter Wonderland Gala support local charities, making this event not only a night of elegance and fun but also a chance to give back to the community. Join us for an unforgettable night of celebration and philanthropy.",
    price: 500000,
    vipPrice: 1000000,
    vvipPrice: 2000000,
    interested: 35,
    category: "Arts & Culture",
    type: "Offline",
    venue: "Rockfeller Center",
    location: "Grand Ballroom, 1234 Luxury Lane, Central City, State, 56789",
    city: "Central City",
    host: {
      name: "Central City Charity Foundation",
      logo: "https://placehold.co/40x40",
    },
    quota: 25,
    vipQuota: 8,
    vvipQuota: 5,
  },
  {
    id: 5,
    title: "Spring Art Exhibition",
    image: eventimg,
    day: "Sunday",
    date: "7 April 2024",
    time: "10:00 AM - 6:00 PM",
    description:
      "The Spring Art Exhibition is a vibrant showcase of creativity, featuring works from local artists and artisans. This annual event highlights a diverse range of artistic expressions, from paintings and sculptures to photography and mixed media.\n\n" +
      "Visitors can explore the exhibition, meet the artists, and purchase original artwork. The event also includes live art demonstrations, interactive workshops, and guided tours, providing a deeper understanding of the artistic process.\n\n" +
      "Held at the picturesque Riverside Art Gallery, the Spring Art Exhibition is a must-visit for art enthusiasts and collectors. Enjoy a day surrounded by beautiful art, inspiring conversations, and the blossoming spirit of spring.",
    price: 150000,
    vipPrice: 300000,
    vvipPrice: 1000000,
    interested: 22,
    category: "Arts & Culture",
    type: "Online",
    venue: "Zoom",
    location: "Online",
    city: "Online",
    host: {
      name: "Central City Art Association",
      logo: "https://placehold.co/40x40",
    },
    quota: 25,
    vipQuota: 8,
    vvipQuota: 5,
  },
  {
    id: 6,
    title: "City Marathon",
    image: eventimg,
    day: "Sunday",
    date: "12 May 2024",
    time: "6:00 AM - 12:00 PM",
    description:
      "The City Marathon is an exciting event that brings together runners of all levels to participate in a challenging and rewarding race. Whether you're a seasoned marathoner or a first-time participant, this event offers a supportive and energetic environment to achieve your running goals.\n\n" +
      "The marathon course takes runners through the city's scenic routes, providing breathtaking views and a unique perspective on the city's landmarks. In addition to the full marathon, there are half marathon and 10K options, making the event accessible to a wide range of runners.\n\n" +
      "Join us for a day of fitness, fun, and community spirit. The City Marathon also includes post-race celebrations with food, music, and awards for top finishers. Lace up your running shoes and be part of this exhilarating event!",
    price: 300000,
    vipPrice: 200000,
    vvipPrice: 1000000,
    interested: 60,
    category: "Sports & Fitness",
    type: "Offline",
    venue: "Central Park",
    location: "City Square, 7890 Marathon Road, Central City, State, 56789",
    city: "Central City",
    host: {
      name: "Central City Running Club",
      logo: "https://placehold.co/40x40",
    },
    quota: 25,
    vipQuota: 8,
    vvipQuota: 5,
  },
];

export default eventCardItems;
