const config = {
    env : {
        imagekit:{
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
        },
        apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
        databaseUrl: process.env.DATABASE_URL!,
        databaseUrlnew: process.env.NEXT_PUBLIC_DATABASE_URL!,
        adminEmail: process.env.ADMIN_EMAIL!,
        adminPassword: process.env.ADMIN_PASSWORD!,
        sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || "2592000", 10), // Default to 30 days if not set
    }
}

export default config;