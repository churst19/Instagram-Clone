import React,{useEffect, useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import M from 'materialize-css'
import Axios from 'axios'


const Signup = () =>{
    const navigate = useNavigate()
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)


    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])
    

    const uploadImage = () =>{
        console.log("Uploading to cloudinary....")
        const fd = new FormData();
        fd.append("file",image);
        fd.append("upload_preset","insta-clone");
        
        Axios.post("https://api.cloudinary.com/v1_1/dw4yp0jcv/image/upload",fd)
        .then((response)=>{
            setUrl(response.data.url)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const uploadFields = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"invalid email",classes:"#d50000 red accent-4"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if (data.error){
                M.toast({html:data.error,classes:"#d50000 red accent-4"})
            }
            else{
                M.toast({html:data.message,classes:"#2e7d32 green darken-3"})
                navigate('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const PostData =()=>{
        if (image) {
            uploadImage()
        }else{
            uploadFields()
        }
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input
                type="text"
                placeholder="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
                <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn #42a5f5 blue lighten-1 darken-1">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #42a5f5 blue darken-1" 
                onClick={()=>PostData()}>
                    Signup
                </button>
                <h5>
                    <Link to="/signin">Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup