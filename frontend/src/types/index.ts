import { StaticImageData } from "next/image";

export interface User {
  id: string;
  name: string;
  nickname?: string;
  email: string;
  profileImage?: string;
  access_token?: string;
}

export interface TravelCardProps {
  image: string | StaticImageData;
  title: string;
  date: string;
  size?: 'small' | 'medium' | 'large';
}

export interface TopBarProps {
  title: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export interface Trip {
  id: number;
  title: string;
  date: string;
  location: string;
  background: string;
  isImage?: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  photos?: string[];
}
