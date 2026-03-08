"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInUser } from "@/server/users"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingToast = toast.loading("Logging in...", {
      description: "Please wait while we verify your credentials.",
    })

    try {
      const result = await signInUser(values.email, values.password)

      if (!result.success) {
        toast.error("Login failed", {
          id: loadingToast,
          description: result.message,
        })
        return
      }

      toast.success("Login successful!", {
        id: loadingToast,
        description: result.message,
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast.error("Login failed", {
        id: loadingToast,
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
      })
    }
  }

  function handleGoogleLogin() {
    toast.info("Google Login", {
      description: "Redirecting to Google authentication...",
    })
    // TODO: Implement Google OAuth
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>

      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login
          </CardDescription>
        </CardHeader>

        <CardContent>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="/login" className="text-sm underline">
                        Forgot password?
                      </Link>
                    </div>

                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>

              <Button 
                variant="outline" 
                type="button" 
                className="w-full"
                onClick={handleGoogleLogin}
              >
                Login with Google
              </Button>

              <p className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="underline">
                  Sign up
                </Link>
              </p>

            </form>
          </Form>

        </CardContent>
      </Card>

    </div>
  )
}