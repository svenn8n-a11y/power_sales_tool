import AuthForm from '@/components/auth/AuthForm'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        Sales Dojo 🥋
                    </h1>
                </div>
                <AuthForm />
            </div>
        </div>
    )
}
