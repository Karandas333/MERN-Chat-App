import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Background from "../../assets/login2.png";
import Victory from "../../assets/victory.svg";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utiles/contants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo ,userInfo} = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");


  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if (password !== conformPassword) {
      toast.error("Password and confirm password should be same.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true })
      if (response.data.user.id) {
        setUserInfo(response.data.user)
        if (response.data.user.profileSetup) {
          navigate('/chat')
        }
        else {
          navigate('/profile')
        }
      }
    }

  };
  
  const handleSignup = async () => {
    try {
      if (validateSignup()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setUserInfo(response.data.user)
        navigate("/profile")
      }
      
    }
    } catch (error) {
      console.log({error})
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full  data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full  data-[state=active]:text-black data-[state=active]:font-bold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10 " value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Conform Password"
                  type="password"
                  className="rounded-full p-6"
                  value={conformPassword}
                  onChange={(e) => setConformPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleSignup}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className=" hidden xl:flex justify-center items-center">
          <img src={Background} alt="background login" className="h-[6d00px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
