import { useState } from "react"
import { GoogleLogin } from "@react-oauth/google"
import { useRouter } from "@tanstack/react-router"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

export function Login() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [googleToken, setGoogleToken] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      setError("Missing Google credential. Please try again.")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      const response = await axios.post(`${API_URL}/api/auth/google/guide`, {
        idToken: credentialResponse.credential,
      })

      // Success
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      router.navigate({ to: "/" })
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response &&
        err.response.status === 400 &&
        err.response.data?.requiresRegistration
      ) {
        // Backend needs more info
        setGoogleToken(credentialResponse.credential)
        setStep(2)
      } else if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Failed to login. Please try again."
        )
      } else {
        setError("Failed to login. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError("Google Sign-In failed. Please try again.")
  }

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !address) {
      setError("Please fill in all fields.")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      const response = await axios.post(`${API_URL}/api/auth/google/guide`, {
        idToken: googleToken,
        phone,
        address,
      })

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      router.navigate({ to: "/" })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        )
      } else {
        setError("Registration failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full bg-background font-sans">
      {/* Left Column - Forms */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 lg:px-20">
        <div className="w-full max-w-md">
          <Card className="border-none bg-transparent shadow-none">
            <CardContent className="p-0">
              {step === 1 ? (
                <div className="animate-in space-y-8 duration-500 fade-in slide-in-from-bottom-4">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                      Welcome Back{" "}
                      <span role="img" aria-label="wave">
                        👋
                      </span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Today is a new day. It's your day. You shape it.
                      <br />
                      Sign in to start managing your projects.
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="mt-8 flex w-full flex-col items-center justify-center">
                    {isLoading ? (
                      <p className="text-sm text-muted-foreground">Signing in...</p>
                    ) : (
                      <div className="flex w-full justify-center [&>div]:w-full [&>div>div]:w-full!">
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={handleGoogleError}
                          theme="outline"
                          size="large"
                          width="100%"
                          text="continue_with"
                          shape="rectangular"
                        />
                      </div>
                    )}
                  </div>

                  <div className="absolute right-0 bottom-6 left-0 text-center text-xs text-muted-foreground/50">
                    © 2026 ALL RIGHTS RESERVED
                  </div>
                </div>
              ) : (
                <div className="animate-in space-y-8 duration-500 fade-in slide-in-from-bottom-4">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                      Almost there!
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      We need a few more details to create your travel agent
                      account.
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Business Address</Label>
                        <Input
                          id="address"
                          placeholder="123 Travel Avenue, Suite 100"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 flex-1"
                        onClick={() => {
                          setStep(1)
                          setGoogleToken("")
                        }}
                        disabled={isLoading}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="h-11 flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? "Completing..." : "Complete Registration"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden p-4 lg:block lg:w-1/2">
        <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=3445&auto=format&fit=crop"
            alt="Beautiful dark floral painting"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
