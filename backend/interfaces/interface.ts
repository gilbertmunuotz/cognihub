interface RequestBody {
    model: string,
    prompt: string
}

interface GoogleProfile {
    id: string;
    displayName: string;
    emails?: Array<{ value: string }>;
    photos?: Array<{ value: string }>;
}

export { RequestBody, GoogleProfile };