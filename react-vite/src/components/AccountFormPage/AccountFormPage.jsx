import { useSelector, useDispatch } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
import "./AccountFormPage.css"
import {uploadPfp} from "../../redux/session"

function AccountFormPage(){
    const user = useSelector((store) => store.session.user);
    const navigate = useNavigate()
    const dispatch = useDispatch()


    if(!user) return navigate('/login')

    let pfp = '/icons/user.png'
    if(user.profileImage){
        pfp = user.profileImage
    }
    console.log('USER', user)
    console.log('PFP', pfp)

    const submitImage = async (e) =>{
        e.preventDefault
        const file = e.target.files[0]
        console.log(file)
        let server
        if(file){
            // const form = new FormData()
            // form.append('profile_image', file)
            // form.append('id', user.id)
            server = await dispatch(uploadPfp({id: user.id, profile_image: file}))
        }
        if(server){
            console.log(server)
        }
    }

    return (
        <div className="main-page">
            <h1>Account Info</h1>

            <div>
                <label htmlFor="file-input">
                    <img
                        src={pfp}
                        alt=''
                        className='pfp'
                    />
                    <input
                        id='file-input'
                        type="file"
                        onChange={(e)=>submitImage(e)}
                        accept="image/*"
                        style={{ display: 'none'}}
                    />
                </label>
                <div className="info-container">
                    <label>
                    <div className="info-text">Name</div>
                    <div className="info-blocks">
                        {user.firstName} {user.lastName}
                        <button><NavLink to={'name'} className="info-text">{'>'}</NavLink></button>
                    </div>
                    </label>
                    <label>
                        <div className="info-text">Phone Number</div>
                        <div className="info-blocks">
                            {user.phoneNumber ? user.phoneNumber : 'Add your phone number'}
                            <button><NavLink to={'phone'} className="info-text">{'>'}</NavLink></button>
                        </div>
                    </label>
                    <label>
                        <div className="info-text">Email</div>
                        <div className="info-blocks">
                            {user.email ? user.email : 'Add your email'}
                            <button><NavLink to={'email'} className="info-text">{'>'}</NavLink></button>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default AccountFormPage