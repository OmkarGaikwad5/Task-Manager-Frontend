import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast"; 

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await register(name, email, password);
      toast.success("Account created successfully!");
      nav("/");
    } catch (e) {
      const message = e?.response?.data?.error || "Register failed";
      setErr(message);
      toast.error(message); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4 sm:px-6">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-center md:text-left">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>

          {err && <p className="text-red-500 mt-2 text-sm text-center md:text-left">{err}</p>}

          <Separator className="my-4" />

          <p className="text-sm text-center md:text-left">
            Have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
