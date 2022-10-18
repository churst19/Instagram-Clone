import React,{useState, useEffect} from 'react'
import Axios from 'axios'
import M from 'materialize-css'
import {Link, useNavigate} from 'react-router-dom' //useHistory,

const CreatePost = () =>{
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(() => {
        if(url){ //prevents running when components mount
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            }).then(res=>res.json())
            .then(data=>{
                if (data.error){
                    M.toast({html:data.error,classes:"#d50000 red accent-4"})
                }
                else{
                    M.toast({html:"Created post successfully",classes:"#2e7d32 green darken-3"})
                    navigate('/')
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    },[url]) // will run once url is updated

    const postDetails = () =>{
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

    return(
        <div className='card input-field'
        style={{
            margin:'30px auto',
            maxWidth:'500px',
            padding:'20px',
            textAlign:'center'
        }}
        >
            <input 
            type='text' 
            placeholder='title' 
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />
            <input type='text' 
            placeholder='body' 
            value={body}
            onChange={(e)=>setBody(e.target.value)}
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
            <button className="btn waves-effect waves-light #42a5f5 blue lighten-1 darken-1"
            onClick={() => postDetails()}
            >
                    Submit Post
            </button>
        </div>
    )

}

export default CreatePost