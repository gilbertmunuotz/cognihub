interface ChatFormProps {
    onChatInteraction: (response: string) => void;
}

interface GoogleUser {
    googleId: string;
    displayName: string;
    email?: string; // Email is optional because it might not always be available
    avatar?: string; // Avatar URL is also optional
}

export type { ChatFormProps, GoogleUser };