"use client"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const { 
    data: session, 
    } = authClient.useSession() 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<'signup' | 'login'>("signup");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        await authClient.signUp.email({
          email,
          password,
          name,
        }, {
          onError: (error) => {
            setError(error.error.message || "Sign up failed");
          },
          onSuccess: (user) => {
            setError(null);
            console.log("Successfully created user", user);
          }
        });
      } else {
        await authClient.signIn.email({
          email,
          password,
        }, {
          onError: (error) => {
            setError(error.error.message || "Login failed");
          },
          onSuccess: (user) => {
            setError(null);
            console.log("Successfully logged in", user);
          }
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return <div className="flex flex-col gap-4 items-center justify-center h-screen p-4">
      <div>
        <p>Logged in as {session.user?.name}</p>
      </div>
      <Button className="w-full hover:cursor-pointer" variant={"destructive"} onClick={() => authClient.signOut()}>Sign out</Button>
    </div>
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen p-4">
      <div className="flex gap-2 mb-2">
        <Button variant={mode === "signup" ? "default" : "outline"} onClick={() => setMode("signup")}>Sign Up</Button>
        <Button variant={mode === "login" ? "default" : "outline"} onClick={() => setMode("login")}>Login</Button>
      </div>
      {mode === "signup" && (
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      )}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div className="text-red-500">{error}</div>}
      <Button variant={"destructive"} onClick={onSubmit} disabled={loading}>
        {loading ? (mode === "signup" ? "Signing Up..." : "Logging In...") : (mode === "signup" ? "Create user" : "Login")}
      </Button>
    </div>
  )
}
