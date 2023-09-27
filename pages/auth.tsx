import { useCallback, useState } from "react"
import { NextPageContext } from 'next';
import Input from "@/components/Input";
import { getSession, signIn } from 'next-auth/react';
import axios from "axios";
import { useRouter } from "next/router";
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import Spinner from "@/components/Spinner";

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);
  
    if (session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    }
  
    return {
      props: {}
    }
  }
  

const Auth = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [variant, setVariant] = useState('login')
    const [erro, setError] = useState(false)

    const [messageNameError, setMessageNameError] = useState("")
    const [messageEmailError, setMessageEmailError] = useState("")
    const [messagePasswordError, setMessagePasswordError] = useState("")
    
    const [messageEmailInUseError, setMessageEmailInUseError] = useState("")
    
    const [messageUserNotExistError, setMessageUserNotExistError] = useState("")
    const [messagePasswordNotMachError, setMessagePasswordNotMachError] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'login' ? "register" : "login")
    },[])

    const logInGoogle = useCallback( async () => {
        setIsLoading(true)
        try {
            await signIn('google', {
                redirect: false,
                callbackUrl: "/profile"
            })
            setTimeout(() => {
                setIsLoading(false)    
            }, 10000);

        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    },[])

    const logInGithub = useCallback( async () => {
        setIsLoading(true)
        try {
            await signIn('github', {
                redirect: false,
                callbackUrl: "/profile"
            })
            setTimeout(() => {
                setIsLoading(false)    
            }, 10000);

        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    },[])

    const login = useCallback( async () => { 
        setIsLoading(true)

        try {
            await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/profile"
            }).then(Response => {
                
                if(!Response?.error){
                    router.push("/")
                    return
                }

                setError(true)
                if (Response?.error === "Email is required!") {
                    setMessageEmailError(Response?.error);
                }
                if (Response?.error === "Password is required!") {
                    setMessagePasswordError(Response?.error);
                }
                if (Response?.error === "Email do not exist!") {
                    setMessageUserNotExistError(Response?.error);
                }
                if (Response?.error === "Incorrect password!") {
                    setMessagePasswordNotMachError(Response?.error);
                }
                setTimeout(() => {
                    setIsLoading(false)
                    setMessageUserNotExistError("")
                    setMessagePasswordNotMachError("")
                    setMessageEmailError("")
                    setMessagePasswordError("") 
                    setError(false)
                }, 1000);
                return
            })   
        } catch (error) {            
            console.log(error)
        }   

    }, [email, password, router])
    
    const register = useCallback( async () => {
        
        setIsLoading(true)
        try {
            await axios.post("/api/register", {
                email,
                name,
                password,
            })
            login()
        } catch (error) {
            
            setError(true)
            if (error?.response.data.type === "name") {
                setMessageNameError(error?.response.data.message);
            }
            if (error?.response.data.type === "email") {
                setMessageEmailError(error?.response.data.message);
            }
            if (error?.response.data.type === "password") {
                setMessagePasswordError(error?.response.data.message);
            }
            if (error?.response.data.type === "email in use") {
                setMessageEmailInUseError(error?.response.data.message);
            }
            setTimeout(() => {
                setIsLoading(false)
                setMessageEmailInUseError("")
                setMessageNameError("")
                setMessageEmailError("")
                setMessagePasswordError("") 
                setError(false)
            }, 1000);
        }
    }, [email, name, password, login])
    
    return (
        <div className="relative h-full w-full bg-[url('/images/hero.jpg')]  bg-center bg-fixed bg-cover">
            <div className="bg-black h-full w-full lg:bg-opacity-50">
                <nav className="px-12 pt-5">
                    <img src="/images/logo.png" alt="Logo" className="h-12"/>
                </nav>
                <div className="flex justify-center items-center">
                    <div className="bg-black bg-opacity-70 px-16 py-5 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <p className="text-red-600">
                            {messageUserNotExistError}
                        </p>
                        <p className="text-red-600">
                            {messagePasswordNotMachError}
                        </p>
                        <p className="text-red-600">
                            {messageEmailInUseError}
                        </p>
                        
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === 'login' ? "Sign in " : "Register"}
                        </h2>
                        <div className="flex flex-col gap-4 ">
                            {variant !== "login" && (
                                <div>
                                    <Input 
                                        label="Username"
                                        value={name}
                                        onChange={(ev: any) => setName(ev.target.value)}
                                        id="name"
                                    />
                                    <p className="text-red-600 ml-1">{messageNameError}</p>    
                                </div>
                            )}
                            <div>
                                <Input 
                                    label="Email"
                                    onChange={(ev: any) => setEmail(ev.target.value)}
                                    id="email"
                                    type="email" 
                                    value={email}
                                />
                                <p className="text-red-600 ml-1">{messageEmailError}</p>    
                            </div>
                            <div>
                                <Input 
                                    label="Password"
                                    onChange={(ev: any) => setPassword(ev.target.value)}
                                    id="password"
                                    type="password" 
                                    value={password}
                                /> 
                                <p className="text-red-600 ml-1">{messagePasswordError}</p>    
                            </div>
                        </div>
                        {isLoading  ?
                            <button className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-md mt-10 transition flex justify-center items-center">
                                <Spinner />
                            </button>
                            :
                            <>
                                <button onClick={variant !== "login" ? register : login} className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-md mt-10 transition flex justify-center items-center">
                                    {variant !== "login" ? 
                                        "Register" 
                                        : "Login" 
                                    }
                                </button>

                                <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                                    <div onClick={() => logInGoogle()} className="w-10 h-10 rounded-full bg-white transition flex items-center justify-center cursor-pointer hover:opacity-80">
                                        <FcGoogle size={30}/>
                                    </div>
                                    <div onClick={() => logInGithub()} className="w-10 h-10 rounded-full bg-white transition flex items-center justify-center cursor-pointer hover:opacity-80">
                                        <FaGithub size={30}/>
                                    </div>
                                </div>
                            </>
                        }
                        <p className="text-neutral-500 mt-12">
                            {variant !== "login" ? "Already have an account?" : "First time using Netflix?"} 
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