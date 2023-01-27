import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import Axios from 'axios'


const Profile = () =>{
    const [mypics,setPics] = useState([])
    const {state,dispatch}= useContext(UserContext)
    const [image,setImage] = useState("")
    // const [url,setUrl] = useState("")
    useEffect(() => {
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer " + localStorage.getItem("jwt") 
            }
        }).then(res =>res.json())
        .then(result =>{
            // console.log('here')
            // console.log(result)
            setPics(result.mypost)
        })
    },[],[])
    useEffect(()=>{
        if(image){
            console.log("Uploading to cloudinary....")
            const fd = new FormData();
            fd.append("file",image);
            fd.append("upload_preset","insta-clone");
            Axios.post("https://api.cloudinary.com/v1_1/dw4yp0jcv/image/upload",fd)
            .then((response)=>{
                // setUrl(response.data.url)
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer " + localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:response.data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    localStorage.setItem("user", JSON.stringify({...state,pic:result.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                })
            }) 
            .catch(err => {
                console.log(err)
            })
        }
    },[image])

    
    const updatePhoto = (file)=>{
        setImage(file)
    }

    if(state=== null){
        return(
            <h5>Loading...</h5>
        )
    }else{
        return(
            <div style={{maxWidth:'550px',margin:'0px auto'}}>
                <div style={{
                    margin:'18px 0px',
                    borderBottom:'1px solid grey'
                }}>
                    <div style={{
                        display:"flex",
                        justifyContent:'space-around',
                    }}>
                        <div>
                            <img style={{width:"160px", height:"160px", borderRadius:"75px"}}
                            src={state?state.pic:"loading"}/>
                            
                        </div>

                        <div>
                            <h4>{state?state.name:"loading"}</h4>
                            {/* <h4>{(JSON.parse(localStorage.getItem("user"))).name}</h4> */}
                            <div style={{display:'flex', justifyContent:'space-between', width:'108%'}}>
                                <h6>{mypics.length} posts</h6>
                                <h6>{state?state.followers.length:"loading"} followers</h6>
                                <h6>{state?state.following.length:"loading"} following</h6>
                            </div>
                        </div>
                    
                    </div>
                    {/* <button style={{
                        margin:"10px 0px 10px 80px"
                    }} 
                    className="btn waves-effect waves-light #42a5f5 blue lighten-1" 
                    onClick={()=>{
                        updatePhoto()
                    }}>
                    Update
                    </button> */}
                    <div className="file-field input-field" style={{margin:"10px"}}>
                        <div className="btn #42a5f5 blue lighten-1 darken-1" style={{marginLeft:"10px"}}>
                            <span>Update Profile Picture</span>
                            <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"/>
                        </div>
                    </div>
                </div>



                <div className='gallery'>
                    {
                        mypics.map(item => {
                            return(
                                <img key={item._id} className='item' src={item.photo} alt={item.title}/>
                            )
                        })
                    }
                </div>
            </div>
        )   
    }
}

export default Profile