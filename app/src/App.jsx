import { BrowserRouter, Route, Routes } from "react-router-dom"
import AppWrapper from "./components/AppWrapper"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import SignIn from "./pages/SignIn"
import { QueryClient, QueryClientProvider  } from "@tanstack/react-query"
import { ReactQueryDevtools }  from "@tanstack/react-query-devtools"
import { Toaster } from "react-hot-toast"
import Blogs from "./pages/Blogs"
import CreateBlog from "./pages/CreateBlog"
import UpdateBlog from "./pages/UpdateBlog"
import BlogPage from "./pages/BlogPage"
import Profile from "./pages/Profile"

const queryClient = new QueryClient();

function App() {

  return (
    <>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/signin" element={<SignIn />}/>
        <Route path="/" element={<AppWrapper />}>
          <Route index element={<Home/>} />
          <Route path="/blog" element={<BlogPage/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/blogs" element={<Blogs/>} />
          <Route path="/blog/add" element={<CreateBlog/>} />
          <Route path="/blog/update" element={<UpdateBlog/>} />
        </Route>
      </Routes>
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
    <Toaster containerClassName="text-[0.8rem] font-outfit"/>
    </QueryClientProvider>
    
    </>
  )
}

export default App
