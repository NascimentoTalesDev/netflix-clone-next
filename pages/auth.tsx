import { signIn } from "next-auth/react"
import { useCallback, useState } from "react"
import Input from "@/components/Input";
import axios from "axios";
import { useRouter } from "next/router";

const Auth = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [variant, setVariant] = useState('login')

    const router = useRouter()

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'login' ? "register" : "login")
    },[])

    const login = useCallback( async () => { 
        try {
            await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/"
            })   
            router.push("/")
            return
        } catch (error) {
            console.log(error);
            
        }        
    }, [email, password, router])
    
    const register = useCallback( async () => {
        try {
            await axios.post("/api/register", {
                email,
                name,
                password,
            })
            login()
            
        } catch (error) {
            console.log(error);
        }
    }, [email, name, password, login])
    
    return (
        <div className="relative h-full w-full bg-[url('/images/hero.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black h-full w-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <img src="/images/logo.png" alt="Logo" className="h-12"/>
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === 'login' ? "Sign in " : "Register"}
                        </h2>
                        <div className="flex flex-col gap-4 ">
                            {variant !== "login" && (
                                <Input 
                                    label="Username"
                                    value={name}
                                    onChange={(ev: any) => setName(ev.target.value)}
                                    id="name"
                                /> 
                            )}
                            <Input 
                                label="Email"
                                onChange={(ev: any) => setEmail(ev.target.value)}
                                id="email"
                                type="email" 
                                value={email}
                            /> 
                            <Input 
                                label="Password"
                                onChange={(ev: any) => setPassword(ev.target.value)}
                                id="password"
                                type="password" 
                                value={password}
                            /> 
                        </div>
                        <button onClick={variant !== "login" ? register : login} className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-md mt-10 transition">
                            {variant !== "login" ? "Sign up" : "Login"}
                        </button>
                        <p className="text-neutral-500 mt-12">
                            {variant !== "login" ? "Already have an account?" : "Frist time using Netflix?"} 
                            <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                                {variant !== "login" ? "Login" : "Create an account" }
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default Auth;