"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FaGithub, FaGoogle } from "react-icons/fa"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { OctagonAlertIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
})

export const SignInView = () => {
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data)
        setError(null)
        setIsPending(true)

        authClient.signIn.email(
            {
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: () => {
                    setIsPending(false)
                    router.push("/")
                },
                onError: (error) => {
                    setIsPending(false)
                    setError(error.error.message)
                }
            }
        )
    }
    const onSocial = async (provider: "google" | "github") => {
        setError(null)
        setIsPending(true)

        authClient.signIn.social(
            {
                provider: provider,
                callbackURL: '/'
            },
            {
                onSuccess: () => {
                    setIsPending(false)
                },
                onError: (error) => {
                    setIsPending(false)
                    setError(error.error.message)
                }
            }
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-10">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center justify-center">
                                    <h1 className="text-2xl font-bold">
                                        Welcome Back
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Login to your account
                                    </p>
                                    
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="m@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="********" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {!!error && (
                                    <Alert variant="destructive" className="bg-destructive/10 border-none">
                                        <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}
                                <Button disabled={isPending} type="submit" className="w-full hover:cursor-pointer">
                                    Sign In
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t">
                                <span className="bg-card text-muted-foreground relative z-10 px-2">
                                    Or continue with
                                </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button 
                                        onClick={() => onSocial("google")}
                                        disabled={isPending}
                                        variant="outline"
                                        type="button"
                                    className="w-full hover:cursor-pointer"
                                    >
                                        <FaGoogle className="mr-2" />
                                        Google
                                        </Button>                            
                                    <Button 
                                        onClick={() => onSocial("github")}
                                        disabled={isPending}
                                        variant="outline"
                                        type="button"
                                    className="w-full hover:cursor-pointer"
                                    >
                                        <FaGithub className="mr-2" />
                                        Github
                                        </Button>                            
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/sign-up" className="underline underline-offset-2 hover:text-green-700 text-sm">
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                    <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col items-center justify-center gap-y-4">
                        <img src="/logo.svg" alt="logo" className="w-[92px] h-[92px]" />
                        <p className="text-white text-2xl font-semibold">
                            Meet.AI
                        </p>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground text-center text-xs *[a]:hover:text-primary text-balance *[a]:underline *[a]:underline-offset-4">
                By clicking sign in, you agree to our <Link href="/terms" className="underline underline-offset-2 hover:text-green-700 text-sm">Terms of Service</Link> and <Link href="/privacy" className="underline underline-offset-2 hover:text-green-700 text-sm">Privacy Policy</Link>
            </div>
        </div>
   )
}