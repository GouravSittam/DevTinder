export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  // Add other user properties as needed
}

export interface Post {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  comments: Comment[];
  // Add other post properties as needed
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  // Add other comment properties as needed
}

export interface Connection {
  id: string;
  user: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  receiver: User;
  createdAt: string;
  read: boolean;
} 