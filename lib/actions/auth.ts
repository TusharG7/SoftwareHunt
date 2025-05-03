'use server'

import { signIn } from "@/auth"

export const signInWithCredentials = async (params: Pick<AuthCredentials,"email" | "password">) => {
    const {email, password} = params
    try {
        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return { success: false, error: result.error }; // Pass error message directly
        }
        return {success: true}

    } catch (error) {
        console.log('SignIn Error - ',error)
        return {success: false, error: `SignIn Error - ${error}`}
    }
}