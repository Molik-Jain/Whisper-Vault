import { BiHomeCircle, BiUser } from 'react-icons/bi'
import { HiEnvelope } from 'react-icons/hi2'
import { BsBell, BsBookmark } from 'react-icons/bs'

const navigationItems = [
  {
    title: "Home",
    icon: BiHomeCircle,
  },

  {
    title: "Notifications",
    icon: BsBell,
  },
  {
    title: "Messages",
    icon: HiEnvelope,
  },
  {
    title: "Bookmarks",
    icon: BsBookmark,
  },
  {
    title: "Profile",
    icon: BiUser,
  }

];

export default navigationItems;