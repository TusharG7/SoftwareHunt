'use client'
import AuthForm from '@/components/AuthForm'
import { signInWithCredentials } from '@/lib/actions/auth'
import { signInSchema } from '@/lib/validations'

const Auth = () => {
  return (
    <>
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div className="w-full max-w-sm">
    <AuthForm
    type="SIGN_IN"
    schema={signInSchema}
    defaultValues={{
        email:'',
        password:'',
    }}
    onSubmit={signInWithCredentials}
    />
    </div>
    </div>
    </>
  )
}

export default Auth