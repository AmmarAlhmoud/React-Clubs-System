import banner from "../../assets/icons/MyClub/banner.png";
import icon from "../../assets/icons/MyClub/icon.png";
import event1Img from "../../assets/icons/MyClub/event1_img.png";
import event2Img from "../../assets/icons/MyClub/event2_img.png";

const CLUB_INFO = {
  name: "E - Sports",
  manager: "Jhon Doe",
  createdDate: "2024-04-20",
  members: 54,
  banner: banner,
  icon: icon,
  description: `Step into our premier eSports club, where gaming enthusiasts converge to compete, improve, and build connections. Equipped with state-of-the-art gear and supported by seasoned coaches, we offer an unmatched environment for skill refinement and success. Join our dynamic community for thrilling tournaments, skill development, and unforgettable camaraderie. Elevate your gaming journey with us today!`,
  email: "mygmail12@gmail.com",
  phone: "+903817295736",
  categories: ["Sports", "Sports 2", "Other"],
  posts: [
    {
      title: `Join us for an electrifying FIFA 24 tournament next week!`,
      description: `Get ready to showcase your skills and compete against fellow gamers in an adrenaline-fueled showdown. Mark your calendars for 12/02/2024, 15:30, as the action kicks off at our eSports club. Whether you're a seasoned pro or a rookie looking to make your mark, this is your chance to claim victory and earn bragging rights. Don't miss out on the excitement – sign up now and let the games begin!`,
      image: event1Img,
    },
  ],
  events: [
    {
      title: `🎮 Exciting Announcement! Ninja and Tefu are Coming to Uskudar University for an Unforgettable Gaming Talk! 🎮`,
      date: "2024-04-20",
      startTime: "15:00",
      endTime: "14:30",
      location: "Nermin Tarhan Hall",
      speakers: ["Ninja", "Tefu"],
      image: event2Img,
      description: `Get ready for an extraordinary event as gaming legends Ninja and Tefu are gracing Uskudar University with their presence for an exclusive gaming talk session! Join us as these gaming titans share their insights on the benefits and advantages of gaming, and delve into the secrets of becoming a professional gamer. 
      
      In this special "Uskudar Talk" you'll have the chance to learn from the best in the industry as they discuss the transformative power of gaming, the skills it develops, and how it can shape your future. Whether you're an avid gamer or simply curious about the world of eSports, this event is for you!`,
    },
  ],
};

export default CLUB_INFO;
